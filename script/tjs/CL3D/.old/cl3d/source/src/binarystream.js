/**
 * data is the .responseText of a GET operation
 * @constructor
 * @private
 */
CL3D.BinaryStream = function(data)
{
	this._buffer = data;
	this._length = data.length;
	this._offset = 0;
	this._bitBuffer = null;
	this._bitOffset = 8;
	
	this.bigEndian = false;
}

/**
 * @private
 */
CL3D.BinaryStream.prototype.bytesAvailable = function()
{
	return this._length - this._offset;
};
	
CL3D.BinaryStream.prototype.getPosition = function()
{
	return this._offset;
}
	
CL3D.BinaryStream.prototype.readInt = function()
{
	return this.readSI32();
}
	
CL3D.BinaryStream.prototype.readByte = function()
{
	return this.readSI8();
}
		
CL3D.BinaryStream.prototype.readByteAt = function(position)
{
	return this._buffer.charCodeAt(position) & 0xff;
}
	
CL3D.BinaryStream.prototype.readBoolean = function()
{
	return this.readSI8() != 0;
}
	
CL3D.BinaryStream.prototype.readShort = function()
{
	return this.readUnsignedShort();
}
		
CL3D.BinaryStream.prototype.readNumber = function(numBytes)
{
	var value = 0;
	var p = this._offset;
	var i = p + numBytes;
	while(i > p){ value = value * 256 + this.readByteAt(--i); }
	this._offset += numBytes;
	return value;
}
		
CL3D.BinaryStream.prototype.readSNumber = function(numBytes)
{
	var value = this.readNumber(numBytes);
	var mask = 0x01 << (numBytes * 8 - 1);
	if(value & mask){ value = (~value + 1) * -1; }
	return value;
}
	
CL3D.BinaryStream.prototype.readUnsignedShort = function()
{
	return this.readUI16();
}
	
CL3D.BinaryStream.prototype.readUnsignedInt = function()
{
	return this.readUI32();
}
		
CL3D.BinaryStream.prototype.readSI8 = function()
{
	return this.readSNumber(1);
}
		
CL3D.BinaryStream.prototype.readSI16 = function()
{
	return this.readSNumber(2);
}
		
CL3D.BinaryStream.prototype.readSI32 = function()
{
	return this.readSNumber(4);
}
		
CL3D.BinaryStream.prototype.readUI8 = function()
{
	return this.readNumber(1);
}
		
CL3D.BinaryStream.prototype.readUI16 = function()
{
		return this.readNumber(2);
}
		
CL3D.BinaryStream.prototype.readUI24 = function()
{
	return this.readNumber(3);
}
		  
CL3D.BinaryStream.prototype.readUI32 = function()
{
	return this.readNumber(4);
}
		
CL3D.BinaryStream.prototype.readFixed = function()
{
	return this._readFixedPoint(32, 16);
}
		
CL3D.BinaryStream.prototype.readFixed8 = function()
{
	return this._readFixedPoint(16, 8);
}
		
CL3D.BinaryStream.prototype._readFixedPoint = function(numBits, precision)
{
	var value = this.readSB(numBits);
	value = value * Math.pow(2, -precision)
	return value;
}
		
CL3D.BinaryStream.prototype.readFloat16 = function()
{
	//return this._readFloatingPoint(5, 10);
	return this.decodeFloat32fast(5, 10);
	
}
		
CL3D.BinaryStream.prototype.readFloat = function()
{
	//var data = this._buffer.substring(this._offset, this._offset+4);
	//var d = this.decodeFloat(data, 23, 8);
	//this._offset += 4;
	//return d;
	
	var f = this.decodeFloat32fast(this._buffer, this._offset);
	this._offset += 4;
	return f;
}
		
CL3D.BinaryStream.prototype.readDouble = function()
{
	var data = this._buffer.substring(this._offset, this._offset+8);
	var d = this.decodeFloat(data, 52, 11);
	this._offset += 8;
	return d;
}

CL3D.BinaryStream.prototype.decodeFloat32fast = function(data, offset)
{
	var b1 = data.charCodeAt(offset+3) & 0xFF,
		b2 = data.charCodeAt(offset+2) & 0xFF,
		b3 = data.charCodeAt(offset+1) & 0xFF,
		b4 = data.charCodeAt(offset+0) & 0xFF;
	var sign = 1 - (2*(b1 >> 7));                     // sign = bit 0
	var exp = (((b1 << 1) & 0xff) | (b2 >> 7)) - 127; // exponent = bits 1..8
	var sig = ((b2 & 0x7f) << 16) | (b3 << 8) | b4;   // significand = bits 9..31
	if (sig == 0 && exp == -127)
	  return 0.0;
	return sign * (1 + sig * Math.pow(2, -23)) * Math.pow(2, exp);
}
		
