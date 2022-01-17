//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * 3d plane class with lots of operators and methods. 
 * @class 3d plane class with lots of operators and methods
 * @public
 * @constructor
 */
CL3D.Plane3d = function()
{
	this.Normal = new CL3D.Vect3d(0,1,0);
	this.recalculateD(new CL3D.Vect3d(0,0,0));
}

/**
 * plane distance to origin
 * @public
 * @type Number
 */
CL3D.Plane3d.prototype.D = 0;

/**
 * plane normal
 * @public
 * @type Vect3d 
 */
CL3D.Plane3d.prototype.Normal = null;

/**
 * front plane relation, used in {@link Plane3d.classifyPointRelation}
 * @const
 * @public
 */
CL3D.Plane3d.ISREL3D_FRONT 		= 0;

/**
 * back plane relation, used in {@link Plane3d.classifyPointRelation}
 * @const
 * @public
 */
CL3D.Plane3d.ISREL3D_BACK 		= 1;

/**
 * planar plane relation, used in {@link Plane3d.classifyPointRelation}
 * @const
 * @public
 */
CL3D.Plane3d.ISREL3D_PLANAR 		= 2;

/**
 * Creates a clone of the plane
 * @returns {Plane3d} the cloned plane
 * @public
 */
CL3D.Plane3d.prototype.clone = function()
{
	var pl = new CL3D.Plane3d(false);
	pl.Normal = this.Normal.clone();
	pl.D = this.D;
	return pl;			
}

/**
 * Recalculates the distance from origin by applying a new member point to the plane.
 * @public
 */ 
CL3D.Plane3d.prototype.recalculateD = function(mpoint)
{
	this.D = - mpoint.dotProduct(this.Normal);
}

/**
 * Gets a member point of the plane.
 * @public
 */
CL3D.Plane3d.prototype.getMemberPoint = function()
{
	return this.Normal.multiplyWithScal(-this.D);
}

/**
 * Sets initial values 
 * @public
 */
CL3D.Plane3d.prototype.setPlane = function(point, nvector)
{
	this.Normal = nvector.clone();
	this.recalculateD(point);
}

/** 
 * creates a plane from 3 points
 * @public
 */
CL3D.Plane3d.prototype.setPlaneFrom3Points = function(point1, point2, point3)
{
	// creates the plane from 3 memberpoints
	this.Normal = (point2.substract(point1)).crossProduct(point3.substract(point1));
	this.Normal.normalize();

	this.recalculateD(point1);
}

/**
 * normalizes the plane
 * @public
 */
CL3D.Plane3d.prototype.normalize = function()
{
	var len = (1.0 / this.Normal.getLength());
	this.Normal = this.Normal.multiplyWithScal(len);
	this.D *= len;
}

/**
 * Classifies the relation of a point to this plane.
 * @public
 * @param point Point to classify its relation.
 * @returns ISREL3D_FRONT if the point is in front of the plane,
 * ISREL3D_BACK if the point is behind of the plane, and
 * ISREL3D_PLANAR if the point is within the plane. 
 */
CL3D.Plane3d.prototype.classifyPointRelation = function(point)
{
	var d = this.Normal.dotProduct(point) + this.D;

	if (d < -0.000001)
		return CL3D.Plane3d.ISREL3D_BACK;

	if (d > 0.000001)
		return CL3D.Plane3d.ISREL3D_FRONT;

	return CL3D.Plane3d.ISREL3D_PLANAR;
}


/** 
 * Get the intersection point with two other planes if there is one.
 * @public
 * @returns {Boolean} true if intersection found, false if not
 */
CL3D.Plane3d.prototype.getIntersectionWithPlanes = function(o1,	o2, outPoint)
{
	var linePoint = new CL3D.Vect3d();
	var lineVect = new CL3D.Vect3d();
	
	if (this.getIntersectionWithPlane(o1, linePoint, lineVect))
		return o2.getIntersectionWithLine(linePoint, lineVect, outPoint);

	return false;
}


/**
 * Intersects this plane with another.
 * @public
 * @param other Other plane to intersect with.
 * @param outLinePoint Base point of intersection line.
 * @param outLineVect Vector of intersection.
 * @returns True if there is a intersection, false if not. 
 */
CL3D.Plane3d.prototype.getIntersectionWithPlane = function(other, outLinePoint, outLineVect)
{
	var fn00 = this.Normal.getLength();
	var fn01 = this.Normal.dotProduct(other.Normal);
	var fn11 = other.Normal.getLength();
	var det = fn00*fn11 - fn01*fn01;

	if (Math.abs(det) < 0.00000001 )
		return false;

	var invdet = 1.0 / det;
	var fc0 = (fn11*-this.D + fn01*other.D) * invdet;
	var fc1 = (fn00*-other.D + fn01*this.D) * invdet;

	this.Normal.crossProduct(other.Normal).copyTo(outLineVect);
	
	var tmp1 = this.Normal.multiplyWithScal(fc0);
	var tmp2 = other.Normal.multiplyWithScal(fc1);
	tmp1.add(tmp2).copyTo(outLinePoint);
	return true;
}


/**
 * Get an intersection with a 3d line.
 * @public
 * @param lineVect Vector of the line to intersect with.
 * @param linePoint Point of the line to intersect with.
 * @param outIntersection Place to store the intersection point, if there is one.
 * @returns True if there was an intersection, false if there was not.
 */
CL3D.Plane3d.prototype.getIntersectionWithLine = function(linePoint, lineVect, outIntersection)
{
	var t2 = this.Normal.dotProduct(lineVect);

	if (t2 == 0)
		return false;

	var t =- (this.Normal.dotProduct(linePoint) + this.D) / t2;
	linePoint.add((lineVect.multiplyWithScal(t))).copyTo(outIntersection);
	return true;
}

/**
 * Get the distance to a point.
 * Note that this only works if the normal is normalized. 
 * @public
 */
CL3D.Plane3d.prototype.getDistanceTo = function(point) 
{
	return point.dotProduct(this.Normal) + this.D;
}

/** 
 * Returns true if the plane is frontfacing to the look direction.
 * @public
 * @param lookDirection {CL3D.Vect3d} look direction
 */
CL3D.Plane3d.prototype.isFrontFacing = function(lookDirection)
{
	var d = this.Normal.dotProduct(lookDirection);
	return d <= 0;
}