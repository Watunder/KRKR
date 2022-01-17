//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

/**
 * @constructor
 * @private
 */
CL3D.Action = function()
{
}

/**
 * @private
 */
CL3D.Action.prototype.execute = function(node, mgr)
{
}

/**
 * @private
 */
CL3D.Action.prototype.createClone = function(oldNodeId, newNodeId)
{
	return null;
}

// ---------------------------------------------------------------------
// Action SetOverlayText
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.SetOverlayText = function()
{
	this.Text = "";
	this.SceneNodeToChange = null;
	this.ChangeCurrentSceneNode = false;
	this.Type = 'SetOverlayText';	
}

/**
 * @private
 */
CL3D.Action.SetOverlayText.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.SetOverlayText();
	a.Text = this.Text;
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	
	if (a.SceneNodeToChange == oldNodeId)
		a.SceneNodeToChange = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.SetOverlayText.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChange);

	if (nodeToHandle && nodeToHandle.setText)
	{
		var posVar = this.Text.indexOf('$');
		if (posVar != -1)
		{
			// text probably contains variables. Find and replace them with their values

			var textModified = this.Text;
			var currentPos = 0;
			var found = true;
			
			while(found)
			{
				found = false;

				posVar = textModified.indexOf('$', currentPos);
				if (posVar != -1)
				{
					currentPos = posVar + 1;
					var posEndVar = textModified.indexOf('$', posVar+1);
					if (posEndVar != -1)
					{
						found = true;

						var varName = textModified.substr(posVar+1, posEndVar - (posVar+1));
						var v = CL3D.CopperCubeVariable.getVariable(varName, false, sceneManager);

						if (v)
						{
							// replace with content of v
							var newStr = textModified.substr(0, posVar);
							newStr += v.getValueAsString();
							currentPos = newStr.length + 1;
							newStr += textModified.substr(posEndVar+1, textModified.length - posEndVar);

							textModified = newStr;
						}
					}
				}
			}

			nodeToHandle.setText(textModified);		
		}
		else
		{
			// text doesn't contain variables, set it as it is
			nodeToHandle.setText(this.Text);
		}
	}
}

// ---------------------------------------------------------------------
// Action MakeSceneNodeInvisible
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.MakeSceneNodeInvisible = function()
{
	this.InvisibleMakeType = 0;
	this.SceneNodeToMakeInvisible = null;
	this.ChangeCurrentSceneNode = false;
	this.Type = 'MakeSceneNodeInvisible';	
}

/**
 * @private
 */