CL3D.BinaryStream.prototype.decodeFloat = function(data, precisionBits, exponentBits)
{
	var b = ((b = new this.Buffer(this.bigEndian, data)), b),
		bias = Math.pow(2, exponentBits - 1) - 1,
		signal = b.readBits(precisionBits + exponentBits, 1),
		exponent = b.readBits(precisionBits, exponentBits),
		significand = 0,
		divisor = 2,
		curByte = b.buffer.length + (-precisionBits >> 3) - 1,
		byteValue,
		startBit,
		mask;
		
	do
	{
		for(byteValue = b.buffer[ ++curByte ], startBit = precisionBits % 8 || 8, mask = 1 << startBit;
			mask >>= 1; (byteValue & mask) && (significand += 1 / divisor), divisor *= 2) 
		{}
	}
	while(precisionBits -= startBit);
	
	return exponent == (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
		: (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
		: Math.pow(2, exponent - bias) * (1 + significand) : 0);
}
	
CL3D.BinaryStream.prototype.Buffer = function(bigEndian, buffer)
{
	this.bigEndian = bigEndian || 0, this.buffer = [], this.setBuffer(buffer);
}

CL3D.BinaryStream.prototype.Buffer.prototype.readBits = function(start, length)
{
	function shl(a, b)
	{
		for(++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1)
		{}
		return a;
	}
	
	if(start < 0 || length <= 0)
		return 0;
		
	for(var offsetLeft, offsetRight = start % 8, curByte = this.buffer.length - (start >> 3) - 1,
		lastByte = this.buffer.length + (-(start + length) >> 3), diff = curByte - lastByte,
		sum = ((this.buffer[ curByte ] >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1))
		+ (diff && (offsetLeft = (start + length) % 8) ? (this.buffer[ lastByte++ ] & ((1 << offsetLeft) - 1))
		<< (diff-- << 3) - offsetRight : 0); diff; sum += shl(this.buffer[ lastByte++ ], (diff-- << 3) - offsetRight)
	) {}
	return sum;
};

CL3D.BinaryStream.prototype.Buffer.prototype.setBuffer = function(data)
{
	if(data)
	{
		for(var l, i = l = data.length, b = this.buffer = new Array(l); i; b[l - i] = data.charCodeAt(--i))
		{}
		this.bigEndian && b.reverse();
	}
}

CL3D.BinaryStream.prototype.Buffer.prototype.hasNeededBits = function(neededBits)
{
	return this.buffer.length >= -(-neededBits >> 3);
}

		
CL3D.BinaryStream.prototype.readSB = function(numBits)
{
	var value = this.readUB(numBits);
	var mask = 0x01 << (numBits - 1);
	if(value & mask){ value -= Math.pow(2, numBits); }
	return value;
}
		
CL3D.BinaryStream.prototype.readUB = function(numBits)
{
	var value = 0;
	var t = this;
	var i = numBits;
	while(i--){
		if(t._bitOffset == 8){
			t._bitBuffer = t.readUI8();
			t._bitOffset = 0;
		}
		var mask = 0x80 >> t._bitOffset;
		value = value * 2 + (t._bitBuffer & mask ? 1 : 0);
		t._bitOffset++;
	}
	return value;
}
		
CL3D.BinaryStream.prototype.readFB = function(numBits)
{
	return this._readFixedPoint(numBits, 16);
}
		
CL3D.BinaryStream.prototype.readString = function(numChars)
{
	var chars = [];
	var i = numChars || this._length - this._offset;
	while(i--){
		var code = this.readNumber(1);
		if(numChars || code){ chars.push(String.fromCharCode(code)); }
		else{ break; }
	}
	return chars.join('');
}
		
CL3D.BinaryStream.prototype.readBool = function(numBits)
{
	return !!this.readUB(numBits || 1);
}
	
CL3D.BinaryStream.prototype.tell = function()
{
	return this._offset;
}
		
CL3D.BinaryStream.prototype.seek = function(offset, absolute)
{
	this._offset = (absolute ? 0 : this._offset) + offset;
	return this;
}
	
CL3D.BinaryStream.prototype.reset = function()
{
	this._offset = 0;
	return this;
}
	