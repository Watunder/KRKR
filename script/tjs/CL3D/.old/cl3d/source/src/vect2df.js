//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * 2d vector class, used for example for texture coordinates.
 * @class 2d vector class, used for example for texture coordinates.
 * @constructor
 * @param {Number} x x coordinate. Can be null.
 * @param {Number} y y coordinate.
 */
CL3D.Vect2d = function(x, y)
{
	if (x == null)
	{
		this.X = 0;
		this.Y = 0;
	}
	else
	{
		this.X = x;
		this.Y = y;
	}
}

/**
 * X coordinate of the vector
 * @public
 * @type Number
 */
CL3D.Vect2d.prototype.X = 0;

/**
 * Y coordinate of the vector
 * @public
 * @type Number 
 */
CL3D.Vect2d.prototype.Y = 0;

/**
 * Sets all 2 coordinates to new values
 * @private
 */
CL3D.Vect2d.prototype.set = function(x,y)
{
	this.X = x;
	this.Y = y;
}

/**
 * Creates a copy of this vector and returns it
 * @public
 * @type Vect2d
 */
CL3D.Vect2d.prototype.clone = function()
{
	return new CL3D.Vect2d(this.X,this.Y);
}
