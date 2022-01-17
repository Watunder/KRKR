//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * Class which holds the geometry of an object.
 * A Mesh is nothing more than a collection of some {@link CL3D.MeshBuffer}s. 
 * A mesh is usually used in a {@link CL3D.MeshSceneNode} in order to be rendered.
 * @constructor
 * @public
 * @class Class which holds the geometry of an object
 */
CL3D.Mesh = function()
{
	this.Box = new CL3D.Box3d();
	this.MeshBuffers = new Array();
}

/** 
 * Adds a {@link MeshBuffer} to a mesh.
 * @public
 */
CL3D.Mesh.prototype.AddMeshBuffer = function(m)
{
	this.MeshBuffers.push(m);
}

/** 
 * Returns an Array of all {@link MeshBuffer}s in this mesh. 
 * @public
 * @returns {Array} array of {@link MeshBuffer}s
 */
CL3D.Mesh.prototype.GetMeshBuffers = function()
{
	return this.MeshBuffers;
}

/** 
 * Returns the amount of polygons in the mesh
 * @public
 * @returns {Number} number of polygons in this mesh
 */
CL3D.Mesh.prototype.GetPolyCount = function()
{
	var cnt = 0;
	
	if (this.MeshBuffers)
	{
		for (var i=0; i<this.MeshBuffers.length; ++i)
			if (this.MeshBuffers[i].Indices)
				cnt += this.MeshBuffers[i].Indices.length;
	}
			
	return cnt / 3;
}

/**
 * Creates a clone of this mesh, a copy
 * @public
 */
CL3D.Mesh.prototype.createClone = function()
{
	var ret = new CL3D.Mesh();
	ret.Box = this.Box.clone();
		
	if (this.MeshBuffers)
	{
		for (var i=0; i<this.MeshBuffers.length; ++i)
			if (this.MeshBuffers[i])
				ret.MeshBuffers.push(this.MeshBuffers[i].createClone());
	}
	
	return ret;
}
