//Import the Three.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three JS Scene
const scene = new THREE.Scene();
//Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep 3D object on gloabal variable for later access
let object;

//OrbitControls, camera movement
let controls

//Set which object to render
let objToRender = 'phone';


//Instantiate .gltf loader
const loader = new GLTFLoader();

//Load file
loader.load(
    `asessts/models/${objToRender}.glb`,
    function (gltf) {
        //If file is loaded, add it to scene
        object = gltf.scene;
        scene.add(object);
    },
    function (xhr) {
        //While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        //If there is an error, log it
        console.error(error);
    }
)

//Instantiate new renderer and set size
const renderer = new THREE.WebGLRenderer({alpha: true}); //Alpha true allows for transparent background
renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set z pos of camera
camera.position.z = objToRender === "phone" ? 2 : 500;

//Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1); //(color, intensity)
topLight.position.set(500, 500, 500) //Top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "phone" ? 5 : 1);
scene.add(ambientLight);

//Render the scene
function animate() {
    requestAnimationFrame(animate);
    //Here could go code for automatic movement

    //Make phone track mouse
    if (object && objToRender === "phone") {
        //Can adjust constants
        object.rotation.y = -3 + mouseX / window.innerWidth * 3;
        object.rotation.x = -1.2 + mouseY / window.innerHeight;
    }
    renderer.render(scene, camera);
}

//Add listerner for window resize
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Add mouse position listner
document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

//Start the 3D rendering
animate();