CL3D.Action.MakeSceneNodeInvisible.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.MakeSceneNodeInvisible();
	a.InvisibleMakeType = this.InvisibleMakeType;
	a.SceneNodeToMakeInvisible = this.SceneNodeToMakeInvisible;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	
	if (a.SceneNodeToMakeInvisible == oldNodeId)
		a.SceneNodeToMakeInvisible = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.MakeSceneNodeInvisible.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToMakeInvisible != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToMakeInvisible);

	if (nodeToHandle)
	{
		switch(this.InvisibleMakeType)
		{
		case 0: //EIT_MAKE_INVISIBLE:
			nodeToHandle.Visible = false;
			break;
		case 1: //EIT_MAKE_VISIBLE:
			nodeToHandle.Visible = true;
			break;
		case 2: //EIT_TOGGLE_VISIBILITY:
			{
				nodeToHandle.Visible = !nodeToHandle.Visible;
			}
			break;
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodePosition
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ChangeSceneNodePosition = function()
{
	this.UseAnimatedMovement = false;
	this.TimeNeededForMovementMs = false;
	this.Type = 'ChangeSceneNodePosition';	
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodePosition.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ChangeSceneNodePosition();
	a.PositionChangeType = this.PositionChangeType;
	a.SceneNodeToChangePosition = this.SceneNodeToChangePosition;
	a.SceneNodeRelativeTo = this.SceneNodeRelativeTo;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.RelativeToCurrentSceneNode = this.RelativeToCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	a.Area3DEnd = this.Area3DEnd ? this.Area3DEnd.clone() : null;
	a.UseAnimatedMovement = this.UseAnimatedMovement;
	a.TimeNeededForMovementMs = this.TimeNeededForMovementMs;
	
	if (a.SceneNodeToChangePosition == oldNodeId)
		a.SceneNodeToChangePosition = newNodeId;
	if (a.SceneNodeRelativeTo == oldNodeId)
		a.SceneNodeRelativeTo = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodePosition.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangePosition != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChangePosition);

	if (nodeToHandle)
	{
		var finalpos = null;
		
		switch(this.PositionChangeType)
		{
		case 0: //EIT_ABSOLUTE_POSITION:
			finalpos = this.Vector.clone();
			break;
		case 1://EIT_RELATIVE_POSITION:
			finalpos = nodeToHandle.Pos.add(this.Vector);
			break;
		case 2://EIT_RELATIVE_TO_SCENE_NODE:
			{
				var nodeRelativeTo = null;
				if (this.RelativeToCurrentSceneNode)
					nodeRelativeTo = currentNode;
				else
				if (this.SceneNodeRelativeTo != -1)
					nodeRelativeTo = sceneManager.getSceneNodeFromId(this.SceneNodeRelativeTo);

				if (nodeRelativeTo)
					finalpos = nodeRelativeTo.Pos.add(this.Vector);
			}
			break;
		case 3: //EIT_RELATIVE_IN_FACING_DIRECTION:
			{
				var len = this.Vector.getLength();
				var matr = nodeToHandle.AbsoluteTransformation;
				
				var moveVect = new CL3D.Vect3d(1,0,0);						
				matr.rotateVect(moveVect);
				
				if (nodeToHandle.getType() == 'camera')
					moveVect = nodeToHandle.Target.substract(nodeToHandle.Pos);
				
				moveVect.setLength(len);
				
				finalpos = nodeToHandle.Pos.add(moveVect);
			}
			break;
		case 4: //EIT_RANDOM_POSITION:
			{
				var box = new CL3D.Box3d();
				box.reset(this.Vector.X, this.Vector.Y, this.Vector.Z);
				box.addInternalPointByVector(this.Area3DEnd);

				finalpos = new CL3D.Vect3d();
				finalpos.X = box.MinEdge.X + (Math.random() * (box.MaxEdge.X - box.MinEdge.X));
				finalpos.Y = box.MinEdge.Y + (Math.random() * (box.MaxEdge.Y - box.MinEdge.Y));
				finalpos.Z = box.MinEdge.Z + (Math.random() * (box.MaxEdge.Z - box.MinEdge.Z));
			}
			break;
		case 5: //EIT_RELATIVE_TO_LAST_BULLET_IMPACT:
			{
				finalpos = sceneManager.LastBulletImpactPosition.add(this.Vector);
			}
			break;
		}
		
		if (finalpos != null)
		{
			if (this.UseAnimatedMovement && this.TimeNeededForMovementMs > 0)
			{
				// move animated to target
				var anim = new CL3D.AnimatorFlyStraight();
				anim.Start = nodeToHandle.Pos.clone();
				anim.End = finalpos;
				anim.TimeForWay = this.TimeNeededForMovementMs;
				anim.DeleteMeAfterEndReached = true;
				anim.recalculateImidiateValues();
				
				nodeToHandle.addAnimator(anim);
			}
			else
			{
				// set position directly
				nodeToHandle.Pos = finalpos;
			}
		}
	}
}


// ---------------------------------------------------------------------
// Action ChangeSceneNodeRotation
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ChangeSceneNodeRotation = function()
{
	this.Type = 'ChangeSceneNodeRotation';
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodeRotation.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ChangeSceneNodeRotation();
	a.RotationChangeType = this.RotationChangeType;
	a.SceneNodeToChangeRotation = this.SceneNodeToChangeRotation;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	a.RotateAnimated = this.RotateAnimated;
	a.TimeNeededForRotationMs = this.TimeNeededForRotationMs;
	
	if (a.SceneNodeToChangeRotation == oldNodeId)
		a.SceneNodeToChangeRotation = newNodeId;
	return a;
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodeRotation.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeRotation != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChangeRotation);

	if (nodeToHandle)
	{
		var finalRot = null;
		
		switch(this.RotationChangeType)
		{
		case 0://EIT_ABSOLUTE_ROTATION:
			finalRot = this.Vector.clone();
			break;
		case 1://EIT_RELATIVE_ROTATION:
			finalRot = nodeToHandle.Rot.add(this.Vector);
			break;
		}
		
		if (finalRot)
		{
			if (!this.RotateAnimated)
			{
				// not animated, set rotation directly
				nodeToHandle.Rot = finalRot;
			}
			else
			{
				// rotate animated to target
				
				var anim = new CL3D.AnimatorRotation();
				anim.setRotateToTargetAndStop(finalRot, nodeToHandle.Rot, this.TimeNeededForRotationMs);
										
				nodeToHandle.addAnimator(anim);
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeScale
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ChangeSceneNodeScale = function()
{
	this.Type = 'ChangeSceneNodeScale';	
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodeScale.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ChangeSceneNodeScale();
	a.ScaleChangeType = this.ScaleChangeType;
	a.SceneNodeToChangeScale = this.SceneNodeToChangeScale;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	
	if (a.SceneNodeToChangeScale == oldNodeId)
		a.SceneNodeToChangeScale = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodeScale.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeScale != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChangeScale);

	if (nodeToHandle)
	{
		switch(this.ScaleChangeType)
		{
		case 0: //EIT_ABSOLUTE_SCALE:
			nodeToHandle.Scale = this.Vector.clone();
			break;
		case 1: //EIT_RELATIVE_SCALE:
			nodeToHandle.Scale = nodeToHandle.Scale.multiplyWithVect(this.Vector);
			break;
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeTexture
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ChangeSceneNodeTexture = function()
{
	this.Type = 'ChangeSceneNodeTexture';	
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodeTexture.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ChangeSceneNodeTexture();
	a.TextureChangeType = this.TextureChangeType;
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.TheTexture = this.TheTexture;
	a.IndexToChange = this.IndexToChange;
	
	if (a.SceneNodeToChange == oldNodeId)
		a.SceneNodeToChange = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.ChangeSceneNodeTexture.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		if (nodeToHandle.getType() == '2doverlay')
		{
			nodeToHandle.setShowImage(this.TheTexture);
		}
		else
		{
			var mcnt = nodeToHandle.getMaterialCount();
			
			if (this.TextureChangeType == 0) // EIT_REPLACE_ALL
			{
				for (var i=0; i<mcnt; ++i)
				{
					var mat = nodeToHandle.getMaterial(i);
					mat.Tex1 = this.TheTexture;
				}
			}
			else
			if (this.TextureChangeType == 1) // EIT_CHANGE_SPECIFIC_INDEX
			{
				var mat = nodeToHandle.getMaterial(this.IndexToChange);
				if (mat != null)
					mat.Tex1 = this.TheTexture;
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action ExecuteJavaScript
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ExecuteJavaScript = function()
{
	this.Type = 'ExecuteJavaScript';	
}

/**
 * @private
 */
CL3D.Action.ExecuteJavaScript.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ExecuteJavaScript();
	a.JScript = this.JScript;
	return a;
}

/**
 * @private
 */
CL3D.Action.ExecuteJavaScript.prototype.execute = function(currentNode, sceneManager)
{
	CL3D.gCurrentJScriptNode = currentNode;
	
	eval(this.JScript);
	
	CL3D.gCurrentJScriptNode = null;
}

// ---------------------------------------------------------------------
// Action OpenWebpage
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.OpenWebpage = function()
{
	this.Type = 'OpenWebpage';	
}

/**
 * @private
 */
CL3D.Action.OpenWebpage.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.OpenWebpage();
	a.Webpage = this.Webpage;
	a.Target = this.Target;
	return a;
}

/**
 * @private
 */
CL3D.Action.OpenWebpage.prototype.execute = function(currentNode, sceneManager)
{
	//CL3D.gCCDebugOutput.print("opening" + this.Webpage + " with:" + this.Target);
	window.open(this.Webpage, this.Target);
}

// ---------------------------------------------------------------------
// Action SetSceneNodeAnimation
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.SetSceneNodeAnimation = function()
{
	this.Type = 'SetSceneNodeAnimation';
}

/**
 * @private
 */
CL3D.Action.SetSceneNodeAnimation.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.SetSceneNodeAnimation();
	a.SceneNodeToChangeAnim = this.SceneNodeToChangeAnim;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Loop = this.Loop;
	a.AnimName = this.AnimName;
	
	if (a.SceneNodeToChangeAnim == oldNodeId)
		a.SceneNodeToChangeAnim = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.SetSceneNodeAnimation.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeAnim != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChangeAnim);

	if (nodeToHandle)
	{
		// set animation
		
		var animatedMesh = nodeToHandle;
		if (animatedMesh.getType() != 'animatedmesh')
			return;
			
		animatedMesh.setAnimationByEditorName(this.AnimName, this.Loop);
	}
}

// ---------------------------------------------------------------------
// Action SwitchToScene
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.SwitchToScene = function(engine)
{
	this.Engine = engine;
	this.Type = 'SwitchToScene';	
}

/**
 * @private
 */
CL3D.Action.SwitchToScene.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.SwitchToScene();
	a.SceneName = this.SceneName;
	return a;
}

/**
 * @private
 */
CL3D.Action.SwitchToScene.prototype.execute = function(currentNode, sceneManager)
{
	if (this.Engine)
		this.Engine.gotoSceneByName(this.SceneName, true);
}

// ---------------------------------------------------------------------
// Action SetActiveCamera
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.SetActiveCamera = function(engine)
{
	this.Engine = engine;
	this.Type = 'SetActiveCamera';	
}

/**
 * @private
 */
CL3D.Action.SetActiveCamera.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.SetActiveCamera();
	a.CameraToSetActive = this.CameraToSetActive;
	
	if (a.CameraToSetActive == oldNodeId)
		a.CameraToSetActive = newNodeId;
	
	return a;
}

/**
 * @private
 */
CL3D.Action.SetActiveCamera.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.CameraToSetActive != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.CameraToSetActive);

	if (nodeToHandle != null)
	{
		if ( nodeToHandle.getType() == 'camera')
		{
			if (this.Engine)
			{
				//CL3D.gCCDebugOutput.print("Setting camera to" + nodeToHandle.Name);
				this.Engine.setActiveCameraNextFrame(nodeToHandle);
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action SetCameraTarget
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.SetCameraTarget = function()
{
	this.UseAnimatedMovement = false;
	this.TimeNeededForMovementMs = 0;
	this.Type = 'SetCameraTarget';	
}

/**
 * @private
 */
CL3D.Action.SetCameraTarget.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.SetCameraTarget();
	a.PositionChangeType = this.PositionChangeType;
	a.SceneNodeToChangePosition = this.SceneNodeToChangePosition;
	a.SceneNodeRelativeTo = this.SceneNodeRelativeTo;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.RelativeToCurrentSceneNode = this.RelativeToCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	a.UseAnimatedMovement = this.UseAnimatedMovement;
	a.TimeNeededForMovementMs = this.TimeNeededForMovementMs;
	return a;
}

/**
 * @private
 */
CL3D.Action.SetCameraTarget.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangePosition != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToChangePosition);
		
	var cam = nodeToHandle;
	if (cam.getType() != 'camera')
		return;

	var finalpos = cam.getTarget().clone();
	
	switch(this.PositionChangeType)
	{
	case 0: //EIT_ABSOLUTE_POSITION:
		finalpos = this.Vector.clone();
		break;
	case 1: //EIT_RELATIVE_POSITION:
		finalpos = nodeToHandle.Pos.add(this.Vector);
		break;
	case 2: //EIT_RELATIVE_TO_SCENE_NODE:
		{
			var nodeRelativeTo = null;
			if (this.RelativeToCurrentSceneNode)
				nodeRelativeTo = currentNode;
			else
			if (this.SceneNodeRelativeTo != -1)
				nodeRelativeTo = sceneManager.getSceneNodeFromId(this.SceneNodeRelativeTo);

			if (nodeRelativeTo)
				finalpos = nodeRelativeTo.Pos.add(this.Vector);
		}
		break;
	}
	
	if (finalpos != null)
	{
		if (this.UseAnimatedMovement && this.TimeNeededForMovementMs > 0)
		{
			// move animated to target
			var anim = new CL3D.AnimatorFlyStraight();
			anim.Start = cam.getTarget().clone();
			anim.End = finalpos;
			anim.TimeForWay = this.TimeNeededForMovementMs;
			anim.DeleteMeAfterEndReached = true;
			anim.AnimateCameraTargetInsteadOfPosition = true;
			anim.recalculateImidiateValues();
			
			nodeToHandle.addAnimator(anim);
		}
		else
		{
			// set target directly
			cam.setTarget(finalpos);
			
			var animfps = cam.getAnimatorOfType('camerafps');
			if (animfps != null)
				animfps.lookAt(finalpos);
		}
	}
}

// ---------------------------------------------------------------------
// Action Shoot
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.Shoot = function()
{
	this.ShootType = 0;
	this.Damage = 0;
	this.BulletSpeed = 0.0;
	this.SceneNodeToUseAsBullet = -1;
	this.WeaponRange = 100.0;
	this.Type = 'Shoot';	
	this.SceneNodeToShootFrom = -1;
	this.ShootToCameraTarget = false;
	this.AdditionalDirectionRotation = null;
	this.ActionHandlerOnImpact = null;
	this.ShootDisplacement = new CL3D.Vect3d();
}

/**
 * @private
 */
CL3D.Action.Shoot.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.Shoot();
	a.ShootType = this.ShootType;
	a.Damage = this.Damage;
	a.BulletSpeed = this.BulletSpeed;
	a.SceneNodeToUseAsBullet = this.SceneNodeToUseAsBullet;
	a.WeaponRange = this.WeaponRange;
	a.SceneNodeToShootFrom = this.SceneNodeToShootFrom;
	a.ShootToCameraTarget = this.ShootToCameraTarget;
	a.AdditionalDirectionRotation = this.AdditionalDirectionRotation;
	a.ActionHandlerOnImpact = this.ActionHandlerOnImpact ? this.ActionHandlerOnImpact.createClone(oldNodeId, newNodeId): null;
	a.ShootDisplacement = this.ShootDisplacement.clone();
	
	if (a.SceneNodeToUseAsBullet == oldNodeId)
		a.SceneNodeToUseAsBullet = newNodeId;
	if (a.SceneNodeToShootFrom == oldNodeId)
		a.SceneNodeToShootFrom = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.Shoot.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;
	
	// calculate ray, depending on how we were shot: If shot by an AI, use its target.
	// it not, use the active camera and shoot into the center of the screen.

	var ray = new CL3D.Line3d();
	var rayFound = false;
	var shooterNode = null;
	var cam = null; // temp variable, used multiple times below
	
	var ainodes = sceneManager.getAllSceneNodesWithAnimator('gameai');
	
	if (this.SceneNodeToShootFrom != -1)
	{
		var userSpecifiedNode = sceneManager.getSceneNodeFromId(this.SceneNodeToShootFrom);
		
		if (userSpecifiedNode != null)
		{
			rayFound = true;
			shooterNode = userSpecifiedNode;
			
			// ray.Start = userSpecifiedNode.getTransformedBoundingBox().getCenter();
			
			ray.Start = userSpecifiedNode.getBoundingBox().getCenter();
			ray.Start.addToThis(this.ShootDisplacement);
			userSpecifiedNode.AbsoluteTransformation.transformVect(ray.Start);

			cam = sceneManager.getActiveCamera();

			if (this.ShootToCameraTarget && cam)
			{
				// in order to shoot to the camera target, we need to collide the camera with the world and
				// all AIs to test were to shoot at

				var lookLine = new CL3D.Line3d();
				lookLine.Start = cam.getAbsolutePosition();
				lookLine.End = cam.getTarget();
				var lineVct = lookLine.getVector();
				lineVct.setLength(this.WeaponRange);
				lookLine.End = lookLine.Start.add(lineVct);

				this.shortenRayToClosestCollisionPointWithWorld(lookLine, ainodes, this.WeaponRange, sceneManager);
				this.shortenRayToClosestCollisionPointWithAIAnimator(lookLine, ainodes, this.WeaponRange, shooterNode, sceneManager);

				// now simply shoot from shooter node center to ray end

				ray.End = lookLine.End;
			}
			else
			{
				// set ray end based on rotation of scene node and add AdditionalDirectionRotation
				
				var matrot = userSpecifiedNode.AbsoluteTransformation;
				
				if (this.AdditionalDirectionRotation)
				{
					var matrot2 = new CL3D.Matrix4();
					matrot2.setRotationDegrees(this.AdditionalDirectionRotation);
					matrot = matrot.multiply(matrot2);
				}

				ray.End.set(1,0,0);
				matrot.rotateVect(ray.End);
				ray.End.addToThis(ray.Start);
			}
		}
	}
	else
	if (currentNode != null)
	{
		shooterNode = currentNode;
		
		var shootingAI =  currentNode.getAnimatorOfType('gameai');
		if (shootingAI && shootingAI.isCurrentlyShooting())
		{
			ray = shootingAI.getCurrentlyShootingLine();
			rayFound = true;
		}
	}

	if (!rayFound)
	{
		cam = sceneManager.getActiveCamera();
		if (cam)
		{
			shooterNode = cam;
			ray.Start = cam.getAbsolutePosition();
			ray.End = cam.getTarget();
			rayFound = true;
		}
	}
	
	if (!rayFound)
		return; // no current node?

	// normalize ray to weapon range

	var vect = ray.getVector();
	vect.setLength(this.WeaponRange);
	ray.End = ray.Start.add(vect);

	// get all game ai nodes and get the world from them, to
	// shorten the shoot distance again until the nearest wall
	
	this.shortenRayToClosestCollisionPointWithWorld(ray, ainodes, this.WeaponRange, sceneManager);
	
	// decide if we do a bullet or direct shot

	if (this.ShootType == 1) //ESIT_BULLET)
	{
		var bulletTemplate = null;

		if (this.SceneNodeToUseAsBullet != -1)
			bulletTemplate = sceneManager.getSceneNodeFromId(this.SceneNodeToUseAsBullet);
		
		if (bulletTemplate)
		{
			// create bullet now

			var cloned = 
				bulletTemplate.createClone(sceneManager.getRootSceneNode(), -1, -1);
			sceneManager.getRootSceneNode().addChild(cloned);
		
			if (cloned != null)
			{
				cloned.Pos = ray.Start;
				cloned.updateAbsolutePosition();
				cloned.Visible = true;
				cloned.Id = -1;
				cloned.Name = "";
				
				// rotate to target
				
				var rotvect = ray.getVector();
				rotvect = rotvect.getHorizontalAngle();
				cloned.Rot = rotvect;

				// move to target

				var speed = this.BulletSpeed;
				if (speed == 0) speed = 1.0;
					
				var anim = new CL3D.AnimatorFlyStraight();
				anim.Start = ray.Start;
				anim.End = ray.End;
				anim.TimeForWay = ray.getLength() / speed;
				anim.DeleteMeAfterEndReached = true;
				anim.recalculateImidiateValues();
				
				anim.TestShootCollisionWithBullet = true;
				anim.ShootCollisionNodeToIgnore = shooterNode; //currentNode;
				anim.ShootCollisionDamage = this.Damage;
				anim.DeleteSceneNodeAfterEndReached = true;
				anim.ActionToExecuteOnEnd = this.ActionHandlerOnImpact;
				anim.ExecuteActionOnEndOnlyIfTimeSmallerThen = this.WeaponRange / speed;
				
				cloned.addAnimator(anim);
			}
		}
	}
	else
	if (this.ShootType == 0) //EST_DIRECT)
	{
		// directly hit the target instead of creating a bullet

		// only check the nearest collision point with all the nodes
		// and take the nearest hit node as target

		var bestDistance = this.WeaponRange;
		var bestHitNode = this.shortenRayToClosestCollisionPointWithAIAnimator(ray, ainodes, this.WeaponRange, shooterNode, sceneManager);
		
		if (bestHitNode != null)
		{
			sceneManager.LastBulletImpactPosition = ray.End.clone();
			
			// finally found a node to hit. Hit it.
			var targetanimAi = bestHitNode.getAnimatorOfType('gameai');

			if (targetanimAi)
				targetanimAi.OnHit(this.Damage, bestHitNode);
		}

	} // end direct shot
}


/**
 * @private
 */
CL3D.Action.Shoot.prototype.shortenRayToClosestCollisionPointWithWorld = function(ray, ainodes, maxLen, sceneManager)
{
	if (ainodes.length != 0)
	{
		// find world to test against collision so we do not need to do this with every
		// single node, to improve performance

		var animAi = ainodes[0].getAnimatorOfType('gameai');
		if (animAi)
		{
			var world = animAi.World;
			if (world)
			{
				var len = CL3D.AnimatorOnClick.prototype.static_getDistanceToNearestCollisionPointWithWorld(sceneManager, ray.Start, ray.End, world, true);

				if (len < maxLen)
				{
					// shorten our ray because it collides with a world wall

					var vect2 = ray.getVector();
					vect2.setLength(len);
					ray.End = ray.Start.add(vect2);
				}
			}
		}
	}
}


/**
 * @private
 */
CL3D.Action.Shoot.prototype.shortenRayToClosestCollisionPointWithAIAnimator = function(ray, ainodes, maxLen, toIgnore, sceneManager)
{
	var bestDistance = maxLen;
	var bestHitNode = null;
			
	for (var i=0; i<ainodes.length; ++i)
	{				
		if (ainodes[i] === toIgnore) // don't collide against myself
			continue;

		var enemyAI = ainodes[i].getAnimatorOfType('gameai');

		if (enemyAI && !enemyAI.isAlive()) // don't test collision against dead items
			continue;

		var collisionDistance = new Object();
		collisionDistance.N = 0;
		if (CL3D.AnimatorOnClick.prototype.static_getCollisionDistanceWithNode(sceneManager, ainodes[i], ray, false,
																	false, null, collisionDistance))
		{
			if (collisionDistance.N < bestDistance)
			{
				bestDistance = collisionDistance.N;
				bestHitNode = ainodes[i];
			}
		}
	}
	
	if (bestHitNode)
	{
		var vect2 = ray.getVector();
		vect2.setLength(bestDistance);
		ray.End = ray.Start.add(vect2);		
	}
	
	return bestHitNode;
}


/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.Shoot.prototype.getWeaponRange = function()
{
	return this.WeaponRange;
}

// ---------------------------------------------------------------------
// Action SetOrChangeAVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.SetOrChangeAVariable = function()
{
	// variables set in loader
	//this.VariableName = this.ReadString();
	//this.Operation = this.Data.readInt();
	//this.ValueType = this.Data.readInt();
	//this.Value = this.ReadString();
	
	this.Type = 'SetOrChangeAVariable';	
}

/**
 * @private
 */
CL3D.Action.SetOrChangeAVariable.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.SetOrChangeAVariable();
	a.VariableName = this.VariableName;
	a.Operation = this.Operation;
	a.ValueType = this.ValueType;
	a.Value = this.Value;
	return a;
}

