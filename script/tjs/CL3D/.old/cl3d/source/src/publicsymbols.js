
// list of public functions and symbols for the closure compiler
//window['CopperLicht'] = CopperLicht;
//CopperLicht.prototype['load'] = CopperLicht.load;
//CL3D['startCopperLichtFromFile'] = CL3D.startCopperLichtFromFile;
window['startCopperLichtFromFile'] = startCopperLichtFromFile;

window['CL3D'] = CL3D;

// scripting interface
window['ccbGetSceneNodeFromId'] = ccbGetSceneNodeFromId;
window['ccbCloneSceneNode'] = ccbCloneSceneNode;
window['ccbGetActiveCamera'] = ccbGetActiveCamera;
window['ccbSetActiveCamera'] = ccbSetActiveCamera;
window['ccbGetChildSceneNode'] = ccbGetChildSceneNode;
window['ccbGetRootSceneNode'] = ccbGetRootSceneNode;
window['ccbGetSceneNodeChildCount'] = ccbGetSceneNodeChildCount;
window['ccbGetSceneNodeFromName'] = ccbGetSceneNodeFromName;
window['ccbRemoveSceneNode'] = ccbRemoveSceneNode;
window['ccbSetSceneNodeParent'] = ccbSetSceneNodeParent;
window['ccbGetSceneNodeMaterialCount'] = ccbGetSceneNodeMaterialCount;
window['ccbGetSceneNodeMaterialProperty'] = ccbGetSceneNodeMaterialProperty;
window['ccbSetSceneNodeMaterialProperty'] = ccbSetSceneNodeMaterialProperty;
window['ccbSetSceneNodeProperty'] = ccbSetSceneNodeProperty;
window['ccbGetSceneNodeProperty'] = ccbGetSceneNodeProperty;
window['ccbSetSceneNodePositionWithoutCollision'] = ccbSetSceneNodePositionWithoutCollision;
window['ccbRegisterOnFrameEvent'] = ccbRegisterOnFrameEvent;
window['ccbDrawColoredRectangle'] = ccbDrawColoredRectangle;
window['ccbDrawTextureRectangle'] = ccbDrawTextureRectangle;
window['ccbDrawTextureRectangleWithAlpha'] = ccbDrawTextureRectangleWithAlpha;
window['ccbGet3DPosFrom2DPos'] = ccbGet3DPosFrom2DPos;
window['ccbGet2DPosFrom3DPos'] = ccbGet2DPosFrom3DPos;
window['ccbGetCollisionPointOfWorldWithLine'] = ccbGetCollisionPointOfWorldWithLine;
window['ccbEndProgram'] = ccbEndProgram;
window['ccbDoesLineCollideWithBoundingBoxOfSceneNode'] = ccbDoesLineCollideWithBoundingBoxOfSceneNode;
window['ccbLoadTexture'] = ccbLoadTexture;
window['ccbGetMousePosX'] = ccbGetMousePosX;
window['ccbGetMousePosY'] = ccbGetMousePosY;
window['ccbGetScreenWidth'] = ccbGetScreenWidth;
window['ccbGetScreenHeight'] = ccbGetScreenHeight;
window['ccbSetCloseOnEscapePressed'] = ccbSetCloseOnEscapePressed;
window['ccbSetCursorVisible'] = ccbSetCursorVisible;
window['ccbSwitchToScene'] = ccbSwitchToScene;
window['ccbPlaySound'] = ccbPlaySound;
window['ccbStopSound'] = ccbStopSound;
window['ccbGetCopperCubeVariable'] = ccbGetCopperCubeVariable;
window['ccbSetCopperCubeVariable'] = ccbSetCopperCubeVariable;
window['ccbReadFileContent'] = ccbReadFileContent;
window['ccbWriteFileContent'] = ccbWriteFileContent;
window['ccbGetPlatform'] = ccbGetPlatform;
window['ccbInvokeAction'] = ccbInvokeAction;
window['ccbCleanMemory'] = ccbCleanMemory;
window['print'] = print;
window['system'] = system;
window['ccbRegisterBehaviorEventReceiver'] = ccbRegisterBehaviorEventReceiver;
window['ccbUnregisterOnFrameEvent'] = ccbUnregisterOnFrameEvent;
window['ccbSwitchToFullscreen'] = ccbSwitchToFullscreen;
window['ccbDoHTTPRequest'] = ccbDoHTTPRequest;
window['ccbCancelHTTPRequest'] = ccbCancelHTTPRequest;
window['ccbCreateMaterial'] = ccbCreateMaterial;
window['ccbSetShaderConstant'] = ccbSetShaderConstant;
window['ccbSetPhysicsVelocity'] = ccbSetPhysicsVelocity;
window['ccbUpdatePhysicsGeometry'] = ccbSetPhysicsVelocity;
window['ccbAICommand'] = ccbAICommand;
window['ccbGetCurrentNode'] = ccbGetCurrentNode;

