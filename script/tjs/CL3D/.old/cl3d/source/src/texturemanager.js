//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * Texture manager containing all {@link Texture}s and able to load new ones, accessible via {@link CopperLicht.getTextureManager}().
 * @constructor
 * @class texture manager containing all {@link Texture}s and able to load new ones, accessible via {@link CopperLicht.getTextureManager}().
 * @public 
 */
CL3D.TextureManager = function()
{
	this.Textures = new Array(); // texure
	this.TheRenderer = null;
	this.PathRoot = '';
}

/**
 * Returns a new CL3D.Texture object from an URL and starts loading it. 
 * If the texture has been already loaded, it doesn't load it a second time but returns the
 * reference to the old texture.
 * @public
 * @param url {String} Url of the image. Can be relative like 'path/to/image/mytexture.jpg' or absolute like 'http://www.ambiera.com/images/ambiera_logo_big.png'
 * @param createIfNotFound {Boolean} set to true to create a new CL3D.Texture object and start loading it if an existing once wasn't found with this url.
 * @returns {CL3D.Texture} texture object
 *
 */
CL3D.TextureManager.prototype.getTexture = function(url, createIfNotFound)
{
	if (url == null || url == "")
		return null;
		
	var t = this.getTextureFromName(url);
	
	if (t != null)
		return t;
	
	if (createIfNotFound)
	{	
		t = new CL3D.Texture();
		t.Name = url;
		this.addTexture(t);
		
		// start loading texture
		
		var me = this;
		t.Image = new Image();
		t.Image.onload = function() { me.onTextureLoaded(t); }
		t.Image.src = t.Name;
		 
		//CL3D.gCCDebugOutput.print("starting loading texture: " + t.Image.src);
		
		return t;
	}
	
	return null;
}

/**
 * Returns the amount of textures 
 * @public 
 */
CL3D.TextureManager.prototype.getTextureCount = function()
{
	return this.Textures.length;
}

/**
 * @private 
 */
CL3D.TextureManager.prototype.onTextureLoaded = function(t)
{
	//CL3D.gCCDebugOutput.print("http loaded texture: " + t.Name);

	 var r = this.TheRenderer;
	 if (r == null)
		return;
	 r.finalizeLoadedImageTexture(t);
	 t.Loaded = true;
}

/**
 * Returns the amount of textures which still need to be loaded
 * @public
 */
CL3D.TextureManager.prototype.getCountOfTexturesToLoad = function()
{
	var ret = 0;
	
	for (var i=0; i<this.Textures.length; ++i)
	{
		var t = this.Textures[i];
		if (t.Loaded == false)
			++ret;
	}
	
	return ret;
}

/**
 * @private
 */
CL3D.TextureManager.prototype.getTextureFromName = function(name)
{
	for (var i=0; i<this.Textures.length; ++i)
	{
		var t = this.Textures[i];
		if (t.Name == name)
			return t;
	}
	
	return null;
}

/**
 * @private
 */
CL3D.TextureManager.prototype.addTexture = function(t)
{
	if (t != null)
	{
		if (this.getTextureFromName(t.Name) != null)
			CL3D.gCCDebugOutput.print("ERROR! Cannot add the texture multiple times: " + t.Name);
		//else
		//	CL3D.gCCDebugOutput.print("adding texture: " + t.Name);
			
		this.Textures.push(t);
	}
}

/**
 * use renderer.deleteTexture instead, this is just for removing it from the list of registered textures
 * @private
 */
CL3D.TextureManager.prototype.removeTexture = function(tex)
{
	for (var i=0; i<this.Textures.length; ++i)
	{
		var t = this.Textures[i];
		if (t == tex)
		{
			this.Textures.splice(i, 1);
			return true;
		}
	}
	
	return false;
}