/**
 * @private
 */
CL3D.Action.SetOrChangeAVariable.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;
				
	if (this.VariableName == null)
		return;
		
	var var1 = CL3D.CopperCubeVariable.getVariable(this.VariableName, true, sceneManager);
	if (var1 == null)
		return;
		
	var var2 = null;

	if (this.ValueType == 1) //EO_VARIABLE)
	{
		var2 = CL3D.CopperCubeVariable.getVariable(this.Value, false, sceneManager);	
		if (var2 == null)
			return; // operand variable not existing
	}

	if (var2 == null)
	{
		var2 = new CL3D.CopperCubeVariable();
		var2.setValueAsString(this.Value);
	}

	switch(this.Operation)
	{
	case 0: //EO_SET:
		var1.setAsCopy(var2);
		break;
	case 1: //EO_ADD:
		var1.setValueAsFloat(var1.getValueAsFloat() + var2.getValueAsFloat());
		break;
	case 2: //EO_SUBSTRACT:
		var1.setValueAsFloat(var1.getValueAsFloat() - var2.getValueAsFloat());
		break;
	case 3: //EO_DIVIDE:
		{
			var diva = var2.getValueAsFloat();
			var1.setValueAsFloat((diva != 0) ? (var1.getValueAsFloat() / diva) : 0);
		}
		break;
	case 4: //EO_DIVIDE_INT:
		{
			var divb = var2.getValueAsFloat();
			var1.setValueAsInt((divb != 0) ? Math.floor(var1.getValueAsFloat() / divb) : 0);
		}
		break;
	case 5: //EO_MULTIPLY:
		var1.setValueAsFloat(var1.getValueAsFloat() * var2.getValueAsFloat());
		break;
	case 6: //EO_MULTIPLY_INT:
		var1.setValueAsInt(Math.floor(var1.getValueAsFloat() * var2.getValueAsFloat()));
		break;
	}		

	CL3D.CopperCubeVariable.saveContentOfPotentialTemporaryVariableIntoSource(var1, sceneManager);
}

