//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * @constructor
 * @private
 */
CL3D.CCDocument = function()
{
	this.CurrentScene = -1;
	this.ApplicationTitle = "";
	this.Scenes = new Array();
	//this.UpdateMode = CL3D.Scene.REDRAW_WHEN_SCENE_CHANGED; 
	this.UpdateMode = CL3D.Scene.REDRAW_EVERY_FRAME;
	this.WaitUntilTexturesLoaded = false;
	
	this.CanvasWidth = 320;
	this.CanvasHeight = 200;
	
	this.addScene = function(s)
	{
		this.Scenes.push(s);
	}
	
	this.getCurrentScene = function(s)
	{
		if (this.CurrentScene < 0 || this.CurrentScene >= this.Scenes.length)
			return null;
		return this.Scenes[this.CurrentScene];
	}
	
	this.setCurrentScene = function(s)
	{
		for (var i=0; i<this.Scenes.length; ++i)
		{
			if (this.Scenes[i] === s)
			{
				this.CurrentScene = i;
				return;
			}
		}
	}
}