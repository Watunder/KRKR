//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt
// This file contains several animators which only make sense in combination with
// the Coppercube editor, and are not pulic.

/////////////////////////////////////////////////////////////////////////////////////////
// Timer animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends CL3D.Animator
 */
CL3D.AnimatorTimer = function(scene)
{
	this.TimeLastTimed = 0;
	this.SMGr = scene;
	this.TheActionHandler = null;
	this.TickEverySeconds = 0;
	this.TimeLastTimed = CL3D.CLTimer.getTime();
}		
CL3D.AnimatorTimer.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorTimer, this will return 'timer'.
 * @private
 */
CL3D.AnimatorTimer.prototype.getType = function()
{
	return 'timer';
}

/** 
 * @private
 */
CL3D.AnimatorTimer.prototype.createClone = function(node, newManager, oldNodeId, newNodeId)
{
	var a = new CL3D.AnimatorTimer(this.SMGr);
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone(oldNodeId, newNodeId) : null;
	a.TimeLastTimed = this.TimeLastTimed;
	a.TickEverySeconds = this.TickEverySeconds;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.AnimatorTimer.prototype.animateNode = function(n, timeMs)
{
	if (n == null)
		return false;

	if (this.TickEverySeconds > 0)
	{
		var now = CL3D.CLTimer.getTime();

		if (now - this.TimeLastTimed > this.TickEverySeconds)
		{
			this.TimeLastTimed = now;
			
			if (this.TheActionHandler)
				this.TheActionHandler.execute(n);					
			return true;
		}
	}	
	return false;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Keypress animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends CL3D.Animator
 */
CL3D.AnimatorOnKeyPress = function(scene, engine)
{
	this.SMGr = scene;
	this.Engine = engine;
	this.TheActionHandler = null;
	this.TickEverySeconds = 0;
	this.Object = null;
	this.LastTimeDoneSomething = false;
	
	engine.registerAnimatorForKeyUp(this);
	engine.registerAnimatorForKeyDown(this);
	
	scene.registerSceneNodeAnimatorForEvents(this);
}		
CL3D.AnimatorOnKeyPress.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnKeyPress, this will return 'keypress'.
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.getType = function()
{
	return 'keypress';
}

/** 
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.createClone = function(node, newManager, oldNodeId, newNodeId)
{
	var a = new CL3D.AnimatorOnKeyPress(this.SMGr, this.Engine);
	a.KeyPressType = this.KeyPressType;
	//a.IfCameraOnlyDoIfActive = this.IfCameraOnlyDoIfActive;
	a.KeyCode = this.KeyCode;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone(oldNodeId, newNodeId) : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.AnimatorOnKeyPress.prototype.animateNode = function(n, timeMs)
{
	this.Object = n;
	var done = this.LastTimeDoneSomething;
	this.LastTimeDoneSomething = false;
	return done;
}

/**
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.onKeyDown = function(evt)
{
	if (this.KeyPressType == 0 && evt.keyCode == this.KeyCode)
	{
		this.directlyRunKeypressEvent();
		return true;
	}
	
	return false;
}

/**
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.onKeyUp = function(evt)
{
	if (this.KeyPressType == 1 && evt.keyCode == this.KeyCode)
	{
		this.directlyRunKeypressEvent();
		return true;
	}
	
	return false;
}

/**
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.onMouseUp = function(evt) 
{			
	if (this.KeyPressType == 1)
	{
		if (evt.button > 1 && this.KeyCode == 0x2) // right click
			this.directlyRunKeypressEvent();
		else
		if (evt.button <= 1 && this.KeyCode == 0x1) // left click
			this.directlyRunKeypressEvent();
	}
}

/**
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.onMouseDown = function(evt) 
{			
	if (this.KeyPressType == 0)
	{
		if (evt.button > 1 && this.KeyCode == 0x2) // right click
			this.directlyRunKeypressEvent();
		else
		if (evt.button <= 1 && this.KeyCode == 0x1) // left click
			this.directlyRunKeypressEvent();
	}
}

/**
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

/**
 * @private
 */
CL3D.AnimatorOnKeyPress.prototype.directlyRunKeypressEvent = function(type)
{
	if (this.Object &&
		this.Object.scene === this.SMGr &&
	    this.Object.isActuallyVisible()	&&
		this.Engine.getScene() === this.Object.scene )
	{
		if (this.Object.Parent == null && // deleted
		    !(this.Object.Type == -1))    // root scene node
		{
			// object seems to be deleted 
			this.Object = null;
			return;
		}
		
		this.LastTimeDoneSomething = true;			
			
		if (this.TheActionHandler)
			this.TheActionHandler.execute(this.Object);	

		this.SMGr.forceRedrawNextFrame(); // the animate might not be recalled after this element has been made invisible in this invokeAction()			
		return true;
	}
	
	return null;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Game AI Animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends CL3D.Animator
 */
CL3D.AnimatorGameAI = function(scene, engine)
{
	// constants for the commands (from coppercube editor):
	// private static const EMT_PLAYER:int = 0;
	// private static const EMT_STAND_STILL:int = 1;
	// private static const EMT_RANDOMLY_PATROL:int = 2;
	
	// private static const EMT_DO_NOTHING:int = 0;
	// private static const EMT_REACH_POSITION:int = 1;
	// private static const EMT_ATTACK_ITEM:int = 2;
	// private static const EMT_DIE_AND_STOP:int = 3;
	
	// private static const EAT_STAND:int = 0;
	// private static const EAT_WALK:int = 1;
	// private static const EAT_ATTACK:int = 2;
	// private static const EAT_DIE:int = 3;
		
	this.AIType = 0
	this.MovementSpeed = 0;
	this.ActivationRadius = 0;
	this.CanFly = false;
	this.Health = 100;
	this.PatrolWaitTimeMs = 3000;
	this.PathIdToFollow = -1;
	this.Tags = "";
	this.AttacksAIWithTags = "";
	this.PatrolRadius = 100;
	this.RotationSpeedMs = 0;
	this.AdditionalRotationForLooking = new CL3D.Vect3d();
	this.StandAnimation = "";
	this.WalkAnimation = "";
	this.DieAnimation = "";
	this.AttackAnimation = "";
	
	this.ActionHandlerOnAttack = null;
	this.ActionHandlerOnActivate = null;
	this.ActionHandlerOnHit = null;
	this.ActionHandlerOnDie = null;
	
	// runtime data
	
	this.CurrentCommand = 0;

	this.NextAttackTargetScanTime = 0;
	this.LastPatrolStartTime = 0;

	this.CurrentCommandTargetPos = null;
	this.CurrentCommandStartTime = 0;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 0;
	this.BeginPositionWhenStartingCurrentCommand = 0;	
	this.HandleCurrentCommandTargetNode = null;
	this.AttackCommandExecuted = false;
	this.Activated = false;
	this.CurrentlyShooting = false; // flag to be queried shoot action
	this.CurrentlyShootingLine = new CL3D.Line3d(); // data to be queried shoot action
	this.NextPathPointToGoTo = 0;
			
	this.World = null;
	this.TheObject = null;
	this.TheSceneManager = scene;
	this.LastTime = 0;
	this.StartPositionOfActor = new CL3D.Vect3d();
	
	this.NearestSceneNodeFromAIAnimator_NodeOut = null;
	this.NearestSceneNodeFromAIAnimator_maxDistance = 0;

}		
CL3D.AnimatorGameAI.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorGameAI, this will return 'gameai'.
 * @private
 */
CL3D.AnimatorGameAI.prototype.getType = function()
{
	return 'gameai';
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.createClone = function(node, newManager, oldNodeId, newNodeId)
{
	var a = new CL3D.AnimatorGameAI(this.TheSceneManager);
	a.AIType = this.AIType;
	a.MovementSpeed = this.MovementSpeed;
	a.ActivationRadius = this.ActivationRadius;
	a.CanFly = this.CanFly;
	a.Health = this.Health;
	a.Tags = this.Tags;
	a.AttacksAIWithTags = this.AttacksAIWithTags;
	a.PatrolRadius = this.PatrolRadius;
	a.RotationSpeedMs = this.RotationSpeedMs;
	a.PathIdToFollow = this.PathIdToFollow;
	a.PatrolWaitTimeMs = this.PatrolWaitTimeMs;
	a.AdditionalRotationForLooking = this.AdditionalRotationForLooking ? this.AdditionalRotationForLooking.clone() : null;
	a.StandAnimation = this.StandAnimation;
	a.WalkAnimation = this.WalkAnimation;
	a.DieAnimation = this.DieAnimation;
	a.AttackAnimation = this.AttackAnimation;
	
	a.ActionHandlerOnAttack = this.ActionHandlerOnAttack ? this.ActionHandlerOnAttack.createClone(oldNodeId, newNodeId) : null;
	a.ActionHandlerOnActivate = this.ActionHandlerOnActivate ? this.ActionHandlerOnActivate.createClone(oldNodeId, newNodeId) : null;
	a.ActionHandlerOnHit = this.ActionHandlerOnHit ? this.ActionHandlerOnHit.createClone(oldNodeId, newNodeId) : null;
	a.ActionHandlerOnDie = this.ActionHandlerOnDie ? this.ActionHandlerOnDie.createClone(oldNodeId, newNodeId) : null;
			
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.AnimatorGameAI.prototype.animateNode = function(node, timeMs)
{
	if (node == null || this.TheSceneManager == null)
		return false;
		
	var diff = timeMs - this.LastTime;
	if (diff > 150) diff = 150;
	this.LastTime = timeMs;
	
	var characterSize = 0;			
	var changedNode = false;
	
	if (!(this.TheObject === node))
	{
		this.TheObject = node;
		node.updateAbsolutePosition();
		this.StartPositionOfActor = node.getAbsolutePosition();
	}
			
	var currentPos = node.getAbsolutePosition();
	
	if (this.CurrentCommand == 3) //EMT_DIE_AND_STOP)
	{
		// do nothing
	}
	else
	if (this.CurrentCommand == 1) //EMT_REACH_POSITION)
	{
		// check if we reached the position

		characterSize = this.getCharacterWidth(node);
		if (this.CurrentCommandTargetPos.substract(currentPos).getLength() < characterSize)
		{
			// target reached.

			this.CurrentCommand = 0; //EMT_DO_NOTHING;
			this.setAnimation(node, 0); //EAT_STAND);
			changedNode = true;
		}
		else
		{
			// not reached position yet
			// check if we possibly hit a wall. This can be done easily by getting the moving speed and 
			// checking the start position and start time

			var cancelled = false;

			if (this.CurrentCommandTicksDone > 2)
			{
				var expectedLengthMoved = this.CurrentCommandTicksDone * (this.MovementSpeed / 1000.0);
				var lengthMoved = this.BeginPositionWhenStartingCurrentCommand.substract(currentPos).getLength();

				if ( lengthMoved * 1.2 < expectedLengthMoved )
				{
					// cancel movement, moved twice as long as we should have already.
					this.CurrentCommand = 0; //EMT_DO_NOTHING;
					this.setAnimation(node, 0); //EAT_STAND);
					cancelled = true;
				}
			}	

			if (!cancelled)
			{
				// move on to the position

				this.CurrentCommandTicksDone += diff;

				var movementVec = this.CurrentCommandTargetPos.substract(currentPos);
				movementVec.setLength((this.MovementSpeed / 1000.0) * diff);
				
				if (!this.CanFly)
					movementVec.Y = 0;

				node.Pos.addToThis(movementVec); 
			}

			// additionally, animate looking direction

			changedNode = this.animateRotation(node, (timeMs - this.CurrentCommandStartTime), 
				this.CurrentCommandTargetPos.substract(currentPos), this.RotationSpeedMs);
		}
	}
	else
	if (this.CurrentCommand == 2) //EMT_ATTACK_ITEM)
	{
		// attack enemy in the middle of the animation

		this.CurrentCommandTicksDone += diff;

		if (!this.AttackCommandExecuted && 
			this.CurrentCommandTicksDone > (this.CurrentCommandExpectedTickCount / 2))
		{
			// execute attack action

			this.CurrentlyShooting = true;

			if (this.ActionHandlerOnAttack)
				this.ActionHandlerOnAttack.execute(node);

			this.CurrentlyShooting = false;
			this.AttackCommandExecuted = true;
			changedNode = true;
		}

		if (this.CurrentCommandTicksDone > this.CurrentCommandExpectedTickCount)
		{
			// finished
			this.CurrentCommand = 0; //EMT_DO_NOTHING;
		}
		else
		{
			// rotate to attack target
			changedNode = this.animateRotation(node, (timeMs - this.CurrentCommandStartTime), 
				this.CurrentCommandTargetPos.substract(currentPos), 
				Math.min(this.RotationSpeedMs, this.CurrentCommandExpectedTickCount));
		}
	}
	else
	if (this.CurrentCommand == 0) //EMT_DO_NOTHING)
	{
		// see if we can check for the target

		// now do high level ai calculation here
		
		if (this.AIType == 1 || //EMT_STAND_STILL ||
			this.AIType == 2 ||  //EMT_RANDOMLY_PATROL) 
			this.AIType == 3 )
		{							
			var attackTargetNode = this.scanForAttackTargetIfNeeded(timeMs, currentPos);
			if (attackTargetNode != null)
			{						
				// found an attack target
				var weaponDistance = this.getAttackDistanceFromWeapon();

				if (!this.Activated && this.ActionHandlerOnActivate)
					this.ActionHandlerOnActivate.execute(node);
				this.Activated = true;
				changedNode = true;

				if (attackTargetNode.getAbsolutePosition().getDistanceTo(currentPos) < weaponDistance)
				{
					// attack target is in distance to be attacked by our weapon. Attack now, but
					// first check if there is a wall between us.
					if (this.isNodeVisibleFromNode(attackTargetNode, node))
					{
						// attack target is visible, attack now

						this.CurrentlyShootingLine.Start = node.getTransformedBoundingBox().getCenter();
						this.CurrentlyShootingLine.End = attackTargetNode.getTransformedBoundingBox().getCenter();
						
						this.attackTarget( node, attackTargetNode, attackTargetNode.getAbsolutePosition(), currentPos, timeMs );
					}
					else
					{
						// attack target is not visible. move to it.
						this.moveToTarget( node, attackTargetNode.getAbsolutePosition(), currentPos, timeMs );
					}
				}
				else
				{
					// attack target is not in distance to be attacked by the weapon. move to it.
					this.moveToTarget( node, attackTargetNode.getAbsolutePosition(), currentPos, timeMs );
				}
			}
			else
			{
				// no attack target found. Do something idle, maybe patrol a bit.
				if ( this.AIType == 2 || this.AIType == 3) //EMT_RANDOMLY_PATROL or EMT_FOLLOW_PATH_ROUTE)
				{
					if (!this.LastPatrolStartTime || timeMs > this.LastPatrolStartTime + this.PatrolWaitTimeMs)
					{
						characterSize = this.getCharacterWidth(node);
						var newPos = null;
						
						if (this.AIType == 3)
						{
							// find next path point to go to
							var path = null;
							
							if (this.PathIdToFollow != -1 && this.TheSceneManager != null)
								path = this.TheSceneManager.getSceneNodeFromId(this.PathIdToFollow);
								
							if (path != null && path.getType() == 'path')
							{
								if (this.NextPathPointToGoTo >= path.getPathNodeCount())
									this.NextPathPointToGoTo = 0;
								
								newPos = path.getPathNodePosition(this.NextPathPointToGoTo);
							}
							
							++this.NextPathPointToGoTo;
						}
						else
						{						
							// find random position to patrol to

							var walklen = this.PatrolRadius;
							this.LastPatrolStartTime = timeMs;
							newPos = new CL3D.Vect3d((Math.random() - 0.5) * walklen,
													 (Math.random() - 0.5)* walklen,
													 (Math.random() -0.5)* walklen);
							
							newPos.addToThis(this.StartPositionOfActor);

							if (!this.CanFly)
								newPos.Y = this.StartPositionOfActor.Y;
						}

						if (!(newPos.substract(currentPos).getLength() < characterSize))
						{
							// move to patrol target
							this.moveToTarget( node, newPos, currentPos, timeMs );
							changedNode = true;
						}
					}
				}
			}
		}
	}
	
	return changedNode;
}



/** 
 * returns if rotation changed, returns true/false
 * @private
 */ 
CL3D.AnimatorGameAI.prototype.animateRotation = function(node, timeSinceStartRotation, 
								 lookvector, rotationSpeedMs)
{
	if (!node)
		return false;

	var isCamera = (node.getType() == 'camera');
	if (isCamera)
		return false;

	if (!this.CanFly)
		lookvector.Y = 0;
		
	var matrot = new CL3D.Matrix4();
	matrot.setRotationDegrees(lookvector.getHorizontalAngle());
	var matrot2 = new CL3D.Matrix4();
	matrot2.setRotationDegrees(this.AdditionalRotationForLooking);
	matrot = matrot.multiply(matrot2);

	// matrot now is the wanted rotation, now interpolate with the current rotation
	var wantedRot = matrot.getRotationDegrees();
	var currentRot = node.Rot.clone();					

	var interpol = Math.min(timeSinceStartRotation, rotationSpeedMs) / rotationSpeedMs;
	interpol = CL3D.clamp(interpol, 0.0, 1.0);

	//node->setRotation(wantedRot.getInterpolated(currentRot, interpol));

	wantedRot.multiplyThisWithScal( CL3D.DEGTORAD);
	currentRot.multiplyThisWithScal( CL3D.DEGTORAD);
	
	var q1 = new CL3D.Quaternion();
	q1.setFromEuler(wantedRot.X, wantedRot.Y, wantedRot.Z);
	
	var q2 = new CL3D.Quaternion();
	q2.setFromEuler(currentRot.X, currentRot.Y, currentRot.Z);
	
	q2.slerp(q2, q1, interpol);
	q2.toEuler(wantedRot);

	wantedRot.multiplyThisWithScal( CL3D.RADTODEG);
	
	if (node.Rot.equals(wantedRot))
		return false;
		
	node.Rot = wantedRot;
	return true;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.moveToTarget = function(node, target, currentPos, now)
{	
	this.CurrentCommand = 1; //EMT_REACH_POSITION;
	this.CurrentCommandTargetPos = target;
	this.CurrentCommandStartTime = now;
	this.BeginPositionWhenStartingCurrentCommand = currentPos;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 0; // invalid for this command
	this.setAnimation(node, 1); //EAT_WALK);
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.attackTarget = function(node, targetnode, target, currentPos, now)
{
	this.CurrentCommand = 2; //EMT_ATTACK_ITEM;
	this.CurrentCommandTargetPos = target;
	this.CurrentCommandStartTime = now;
	this.HandleCurrentCommandTargetNode = targetnode;
	this.BeginPositionWhenStartingCurrentCommand = currentPos;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 500; // seems to be a nice default value
	this.AttackCommandExecuted = false;

	var animDuration = this.setAnimation(node, 2);//EAT_ATTACK);

	if (animDuration != 0)
	{
		this.CurrentCommandExpectedTickCount = animDuration;
	}
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.aiCommandCancel = function(node)
{
	this.CurrentCommand = 0; //EMT_DO_NOTHING;
	this.setAnimation(node, 0); //EAT_STAND);
}


/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.die = function(node, currentPos, now)
{
	this.CurrentCommand = 3; //EMT_DIE_AND_STOP;
	this.CurrentCommandStartTime = now;
	this.BeginPositionWhenStartingCurrentCommand = currentPos;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 500; // seems to be a nice default value

	var animDuration = this.setAnimation(node, 3); //EAT_DIE);
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.isNodeVisibleFromNode = function(node1, node2)
{
	if (!node1 || !node2)
		return false;

	// instead of checking the positions of the nodes, we use the centers of the boxes of the nodes
	
	var pos1 = node1.getTransformedBoundingBox().getCenter();
	var pos2 = node2.getTransformedBoundingBox().getCenter();
	
	// if this is a node with collision box enabled, move the test start position outside of the collision box (otherwise the test would collide with itself)

	if (this.TheObject == node2)
	{
		if (node2.getType() == 'mesh')
		{
			if (node2.DoesCollision)
			{
				var extendLen = node2.getBoundingBox().getExtent().getLength() * 0.5;
				var vect = pos2.substract(pos1);
				vect.normalize();
				vect.multiplyThisWithScal( extendLen + (extendLen * 0.02));
				pos1.addToThis(vect);
			}
		}
	}

	return this.isPositionVisibleFromPosition(pos1, pos2);
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.isPositionVisibleFromPosition = function(pos1, pos2)
{
	if (!this.World || !this.TheSceneManager)
		return true;

	if (this.World.getCollisionPointWithLine(pos1, pos2, true, null, true) != null)
	{
		return false;
	}

	return true;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.getNearestSceneNodeFromAIAnimatorAndDistance = function(node, 
															  currentpos,
															  tag)
{
	if (!node || !node.Visible)
		return;

	// check if the node is in the max distance

	var isMatching = false;
	var dist = currentpos.getDistanceTo(node.getAbsolutePosition());	

	if (dist < this.NearestSceneNodeFromAIAnimator_maxDistance)
	{
		// find ai animator in the node

		var ainode = node.getAnimatorOfType('gameai');

		if (ainode && tag != "" &&
			!(ainode === this) &&
			ainode.isAlive() )
		{
			// check if animator tags are the ones we need
			isMatching = ainode.Tags.indexOf(tag) != -1;
		}
	}

	if (isMatching)
	{
		this.NearestSceneNodeFromAIAnimator_maxDistance = dist;
		this.NearestSceneNodeFromAIAnimator_NodeOut = node;
	}

	// search children of the node
	
	for (var i = 0; i<node.Children.length; ++i)
	{				
		var child = node.Children[i];
		this.getNearestSceneNodeFromAIAnimatorAndDistance(child, currentpos, tag);
	}
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.scanForAttackTargetIfNeeded = function(timems, currentpos)
{
	if (this.ActivationRadius <= 0 || !this.TheObject || this.AttacksAIWithTags.length == 0 || !this.TheSceneManager)
		return null;

	if (!this.NextAttackTargetScanTime || timems > this.NextAttackTargetScanTime)
	{
		this.NearestSceneNodeFromAIAnimator_maxDistance = this.ActivationRadius;
		this.NearestSceneNodeFromAIAnimator_NodeOut = null;
		
		this.getNearestSceneNodeFromAIAnimatorAndDistance(this.TheSceneManager.getRootSceneNode(),
													 currentpos, this.AttacksAIWithTags );

		this.NextAttackTargetScanTime = timems + 500 + (Math.random() * 1000);

		return this.NearestSceneNodeFromAIAnimator_NodeOut;	
	}

	return null;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.getAttackDistanceFromWeapon = function()
{
	var ret = 1000;

	if (this.ActionHandlerOnAttack)
	{
		var action = this.ActionHandlerOnAttack.findAction('Shoot');
		if (action)
			ret = action.getWeaponRange();
	}

	return ret;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.getCharacterWidth = function(node)
{
	if (node != null)
		return 10;

	var sz = node.getTransformedBoundingBox().getExtent();
	sz.Y = 0;
	return sz.getLength();
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.getAnimationNameFromType = function(t)
{
	switch(t)
	{
	case 0: return this.StandAnimation;
	case 1: return this.WalkAnimation;
	case 2: return this.AttackAnimation;
	case 3: return this.DieAnimation;
	}

	return "";
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.setAnimation = function(node, animationType)
{
	if (!node || node.getType() != 'animatedmesh')
		return 0;

	// find mesh and node type

	var animatedMesh = node;
			
	var skinnedmesh = animatedMesh.Mesh; // as SkinnedMesh;
	if (!skinnedmesh)
		return 0;

	// find range for animation
	
	var range = skinnedmesh.getNamedAnimationRangeByName(this.getAnimationNameFromType(animationType));
		
	if (range)
	{
		animatedMesh.setFrameLoop(range.Begin, range.End);
		if (range.FPS != 0)
			animatedMesh.setAnimationSpeed(range.FPS);
		animatedMesh.setLoopMode(animationType == 1 || animationType == 0); //animationType == EAT_WALK || animationType == EAT_STAND);
		
		return (range.End - range.Begin) * range.FPS * 1000;
	}
	else
	{
		// note: temporary bug fix. The flash animation player is
		// not able to stop an animation at (0,0), so we stop at (1,1)
		animatedMesh.setFrameLoop(1, 1);
		animatedMesh.setLoopMode(false);
	}

	return 0;
}
	
/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.isCurrentlyShooting = function()
{
	return this.CurrentlyShooting;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.getCurrentlyShootingLine = function()
{
	return this.CurrentlyShootingLine;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.isAlive = function()
{
	return this.Health > 0;
}

/** 
 * @private
 */
CL3D.AnimatorGameAI.prototype.OnHit = function(damage, node)
{
	if (!node)
		return;

	if (this.Health == 0)
		return; // already dead

	this.Health -= damage;
	if (this.Health < 0)
		this.Health = 0;

	if (this.Health == 0)
	{
		if (this.ActionHandlerOnDie != null) 
			this.ActionHandlerOnDie.execute(node);

		this.die(node, node.getAbsolutePosition(), 0);
	}
	else
	{
		if (this.ActionHandlerOnHit != null)
			this.ActionHandlerOnHit.execute(node);
	}
}		



/**
 * @private
 */
CL3D.AnimatorGameAI.prototype.findActionByType = function(type)
{
	var ret = null;
	
	if (this.ActionHandlerOnAttack)
	{
		ret = this.ActionHandlerOnAttack.findAction(type);
		if (ret)
			return ret;
	}
	
	if (this.ActionHandlerOnActivate)
	{
		ret = this.ActionHandlerOnActivate.findAction(type);
		if (ret)
			return ret;
	}
	
	if (this.ActionHandlerOnHit)
	{
		ret = this.ActionHandlerOnHit.findAction(type);
		if (ret)
			return ret;
	}
	
	if (this.ActionHandlerOnDie)
	{
		ret = this.ActionHandlerOnDie.findAction(type);
		if (ret)
			return ret;
	}
	
	return null;
}


/////////////////////////////////////////////////////////////////////////////////////////
// CopperCube Variable
// not really an animator, but needed only for coppercube
/////////////////////////////////////////////////////////////////////////////////////////


/**
 * @private
 * Array containing instances of CL3D.CopperCubeVariable. A container for holding coppercube variables, which
 * can also be set and changed using the Actions in the editor.
 */
CL3D.CopperCubeVariables = new Array();

/**
 * Interface class for accessing CopperCube variables, which can be set and changed using the Actions and
 * Behaviors in the CopperCube editor. Use the static function CL3D.CopperCubeVariable.getVariable to get an
 * instance of a variable.
 * @constructor
 * @class Interface class for accessing CopperCube variables
 * @public
 */
CL3D.CopperCubeVariable = function()
{
	this.Name = '';		
	this.StringValue = '';
	this.ActiveValueType = 0; // 0=string, 1=int, 2=float
	this.IntValue = 0;
	this.FloatValue = 0.0;
}		

/** 
 * Static function, returns the instance of an existing CopperCube variable or creates one if not existing.
 * @public
 * @param n {String} Name of the variable
 * @param createIfNotExisting {Boolean} if the variable is not found, it will be created if this is set to true.
 * @param scene {CL3D.Scene} The current scene. This parameter is optional, this can be 0. It is used for getting runtime variables such as #player1.health
 * @returns {CL3D.CopperCubeVariable} Returns instance of the variable or null if not found
 */
CL3D.CopperCubeVariable.getVariable = function(n, createIfNotExisting, scene)
{
	if (n == null)
		return null;
					
	var toFind = n.toLowerCase();
	var ar = CL3D.CopperCubeVariables;
	
	for (var i=0; i<ar.length; ++i)
	{
		var v = ar[i];
		if (v != null && v.getName().toLowerCase() == toFind)
			return v;
	}
	
	// for temporary virtual variables like "#player.health", create one now
	var tmpvar = CL3D.CopperCubeVariable.createTemporaryVariableIfPossible(n, scene);
	if (tmpvar)
		return tmpvar;
	
	// not found, so create new
	if (createIfNotExisting == true)
	{
		var nv = new CL3D.CopperCubeVariable();
		nv.setName(n);
		ar.push(nv);
		
		return nv;
	}
	
	return null;
}

/** 
 * @private
 * Creates a coppercube variable of the type "#player.health" with the correct expected content
 */
CL3D.CopperCubeVariable.createTemporaryVariableIfPossible = function(varname, scene)
{
	var ret = CL3D.CopperCubeVariable.getSceneNodeAndAttributeNameFromTemporaryVariableName(varname, scene);
	if (ret == null)
		return null;
		
	var nv = new CL3D.CopperCubeVariable();
	nv.setName(varname);
	nv.setValueAsInt(0);
	var node = ret.node;
	
	if (ret.attrname == 'health' && node != null)
	{
		var gameai = node.getAnimatorOfType('gameai');
		if (gameai != null)
			nv.setValueAsInt(gameai.Health);
	}
	else
	if (ret.attrname == 'movementspeed' && node != null)
	{
		var an = node.getAnimatorOfType('gameai');
		var an2 = node.getAnimatorOfType('keyboardcontrolled');
		var an3 = node.getAnimatorOfType('camerafps');
		
		if (an3)
			nv.setValueAsFloat(an3.MoveSpeed);
		else
		if (an2)
			nv.setValueAsFloat(an2.MoveSpeed);
		else
		if (an)
			nv.setValueAsFloat(an.MovementSpeed);
	}
	else
	if (ret.attrname == 'damage' && node != null)
	{
		var theaction = node.findActionOfType('Shoot');
		if (theaction)
			nv.setValueAsInt(theaction.Damage); 
	}
	else
	if (ret.attrname == 'colsmalldistance' && node != null)
	{
		var acr = node.getAnimatorOfType('collisionresponse');
		if (acr != null)
			nv.setValueAsFloat(acr.SlidingSpeed); 
	}
	else
	if (ret.attrname == 'soundvolume')
	{
		nv.setValueAsFloat(CL3D.gSoundManager.getGlobalVolume() * 100.0);
	}
	
	return nv;
}

/** 
 * @private
 * Saves the content of a coppercube variable of the type "#player.health" back into the correct scene node
 */
CL3D.CopperCubeVariable.saveContentOfPotentialTemporaryVariableIntoSource = function(thevar, scene)
{
	var ret = CL3D.CopperCubeVariable.getSceneNodeAndAttributeNameFromTemporaryVariableName(thevar.Name, scene);
	if (ret == null)
		return;
		
	var node = ret.node;
		
	if (ret.attrname == 'health' && node != null)
	{
		var gameai = node.getAnimatorOfType('gameai');
		if (gameai != null)
		{
			var healthBefore = gameai.Health;
			var healthNew = thevar.getValueAsInt();
			var damage = healthBefore - healthNew;
			
			if (damage > 0)
				gameai.OnHit(damage, node);
			else
				gameai.Health = healthNew;
		}
	}
	else
	if (ret.attrname == 'movementspeed' && node != null)
	{
		var an = node.getAnimatorOfType('gameai');
		var an2 = node.getAnimatorOfType('keyboardcontrolled');
		var an3 = node.getAnimatorOfType('camerafps');
		
		if (an3)
			an3.MoveSpeed = thevar.getValueAsFloat();
		else
		if (an2)
			an2.MoveSpeed = thevar.getValueAsFloat();
		else
		if (an)
			an.MovementSpeed = thevar.getValueAsFloat();
	}
	else
	if (ret.attrname == 'damage' && node != null)
	{
		var theaction = node.findActionOfType('Shoot');
		if (theaction)
			theaction.Damage = thevar.getValueAsInt(); 
	}
	else
	if (ret.attrname == 'damage' && node != null)
	{
		var theaction = node.findActionOfType('Shoot');
		if (theaction)
			theaction.Damage = thevar.getValueAsInt(); 
	}
	else
	if (ret.attrname == 'colsmalldistance' && node != null)
	{
		var acr = node.getAnimatorOfType('collisionresponse');
		if (acr != null)
		{
			acr.SlidingSpeed = thevar.getValueAsInt();
			acr.UseFixedSlidingSpeed = true;
		}
	}
	else
	if (ret.attrname == 'soundvolume')
	{
		CL3D.gSoundManager.setGlobalVolume(thevar.getValueAsFloat() / 100.0);
	}
}

/** 
 * @private
 * Parses the variable name of the type "#player.health" and returns attribute name and scene node in the scene
 */
CL3D.CopperCubeVariable.getSceneNodeAndAttributeNameFromTemporaryVariableName = function(varname, scene)
{
	if (varname.length == 0 || scene == null)
		return null;
		
	// temporary virtual variables have the layout like "#player.health"
	if (varname[0] != '#')
		return null;
		
	var pos = varname.indexOf('.');
	if (pos == -1)
		return null;
		
	// get attibute name

	var attrname = varname.substr(pos+1, varname.length - pos);
	if (attrname.length == 0)
		return null;

	// find scene node	
	
	var sceneNodeName = varname.substr(1, pos-1);
	var node = null;
	
	if (sceneNodeName == 'system')
	{
		// system variable
	}
	else
	{
		node = scene.getSceneNodeFromName(sceneNodeName);
		
		if (node == null)
			return null;
	}
		
	// return
	
	var retobj = new Object(); // used for passing scene node and attribute name back if available
	retobj.node = node;
	retobj.attrname = attrname;
	return retobj;
}

/** 
 * Returns if this variable is a string
 * @public
 */
CL3D.CopperCubeVariable.prototype.isString = function()
{		
	return this.ActiveValueType == 0;
}

/** 
 * Returns if this variable is a float value
 * @public
 */
CL3D.CopperCubeVariable.prototype.isFloat = function()
{		
	return this.ActiveValueType == 2;
}

/** 
 * Returns if this variable is an int value
 * @public
 */
CL3D.CopperCubeVariable.prototype.isInt = function()
{		
	return this.ActiveValueType == 1;
}

/** 
 * Returns the name of the variable
 * @public
 */
CL3D.CopperCubeVariable.prototype.getName = function()
{		
	return this.Name;
}

/** 
 * Sets the name of the variable
 * @public
 * @param n Name
 */
CL3D.CopperCubeVariable.prototype.setName = function(n)
{		
	this.Name = n;
}

/** 
 * @private
 */
CL3D.CopperCubeVariable.prototype.setAsCopy = function(copyFrom)
{		
	if (copyFrom == null)
		return;
		
	this.ActiveValueType = copyFrom.ActiveValueType;

	this.StringValue = copyFrom.StringValue;
	this.IntValue = copyFrom.IntValue;
	this.FloatValue = copyFrom.FloatValue;
}

/** 
 * Returns the value of the variable as string
 * @public
 */
CL3D.CopperCubeVariable.prototype.getValueAsString = function()
{		
	switch(this.ActiveValueType)
	{
	case 1: // int
		return String(this.IntValue);
	case 2: // float
		if ((this.FloatValue % 1) == 0.0)
			return String(this.FloatValue);
		else
			return this.FloatValue.toFixed(6);
	}
	
	return this.StringValue;
}

/** 
 * Returns the value of the variable as int
 * @public
 */
CL3D.CopperCubeVariable.prototype.getValueAsInt = function()
{		
	switch(this.ActiveValueType)
	{
	case 0: // string
		return Math.floor(this.StringValue);
	case 1: // int
		return this.IntValue;
	case 2: // float
		return this.FloatValue;
	}
	
	return 0;
}

/** 
 * Returns the value of the variable as float 
 * @public
 */
CL3D.CopperCubeVariable.prototype.getValueAsFloat = function()
{		
	switch(this.ActiveValueType)
	{
	case 0: // string
		return Number(this.StringValue);
	case 1: // int
		return this.IntValue;
	case 2: // float
		return this.FloatValue;
	}
	
	return 0;
}

/** 
 * Sets the value of the variable as string
 * @public
 * @param v the new value
 */
CL3D.CopperCubeVariable.prototype.setValueAsString = function(v)
{
	this.ActiveValueType = 0;
	this.StringValue = v;
}

/** 
 * Sets the value of the variable as int
 * @public
 * @param v the new value
 */
CL3D.CopperCubeVariable.prototype.setValueAsInt = function(v)
{
	this.ActiveValueType = 1;
	this.IntValue = v;
}

/** 
 * Sets the value of the variable as float
 * @public
 * @param v the new value
 */
CL3D.CopperCubeVariable.prototype.setValueAsFloat = function(v)
{
	this.ActiveValueType = 2;
	this.FloatValue = v;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Keyboard controlled animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends CL3D.Animator
 */
CL3D.AnimatorKeyboardControlled = function(scene, engine)
{
	this.lastAnimTime = 0;
	this.SMGr = scene;
	
	this.MoveSpeed = 0;
	this.RunSpeed = 0;
	this.RotateSpeed = 0;
	this.JumpSpeed = 0;
	this.PauseAfterJump = false;
	
	this.UseAcceleration = false;
	this.AccelerationSpeed = 0;
	this.DecelerationSpeed = 0;
	
	this.FollowSmoothingSpeed = 15;
	this.AdditionalRotationForLooking = new CL3D.Vect3d();
	
	this.StandAnimation = "";
	this.WalkAnimation = "";
	this.JumpAnimation = "";
	this.RunAnimation = "";

	this.LastAnimationTime = CL3D.CLTimer.getTime();	
	this.LastJumpTime = this.LastAnimationTime;
	this.WasMovingLastFrame = false;		
	this.ShiftIsDown = false;		
	
	this.Registered = false;
	
	this.leftKeyDown = false;
	this.rightKeyDown = false;
	this.upKeyDown = false;
	this.downKeyDown = false;
	this.jumpKeyDown = false;
	
	this.AcceleratedSpeed = 0;
	this.AccelerationIsForward = false;
	
	this.firstUpdate = true;
	this.DisableWithoutActiveCamera = false;
	
	this.Engine = engine;
	engine.registerAnimatorForKeyUp(this);
	engine.registerAnimatorForKeyDown(this);
}		
CL3D.AnimatorKeyboardControlled.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorTimer, this will return 'keyboardcontrolled'.
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.getType = function()
{
	return 'keyboardcontrolled';
}

/** 
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.createClone = function(node, newManager, oldNodeId, newNodeId)
{
	var a = new CL3D.AnimatorKeyboardControlled(this.SMGr, this.Engine);
	a.MoveSpeed = this.MoveSpeed;
	a.RunSpeed = this.RunSpeed;
	a.RotateSpeed = this.RotateSpeed;
	a.JumpSpeed = this.JumpSpeed;				
	a.FollowSmoothingSpeed = this.FollowSmoothingSpeed;
	a.AdditionalRotationForLooking = this.AdditionalRotationForLooking ? this.AdditionalRotationForLooking.clone() : null;		
	a.StandAnimation = this.StandAnimation;
	a.WalkAnimation = this.WalkAnimation;
	a.JumpAnimation = this.JumpAnimation;
	a.RunAnimation = this.RunAnimation;
	a.UseAcceleration = this.UseAcceleration;
	a.AccelerationSpeed = this.AccelerationSpeed;
	a.DecelerationSpeed = this.DecelerationSpeed;
	a.DisableWithoutActiveCamera = this.DisableWithoutActiveCamera;
			
	return a;
}

/** 
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.setKeyBool = function(down, code)
{
	// 37 = left arrow key
	// 38 = up arrow key
	// 39 = right arrow key
	// 40 = down arrow key
	// 65 = a or A
	// 87 = w or W
	// 68 = d or D
	// 83 = s or S
	// 32 = space

	if (code == 37 || code == 65 )
	{
		this.leftKeyDown = down;
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.rightKeyDown = false;
		return true;
	}
		
	if (code == 39 || code == 68 )
	{
		this.rightKeyDown = down;
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.leftKeyDown = false;
		return true;
	}
		
	if (code == 38 || code == 87 )
	{
		this.upKeyDown = down;			
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.downKeyDown = false;
		return true;
	}
		
	if (code == 40 || code == 83 )
	{
		this.downKeyDown = down;
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.upKeyDown = false;
		return true;
	}
	
	if (code == 32)
	{
		// jump key
		this.jumpKeyDown = down;
		return true;
	}
	
	return false;
}

/**
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.onKeyDown = function(evt)
{
	this.ShiftIsDown = (evt.shiftKey == 1);
	return this.setKeyBool(true, evt.keyCode);
}

/**
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.onKeyUp = function(evt)
{
	this.ShiftIsDown = (evt.shiftKey == 1);
	return this.setKeyBool(false, evt.keyCode);
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.AnimatorKeyboardControlled.prototype.animateNode = function(node, timeMs)
{
	var timeDiff = timeMs - this.lastAnimTime;			
	if (timeDiff > 250)
		timeDiff = 250;
	
	this.lastAnimTime = timeMs;
		
	var bChanged = false;
		
	this.LastAnimationTime = timeMs;
	
	// disable if user wants disabled without active camera following the object we are controlling
	
	if (this.DisableWithoutActiveCamera)
	{
		var cam = node.scene.getActiveCamera();
		if (cam != null)
		{
			var an = cam.getAnimatorOfType('3rdpersoncamera');
			if (an != null)
			{
				if (!(an.NodeToFollow === node))
					return false;
			}
			else
				return false;
		}
	}

	// Update rotation

	var currentRot = node.Rot;	

	if (this.leftKeyDown)
	{
		currentRot.Y -= timeDiff * this.RotateSpeed * 0.001;
		bChanged = true;
	}

	if (this.rightKeyDown)
	{
		currentRot.Y += timeDiff * this.RotateSpeed * 0.001;
		bChanged = true;
	}

	// move forward/backward

	var pos = node.Pos;

	var matrot = new CL3D.Matrix4();
	matrot.setRotationDegrees(currentRot);
	var directionForward = new CL3D.Vect3d(0,0,1);

	var matrot2 = new CL3D.Matrix4();
	matrot2.setRotationDegrees(this.AdditionalRotationForLooking);
	matrot = matrot.multiply(matrot2);

	matrot.rotateVect(directionForward);

	var bRun = this.ShiftIsDown;
	var speed = (bRun ? this.RunSpeed : this.MoveSpeed) * timeDiff;
	var origSpeed = 0;
			
	var bBackward = this.downKeyDown;
	var bForward = this.upKeyDown;
	
	if (this.UseAcceleration && timeDiff)
	{
		if (bForward || bBackward)
		{
			// accelerate normally 

			if (this.AccelerationIsForward != bForward)
			{
				// user change direction.
				if (this.DecelerationSpeed == 0)
					this.AcceleratedSpeed *= -1.0; //  We need to invert the force so he has to work against it
				else
					this.AcceleratedSpeed = 0.0; // no deceleration, stop immediately
			}

			this.AccelerationIsForward = !bBackward;

			origSpeed = speed / timeDiff;
			this.AcceleratedSpeed += (this.AccelerationSpeed) * origSpeed * (timeDiff / 1000.0);
			if (this.AcceleratedSpeed > origSpeed) this.AcceleratedSpeed = origSpeed;

			speed = this.AcceleratedSpeed * timeDiff;
		}
		else
		{
			// no key pressed, decellerate

			if (this.DecelerationSpeed == 0.0)
				this.AcceleratedSpeed = 0;
			else
			{
				origSpeed = speed / Number(timeDiff);
				this.AcceleratedSpeed -= (this.DecelerationSpeed) * origSpeed * (timeDiff / 1000.0);
				if (this.AcceleratedSpeed < 0) this.AcceleratedSpeed = 0;
				speed = this.AcceleratedSpeed * timeDiff;
			}
		}
	}

	directionForward.setLength(speed);

	if (bForward || bBackward || (this.UseAcceleration && this.AcceleratedSpeed != 0))
	{
		var moveVect = directionForward.clone();

		if (bBackward || (!(bForward || bBackward) && !this.AccelerationIsForward))
			moveVect.multiplyThisWithScal(-1.0);

		node.Pos.addToThis(moveVect);
		bChanged = true;
		this.WasMovingLastFrame = true;
	}
	
	if (bForward || bBackward)
	{
		this.setAnimation(node, bRun ? 3 : 1, bBackward);

		this.WasMovingLastFrame = true;
		bChanged = true;
	}
	else
	{
		// no key pressed
		
		// stand animation, only if not falling

		var bFalling = false;

		var a = node.getAnimatorOfType('collisionresponse');
		if (a)
			bFalling = a.isFalling();
		
		if (!bFalling && (this.hasAnimationType(node, 1) || this.hasAnimationType(node, 3) || this.hasAnimationType(node, 2)))
			this.setAnimation(node, 0, false);
	}

	// jump

	// For jumping, we find the collision response animator attached to our camera
	// and if it's not falling, we tell it to jump.
	if (this.jumpKeyDown)
	{
		var b = node.getAnimatorOfType('collisionresponse');
		if (b && !b.isFalling())
		{
			var minJumpTime = 0;
			if (this.SMGr && this.SMGr.Gravity != 0)
				minJumpTime = Math.floor((this.JumpSpeed * (1.0 / this.SMGr.Gravity)) * 2000);

			if (!this.PauseAfterJump ||
				(this.PauseAfterJump && (timeMs - this.LastJumpTime) > minJumpTime))
			{
				b.jump(this.JumpSpeed);
				this.setAnimation(node, 2, false);

				this.LastJumpTime = timeMs;
				
				bChanged = true;
			}
		}
	}
	
	return bChanged;
}

/**
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.getAnimationNameFromType = function(n)
{
	switch(n)
	{
	case 0: return this.StandAnimation;
	case 1:  return this.WalkAnimation;
	case 2:  return this.JumpAnimation;
	case 3:  return this.RunAnimation;
	}

	return "";
}

/** 
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.hasAnimationType = function(node, animationType)
{
	return this.setAnimation(node, animationType, false, true);
}

/** 
 * @private
 */
CL3D.AnimatorKeyboardControlled.prototype.setAnimation = function(node, animationType, breverse, testIfIsSetOnly)
{
	if (!node || node.getType() != 'animatedmesh')
		return false;

	// find mesh and node type

	var animatedMesh = node;
			
	var skinnedmesh = animatedMesh.Mesh; // as SkinnedMesh;
	if (!skinnedmesh)
		return false;

	// find range for animation
	
	var range = skinnedmesh.getNamedAnimationRangeByName(this.getAnimationNameFromType(animationType));
		
	if (range)
	{
		var wantedFPS = 1.0 * range.FPS;
		if (breverse)
			wantedFPS *= -1.0;
			
		if (testIfIsSetOnly)
		{
			return animatedMesh.EndFrame == range.End &&
			       animatedMesh.StartFrame == range.Begin;
		}
			
		if (!(animatedMesh.EndFrame == range.End &&
			 animatedMesh.StartFrame == range.Begin &&
			 CL3D.equals(animatedMesh.FramesPerSecond, wantedFPS)))
		{			
			animatedMesh.setFrameLoop(range.Begin, range.End);
			if (wantedFPS)
				animatedMesh.setAnimationSpeed(wantedFPS);
				
			animatedMesh.setLoopMode(animationType == 0 || animationType == 1  || animationType == 3);
		}
			
		return false;
	}
	else
	{
		// note: temporary bug fix. The flash animation player is
		// not able to stop an animation at (0,0), so we stop at (1,1)
		if (!testIfIsSetOnly)
		{
			animatedMesh.setFrameLoop(1, 1);
			animatedMesh.setLoopMode(false);
		}
	}

	return false;
}


/////////////////////////////////////////////////////////////////////////////////////////
// Animator3rdPersonCamera
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends CL3D.Animator
 */
CL3D.Animator3rdPersonCamera = function(scene)
{
	this.lastAnimTime = 0;
	this.SMGr = scene;
	
	this.SceneNodeIDToFollow = -1;
	this.FollowSmoothingSpeed = 15;
	this.AdditionalRotationForLooking = new CL3D.Vect3d();
	this.FollowMode = 0;
	this.TargetHeight = 0;
	this.CollidesWithWorld = false;
	this.World = 0;
		
		// runtime variables
					
	this.LastAnimationTime = 0.0;
	this.InitialDeltaToObject = new CL3D.Vect3d();
	this.DeltaToCenterOfFollowObject = new CL3D.Vect3d();
	this.NodeToFollow = null;
	this.TriedToLinkWithNode = false;
		
	this.firstUpdate = true;		
}		
CL3D.Animator3rdPersonCamera.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorTimer, this will return '3rdpersoncamera'.
 * @private
 */
CL3D.Animator3rdPersonCamera.prototype.getType = function()
{
	return '3rdpersoncamera';
}

/** 
 * @private
 */
CL3D.Animator3rdPersonCamera.prototype.createClone = function(node, newManager, oldNodeId, newNodeId)
{
	var a = new CL3D.Animator3rdPersonCamera(this.SMGr);
	a.SceneNodeIDToFollow = this.SceneNodeIDToFollow;
	a.FollowSmoothingSpeed = this.FollowSmoothingSpeed;
	a.AdditionalRotationForLooking = this.AdditionalRotationForLooking.clone();
	a.FollowMode = this.FollowMode;
	a.TargetHeight = this.TargetHeight;
	a.CollidesWithWorld = this.CollidesWithWorld;
	a.World = this.World;
			
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.Animator3rdPersonCamera.prototype.animateNode = function(node, timeMs)
{
	var timeDiff = timeMs - this.lastAnimTime;			
	if (timeDiff > 250)
		timeDiff = 250;
	this.lastAnimTime = timeMs;
		
	var bChanged = false;
	
	if (node == null)
		return false;
			
	var camera = node;
			
	this.linkWithNode(node.scene);

	if (!this.NodeToFollow)
		return false;
		
	var bChanged = false;

	var oldTarget = camera.Target.clone();
	
	camera.Target = this.NodeToFollow.getAbsolutePosition();
	camera.Target.addToThis(this.DeltaToCenterOfFollowObject);
	camera.Target.Y += this.TargetHeight;
	
	if (!camera.Target.equals(oldTarget))
		bChanged = true;

	if (this.firstUpdate)
	{
		this.NodeToFollow.updateAbsolutePosition();
		camera.updateAbsolutePosition();

		this.DeltaToCenterOfFollowObject = this.NodeToFollow.getBoundingBox().getExtent();
		this.DeltaToCenterOfFollowObject.Y = this.DeltaToCenterOfFollowObject.Y / 2;
		this.DeltaToCenterOfFollowObject.X = 0;
		this.DeltaToCenterOfFollowObject.Z = 0;

		this.lastAnimTime = timeMs;
		this.firstUpdate = false;
	}
	
	if (!(camera.scene.getActiveCamera() === camera))
		return false;
	
	if (this.InitialDeltaToObject.equalsZero())	
	{
		this.InitialDeltaToObject = this.NodeToFollow.getAbsolutePosition().substract(camera.getAbsolutePosition());
		
		// this line didn't work with scale
		//this.NodeToFollow.AbsoluteTransformation.inverseRotateVect(this.InitialDeltaToObject);
		// this one does
		var matrotinit = new CL3D.Matrix4();
		matrotinit.setRotationDegrees(this.NodeToFollow.Rot);
		matrotinit.inverseRotateVect(this.InitialDeltaToObject);
	}

	var currentRot = this.NodeToFollow.Rot;	

	var matrot = new CL3D.Matrix4();
	matrot.setRotationDegrees(currentRot);
	
	var matrot2 = new CL3D.Matrix4();
	matrot2.setRotationDegrees(this.AdditionalRotationForLooking);
	matrot = matrot.multiply(matrot2);

	// animate camera position
	
	var finalpos = camera.Pos.clone();

	switch(this.FollowMode)
	{
	case 0: //ECFM_FIXED:
		// don't change position
		break;
	case 2: //ECFM_FOLLOW_FIXED:
		{
			// only add position

			finalpos = this.NodeToFollow.getAbsolutePosition().substract(this.InitialDeltaToObject);
		}
		break;
	case  1: //ECFM_FOLLOW:
		{
			// add position and rotation

			var newdelta = this.InitialDeltaToObject.clone();
			matrot.rotateVect(newdelta);

			var desiredPos = this.NodeToFollow.getAbsolutePosition().substract(newdelta);
			var distanceToDesiredPos = camera.getAbsolutePosition().getDistanceTo(desiredPos);
			var userSetDefaultCameraDistance = this.InitialDeltaToObject.getLength();

			var bTooFarAway = distanceToDesiredPos > userSetDefaultCameraDistance * 2.2;

			if (CL3D.equals(this.FollowSmoothingSpeed, 0.0) || bTooFarAway)
			{
				// smoothing speed is disabled or camera is too far away from the object
				// directly set position of camera		
				
				finalpos = desiredPos;
			}
			else
			{
				// move camera position smoothly to desired position

				// the more away the distance is, the faster move toward the new target
				var distanceToMove = Math.sqrt(distanceToDesiredPos) * (timeDiff / 1000.0) * this.FollowSmoothingSpeed;
				if (distanceToMove > distanceToDesiredPos) 
					distanceToMove = distanceToDesiredPos;

				var moveVect = desiredPos.substract(camera.Pos);
				moveVect.setLength(distanceToMove);
				moveVect.addToThis(camera.Pos);
				
				finalpos = moveVect;
			}
		}
		break;
	}
	
	// collide with world
			
	if (this.CollidesWithWorld &&
		this.World != null &&
		!camera.Pos.equals(finalpos))
	{
		this.World.setNodeToIgnore(this.NodeToFollow);

		var ray = new CL3D.Line3d();
		
		ray.Start = camera.Target.clone();
		ray.End = finalpos.clone();

		var rayVect = ray.getVector();
		var wantedDistanceToTarget = rayVect.getLength();
		var distanceToNextWall = this.InitialDeltaToObject.getLength() / 10.0;

		rayVect.setLength(distanceToNextWall);
		ray.End.addToThis(rayVect);

		var triangle = new CL3D.Triangle3d();
		
		var pos = this.World.getCollisionPointWithLine(ray.Start, ray.End, true, triangle, true);
		if (pos != null)
		{
			// ensure final collision position is at least distanceToNextWall away from the collision point.
			var collisionVect = pos.substract(ray.Start);
			var collisionVectLen = collisionVect.getLength();
			if (collisionVectLen < distanceToNextWall) collisionVectLen = distanceToNextWall;
			collisionVectLen -= distanceToNextWall;
			if (collisionVectLen > wantedDistanceToTarget) collisionVectLen = wantedDistanceToTarget;

			collisionVect.setLength(collisionVectLen);
			finalpos = ray.Start.add(collisionVect);
		}					

		this.World.setNodeToIgnore(null);
	}				
	
	// set final position
	
	if (!camera.Pos.equals(finalpos))
	{
		bChanged = true;	
		camera.Pos = finalpos;
	}
	
	return bChanged;
}


/**
 * @private
 */
CL3D.Animator3rdPersonCamera.prototype.linkWithNode = function(smgr)
{
	if (this.TriedToLinkWithNode)
		return;

	if (this.SceneNodeIDToFollow == -1)
		return;

	if (smgr == null)
		return;

	var node = smgr.getSceneNodeFromId(this.SceneNodeIDToFollow);
	if (node && !(node === this.NodeToFollow))
	{
		this.NodeToFollow = node;
		this.firstUpdate = true;
	}

	this.TriedToLinkWithNode = true;
}


/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnFirstFrame
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends CL3D.Animator
 */
CL3D.AnimatorOnFirstFrame = function(scene)
{
	this.RunAlready = false;
	this.AlsoOnReload = false;
	this.SMGr = scene;
	this.TheActionHandler = null;
}		
CL3D.AnimatorOnFirstFrame.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnFirstFrame, this will return 'onfirstframe'.
 * @private
 */
CL3D.AnimatorOnFirstFrame.prototype.getType = function()
{
	return 'onfirstframe';
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {CL3D.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
CL3D.AnimatorOnFirstFrame.prototype.animateNode = function(n, timeMs)
{
	if (this.RunAlready)
		return false;
		
	this.RunAlready = true;
		
	if (this.TheActionHandler)
	{
		this.TheActionHandler.execute(n);					
		return true;
	}	
	
	return false;
}

// ----------------------------------------------------------------------------------------------
// Animator for moving cursor position of Mobile2DInputSceneNode
// ----------------------------------------------------------------------------------------------
// moved to coppercubeprivate.js since it is needing the animator definition first
/**
* @constructor
* @extends CL3D.Animator
* @class  Scene node animator which animated a mobile input 2d node
* @private
*/
CL3D.AnimatorMobileInput = function(engine, scene, obj)
{
	this.SMGr = scene;
	this.Obj = obj;
	this.engine = engine;
	this.MouseDown = false;
	scene.registerSceneNodeAnimatorForEvents(this);
	
	this.KeyDown = new Array();
	for (var i=0; i<255; ++i)
		this.KeyDown.push(false);
	
	this.CoordArray = new Array();
	this.CoordArray.push(new CL3D.Vect2d(-1,0)); // left
	this.CoordArray.push(new CL3D.Vect2d(0,-1)); // up
	this.CoordArray.push(new CL3D.Vect2d(1,0)); // right
	this.CoordArray.push(new CL3D.Vect2d(0,1)); // down
}
CL3D.AnimatorMobileInput.prototype = new CL3D.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnClick, this will return 'mobileinput'.
 * @private
 */
CL3D.AnimatorMobileInput.prototype.getType = function()
{
	return 'mobileinput';
}

/** 
 * @private
 */
CL3D.AnimatorMobileInput.prototype.animateNode = function(n, timeMs)
{
	var ret = false;
	
	if (this.Obj.InputMode == 1) // specific key
	{
		this.postKey(this.MouseDown && this.Obj.MouseOverButton, this.Obj.KeyCode);
	}
	else
	{
		// cursor key mode
		
		var len = Math.sqrt(this.Obj.CursorPosX*this.Obj.CursorPosX + this.Obj.CursorPosY*this.Obj.CursorPosY);
		var minLen = 0.3;
		
		if (len < minLen || !this.MouseDown)
		{
			if (!this.MouseDown)
			{				
				ret = (this.Obj.CursorPosX != 0 && this.Obj.CursorPosY != 0);
				this.Obj.CursorPosX = 0;
				this.Obj.CursorPosY = 0;					
			}

			this.postKey(false, 37);
			this.postKey(false, 38);
			this.postKey(false, 39);
			this.postKey(false, 40);
		}
		else
		{
			for (var i=0; i<4; ++i)
			{
				var distanceX = this.CoordArray[i].X-this.Obj.CursorPosX;
				var distanceY = this.CoordArray[i].Y-this.Obj.CursorPosY;
			
				var isPointInside = Math.sqrt(distanceX*distanceX + distanceY*distanceY) < 1;
				this.postKey(isPointInside, 37 + i);
			}
		}
	}

	return ret;
}

/**
 * @private
 */
CL3D.AnimatorMobileInput.prototype.postKey = function(down, key)
{
	if (this.KeyDown[key]  == down)
		return;
		
	this.KeyDown[key] = down;
	
	var e = new Object();
	e.keyCode = key;
	
	if (down)
		this.engine.handleKeyDown(e);
	else
		this.engine.handleKeyUp(e);
}

/**
 * @private
 */
CL3D.AnimatorMobileInput.prototype.onMouseUp = function(event) 
{			
	this.MouseDown = false;
}

/**
 * @private
 */
CL3D.AnimatorMobileInput.prototype.onMouseDown = function(event) 
{
	this.MouseDown = true;
}

/**
 * @private
 */
CL3D.AnimatorMobileInput.prototype.onMouseMove = function(event) 
{
	if (this.MouseDown && this.Obj.MouseOverButton && 
	    this.Obj.RealWidth != 0 && this.Obj.RealHeight != 0)
	{
		var x = this.engine.getMousePosXFromEvent(event) - this.Obj.RealPosX;
		var y = this.engine.getMousePosYFromEvent(event) - this.Obj.RealPosY;
	
		this.Obj.CursorPosX = x / this.Obj.RealWidth; 
		this.Obj.CursorPosY = y / this.Obj.RealHeight; 
		
		this.Obj.CursorPosX = CL3D.clamp(this.Obj.CursorPosX, 0.0, 1.0);
		this.Obj.CursorPosY = CL3D.clamp(this.Obj.CursorPosY, 0.0, 1.0);
		
		// move coordinates from 0..1 to -1..1 range
		
		this.Obj.CursorPosX = (this.Obj.CursorPosX * 2.0) - 1.0;
		this.Obj.CursorPosY = (this.Obj.CursorPosY * 2.0) - 1.0;
	}
}