// ---------------------------------------------------------------------
// Action IfVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.IfVariable = function()
{
	// variables set in loader
	// this.VariableName = this.ReadString();
	// this.ComparisonType = this.Data.readInt();
	// this.ValueType = this.Data.readInt();
	// this.Value = this.ReadString();
	// this.TheActionHandler
	
	this.Type = 'IfVariable';	
}

/**
 * @private
 */
CL3D.Action.IfVariable.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.IfVariable();
	a.VariableName = this.VariableName;
	a.ComparisonType = this.ComparisonType;
	a.ValueType = this.ValueType;
	a.Value = this.Value;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone(oldNodeId, newNodeId) : null;
	a.TheElseActionHandler = this.TheElseActionHandler ? this.TheElseActionHandler.createClone(oldNodeId, newNodeId) : null;
	return a;
}

/**
 * @private
 */
CL3D.Action.IfVariable.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;
		
	if (this.VariableName == null)
		return;
		
	var var1 = CL3D.CopperCubeVariable.getVariable(this.VariableName, true, sceneManager);
	if (var1 == null) // should not happen since the function above creates if not found
		return;
		
	var var2 = null;

	if (this.ValueType == 1) //EO_VARIABLE)
	{
		var2 = CL3D.CopperCubeVariable.getVariable(this.Value, false, sceneManager);	
		if (var2 == null)
			return; // operand variable not existing
	}

	if (var2 == null)
	{
		var2 = new CL3D.CopperCubeVariable();
		var2.setValueAsString(this.Value);
	}
	
	var execute = false;

	switch(this.ComparisonType)
	{
	case 0: //EO_EQUAL:
	case 1: //EO_NOT_EQUAL:
		{
			if (var1.isString() && var2.isString())
				// string compare
				execute = var1.getValueAsString() == var2.getValueAsString();
			else
				// number compare
				execute = CL3D.equals(var1.getValueAsFloat(), var2.getValueAsFloat());

			if (this.ComparisonType == 1) //EO_NOT_EQUAL)
				execute = !execute;	
			break;
		}
	case 2: //EO_BIGGER_THAN:
		{
			execute = var1.getValueAsFloat() > var2.getValueAsFloat();
		}
		break;
	case 3: //EO_SMALLER_THAN:
		{
			execute = var1.getValueAsFloat() < var2.getValueAsFloat();
		}
		break;
	}			
	
	if (execute)
	{
		if (this.TheActionHandler)
			this.TheActionHandler.execute(currentNode);
	}
	else
	{
		if (this.TheElseActionHandler)
			this.TheElseActionHandler.execute(currentNode);
	}
}

