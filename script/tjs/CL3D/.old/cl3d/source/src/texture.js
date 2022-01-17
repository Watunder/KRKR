//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * Class representing a texture which can be loaded from an URL.
 * @constructor
 * @class Class representing a texture which can be loaded from an URL.
 * @public
 */
CL3D.Texture = function()
{
	this.Name = '';
	this.Loaded = false;

	this.Image = null;
	this.Texture = null; // webgl texture object
	this.RTTFrameBuffer = null; // when used as RTT
	
	
	this.CachedWidth = null; // used if the texture was created from a 2d canvas
	this.CachedHeight = null; // used if the texture was created from a 2d canvas 
	
	this.OriginalWidth = null; // original with of the texture, before scaling up to power of two
	this.OriginalHeight = null; // original with of the texture, before scaling up to power of two
}

/**
 * returns the image of the texture
 * @public
 * @type {Image}
 */
CL3D.Texture.prototype.getImage = function()
{
	return this.Image;
}

/**
 * returns the webGL texture object of the texture, only available if the texture has been loaded already.
 * @public
 * @type {CL3D.Texture}
 */
CL3D.Texture.prototype.getWebGLTexture = function()
{
	return this.Texture;
}

/**
 * returns the width of this texture, or null if not loaded yet
 * @public
 * @type {int}
 */
CL3D.Texture.prototype.getWidth = function()
{
	if (this.Image)
		return this.Image.width;
		
	if (this.CachedWidth != null)
		return this.CachedWidth;
	
	return 0;
}

/**
 * returns the height of this texture, or null if not loaded yet
 * @public
 * @type {int}
 */
CL3D.Texture.prototype.getHeight = function()
{
	if (this.Image)
		return this.Image.height;
		
	if (this.CachedHeight != null)
		return this.CachedHeight;
	
	return 0;
}

/**
 * returns the URL of this texture
 * @public
 * @type {String}
 */
CL3D.Texture.prototype.getURL = function()
{
	return this.Name;
}

/**
 * returns if the texture has been sucessfully loaded
 * @public
 * @type {Boolean}
 */
CL3D.Texture.prototype.isLoaded = function()
{
	return this.Loaded;
}