/*
with (CL3D)
{

Vect3d.prototype['dotProduct'] = Vect3d.prototype.dotProduct;
Vect3d.prototype['getHorizontalAngle'] = Vect3d.prototype.getHorizontalAngle;
Vect3d.prototype['crossProduct'] = Vect3d.prototype.crossProduct;
Vect3d.prototype['divideThroughVect'] = Vect3d.prototype.divideThroughVect;
Vect3d.prototype['divideThisThroughVect'] = Vect3d.prototype.divideThisThroughVect;
Vect3d.prototype['multiplyWithVect'] = Vect3d.prototype.multiplyWithVect;
Vect3d.prototype['multiplyThisWithVect'] = Vect3d.prototype.multiplyThisWithVect;
Vect3d.prototype['multiplyThisWithScal'] = Vect3d.prototype.multiplyThisWithScal;
Vect3d.prototype['multiplyWithScal'] = Vect3d.prototype.multiplyWithScal;
Vect3d.prototype['getLengthSQ'] = Vect3d.prototype.getLengthSQ;
Vect3d.prototype['getDistanceFromSQ'] = Vect3d.prototype.getDistanceFromSQ;
Vect3d.prototype['getDistanceTo'] = Vect3d.prototype.getDistanceTo ;
Vect3d.prototype['getLength'] = Vect3d.prototype.getLength;
Vect3d.prototype['isZero'] = Vect3d.prototype.isZero;
Vect3d.prototype['equalsByNumbers'] = Vect3d.prototype.equalsByNumbers;
Vect3d.prototype['equalsZero'] = Vect3d.prototype.equalsZero;
Vect3d.prototype['equals'] = Vect3d.prototype.equals;
Vect3d.prototype['setTo'] = Vect3d.prototype.setTo ;
Vect3d.prototype['setLength'] = Vect3d.prototype.setLength;
Vect3d.prototype['getNormalized'] = Vect3d.prototype.getNormalized;
Vect3d.prototype['normalize'] = Vect3d.prototype.normalize;
Vect3d.prototype['addToThis'] = Vect3d.prototype.addToThis;
Vect3d.prototype['add'] = Vect3d.prototype.add;
Vect3d.prototype['crossProduct'] = Vect3d.prototype.crossProduct;
Vect3d.prototype['substractFromThis'] = Vect3d.prototype.substractFromThis;
Vect3d.prototype['substract'] = Vect3d.prototype.substract;
Vect3d.prototype['set'] = Vect3d.prototype.set;
Vect3d.prototype['setTo'] = Vect3d.prototype.setTo;
Vect3d.prototype['copyTo'] = Vect3d.prototype.copyTo;
Vect3d.prototype['clone'] = Vect3d.prototype.clone;
Vect3d.prototype['toString'] = Vect3d.prototype.toString;

Quaternion.prototype['clone'] = Quaternion.prototype.clone;
Quaternion.prototype['copyTo'] = Quaternion.prototype.copyTo;
Quaternion.prototype['multiplyWith'] = Quaternion.prototype.multiplyWith;
Quaternion.prototype['addToThis'] = Quaternion.prototype.addToThis;
Quaternion.prototype['slerp'] = Quaternion.prototype.slerp;
Quaternion.prototype['dotProduct'] = Quaternion.prototype.dotProduct;
Quaternion.prototype['getMatrix'] = Quaternion.prototype.getMatrix;
Quaternion.prototype['toEuler'] = Quaternion.prototype.toEuler;
Quaternion.prototype['setFromEuler'] = Quaternion.prototype.setFromEuler;
Quaternion.prototype['normalize'] = Quaternion.prototype.normalize;

Triangle3d.prototype['getIntersectionWithLine'] = Triangle3d.prototype.getIntersectionWithLine;
Triangle3d.prototype['getIntersectionOfPlaneWithLine'] = Triangle3d.prototype.getIntersectionOfPlaneWithLine;
Triangle3d.prototype['getNormal'] = Triangle3d.prototype.getNormal;
Triangle3d.prototype['isPointInside'] = Triangle3d.prototype.isPointInside;
Triangle3d.prototype['isPointInsideFast'] = Triangle3d.prototype.isPointInsideFast;
Triangle3d.prototype['getPlane'] = Triangle3d.prototype.getPlane;
Triangle3d.prototype['clone'] = Triangle3d.prototype.clone;
Triangle3d.prototype['isTotalInsideBox'] = Triangle3d.prototype.isTotalInsideBox;
Triangle3d.prototype['copyTo'] = Triangle3d.prototype.copyTo;

Matrix4.prototype['makeIdentity'] = Matrix4.prototype.makeIdentity;
Matrix4.prototype['isIdentity'] = Matrix4.prototype.isIdentity;
Matrix4.prototype['isTranslateOnly'] = Matrix4.prototype.isTranslateOnly;
Matrix4.prototype['equals'] = Matrix4.prototype.equals;
Matrix4.prototype['getTranslation'] = Matrix4.prototype.getTranslation;
Matrix4.prototype['getScale'] = Matrix4.prototype.getScale;
Matrix4.prototype['rotateVect'] = Matrix4.prototype.rotateVect;
Matrix4.prototype['rotateVect2'] = Matrix4.prototype.rotateVect2;
Matrix4.prototype['getRotatedVect'] = Matrix4.prototype.getRotatedVect;
Matrix4.prototype['getTransformedVect'] = Matrix4.prototype.getTransformedVect;
Matrix4.prototype['transformVect'] = Matrix4.prototype.transformVect;
Matrix4.prototype['transformVect2'] = Matrix4.prototype.transformVect2;
Matrix4.prototype['getTranslatedVect'] = Matrix4.prototype.getTranslatedVect;
Matrix4.prototype['translateVect'] = Matrix4.prototype.translateVect;
Matrix4.prototype['transformPlane'] = Matrix4.prototype.transformPlane;
Matrix4.prototype['multiply'] = Matrix4.prototype.multiply;
Matrix4.prototype['multiplyWith1x4Matrix'] = Matrix4.prototype.multiplyWith1x4Matrix;
Matrix4.prototype['getInverse'] = Matrix4.prototype.getInverse;
Matrix4.prototype['makeInverse'] = Matrix4.prototype.makeInverse;
Matrix4.prototype['asArray'] = Matrix4.prototype.asArray;
Matrix4.prototype['setByIndex'] = Matrix4.prototype.setByIndex;
Matrix4.prototype['clone'] = Matrix4.prototype.clone;
Matrix4.prototype['copyTo'] = Matrix4.prototype.copyTo;
Matrix4.prototype['buildProjectionMatrixPerspectiveFovLH'] = Matrix4.prototype.buildProjectionMatrixPerspectiveFovLH;
Matrix4.prototype['buildCameraLookAtMatrixLH'] = Matrix4.prototype.buildCameraLookAtMatrixLH;
Matrix4.prototype['setRotationDegrees'] = Matrix4.prototype.setRotationDegrees;
Matrix4.prototype['setRotationRadians'] = Matrix4.prototype.setRotationRadians;
Matrix4.prototype['getRotationDegrees'] = Matrix4.prototype.getRotationDegrees;
Matrix4.prototype['setTranslation'] = Matrix4.prototype.setTranslation;
Matrix4.prototype['setScale'] = Matrix4.prototype.setScale;
Matrix4.prototype['setScaleXYZ'] = Matrix4.prototype.setScaleXYZ;
Matrix4.prototype['transformBoxEx'] = Matrix4.prototype.transformBoxEx;

Box3d.prototype['getCenter'] = Box3d.prototype.getCenter;
Box3d.prototype['getExtent'] = Box3d.prototype.getExtent;
Box3d.prototype['clone'] = Box3d.prototype.clone;
Box3d.prototype['intersectsWithLine'] = Box3d.prototype.intersectsWithLine;
Box3d.prototype['addInternalPoint'] = Box3d.prototype.addInternalPoint;
Box3d.prototype['addInternalPointByVector'] = Box3d.prototype.addInternalPointByVector;
Box3d.prototype['intersectsWithBox'] = Box3d.prototype.intersectsWithBox;
Box3d.prototype['getEdges'] = Box3d.prototype.getEdges;
Box3d.prototype['isPointInside'] = Box3d.prototype.isPointInside;

Line3d.prototype['getVector'] = Line3d.prototype.getVector;
Line3d.prototype['getLength'] = Line3d.prototype.getLength;

CL3D['TOLERANCE'] = CL3D.TOLERANCE;
CL3D['radToDeg'] = CL3D.radToDeg;
CL3D['degToRad'] = CL3D.degToRad;
CL3D['iszero'] = CL3D.iszero;
CL3D['isone'] = CL3D.isone;
CL3D['equals'] = CL3D.equals;
CL3D['clamp'] = CL3D.clamp;
CL3D['fract'] = CL3D.fract;
CL3D['max3'] = CL3D.max3;
CL3D['min3'] = CL3D.min3;
CL3D['getBlue'] = CL3D.getBlue;
CL3D['getGreen'] = CL3D.getGreen;
CL3D['getRed'] = CL3D.getRed;
CL3D['getAlpha'] = CL3D.getAlpha;
CL3D['createColor'] = CL3D.createColor;

Scene['REDRAW_WHEN_SCENE_CHANGED'] = Scene.REDRAW_WHEN_SCENE_CHANGED;
Scene['REDRAW_WHEN_CAM_MOVED'] = Scene.REDRAW_WHEN_CAM_MOVED;
Scene['REDRAW_EVERY_FRAME'] = Scene.REDRAW_EVERY_FRAME;
Scene['RENDER_MODE_SKYBOX'] = Scene.RENDER_MODE_SKYBOX;
Scene['RENDER_MODE_DEFAULT'] = Scene.RENDER_MODE_DEFAULT;
Scene['RENDER_MODE_LIGHTS'] = Scene.RENDER_MODE_LIGHTS;
Scene['RENDER_MODE_CAMERA'] = Scene.RENDER_MODE_CAMERA;
Scene['RENDER_MODE_TRANSPARENT'] = Scene.RENDER_MODE_TRANSPARENT;
Scene['RENDER_MODE_2DOVERLAY'] = Scene.RENDER_MODE_2DOVERLAY;

Scene.prototype['setRedrawMode'] = Scene.prototype.setRedrawMode;
Scene.prototype['setActiveCamera'] = Scene.prototype.setActiveCamera;
Scene.prototype['getActiveCamera'] = Scene.prototype.getActiveCamera;
Scene.prototype['forceRedrawNextFrame'] = Scene.prototype.forceRedrawNextFrame;
Scene.prototype['getStartTime'] = Scene.prototype.getStartTime;
Scene.prototype['registerNodeForRendering'] = Scene.prototype.registerNodeForRendering;
Scene.prototype['getAllSceneNodesOfType'] = Scene.prototype.getAllSceneNodesOfType;
Scene.prototype['getSceneNodeFromName'] = Scene.prototype.getSceneNodeFromName;
Scene.prototype['getSceneNodeFromId'] = Scene.prototype.getSceneNodeFromId;
Scene.prototype['getRootSceneNode'] = Scene.prototype.getRootSceneNode;
Scene.prototype['registerNodeForRendering'] = Scene.prototype.registerNodeForRendering;
Scene.prototype['getCurrentRenderMode'] = Scene.prototype.getCurrentRenderMode;
Scene.prototype['setBackgroundColor'] = Scene.prototype.setBackgroundColor;
Scene.prototype['getBackgroundColor'] = Scene.prototype.getBackgroundColor;
Scene.prototype['setName'] = Scene.prototype.setName;
Scene.prototype['getName'] = Scene.prototype.getName;
Scene.prototype['getCollisionGeometry'] = Scene.prototype.getCollisionGeometry;

SceneNode.prototype['getParent'] = SceneNode.prototype.getParent;
SceneNode.prototype['getAnimators'] = SceneNode.prototype.getAnimators;
SceneNode.prototype['getAnimatorOfType'] = SceneNode.prototype.getAnimatorOfType;
SceneNode.prototype['getTransformedBoundingBox'] = SceneNode.prototype.getTransformedBoundingBox;
SceneNode.prototype['addAnimator'] = SceneNode.prototype.addAnimator;
SceneNode.prototype['removeAnimator'] = SceneNode.prototype.removeAnimator;
SceneNode.prototype['addChild'] = SceneNode.prototype.addChild;
SceneNode.prototype['removeChild'] = SceneNode.prototype.removeChild;
SceneNode.prototype['getRelativeTransformation'] = SceneNode.prototype.getRelativeTransformation;
SceneNode.prototype['updateAbsolutePosition'] = SceneNode.prototype.updateAbsolutePosition;
SceneNode.prototype['getAbsolutePosition'] = SceneNode.prototype.getAbsolutePosition;
SceneNode.prototype['init'] = SceneNode.prototype.init;
SceneNode.prototype['getAbsoluteTransformation'] = SceneNode.prototype.getAbsoluteTransformation;

Animator.prototype['getType'] = Animator.prototype.getType;

AnimatorCameraFPS.prototype['getType'] = AnimatorCameraFPS.prototype.getType;
AnimatorCameraFPS.prototype['lookAt'] = AnimatorCameraFPS.prototype.lookAt;
AnimatorCameraFPS.prototype['animateNode'] = AnimatorCameraFPS.prototype.animateNode;

AnimatorCameraModelViewer.prototype['animateNode'] = AnimatorCameraModelViewer.prototype.animateNode;
AnimatorCameraModelViewer.prototype['getType'] = AnimatorCameraModelViewer.prototype.getType;

AnimatorFollowPath.prototype['animateNode'] = AnimatorFollowPath.prototype.animateNode;
AnimatorFollowPath.prototype['getType'] = AnimatorFollowPath.prototype.getType;
AnimatorFollowPath.prototype['setOptions'] = AnimatorFollowPath.prototype.setOptions;
AnimatorFollowPath.prototype['setPathToFollow'] = AnimatorFollowPath.prototype.setPathToFollow;
AnimatorFollowPath['EFPFEM_STOP'] = AnimatorFollowPath.EFPFEM_STOP;
AnimatorFollowPath['EFPFEM_START_AGAIN'] = AnimatorFollowPath.EFPFEM_START_AGAIN;

AnimatorOnClick.prototype['getType'] = AnimatorOnClick.prototype.getType;

AnimatorOnProximity.prototype['getType'] = AnimatorOnProximity.prototype.getType;

AnimatorCollisionResponse.prototype['getType'] = AnimatorCollisionResponse.prototype.getType;
AnimatorCollisionResponse.prototype['setWorld'] = AnimatorCollisionResponse.prototype.setWorld;
AnimatorCollisionResponse.prototype['getWorld'] = AnimatorCollisionResponse.prototype.getWorld;
AnimatorCollisionResponse.prototype['isFalling'] = AnimatorCollisionResponse.prototype.isFalling;
AnimatorCollisionResponse.prototype['setGravity'] = AnimatorCollisionResponse.prototype.setGravity;
AnimatorCollisionResponse.prototype['getGravity'] = AnimatorCollisionResponse.prototype.getGravity;

Material['EMT_SOLID'] = Material.EMT_SOLID;
Material['EMT_LIGHTMAP'] = Material.EMT_LIGHTMAP;
Material['EMT_TRANSPARENT_ADD_COLOR'] = Material.EMT_TRANSPARENT_ADD_COLOR;
Material['EMT_TRANSPARENT_ALPHA_CHANNEL'] = Material.EMT_TRANSPARENT_ALPHA_CHANNEL;

CopperLicht.prototype['getRenderer'] = CopperLicht.prototype.getRenderer;
CopperLicht.prototype['getScene'] = CopperLicht.prototype.getScene;
CopperLicht.prototype['load'] = CopperLicht.prototype.load;
CopperLicht.prototype['isLoading'] = CopperLicht.prototype.isLoading;
CopperLicht.prototype['draw3dScene'] = CopperLicht.prototype.draw3dScene;
CopperLicht.prototype['gotoScene'] = CopperLicht.prototype.gotoScene;
CopperLicht.prototype['getScenes'] = CopperLicht.prototype.getScenes;
CopperLicht.prototype['getMouseX'] = CopperLicht.prototype.getMouseX;
CopperLicht.prototype['getMouseY'] = CopperLicht.prototype.getMouseY;
CopperLicht.prototype['isMouseDown'] = CopperLicht.prototype.isMouseDown;
CopperLicht.prototype['getMouseDownX'] = CopperLicht.prototype.getMouseDownX;
CopperLicht.prototype['getMouseDownY'] = CopperLicht.prototype.getMouseDownY;
CopperLicht.prototype['initRenderer'] = CopperLicht.prototype.initRenderer;
CopperLicht.prototype['getTextureManager'] = CopperLicht.prototype.getTextureManager;
CopperLicht.prototype['get2DPositionFrom3DPosition'] = CopperLicht.prototype.get2DPositionFrom3DPosition;
CopperLicht.prototype['get3DPositionFrom2DPosition'] = CopperLicht.prototype.get3DPositionFrom2DPosition;
CopperLicht.prototype['addScene'] = CopperLicht.prototype.addScene;

CameraSceneNode.prototype['setAspectRatio'] = CameraSceneNode.prototype.setAspectRatio;
CameraSceneNode.prototype['getAspectRatio'] = CameraSceneNode.prototype.getAspectRatio;
CameraSceneNode.prototype['getFov'] = CameraSceneNode.prototype.getFov;
CameraSceneNode.prototype['setFov'] = CameraSceneNode.prototype.setFov;
CameraSceneNode.prototype['setTarget'] = CameraSceneNode.prototype.setTarget;
CameraSceneNode.prototype['getTarget'] = CameraSceneNode.prototype.getTarget;
CameraSceneNode.prototype['getUpVector'] = CameraSceneNode.prototype.getUpVector;
CameraSceneNode.prototype['setUpVector'] = CameraSceneNode.prototype.setUpVector;
CameraSceneNode.prototype['getNearValue'] = CameraSceneNode.prototype.getNearValue;
CameraSceneNode.prototype['setNearValue'] = CameraSceneNode.prototype.setNearValue;
CameraSceneNode.prototype['getFarValue'] = CameraSceneNode.prototype.getFarValue;
CameraSceneNode.prototype['setFarValue'] = CameraSceneNode.prototype.setFarValue;
CameraSceneNode.prototype['createClone'] = CameraSceneNode.prototype.createClone;

BillboardSceneNode.prototype['getBoundingBox'] = BillboardSceneNode.prototype.getBoundingBox;
BillboardSceneNode.prototype['getType'] = BillboardSceneNode.prototype.getType;
BillboardSceneNode.prototype['render'] = BillboardSceneNode.prototype.render;
BillboardSceneNode.prototype['getMaterialCount'] = BillboardSceneNode.prototype.getMaterialCount;
BillboardSceneNode.prototype['getMaterial'] = BillboardSceneNode.prototype.getMaterial;
BillboardSceneNode.prototype['createClone'] = BillboardSceneNode.prototype.createClone;
BillboardSceneNode.prototype['setSize'] = BillboardSceneNode.prototype.setSize;
BillboardSceneNode.prototype['getSize'] = BillboardSceneNode.prototype.getSize;

SkyBoxSceneNode.prototype['createClone'] = SkyBoxSceneNode.prototype.createClone;
SkyBoxSceneNode.prototype['getType'] = SkyBoxSceneNode.prototype.getType;

Overlay2DSceneNode.prototype['createClone'] = Overlay2DSceneNode.prototype.createClone;
Overlay2DSceneNode.prototype['getType'] = Overlay2DSceneNode.prototype.getType;
Overlay2DSceneNode.prototype['setShowImage'] = Overlay2DSceneNode.prototype.setShowImage;
Overlay2DSceneNode.prototype['setShowBackgroundColor'] = Overlay2DSceneNode.prototype.setShowBackgroundColor;
Overlay2DSceneNode.prototype['set2DPosition'] = Overlay2DSceneNode.prototype.set2DPosition;
Overlay2DSceneNode.prototype['setText'] = Overlay2DSceneNode.prototype.setText;

AnimatedMeshSceneNode.prototype['getBoundingBox'] = AnimatedMeshSceneNode.prototype.getBoundingBox;
AnimatedMeshSceneNode.prototype['getType'] = AnimatedMeshSceneNode.prototype.getType;
AnimatedMeshSceneNode.prototype['createClone'] = AnimatedMeshSceneNode.prototype.createClone;
AnimatedMeshSceneNode.prototype['setAnimationSpeed'] = AnimatedMeshSceneNode.prototype.setAnimationSpeed;
AnimatedMeshSceneNode.prototype['setLoopMode'] = AnimatedMeshSceneNode.prototype.setLoopMode;
AnimatedMeshSceneNode.prototype['setFrameLoop'] = AnimatedMeshSceneNode.prototype.setFrameLoop;
AnimatedMeshSceneNode.prototype['setCurrentFrame'] = AnimatedMeshSceneNode.prototype.setCurrentFrame;
AnimatedMeshSceneNode.prototype['getFrameNr'] = AnimatedMeshSceneNode.prototype.getFrameNr;
AnimatedMeshSceneNode.prototype['setMinimalUpdateDelay'] = AnimatedMeshSceneNode.prototype.setMinimalUpdateDelay;
AnimatedMeshSceneNode.prototype['getNamedAnimationCount'] = AnimatedMeshSceneNode.prototype.getNamedAnimationCount;
AnimatedMeshSceneNode.prototype['getNamedAnimationInfo'] = AnimatedMeshSceneNode.prototype.getNamedAnimationInfo;
AnimatedMeshSceneNode.prototype['setAnimation'] = AnimatedMeshSceneNode.prototype.setAnimation;

PathSceneNode.prototype['getBoundingBox'] = PathSceneNode.prototype.getBoundingBox;
PathSceneNode.prototype['getType'] = PathSceneNode.prototype.getType;
PathSceneNode.prototype['createClone'] = PathSceneNode.prototype.createClone;
PathSceneNode.prototype['getPathNodePosition'] = PathSceneNode.prototype.getPathNodePosition;
PathSceneNode.prototype['getPointOnPath'] = PathSceneNode.prototype.getPointOnPath;

MeshSceneNode.prototype['getMesh'] = MeshSceneNode.prototype.getMesh;
MeshSceneNode.prototype['getMaterialCount'] = MeshSceneNode.prototype.getMaterialCount;
MeshSceneNode.prototype['getMaterial'] = MeshSceneNode.prototype.getMaterial;
MeshSceneNode.prototype['createClone'] = MeshSceneNode.prototype.createClone;
MeshSceneNode.prototype['setMesh'] = MeshSceneNode.prototype.setMesh;
MeshSceneNode.prototype['getBoundingBox'] = MeshSceneNode.prototype.getBoundingBox;

Plane3d['ISREL3D_FRONT'] = Plane3d.ISREL3D_FRONT;
Plane3d['ISREL3D_BACK'] = Plane3d.ISREL3D_BACK;
Plane3d['ISREL3D_PLANAR'] = Plane3d.ISREL3D_PLANAR;
Plane3d.prototype['clone'] = Plane3d.prototype.clone;
Plane3d.prototype['recalculateD'] = Plane3d.prototype.recalculateD;
Plane3d.prototype['getMemberPoint'] = Plane3d.prototype.getMemberPoint;
Plane3d.prototype['setPlane'] = Plane3d.prototype.setPlane;
Plane3d.prototype['setPlaneFrom3Points'] = Plane3d.prototype.setPlaneFrom3Points;
Plane3d.prototype['normalize'] = Plane3d.prototype.normalize;
Plane3d.prototype['classifyPointRelation'] = Plane3d.prototype.classifyPointRelation;
Plane3d.prototype['getIntersectionWithPlanes'] = Plane3d.prototype.getIntersectionWithPlanes;
Plane3d.prototype['getIntersectionWithPlane'] = Plane3d.prototype.getIntersectionWithPlane;
Plane3d.prototype['getIntersectionWithLine'] = Plane3d.prototype.getIntersectionWithLine;
Plane3d.prototype['getDistanceTo'] = Plane3d.prototype.getDistanceTo;
Plane3d.prototype['isFrontFacing'] = Plane3d.prototype.isFrontFacing;

Mesh.prototype['AddMeshBuffer'] = Mesh.prototype.AddMeshBuffer;
Mesh.prototype['GetMeshBuffers'] = Mesh.prototype.GetMeshBuffers;
Mesh.prototype['GetPolyCount'] = Mesh.prototype.GetPolyCount;

MeshBuffer.prototype['update'] = MeshBuffer.prototype.update;
MeshBuffer.prototype['recalculateBoundingBox'] = MeshBuffer.prototype.recalculateBoundingBox;

Renderer.prototype['getWidth'] = Renderer.prototype.getWidth; 
Renderer.prototype['getWebGL'] = Renderer.prototype.getWebGL; 
Renderer.prototype['getHeight'] = Renderer.prototype.getHeight; 
Renderer.prototype['drawMesh'] = Renderer.prototype.drawMesh; 
Renderer.prototype['setMaterial'] = Renderer.prototype.setMaterial; 
Renderer.prototype['drawMeshBuffer'] = Renderer.prototype.drawMeshBuffer; 
Renderer.prototype['beginScene'] = Renderer.prototype.beginScene; 
Renderer.prototype['endScene'] = Renderer.prototype.endScene; 
Renderer.prototype['clearDynamicLights'] = Renderer.prototype.clearDynamicLights; 
Renderer.prototype['setProjection'] = Renderer.prototype.setProjection; 
Renderer.prototype['getProjection'] = Renderer.prototype.getProjection; 
Renderer.prototype['setView'] = Renderer.prototype.setView; 
Renderer.prototype['getView'] = Renderer.prototype.getView; 
Renderer.prototype['getWorld'] = Renderer.prototype.getWorld; 
Renderer.prototype['setWorld'] = Renderer.prototype.setWorld; 
Renderer.prototype['createMaterialType'] = Renderer.prototype.createMaterialType; 
Renderer.prototype['getGLProgramFromMaterialType'] = Renderer.prototype.getGLProgramFromMaterialType; 
Renderer.prototype['draw2DRectangle'] = Renderer.prototype.draw2DRectangle; 
Renderer.prototype['draw2DImage'] = Renderer.prototype.draw2DImage; 
Renderer.prototype['deleteTexture'] = Renderer.prototype.deleteTexture; 
Renderer.prototype['createTextureFrom2DCanvas'] = Renderer.prototype.createTextureFrom2DCanvas;

TextureManager.prototype['getTexture'] = TextureManager.prototype.getTexture; 
TextureManager.prototype['getTextureCount'] = TextureManager.prototype.getTextureCount; 
TextureManager.prototype['getCountOfTexturesToLoad'] = TextureManager.prototype.getCountOfTexturesToLoad; 

Texture.prototype['getWidth'] = Texture.prototype.getWidth; 
Texture.prototype['getHeight'] = Texture.prototype.getHeight; 
Texture.prototype['getURL'] = Texture.prototype.getURL; 
Texture.prototype['isLoaded'] = Texture.prototype.isLoaded; 
Texture.prototype['getWebGLTexture'] = Texture.prototype.getWebGLTexture; 
Texture.prototype['getImage'] = Texture.prototype.getImage; 

TriangleSelector.prototype['getAllTriangles'] = TriangleSelector.prototype.getAllTriangles; 
TriangleSelector.prototype['getTrianglesInBox'] = TriangleSelector.prototype.getTrianglesInBox; 
TriangleSelector.prototype['getCollisionPointWithLine'] = TriangleSelector.prototype.getCollisionPointWithLine; 
MeshTriangleSelector.prototype['getAllTriangles'] = MeshTriangleSelector.prototype.getAllTriangles; 
MeshTriangleSelector.prototype['getTrianglesInBox'] = MeshTriangleSelector.prototype.getTrianglesInBox; 
MetaTriangleSelector.prototype['getAllTriangles'] = MetaTriangleSelector.prototype.getAllTriangles; 
MetaTriangleSelector.prototype['getTrianglesInBox'] = MetaTriangleSelector.prototype.getTrianglesInBox; 
OctTreeTriangleSelector.prototype['getAllTriangles'] = OctTreeTriangleSelector.prototype.getAllTriangles; 
OctTreeTriangleSelector.prototype['getTrianglesInBox'] = OctTreeTriangleSelector.prototype.getTrianglesInBox; 

} // end with
*/