// ---------------------------------------------------------------------
// Action RestartBehaviors
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.RestartBehaviors = function()
{
	this.SceneNodeToRestart = null;
	this.ChangeCurrentSceneNode = false;
	this.Type = 'RestartBehaviors';	
}

/**
 * @private
 */
CL3D.Action.RestartBehaviors.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.RestartBehaviors();
	a.SceneNodeToRestart = this.SceneNodeToRestart;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	
	if (a.ChangeCurrentSceneNode == oldNodeId)
		a.ChangeCurrentSceneNode = newNodeId;
	return a;
}

/**
 * @private
 */
CL3D.Action.RestartBehaviors.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToRestart != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToRestart);

	if (nodeToHandle)
	{
		for (var i = 0; i<nodeToHandle.Animators.length; ++i)
		{
			var a = nodeToHandle.Animators[i];
			if (a != null)
				a.reset();
		}
	}
}


// ---------------------------------------------------------------------
// Action PlaySound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionPlaySound = function()
{
	this.Type = 'PlaySound';	
}

/**
 * @private
 */
CL3D.Action.ActionPlaySound.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionPlaySound();
	a.SceneNodeToPlayAt = this.SceneNodeToPlayAt;
	a.PlayAtCurrentSceneNode = this.PlayAtCurrentSceneNode;
	a.Position3D = this.Position3D ? this.Position3D.clone() : null;
	a.MinDistance = this.MinDistance;
	a.MaxDistance = this.MaxDistance;
	a.PlayLooped = this.PlayLooped;
	a.Volume = this.Volume;
	a.PlayAs2D = this.PlayAs2D;
	a.TheSound = this.TheSound;
	
	if (a.SceneNodeToPlayAt == oldNodeId)
		a.SceneNodeToPlayAt = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionPlaySound.prototype.execute = function(currentNode, sceneManager)
{
	if (sceneManager == null || this.TheSound == null)
		return;
						
	if (this.PlayAs2D || true) // currently no 3d playing supported
	{
		this.PlayingSound = CL3D.gSoundManager.play2D(this.TheSound, this.PlayLooped, this.Volume);
	}
}

