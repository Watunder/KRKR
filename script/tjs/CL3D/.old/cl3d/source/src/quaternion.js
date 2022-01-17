//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * Quaternion class for representing rotations
 * @constructor
 * @public
 * @class Quaternion class for representing rotations
 */
CL3D.Quaternion = function(x,y,z,w)
{
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.W = 1;
		
	if (x != null )
		this.X = x;
		
	if ( y != null)
		this.Y = y;
		
	if (z != null)
		this.Z = z;
		
	if (w != null)
		this.W = w;
}

/**
 * X component of the Quaternion
 * @public
 * @type Number
 */
CL3D.Quaternion.prototype.X = 0;

/**
 * Y component of the Quaternion
 * @public
 * @type Number 
 */
CL3D.Quaternion.prototype.Y = 0;

/**
 * Z component of the Quaternion
 * @public
 * @type Number
 */
CL3D.Quaternion.prototype.Z = 0;

/**
 * W component of the Quaternion
 * @public
 * @type Number
 */
CL3D.Quaternion.prototype.W = 0;


/**
 * Creates a clone of this Quaternion
 * @public
 */
CL3D.Quaternion.prototype.clone = function()
{
	var m = new CL3D.Quaternion();
	this.copyTo(m);
	return m;
}

/**
 * Copies the content of this Quaternion to a target Quaternion
 * @public
 */
CL3D.Quaternion.prototype.copyTo = function(tgt)
{
	tgt.X = this.X;
	tgt.Y = this.Y;
	tgt.Z = this.Z;
	tgt.W = this.W;
}

/**
 * Multiplication operator, multiplies with a float (scalar).
 * @public
 */
CL3D.Quaternion.prototype.multiplyWith = function(s) //:Quaternion
{
	return new CL3D.Quaternion(this.X*s, this.Y*s, this.Z*s, this.W*s);
}

/**
 * Multiplication operator, multiplies with a float (scalar).
 * @private
 */
CL3D.Quaternion.prototype.multiplyThisWith = function(s)
{
	this.X = this.X*s;
	this.Y = this.Y*s;
	this.Z = this.Z*s;
	this.W = this.W*s;
}

/**
 * Addition operator, adds another quaternion to this one
 * @public
 */
CL3D.Quaternion.prototype.addToThis = function(b) //:Quaternion
{
	this.X += b.X;
	this.Y += b.Y;
	this.Z += b.Z;
	this.W += b.W;
	return this;
}

/**
 * set this quaternion to the result of the interpolation between two quaternions. Time is a float between 0 and 1
 * @public
 */
CL3D.Quaternion.prototype.slerp = function(q1, q2, time) //:void
{
	var angle = q1.dotProduct(q2);

	if (angle < 0.0)
	{
		q1 = q1.multiplyWith(-1.0);
		angle *= -1.0;
	}

	var scale;
	var invscale;

	if ((angle + 1.0) > 0.05)
	{
		if ((1.0 - angle) >= 0.05) // spherical interpolation
		{
			var theta = Math.acos(angle);
			var invsintheta = 1.0 / Math.sin(theta);
			scale = Math.sin(theta * (1.0-time)) * invsintheta;
			invscale = Math.sin(theta * time) * invsintheta;
		}
		else // linear interploation
		{
			scale = 1.0 - time;
			invscale = time;
		}
	}
	else
	{
		q2 = new CL3D.Quaternion(-q1.Y, q1.X, -q1.W, q1.Z);
		scale = Math.sin(CL3D.PI * (0.5 - time));
		invscale = Math.sin(CL3D.PI * time);
	}

	// return (*this = (q1*scale) + (q2*invscale));
	var res = q1.multiplyWith(scale).addToThis(q2.multiplyWith(invscale));
	this.X = res.X;
	this.Y = res.Y;
	this.Z = res.Z;
	this.W = res.W;
}


/**
 * calculates to dot product with another quaternion
 * @public
 */
CL3D.Quaternion.prototype.dotProduct = function(q2)
{
	return (this.X * q2.X) + (this.Y * q2.Y) + (this.Z * q2.Z) + (this.W * q2.W);
}

