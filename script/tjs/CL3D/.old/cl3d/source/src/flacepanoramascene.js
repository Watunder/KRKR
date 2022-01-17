//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * @constructor
 * @extends CL3D.Scene
 * @private
 */
CL3D.PanoramaScene = function()
{
	this.init();
}
CL3D.PanoramaScene.prototype = new CL3D.Scene();


/**
  * returns the type string of the current scene. For Panorama scenes, this is 'panorama'.
  * @public
*/
CL3D.PanoramaScene.prototype.getSceneType = function()
{
	return "panorama";
}