// ---------------------------------------------------------------------
// Action StopSpecificSound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.StopSpecificSound = function()
{
	this.Type = 'StopSpecificSound';	
}

/**
 * @private
 */
CL3D.Action.StopSpecificSound.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.StopSpecificSound();
	a.TheSound = this.TheSound;
	
	return a;
}

/**
 * @private
 */
CL3D.Action.StopSpecificSound.prototype.execute = function(currentNode, sceneManager)
{
	if (sceneManager == null || this.TheSound == null)
		return;
	
	CL3D.gSoundManager.stopSpecificPlayingSound(this.TheSound.Name);
}

// ---------------------------------------------------------------------
// Action StopSound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionStopSound = function()
{
	this.Type = 'StopSound';	
}

/**
 * @private
 */
CL3D.Action.ActionStopSound.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionStopSound();
	a.SoundChangeType = this.SoundChangeType;
	a.SoundFileName = this.SoundFileName;
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionStopSound.prototype.execute = function(currentNode, sceneManager)
{
	CL3D.gSoundManager.stopAll();
}

// ---------------------------------------------------------------------
// Action Store Load Variable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionStoreLoadVariable = function()
{
	this.Type = 'StoreLoadVariable';	
}

/**
 * @private
 */
CL3D.Action.ActionStoreLoadVariable.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionStoreLoadVariable();
	a.Load = this.Load;
	a.VariableName = this.VariableName;
	return a;
}

