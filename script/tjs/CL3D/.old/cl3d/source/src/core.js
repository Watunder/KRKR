//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/*
 * This file Contains basic helper functions to convert between angles, finding minima and maxima of numbers and similar
 */

/** 
 * @const 
 * @private
 * The value PI
 */
CL3D.PI = 3.14159265359;

/** 
 * @const 
 * @private
 * reciprocal PI value
 */	
CL3D.RECIPROCAL_PI		= 1.0 / 3.14159265359;

/** 
 * @const 
 * @private
 * Half of PI
 */	
CL3D.HALF_PI			= 3.14159265359 / 2.0;

/** 
 * @const 
 * @private
 * Hih precision PI value
 */
CL3D.PI64				= 3.1415926535897932384626433832795028841971693993751;

/** 
 * @const 
 * @private
 * Value to convert degrees to grad. Use {@link degToRad} to do this.
 */
CL3D.DEGTORAD 			= 3.14159265359 / 180.0;

/** 
 * @const 
 * @private
 */	
CL3D.RADTODEG 			= 180.0 / 3.14159265359;

/** 
 * Low tolerance value deciding which floating point values are considered equal.
 * @const 
 */	
CL3D.TOLERANCE 			= 0.00000001;



/** 
 * Converts an angle from radians to degrees. 
 */
CL3D.radToDeg = function(radians)
{
	return radians * CL3D.RADTODEG;
};


/** 
 * Converts an angle from degrees to radians.
 */
CL3D.degToRad = function(deg)
{
	return deg * CL3D.DEGTORAD;
}

/** 
 * Returns if a floating point value is considered similar to 0, depending on {@link TOLERANCE}.
 */
CL3D.iszero = function(a)
{
	return (a < 0.00000001) && (a > -0.00000001);
}

/** 
 * Returns if a floating point value is considered similar to 0, depending on {@link TOLERANCE}.
 */
CL3D.isone = function(a)
{
	return (a + 0.00000001 >= 1) && (a - 0.00000001 <= 1);
}

/** 
 * Returns if two floating point values are considered similar, depending on {@link TOLERANCE}.
 */
CL3D.equals = function(a, b)
{
	return (a + 0.00000001 >= b) && (a - 0.00000001 <= b);
}


/** 
 * Returns a new value which is clamped between low and high. 
 */
CL3D.clamp = function(n, low, high)
{
	if (n < low)
		return low;
		
	if (n > high)
		return high;
		
	return n;
}

/** 
 * Returns the fraction part of a floating point value. Given for example 6.788, this would return 0.788.
 */
CL3D.fract = function(n)
{
	return n - Math.floor(n);
}

/** 
 * Returns the maximum value of 3 input values.
 */		
CL3D.max3 = function(a, b, c)
{
	if (a > b)
	{
		if (a > c)
			return a;
		
		return c;
	}
	
	if (b > c)
		return b;
		
	return c;
}

/** 
 * Returns the minimum of 3 input values. 
 */
CL3D.min3 = function(a, b, c)
{
	if (a < b)
	{
		if (a < c)
			return a;
		
		return c;
	}
	
	if (b < c)
		return b;
		
	return c;
}

/**
 * Returns the alpha component of a color compressed into one 32bit integer value
 * @param {Number} clr color
 * @returns {Number} color component value, a value between 0 and 255  
 */
CL3D.getAlpha = function(clr)
{
	return ((clr & 0xFF000000) >>> 24);
}

/**
 * Returns the red component of a color compressed into one 32bit integer value
 * @param clr {Number} color
 * @returns {Number} color component value, a value between 0 and 255  
 */
CL3D.getRed = function(clr)
{
	return ((clr & 0x00FF0000) >> 16);
}

/**
 * Returns the green component of a color compressed into one 32bit integer value
 * @param clr {Number} color
 * @returns {Number} color component value, a value between 0 and 255   
 */
CL3D.getGreen = function(clr)
{
	return ((clr & 0x0000FF00) >> 8);
}

/**
 * Returns the blue component of a color compressed into one 32bit integer value
 * @param clr {Number} 32 bit color
 * @returns {Number} color component value, a value between 0 and 255  
 */
CL3D.getBlue = function(clr)
{
	return ((clr & 0x000000FF));
}

/**
 * Creates a 32bit value representing a color
 * @param a {Number} Alpha component of the color (value between 0 and 255)
 * @param r {Number} Red component of the color (value between 0 and 255)
 * @param g {Number} Green component of the color (value between 0 and 255)
 * @param b {Number} Blue component of the color (value between 0 and 255)
 * @returns {Number} 32 bit color 
 */
CL3D.createColor = function(a, r, g, b)
{
	a = a & 0xff;
	r = r & 0xff;
	g = g & 0xff;
	b = b & 0xff;
	
	return (a<<24) | (r<<16) | (g<<8) | b;
}	


/**
 * Creates a CL3D.ColorF from 32bit value representing a color
 */
CL3D.createColorF = function(c)
{
	var r = new CL3D.ColorF();
	r.A = CL3D.getAlpha(c) / 255.0;
	r.R = CL3D.getRed(c) / 255.0;
	r.G = CL3D.getGreen(c) / 255.0;
	r.B = CL3D.getBlue(c) / 255.0;
	return r;
}	


/**
 * @private
 */
CL3D.getInterpolatedColor = function(clr1, clr2, f)
{
	var invf = 1.0 - f;
	
	return CL3D.createColor(
		CL3D.getAlpha(clr1)*f + CL3D.getAlpha(clr2)*invf,
		CL3D.getRed  (clr1)*f + CL3D.getRed  (clr2)*invf,
		CL3D.getGreen(clr1)*f + CL3D.getGreen(clr2)*invf,
		CL3D.getBlue (clr1)*f + CL3D.getBlue (clr2)*invf);
}	

/**
 * @private
 */
CL3D.sgn = function(a)
{
	if (a > 0.0) 
		return 1.0;

	if (a < 0.0) 
		return -1.0;

	return 0.0;
}

/**
 * A class holding a floating point color, consisting of four Numbers, for r, g, b and alpha
 * @constructor
 * @class A class holding a floating point color, consisting of four Numbers, for r, g, b and alpha
 */
CL3D.ColorF = function()
{
	this.A = 1.0;
	this.R = 1.0;
	this.G = 1.0;
	this.B = 1.0;
}

/**
 * Creates a copy of this color
 * @public
 */
CL3D.ColorF.prototype.clone = function()
{
	var r = new CL3D.ColorF();
	r.A = this.A;
	r.R = this.R;
	r.G = this.G;
	r.B = this.B;
	return r;
}

/**
 * alpha value of the color
 * @public
 * @type Number
 */
CL3D.ColorF.prototype.A = 1.0;

/**
 * red value of the color
 * @public
 * @type Number
 */
CL3D.ColorF.prototype.R = 1.0;

/**
 * green value of the color
 * @public
 * @type Number
 */
CL3D.ColorF.prototype.G = 1.0;

/**
 * blue value of the color
 * @public
 * @type Number
 */
CL3D.ColorF.prototype.B = 1.0;


/** 
 * @public
 * Global flag toggling if shadow maps should be rendered using a shadow map cascade or a single map.
 * This needs to be set before initialiting the engine.
 */
CL3D.UseShadowCascade = true;

/** 
 * @private
 * Global flag disabling post effects if hardware or browser is not capable of doing them.
 */
CL3D.Global_PostEffectsDisabled = false;
