//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

// list of extern functions and symbols for the closure compiler

// public scripting interface:

vector3d;
vector3d.x;
vector3d.y;
vector3d.z;
vector3d.prototype.add;
vector3d.prototype.substract;
vector3d.prototype.getLength;
vector3d.prototype.normalize;
vector3d.prototype.toString;

/*
ccbGetSceneNodeFromId;
ccbCloneSceneNode;
ccbGetActiveCamera;
ccbSetActiveCamera;
ccbGetChildSceneNode;
ccbGetRootSceneNode;
ccbGetSceneNodeChildCount;
ccbGetSceneNodeFromName;
ccbRemoveSceneNode;
ccbGetSceneNodeMaterialCount;
ccbGetSceneNodeMaterialProperty;
ccbSetSceneNodeMaterialProperty;
ccbSetSceneNodeProperty;
ccbGetSceneNodeProperty;
ccbSetSceneNodePositionWithoutCollision;
ccbRegisterOnFrameEvent;
ccbDrawColoredRectangle;
ccbDrawTextureRectangle;
ccbDrawTextureRectangleWithAlpha;
ccbGet3DPosFrom2DPos;
ccbGet2DPosFrom3DPos;
ccbGetCollisionPointOfWorldWithLine;
ccbEndProgram;
ccbDoesLineCollideWithBoundingBoxOfSceneNode;
ccbLoadTexture;
ccbGetMousePosX;
ccbGetMousePosY;
ccbGetScreenWidth;
ccbGetScreenHeight;
ccbSetCloseOnEscapePressed;
ccbSetCursorVisible;
ccbSwitchToScene;
ccbPlaySound;
ccbGetCopperCubeVariable;
ccbSetCopperCubeVariable;
ccbReadFileContent;
ccbWriteFileContent;
ccbGetPlatform;
ccbInvokeAction;
print;
system;
ccbRegisterBehaviorEventReceiver;
ccbSwitchToFullscreen;
ccbDoHTTPRequest;
ccbCancelHTTPRequest;
ccbCreateMaterial;
ccbSetShaderConstant;
ccbSetPhysicsVelocity;
*/
/*
// Vect2d

CL3D.Vect2d;
CL3D.Vect2d.prototype.X;
CL3D.Vect2d.prototype.Y;

// Vect3d

CL3D.Vect3d;
CL3D.Vect3d.prototype.X;
CL3D.Vect3d.prototype.Y;
CL3D.Vect3d.prototype.Z;

// triangle3d

CL3D.Triangle3d.prototype.pointA;
CL3D.Triangle3d.prototype.pointB;
CL3D.Triangle3d.prototype.pointC;

// quaternion

CL3D.Quaternion.prototype.X;
CL3D.Quaternion.prototype.Y;
CL3D.Quaternion.prototype.Z;
CL3D.Quaternion.prototype.Q;

// plane3d

CL3D.Plane3d.prototype.D;
CL3D.Plane3d.prototype.Normal;

// named animation range

CL3D.NamedAnimationRange.prototype.Name;
CL3D.NamedAnimationRange.prototype.Begin;
CL3D.NamedAnimationRange.prototype.End;
CL3D.NamedAnimationRange.prototype.FPS;

// box3d

CL3D.Box3d.prototype.MinEdge;
CL3D.Box3d.prototype.MaxEdge;

// line3d

CL3D.Line3d.prototype.Start;
CL3D.Line3d.prototype.End;

// Vertex3d

CL3D.Vertex3D.prototype.Pos;
CL3D.Vertex3D.prototype.Normal;
CL3D.Vertex3D.prototype.Color;
CL3D.Vertex3D.prototype.TCoords;
CL3D.Vertex3D.prototype.TCoords2;

// scene node
CL3D.SceneNode.prototype.Pos;
CL3D.SceneNode.prototype.Rot;
CL3D.SceneNode.prototype.Scale;
CL3D.SceneNode.prototype.Visible;
CL3D.SceneNode.prototype.Name;
CL3D.SceneNode.prototype.Id;
CL3D.SceneNode.prototype.Parent;
CL3D.SceneNode.prototype.createClone = function(newparent) {};
CL3D.SceneNode.prototype.OnRegisterSceneNode  = function(scene) {};
CL3D.SceneNode.prototype.OnAnimate = function(scene, timeMs) {};
CL3D.SceneNode.prototype.render = function(renderer) {};
CL3D.SceneNode.prototype.getMaterialCount = function() {};
CL3D.SceneNode.prototype.getMaterial = function(i) {};
CL3D.SceneNode.prototype.getBoundingBox = function() {};
CL3D.SceneNode.prototype.getType = function() {};

CL3D.MeshSceneNode.prototype.getType = function() {};
CL3D.CameraSceneNode.prototype.getType = function() {};
CL3D.BillboardSceneNode.prototype.getType = function() {};

// vertex
CL3D.Vertex3D.prototype.Pos;
CL3D.Vertex3D.prototype.Normal;
CL3D.Vertex3D.prototype.Color;
CL3D.Vertex3D.prototype.TCoords;
CL3D.Vertex3D.prototype.TCoords2;

// animator

CL3D.Animator.prototype.onMouseDown = function(event) {};
CL3D.Animator.prototype.onMouseWheel = function(event) {};
CL3D.Animator.prototype.onMouseUp = function(event) {};
CL3D.Animator.prototype.onMouseMove = function(event) {};
CL3D.Animator.prototype.onKeyDown = function(event) {};
CL3D.Animator.prototype.onKeyUp = function(event) {};
CL3D.Animator.prototype.animateNode = function(n, timeMs) {};

CL3D.AnimatorCameraFPS.prototype.onMouseDown = function(event) {};
CL3D.AnimatorCameraFPS.prototype.onMouseWheel = function(event) {};
CL3D.AnimatorCameraFPS.prototype.onMouseUp = function(event) {};
CL3D.AnimatorCameraFPS.prototype.onMouseMove = function(event) {};
CL3D.AnimatorCameraFPS.prototype.onKeyDown = function(event) {};
CL3D.AnimatorCameraFPS.prototype.onKeyUp = function(event) {};
CL3D.AnimatorCameraFPS.prototype.MoveSpeed;
CL3D.AnimatorCameraFPS.prototype.RotateSpeed;
CL3D.AnimatorCameraFPS.prototype.JumpSpeed;
CL3D.AnimatorCameraFPS.prototype.NoVerticalMovement;
CL3D.AnimatorCameraFPS.prototype.MayMove;
CL3D.AnimatorCameraFPS.prototype.MayZoom;

CL3D.AnimatorCameraModelViewer.prototype.RotateSpeed;
CL3D.AnimatorCameraModelViewer.prototype.Radius;
CL3D.AnimatorCameraModelViewer.prototype.NoVerticalMovement;

CL3D.AnimatorCameraFPS.prototype.animateNode = function(n, timeMs) {};

// material

CL3D.Material.prototype.Type;
CL3D.Material.prototype.ZWriteEnabled;
CL3D.Material.prototype.ZReadEnabled;
CL3D.Material.prototype.ClampTexture1;
CL3D.Material.prototype.isTransparent = function() {};
CL3D.Material.prototype.Tex1;
CL3D.Material.prototype.Tex1;

// mesh buffer

CL3D.MeshBuffer.prototype.Box;
CL3D.MeshBuffer.prototype.Mat;
CL3D.MeshBuffer.prototype.Indices;
CL3D.MeshBuffer.prototype.Vertices;
CL3D.MeshBuffer.prototype.RendererNativeArray;

// copperlicht

CL3D.CopperLicht.prototype.OnAnimate;
CL3D.CopperLicht.prototype.OnAfterDrawAll;
CL3D.CopperLicht.prototype.OnBeforeDrawAll;
CL3D.CopperLicht.prototype.OnLoadingComplete;
CL3D.CopperLicht.prototype.handleKeyDown;
CL3D.CopperLicht.prototype.handleKeyUp;
CL3D.CopperLicht.prototype.handleMouseDown;
CL3D.CopperLicht.prototype.handleMouseUp;
CL3D.CopperLicht.prototype.handleMouseMove;


// path scene node
CL3D.PathSceneNode.prototype.Tightness;
CL3D.PathSceneNode.prototype.IsClosedCircle;
CL3D.PathSceneNode.prototype.Nodes;
*/