CL3D.Action.ActionStoreLoadVariable.prototype.setCookie = function(cookieName, value, expdays)
{
	var expdate = new Date();
	expdate.setDate(expdate.getDate() + expdays);
	var cvalue = escape(value) + ("; expires=" + expdate.toUTCString());
	document.cookie = cookieName + "=" + cvalue;
}

CL3D.Action.ActionStoreLoadVariable.prototype.getCookie = function(cookieName)
{
	var ARRcookies = document.cookie.split(";");
	for (var i=0; i<ARRcookies.length; ++i)
	{
		var cookie = ARRcookies[i];
		var equalspos = cookie.indexOf("=");
		var varname = cookie.substr(0, equalspos);
		
		varname = varname.replace(/^\s+|\s+$/g,"");
		
		if (varname == cookieName)
			return unescape(cookie.substr(equalspos+1));
	}
	
	return null;
}

/**
 * @private
 */
CL3D.Action.ActionStoreLoadVariable.prototype.execute = function(currentNode, sceneManager)
{
	if (this.VariableName == null || this.VariableName == "")
		return;
		
	var var1 = CL3D.CopperCubeVariable.getVariable(this.VariableName, this.Load, sceneManager);
	
	if (var1 != null)
	{
		try
		{			
			if (this.Load)
			{
				// load
				
				var1.setValueAsString(this.getCookie(var1.getName()));
			}
			else
			{
				// save
				this.setCookie(var1.getName(), var1.getValueAsString(), 99);
			}
		}
		catch(e)
		{
			//Debug.print("error loading/saving data");
		}
	}
}


// ---------------------------------------------------------------------
// Action Handler
// ---------------------------------------------------------------------

/**
 * @constructor
 * @private
 * @class
 */
CL3D.ActionHandler = function(scene)
{
	this.Actions = new Array();
	this.SMGr = scene;
}

/**
 * @private
 */
CL3D.ActionHandler.prototype.execute = function(node, mgr)
{
	for (var i=0; i<this.Actions.length; ++i)
	{
		 this.Actions[i].execute(node, this.SMGr);
	}
}

/**
 * @private
 */
CL3D.ActionHandler.prototype.addAction = function(a)
{
	if (a == null)
		return;
		
	this.Actions.push(a);
}

/**
 * @private
 */
CL3D.ActionHandler.prototype.findAction = function(type)
{
	for (var i=0; i<this.Actions.length; ++i)
	{
		var a = this.Actions[i];
		if (a.Type == type)
			return a;
	}
	
	return null;
}

/**
 * @private
 */
CL3D.ActionHandler.prototype.createClone = function(oldNodeId, newNodeId)
{
	var c = new CL3D.ActionHandler(this.SMGr);
	
	for (var i=0; i<this.Actions.length; ++i)
	{
		var a = this.Actions[i];
		if (a.createClone != null)
			c.addAction(a.createClone(oldNodeId, newNodeId));
	}
	
	return c;
}


// ---------------------------------------------------------------------
// Action ActionRestartScene
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionRestartScene = function(engine)
{
	this.Engine = engine;
	this.Type = 'RestartScene';	
}

/**
 * @private
 */
CL3D.Action.ActionRestartScene.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionRestartScene();
	a.SceneName = this.SceneName;
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionRestartScene.prototype.execute = function(currentNode, sceneManager)
{
	if (this.Engine)
		this.Engine.reloadScene(this.SceneName);
}

// ---------------------------------------------------------------------
// Action ActionDeleteSceneNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionDeleteSceneNode = function()
{
	this.Type = 'ActionDeleteSceneNode';	
}

/**
 * @private
 */
CL3D.Action.ActionDeleteSceneNode.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionDeleteSceneNode();
	a.SceneNodeToDelete = this.SceneNodeToDelete;
	a.DeleteCurrentSceneNode = this.DeleteCurrentSceneNode;
	a.TimeAfterDelete = this.TimeAfterDelete;
	
	if (a.SceneNodeToDelete == oldNodeId)
		a.SceneNodeToDelete = newNodeId;
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionDeleteSceneNode.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.DeleteCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToDelete != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToDelete);

	if (nodeToHandle != null)
		sceneManager.addToDeletionQueue(nodeToHandle, this.TimeAfterDelete);
}

// ---------------------------------------------------------------------
// Action ActionCloneSceneNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionCloneSceneNode = function()
{
	this.Type = 'ActionCloneSceneNode';	
}

/**
 * @private
 */
CL3D.Action.ActionCloneSceneNode.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionCloneSceneNode();
	a.SceneNodeToClone = this.SceneNodeToClone;
	a.CloneCurrentSceneNode = this.CloneCurrentSceneNode;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone(oldNodeId, newNodeId) : null;
	
	if (a.SceneNodeToClone == oldNodeId)
		a.SceneNodeToClone = newNodeId;
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionCloneSceneNode.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.CloneCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToClone != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToClone);

	if (nodeToHandle)
	{
		var oldId = nodeToHandle.Id;
		var newId = -1;
		
		// get new, unused id
		
		newId = sceneManager.getUnusedSceneNodeId();
		
		// clone
				
		var cloned = nodeToHandle.createClone(nodeToHandle.Parent, oldId, newId);
		
		if (cloned != null)
		{
			cloned.Id = newId;
			nodeToHandle.Parent.addChild(cloned);
			
			// update refernced ids which haven't been updated yet
			
			sceneManager.replaceAllReferencedNodes(nodeToHandle, cloned);
			
			// also clone collision detection of the node in the world
			
			var selector = nodeToHandle.Selector;
			if (selector)
			{
				var newSelector = selector.createClone(cloned);
				if (newSelector)
				{
					// set to node

					cloned.Selector = newSelector;

					// also, copy into world

					if (sceneManager.getCollisionGeometry()) 
						sceneManager.getCollisionGeometry().addSelector(newSelector);
				}
			}
			
			// run action on clone
	
			if (this.TheActionHandler)
				this.TheActionHandler.execute(cloned);
		}
	}
}

