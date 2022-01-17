//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * An animator animates a scene node. It can animate position, rotation, material, and so on. 
 * A scene node animator is able to animate a {@link SceneNode} in a very simple way: It may change its position,
 * rotation, scale and/or material. There are lots of animators to choose from. You can create scene node animators 
 * and attach them to a scene node using {@link SceneNode.addAnimator()}.<br/>
 * Note that this class is only the base class of all Animators, it doesn't do anything itself. See
 * {@link AnimatorCameraFPS} for a concrete Animator example.
 * @class An animator can be attached to a scene node and animates it.
 * @constructor
 * @public
 */
CL3D.Animator = function()
{
	this.Type = -1;
}

/** 
 * Returns the type of the animator.
 * Usual values are 'none', 'camerafps', etc. See the concreate animator implementations for type strings.
 * @public
 */
CL3D.Animator.prototype.getType = function()
{
	return 'none';
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.Animator.prototype.animateNode = function(n, timeMs)
{
	return false;
}		

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
CL3D.Animator.prototype.onMouseDown = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
CL3D.Animator.prototype.onMouseWheel = function(delta) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
CL3D.Animator.prototype.onMouseUp = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
CL3D.Animator.prototype.onMouseMove = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input.
 * Returns false if the event has not been processed.
 * @public
 */
CL3D.Animator.prototype.onKeyDown = function(event)
{
	return false;
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * Returns false if the event has not been processed.
 * @public
 */
CL3D.Animator.prototype.onKeyUp = function(event)
{
	return false;
}

/**
 * Resets the animator, if supported
 * @private
 */
CL3D.Animator.prototype.reset = function(event) 
{
}


/**
 * @private
 */
CL3D.Animator.prototype.findActionByType = function(type)
{
	return null;
}


/**
 * Creates an exact, deep copy of this animator
 * @public
 */
CL3D.Animator.prototype.createClone = function(node, scene, oldNodeId, newNodeId)
{
	return null;
}