//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

	/**
	 * A simple class for receiving the current time in milliseconds. Used by the animators for example.
	 * @constructor
	 * @private
	 */
	CL3D.CLTimer = function()
	{
	}

	/** 
	 * Returns the current time in milliseconds.
	 * @public
	 */
	CL3D.CLTimer.getTime = function()
	{
		var d = new Date();
		return d.getTime();
	}