/**
 * Creates a matrix from this quaternion
 * @public
 */
CL3D.Quaternion.prototype.getMatrix = function() //:Matrix4
{
	var m = new CL3D.Matrix4(false);
	this.getMatrix_transposed(m);
	return m;
}

/**
 * Creates a matrix from this quaternion
 * @private
 */
CL3D.Quaternion.prototype.getMatrix_transposed = function( dest ) //:void
{
	var X = this.X;
	var Y = this.Y;
	var Z = this.Z;
	var W = this.W;
	
	dest.m00 = 1.0 - 2.0*Y*Y - 2.0*Z*Z;
	dest.m04 = 2.0*X*Y + 2.0*Z*W;
	dest.m08 = 2.0*X*Z - 2.0*Y*W;
	dest.m12 = 0.0;

	dest.m01 = 2.0*X*Y - 2.0*Z*W;
	dest.m05 = 1.0 - 2.0*X*X - 2.0*Z*Z;
	dest.m09 = 2.0*Z*Y + 2.0*X*W;
	dest.m13 = 0.0;

	dest.m02 = 2.0*X*Z + 2.0*Y*W;
	dest.m06 = 2.0*Z*Y - 2.0*X*W;
	dest.m10 = 1.0 - 2.0*X*X - 2.0*Y*Y;
	dest.m14 = 0.0;

	dest.m03 = 0.0;
	dest.m07 = 0.0;
	dest.m11 = 0.0;
	dest.m15 = 1.0;
	
	dest.bIsIdentity = false;
}

/**
 * Fills a 3D vector with euler coodinates representing this quaternion
 * @param {CL3D.Vect3d} dest 3d vector to be filled with the euler coordinates
 * @public
 */
CL3D.Quaternion.prototype.toEuler = function(dest)
{
	var sqw = this.W*this.W;
	var sqx = this.X*this.X;
	var sqy = this.Y*this.Y;
	var sqz = this.Z*this.Z;

	// heading = rotation about z-axis
	dest.Z = (Math.atan2(2.0 * (this.X*this.Y +this.Z*this.W),(sqx - sqy - sqz + sqw)));

	// bank = rotation about x-axis
	dest.X = (Math.atan2(2.0 * (this.Y*this.Z +this.X*this.W),(-sqx - sqy + sqz + sqw)));

	// attitude = rotation about y-axis
	dest.Y = Math.asin( CL3D.clamp(-2.0 * (this.X*this.Z - this.Y*this.W), -1.0, 1.0) );
}

/**
 * Sets the quaternion from euler coordinates
 * @param {CL3D.Vect3d} dest 3d vector to be filled with the euler coordinates
 * @public
 */
CL3D.Quaternion.prototype.setFromEuler = function(x, y, z)
{
	var angle = x * 0.5;
	var sr = Math.sin(angle);
	var cr = Math.cos(angle);

	angle = y * 0.5;
	var sp = Math.sin(angle);
	var cp = Math.cos(angle);

	angle = z * 0.5;
	var sy = Math.sin(angle);
	var cy = Math.cos(angle);

	var cpcy = cp * cy;
	var spcy = sp * cy;
	var cpsy = cp * sy;
	var spsy = sp * sy;

	this.X = (sr * cpcy - cr * spsy);
	this.Y = (cr * spcy + sr * cpsy);
	this.Z = (cr * cpsy - sr * spcy);
	this.W = (cr * cpcy + sr * spsy);

	this.normalize();
}

// sets from euler coordinates
CL3D.Quaternion.prototype.normalize = function()
{
	var n = this.X*this.X + this.Y*this.Y + this.Z*this.Z + this.W*this.W;

	if (n == 1)
		return;

	n = 1.0 / Math.sqrt(n);
	this.multiplyThisWith(n);
}

/**
 * Creates a matrix from this quaternion
 * @private
 */	
CL3D.Quaternion.prototype.toString = function() //:String
{
	return "(x: " + this.X + " y:" + this.Y + " z:" + this.Z + " w:" + this.W + ")";
}