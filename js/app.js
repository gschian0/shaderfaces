import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import fragment2 from "./shader/fragment2.glsl";
import fragment3 from "./shader/fragment3.glsl";
import vertex from "./shader/vertex.glsl";
import twirl from "./twirl_01.png";
import dat from "../node_modules/three/examples/jsm/libs/dat.gui.module";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";

export default class Sketch {
  constructor(options) {
    this.loader = new THREE.TextureLoader();
    this.twirl = this.loader.load(twirl);
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffc0cb, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 20);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  settings() {
    let that = this; //eslint-disable-line
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this; //eslint-disable-line
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.material2 = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment2,
    });

    this.material3 = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment3,
    });

    this.geometry = new THREE.BoxBufferGeometry(10, 10, 10, 10, 10, 10);

    this.materialFaces = [
      this.material, //right
      this.material, // opposite
      this.material2, //top
      this.material2, // bottom
      this.material3, // front
      this.material3, // left
    ];

    this.plane = new THREE.Mesh(this.geometry, this.materialFaces);
    this.scene.add(this.plane);

    // create buffer style
    this.bufferGeo = new THREE.BufferGeometry();
    // this.bufferGeo.copy(this.geometry);

    const count = 500;

    const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

    for (
      let i = 0;
      i < count * 3;
      i++ // Multiply by 3 for same reason
    ) {
      positions[i] = (Math.random() - 0.5) * 30; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    }

    this.bufferGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

    this.bufferMat = new THREE.PointsMaterial({
      // color: "green",
      map: this.twirl,
    });
    this.bufferMat.transparent = true;
    this.bufferMat.alphaMap = this.twirl;
    this.bufferMat.alphaTest = 0.001;
    //this.bufferMat.depthTest = false;
    this.bufferPoints = new THREE.Points(this.bufferGeo, this.bufferMat);
    this.scene.add(this.bufferPoints);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time = this.clock.getElapsedTime();
    this.plane.rotation.y = this.time;
    this.plane.rotation.x = -this.time;
    this.plane.rotation.z = this.time * 0.5;
    this.material.uniforms.time.value = this.time;
    this.material2.uniforms.time.value = this.time;
    this.material3.uniforms.time.value = this.time;
    this.bufferPoints.rotation.y = this.time * 0.25;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});
