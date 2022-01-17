//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * @constructor
 * @private
 */
CL3D.DebugOutput = function(elementIdToReplace, enableFPSCounter)
{
	this.DebugRoot = null;
	this.FPSRoot = null;
	this.TextRoot = null;
	
	var c = document.getElementById(elementIdToReplace);
	
	if (c == null)
	{
		//document.write("CopperCube: Element not found:" + elementIdToReplace);
		CL3D.gCCDebugInfoEnabled = false;
		return;
	}
	
	this.DebugRoot = c.parentNode;
	
	// create loading root
	
	if (this.DebugRoot)
	{
		this.LoadingRoot = document.createElement("div");
		//this.LoadingRoot.class = 'cl_loadingindicator';
		this.DebugRoot.appendChild(this.LoadingRoot);
		var ln = document.createTextNode("Loading...");
		this.LoadingRootText = ln;
		this.LoadingRoot.appendChild(ln);
	}
	
	if (enableFPSCounter)
	{
		this.enableFPSCounter();
	}
};

CL3D.DebugOutput.prototype.enableFPSCounter = function()
{
	if (this.FPSRoot != null)
		return;
		
	this.FPSRoot = document.createElement("div");
	this.DebugRoot.appendChild(this.FPSRoot);
	var ln = document.createTextNode("FPS: 0");
	this.FPSRootText = ln;
	this.FPSRoot.appendChild(ln);
	
	this.frames = 0;
	this.lasttime = new Date().getTime();
}

CL3D.DebugOutput.prototype.updatefps = function(additionalText)
{
	if (this.FPSRootText == null)
		return;
		
	this.frames += 1;
	var stopTime = new Date().getTime();
	
	if (stopTime - this.lasttime > 1000)
	{
		var fps = this.frames / (stopTime - this.lasttime) * 1000;
		var txt = "FPS: " + fps.toFixed(2);
		
		if (additionalText != null)
			txt += additionalText;
		
		this.FPSRootText.nodeValue = txt;
		
		this.lasttime = stopTime;
		this.frames = 0;
	}
}

CL3D.DebugOutput.prototype.print = function(str)
{
	if (CL3D.gCCDebugInfoEnabled == false)
		return;
	this.printInternal(str, false);
}

CL3D.DebugOutput.prototype.setLoadingText = function(txt)
{
	if (!this.LoadingRoot)
		return;
		
	if (txt == null)
		this.LoadingRoot.style.display = 'none';
	else
	{
		this.LoadingRoot.style.display = 'block';
		this.LoadingRootText.nodeValue = txt;
	}
}

CL3D.DebugOutput.prototype.printError = function(str, ashtml)
{
	this.printInternal(str, true, ashtml);
}

/**
 * @private
 * This prints to the JavaScript console, if possible.
 */
CL3D.DebugOutput.prototype.jsConsolePrint = function(msg)
{
	if (window['console'])
	{
		try {
			window['console']['log'](msg);
		} catch(e) {} 
	}
	else
	{
		// print for browser without console.log functionality
		
		setTimeout(function() {
			throw new Error(msg);
		}, 0);
	}
}

/**
 * @private
 */
CL3D.DebugOutput.prototype.printInternal = function(str, force, ashtml)
{
	if (CL3D.gCCDebugInfoEnabled == false && force != true)
		return;
		
	if (this.TextRoot == null)
	{
		this.TextRoot = document.createElement("div");
		this.TextRoot.className = 'cldebug';
		this.DebugRoot.appendChild(this.TextRoot);
	}
	if (ashtml)
	{
		this.TextRoot.appendChild(document.createElement("br"));
		var dv = document.createElement('div');
		this.TextRoot.appendChild(dv);
		dv.innerHTML = str;		
	}
	else
	{
		this.TextRoot.appendChild(document.createElement("br"));
		var ln = document.createTextNode(str);
		this.TextRoot.appendChild(ln);
	}
}


CL3D.gCCDebugInfoEnabled = true;
CL3D.gCCDebugOutput = null;
