import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export function modelToImage(modelUrl) {
  return new Promise((resolve) => {
    let camera, scene, renderer;
    init();
    render();

    function init() {
      const container = document.createElement('div');
      document.body.appendChild(container);

      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
      camera.position.set(-200, 100, 400);

      const environment = new RoomEnvironment();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      scene = new THREE.Scene();
      const axesHelper = new THREE.AxesHelper(100);
      scene.add(axesHelper);
      scene.background = new THREE.Color(0xE8E8E8);
      scene.environment = pmremGenerator.fromScene(environment).texture;
      // environment.dispose();

      const grid = new THREE.GridHelper(500, 10, 0xffffff, 0xffffff);
      grid.material.opacity = 0.09;
      grid.material.depthWrite = false;
      grid.material.transparent = true;
      scene.add(grid);

      const ktx2Loader = new KTX2Loader()
        .setTranscoderPath('js/libs/basis/')
        .detectSupport(renderer);

      // const loader = new GLTFLoader().setPath('pub/glbmodels/');
      const loader = new GLTFLoader()
      loader.setKTX2Loader(ktx2Loader);
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(modelUrl, function (gltf) {
        // loader.load('pub/glbmodels/pot.glb', function (gltf) {
        // loader.load( 'MockUpBackground_Circle_2022-10-06.gltf', function ( gltf ) {

        let mesh = gltf.scene
        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(mesh);

        let vector = new THREE.Vector3();
        let height = boundingBox.getSize(vector).y;
        let width = boundingBox.getSize(vector).x / 2;
        let length = boundingBox.getSize(vector).z / 2;
        
        let maxDimension
        if ((height > width) && (height > length)) {
          maxDimension = height
        } else if (width > length) {
          maxDimension = width
        } else {
          maxDimension = length
        }

        let requiredMaxDimension = 200
        let requiredScale = requiredMaxDimension / maxDimension

        mesh.scale.setScalar(requiredScale)

        let boundingBox2 = new THREE.Box3();
        boundingBox2.setFromObject(mesh);

        let centeredObject = moveObjectToCenter(mesh, true)
        centeredObject.position.y = 8;
        scene.add(centeredObject);
        render();

        const link = document.createElement('a');
        link.download = 'Model.png';
        link.href = renderer.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        container.innerHTML = ""
        resolve(link.href)
        link.click();
        return link.href
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', render); // use if there is no animation loop
      controls.minDistance = 400;
      controls.maxDistance = 1000;
      controls.target.set(10, 90, - 16);
      controls.update();
      window.addEventListener('resize', onWindowResize);
    }
    function moveObjectToCenter(inObject, YBottomBool = false) {
      //DESCRIPTION : it will take model and if object position is not center then it will make object in center 

      // Create object parent
      let parent = new THREE.Object3D()
      parent.add(inObject)

      // Getting bounding box from scene object
      let box = new THREE.Box3()
      box.setFromObject(inObject)

      // Getting bounding box center
      let center = new THREE.Vector3()
      box.getCenter(center)

      // Reverse center to get translation vector for object to move center
      center.negate()

      inObject.position.copy(center)

      if (YBottomBool) {
        // Getting bounding box from parent object
        let box2 = new THREE.Box3()
        box2.setFromObject(parent)

        let minY = box2.min.y
        let translateY = -minY
        inObject.translateY(translateY)
      }
      return parent
    }
    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      render();

    }

    function render() {
      renderer.render(scene, camera);
    }
  })
}

