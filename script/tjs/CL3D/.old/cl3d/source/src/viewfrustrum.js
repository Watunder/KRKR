//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * A view frustrum defining the area of view
 * @constructor
 * @private
 * @class A view frustrum defining the area of view
 */
CL3D.ViewFrustrum = function()
{
	this.planes = new Array();
	for (var i=0; i<CL3D.ViewFrustrum.VF_PLANE_COUNT; ++i)
		this.planes.push(new CL3D.Plane3d());
}	

CL3D.ViewFrustrum.prototype.planes = null; //:Array; // Plane3d


/**
 * Far plane of the frustum. That is the plane farest away from the eye.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_FAR_PLANE = 0;

/**
 * Near plane of the frustum. That is the plane nearest to the eye.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_NEAR_PLANE = 1;

/**
 * Left plane of the frustum.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_LEFT_PLANE = 2;

/**
 * Right plane of the frustum.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_RIGHT_PLANE = 3;


/**
 * Bottom plane of the frustum.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_BOTTOM_PLANE = 4;


/**
 * Top plane of the frustum.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_TOP_PLANE = 5;

/**
 * Amount of planes enclosing the view frustum. Should be 6.
 * @private
 * @const
 */
CL3D.ViewFrustrum.VF_PLANE_COUNT = 6;

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.setFrom = function(mat)
{
	// left clipping plane
	var plane;
	
	plane = this.planes[CL3D.ViewFrustrum.VF_LEFT_PLANE];
	plane.Normal.X = mat.m03 + mat.m00;
	plane.Normal.Y = mat.m07 + mat.m04;
	plane.Normal.Z = mat.m11 + mat.m08;
	plane.D =        mat.m15 + mat.m12;

	// right clipping plane
	plane = this.planes[CL3D.ViewFrustrum.VF_RIGHT_PLANE];
	plane.Normal.X = mat.m03 - mat.m00;
	plane.Normal.Y = mat.m07 - mat.m04;
	plane.Normal.Z = mat.m11 - mat.m08;
	plane.D =        mat.m15 - mat.m12;

	// top clipping plane
	plane = this.planes[CL3D.ViewFrustrum.VF_TOP_PLANE];
	plane.Normal.X = mat.m03 - mat.m01;
	plane.Normal.Y = mat.m07 - mat.m05;
	plane.Normal.Z = mat.m11 - mat.m09;
	plane.D =        mat.m15 - mat.m13;

	// bottom clipping plane
	plane = this.planes[CL3D.ViewFrustrum.VF_BOTTOM_PLANE];
	plane.Normal.X = mat.m03 + mat.m01;
	plane.Normal.Y = mat.m07 + mat.m05;
	plane.Normal.Z = mat.m11 + mat.m09;
	plane.D =        mat.m15 + mat.m13;

	// far clipping plane
	plane = this.planes[CL3D.ViewFrustrum.VF_FAR_PLANE];
	plane.Normal.X = mat.m03 - mat.m02;
	plane.Normal.Y = mat.m07 - mat.m06;
	plane.Normal.Z = mat.m11 - mat.m10;
	plane.D =        mat.m15 - mat.m14;

	// near clipping plane
	plane = this.planes[CL3D.ViewFrustrum.VF_NEAR_PLANE];
	plane.Normal.X = mat.m02;
	plane.Normal.Y = mat.m06;
	plane.Normal.Z = mat.m10;
	plane.D =        mat.m14;

	// normalize normals
	var i = 0;
	for ( i=0; i < CL3D.ViewFrustrum.VF_PLANE_COUNT; ++i)
	{
		plane = this.planes[i];
		var len = -(1.0 / plane.Normal.getLength());
		plane.Normal = plane.Normal.multiplyWithScal(len);
		plane.D *= len;
	}
}

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.getFarLeftUp = function()
{
	var p = new CL3D.Vect3d();
	
	this.planes[CL3D.ViewFrustrum.VF_FAR_PLANE].getIntersectionWithPlanes(	
		this.planes[CL3D.ViewFrustrum.VF_TOP_PLANE], this.planes[CL3D.ViewFrustrum.VF_LEFT_PLANE], p);

	return p;
}

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.getFarRightUp = function()
{
	var p = new CL3D.Vect3d();
	
	this.planes[CL3D.ViewFrustrum.VF_FAR_PLANE].getIntersectionWithPlanes(	
		this.planes[CL3D.ViewFrustrum.VF_TOP_PLANE], this.planes[CL3D.ViewFrustrum.VF_RIGHT_PLANE], p);

	return p;
}

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.getFarRightDown = function()
{
	var p = new CL3D.Vect3d();
	
	this.planes[CL3D.ViewFrustrum.VF_FAR_PLANE].getIntersectionWithPlanes(	
		this.planes[CL3D.ViewFrustrum.VF_BOTTOM_PLANE], this.planes[CL3D.ViewFrustrum.VF_RIGHT_PLANE], p);

	return p;
}

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.getFarLeftDown = function()
{
	var p = new CL3D.Vect3d();
	
	this.planes[CL3D.ViewFrustrum.VF_FAR_PLANE].getIntersectionWithPlanes(	
		this.planes[CL3D.ViewFrustrum.VF_BOTTOM_PLANE], this.planes[CL3D.ViewFrustrum.VF_LEFT_PLANE], p);

	return p;
}

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.getBoundingBox = function(campos)
{
	var b = new CL3D.Box3d();
	b.reset ( campos.X, campos.Y, campos.Z );

	b.addInternalPointByVector(this.getFarLeftUp());
	b.addInternalPointByVector(this.getFarRightUp());
	b.addInternalPointByVector(this.getFarLeftDown());
	b.addInternalPointByVector(this.getFarRightDown());
	
	return b;
}

/**
 * @private
 */
CL3D.ViewFrustrum.prototype.isBoxInside = function(box)
{
	var edges = box.getEdges();
	
	for (var p=0; p<6; ++p)
	{
		var boxInFrustum = false;
		
		for (var j=0; j<8; ++j)
		{
			if (this.planes[p].classifyPointRelation(edges[j]) != CL3D.Plane3d.ISREL3D_FRONT)
			{
				boxInFrustum = true;
				break;
			}
		}
		
		if (!boxInFrustum)
			return false;
	}
	
	return true;
}