// ---------------------------------------------------------------------
// Action ActionPlayMovie
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionPlayMovie = function(engine)
{
	this.Type = 'ActionPlayMovie';	
	this.Engine = engine;
}

/**
 * @private
 */
CL3D.Action.ActionPlayMovie.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionPlayMovie();
	a.PlayLooped = this.PlayLooped;
	a.Command = this.Command;
	a.VideoFileName = this.VideoFileName;
	a.SceneNodeToPlayAt = this.SceneNodeToPlayAt;
	a.PlayAtCurrentSceneNode = this.PlayAtCurrentSceneNode;
	a.MaterialIndex = this.MaterialIndex;	
	a.ActionHandlerFinished = this.ActionHandlerFinished ? this.ActionHandlerFinished.createClone(oldNodeId, newNodeId) : null;
	a.ActionHandlerFailed = this.ActionHandlerFailed ? this.ActionHandlerFailed.createClone(oldNodeId, newNodeId) : null;
	
	if (a.SceneNodeToPlayAt == oldNodeId)
		a.SceneNodeToPlayAt = newNodeId;
		
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionPlayMovie.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode || !sceneManager)
		return;

	var nodeToHandle = null;
	if (this.PlayAtCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlayAt != -1)
		nodeToHandle = sceneManager.getSceneNodeFromId(this.SceneNodeToPlayAt);


	var failed = false;
	
	// create video stream
	
	var stream = this.Engine.getOrCreateVideoStream(this.VideoFileName, this.Command == 0, this.ActionHandlerFinished, this.ActionHandlerFailed);
		
	if (stream != null)
	{
		switch(this.Command)
		{
		case 0: // play
			{
				stream.play(this.PlayLooped);
				
				// set texture
				
				if (nodeToHandle)
				{
					if (nodeToHandle.getType() == '2doverlay')
						nodeToHandle.setShowImage(stream.texture);
					else
					{
						var mat = nodeToHandle.getMaterial(this.MaterialIndex);
						if (mat != null)
							mat.Tex1 = stream.texture;
					}
				}
			}
			break;
		case 1: // pause
			stream.pause();
			break;
		case 2: // stop
			stream.stop();
			break;
		}	
	}
}

// ---------------------------------------------------------------------
// Playing video stream
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.VideoStream = function(filename, renderer)
{
	this.filename = filename;
	this.videoElement = null;
	this.renderer = renderer;
	this.texture = null;
	this.handlerOnVideoEnded = null;
	this.handlerOnVideoFailed = null;
	this.readyToShow = false;
	this.playBackEnded = false;
	this.stopped = false;
	this.state = 0; // 0=stopped, 1=loading, 2=playing, 3=paused
	this.playLooped = false;
	this.isError = false;
	
	this.videoBufferReady = function()
	{
		this.state = 2; // playing
		
		// start video
		this.videoElement.play();
		this.readyToShow = true;
		
		var oldTexture = this.texture;
		var newTexture = this.renderer.createTextureFrom2DCanvas(this.videoElement, true);
		
		// now replace content of the new texture with the old placeholder texture
		
		this.renderer.replacePlaceholderTextureWithNewTextureContent(oldTexture, newTexture);		
	}
	
	this.videoPlaybackDone = function()
	{
		this.state = 0; // 0=stopped, 1=loading, 2=playing, 3=paused
		this.playBackEnded = true;
	}
	
	this.errorHappened = function()
	{
		this.state = 0;
		this.playBackEnded = true;
		this.isError = true;
	}
		
	this.play = function(playLooped)
	{
		if (this.state == 2 || this.state == 1) // playing or loading
			return;
			
		if (this.videoElement)
		{
			if (this.state == 3) // paused
			{
				// unpause
				this.videoElement.play();
				this.state = 2;
				this.playBackEnded = false;
				return;
			}
			else
			if (this.state == 0) // stopped
			{
				this.videoElement.currentTime = 0;
				this.videoElement.play();
				this.state = 2;
				this.playBackEnded = false;
				return;
			}
		}
		
		var v = document.createElement('video');
		
		var me = this;
		
		this.videoElement = v;
		this.playLooped = playLooped;
		
		v.addEventListener("canplaythrough", function() { me.videoBufferReady(); }, true);
		v.addEventListener("ended", function() { me.videoPlaybackDone(); }, true);
		v.addEventListener("error", function() { me.errorHappened(); }, true);
		
		v['preload'] = "auto";
		v.src = filename; // works with .ogv and .mp4
		v.style.display = 'none';
		
		if (this.playLooped)			
			v.loop = true;
			
		this.state = 1; // loading
		
		// create placeholder texture
		
		var canvas = document.createElement("canvas");
		if (canvas == null)
			return;					
		canvas.width = 16;
		canvas.height = 16;
		
		//ctx = canvas.getContext("2d");
		//ctx.fillStyle = "rgba(255, 0, 255, 1)";
		//ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		this.texture = this.renderer.createTextureFrom2DCanvas(canvas, true);
	}
	
	this.pause = function()
	{
		if (this.state != 2)
			return;
			
		this.videoElement.pause();
		this.state = 3;
	}
	
	this.stop = function()
	{
		if (this.state != 2)
			return;
			
		this.videoElement.pause();
		this.state = 0;	
	}
	
	this.updateVideoTexture = function()
	{
		if (!this.readyToShow)
			return;
			
		if (this.state != 2) // playing
			return;			
		
		this.renderer.updateTextureFrom2DCanvas(this.texture, this.videoElement);
	}
	
	this.hasPlayBackEnded = function()
	{
		if (this.state == 0) // 0=stopped, 1=loading, 2=playing, 3=paused
			return true;
			
		return this.playBackEnded;
	}
}