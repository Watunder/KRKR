//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * @constructor
 * @extends CL3D.Scene
 * @private
 */
CL3D.Free3dScene = function()
{
	this.init();
	this.DefaultCameraPos = new CL3D.Vect3d();
	this.DefaultCameraTarget = new CL3D.Vect3d();
}
CL3D.Free3dScene.prototype = new CL3D.Scene();

/**
  * returns the type string of the current scene. For free 3d scenes, this is 'free'.
  * @public
*/
CL3D.Free3dScene.prototype.getSceneType = function()
{
	return "free";
}
