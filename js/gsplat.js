// import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@latest";
import * as SPLAT from "./gsplat_j4u/index.js";

const canvas = document.getElementById("gsplatCanvas");
const progressDialog = document.getElementById("progress-dialog");
const progressIndicator = document.getElementById("progress-indicator");

window.renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
window.controls = new SPLAT.OrbitControls(camera, canvas);
// console.log(controls);


// resetZoom: (defaultRadius = 5) => {
//   desiredRadius = defaultRadius;
//   // Optionally, reset other related variables here if needed
// }
// function resetAR() {
//   controls.desiredAlpha = 0.5;
//   controls.desiredBeta = 0.5;
//   controls.desiredradius = 5;
// }

// class OrbitControls {
//   resetToDefault() {
//       this.desiredAlpha = 0.5;
//       this.desiredBeta = 0.5;
//       this.desiredRadius = 5;
//       // Reset other properties as needed
//   }
// }


// Put below in variables.js
controls.minAngle = 10;
controls.maxAngle = 50;
controls.minZoom = 4;
controls.maxZoom = 20;
// console.log(controls);

let viewContainer = document.querySelector("#viewspacecontainer");

async function loadGsplat() {
  // const query = new URLSearchParams(window.location.search);
  // const model = query.get("id") ?? "jewel7_lr";
  if (sessionStorage.getItem("selectedJewel") == null ){
    sessionStorage.setItem("selectedJewel", "jewel7_lr");
  }
  const model = sessionStorage.getItem("selectedJewel");
  // if Vr is enabled
  if (!isVideo) {
    viewContainer.style.background = jewelsList[model].lightBackground || defaultLightBg;
  }

  const url =
    "https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/" +
    model +
    "/" +
    model +
    ".splat";

  // const object = await fetch("https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/"+model+"/"+model+".json")
  // const objectMatrix = await object.json()
  // viewMatrix = objectMatrix.defualt_view_matrix

  scene.reset();

  const splat = await SPLAT.Loader.LoadAsync(
    url,
    scene,
    // (progress) => (progressIndicator.value = progress * 100)
    (progress) => {
      updateLoadingProgress(progress * 100);
    }
  );
  // progressDialog.close();

  // scene.removeObject(splat);
  // scene.addObject(splat);

  // const handleResize = () => {
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // };

  const handleResize = () => {
    // let canvasWidth = window.innerWidth;
    // let canvasHeight = window.innerHeight;
    // if(isVideo){
    //   if (window.innerWidth < 440) {
    //     // Define fixed dimensions for the canvas here
    //     // These dimensions could be based on the initial load or a preferred fixed size
    //     // Example: fixed size for portrait orientation
    //     canvasWidth = 440*2; // Set this based on your requirements
    //     canvasHeight = 760; // Adjust height accordingly
        
    //   }
    // }
    //   // Remove any applied styles when not in fixed size mode
    // // Set the canvas size
    // outputCanvasElement.width = canvasWidth;
    // outputCanvasElement.height = canvasHeight;
  
    // Update WebGL renderer size
    if(isVideo){
      renderer.setSize(window.innerWidth*2, window.innerHeight);
    }
  }

  //new code
  // const handleResize = () => {
  //   let canvasWidth = window.innerWidth;
  //   let canvasHeight = window.innerHeight;
  
  //   // Adjust the canvas size
  //   outputCanvasElement.width = canvasWidth;
  //   outputCanvasElement.height = canvasHeight;
  //   canvas.width = canvasWidth;
  //   canvas.height = canvasHeight;
  
  //   // Recalculate and adjust aspect ratio
  //   const aspectRatio = canvasWidth / canvasHeight;
  
  //   // Depending on your AR rendering logic, adjust the bangle rendering here
  //   // This might involve recalculating positions, scales, etc., based on the new aspect ratio
  //   // Ensure the full bangle is visible and properly oriented

  //   // If using WebGL or similar for rendering, you might need to adjust the camera or viewport
  //   renderer.setSize(canvasWidth, canvasHeight);
  //   // Additionally, adjust the camera aspect ratio if your rendering relies on it
  //   // camera.aspect = aspectRatio;
  //   // camera.updateProjectionMatrix();
  
  //   // Redraw or update the scene with the new dimensions and aspect ratio
  // };
  
  // baseTheta = 0.25;
  rawBaseTheta = baseTheta;
  // basePhi = 2.5;
  // baseGama = -0.05;

  // splat.applyPosition();
  // splat.applyRotation();
  // splat.applyScale();

  // // update projection matrix for our case
  // camera._data._updateProjectionMatrix = () => {
  //   // prettier-ignore
  //   camera._data._projectionMatrix = new SPLAT.Matrix4(
  //       2 * camera._data.fx / camera._data.width, 0, 0, 0,
  //       0, -2 * camera._data.fy / camera._data.height, 0, 0,
  //       0, 0, 0.1*((camera._data.far * camera._data.near) / (camera._data.far - camera._data.near)), 0,
  //       0, 0, 0.5*(camera._data.far + camera._data.near) / (camera._data.far - camera._data.near), 1
  //   );

  //   camera._data._viewProj = camera._data.projectionMatrix.multiply(camera._data.viewMatrix);
  // };

  var autorotateAngle = 0;
  // const autoRotatePhiMin = -1, autoRotatePhiMax = 3;

  const frame = () => {

    // Autorotate in VR Showcase
    autorotateAngle = (autorotate) ? autorotateAngle + autorotateSpeed : 0;
    // autorotateSpeed = Math.min(Math.max(autorotateSpeed, autoRotatePhiMin), autoRotatePhiMax);

    // adding radians of x-rotation, y-rotation, z-rotation
    const rotation = new SPLAT.Vector3(
      baseTheta + XRDelta,
      basePhi + YRDelta + autorotateAngle,
      baseGama
    );
    splat.rotation = SPLAT.Quaternion.FromEuler(rotation);

    // adding units of translation in x,y,z, direction

    // const translation = new SPLAT.Vector3(XTrans / 200, YTrans / 200, 0);
    // splat.position = translation;

    // scaleFactor to be applied inn all directions
    const scaling = new SPLAT.Vector3(scaleMul, scaleMul, scaleMul);
    splat.scale = scaling;
    // To cut the back part of jewel
    camera._data._near = cameraNear;
    camera._data._far = cameraFar;
    
    camera._data._updateProjectionMatrix();
    // console.log((camera._data.far * camera._data.near) / (camera._data.far - camera._data.near));

    if(!isVideo){
      controls.update();
    }
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  };
  
  handleResize();
  window.addEventListener("resize", handleResize);
  window.addEventListener('orientationchange', handleResize);

  requestAnimationFrame(frame);
}

renderer.setSize(window.innerWidth, window.innerHeight);
function handleClick() {
  camera.position = new SPLAT.Vector3(2.1036774620197414, -2.397127693021015, -3.8507557646703496);
  //  { x: -0.2397127693021015, y: -0.2397127693021015, z: -0.06120871905481365, w: 0.9387912809451863 }
  camera.rotation = new SPLAT.Quaternion(-0.2397127693021015, -0.2397127693021015, -0.06120871905481365, 0.9387912809451863);
}

// _position
// : 
// A {x: 2.1036774620197414, y: -2.397127693021015, z: -3.8507557646703496}
// _rotation
// : 
// Q {x: -0.2397127693021015, y: -0.2397127693021015, z: -0.06120871905481365, w: 0.9387912809451863}

window.THREE.Cache.clear();
checkDevice();
loadGsplat();
resetMeshForVR();
window.addEventListener('click', handleClick)

window.loadGsplat = loadGsplat;
