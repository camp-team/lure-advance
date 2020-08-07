import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as trackballControls from 'three-trackballcontrols';

@Component({
  selector: 'app-stl-viewer',
  templateUrl: './stl-viewer.component.html',
  styleUrls: ['./stl-viewer.component.scss'],
})
export class StlViewerComponent implements OnInit, AfterViewInit {
  constructor() {}

  @Input() stlUrl: string;
  @Output() onLoadCompleted: EventEmitter<boolean> = new EventEmitter();

  containerClassName: string = 'container-viewer';
  private scene: THREE.Scene;
  private container: HTMLElement;

  ngOnInit(): void {
    this.container = document.getElementById(this.containerClassName);
    this.start(this.stlUrl);
    console.log(this.stlUrl);
  }

  ngAfterViewInit(): void {
    this.scene?.dispose();
  }

  createRender(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    return () => renderer.render(scene, camera);
  }

  createAnimate(callback) {
    function animate() {
      requestAnimationFrame(animate);
      callback();
    }
    return animate;
  }

  async start(url: string) {
    if (url === undefined) {
      return;
    }

    if (!this.container.clientWidth) return;
    if (!this.container.clientHeight) return;

    const canvasWidth: number = this.container.clientWidth;
    const canvasHeight: number = this.container.clientHeight;
    this.scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      canvasWidth / canvasHeight,
      1,
      1000
    );

    const topLight = new THREE.DirectionalLight(0x999999);
    this.scene.add(topLight);
    const headLight = new THREE.DirectionalLight(0x666666);
    this.scene.add(headLight);
    this.scene.add(new THREE.AmbientLight(0x333333));

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(canvasWidth, canvasHeight);

    const loader: STLLoader = new STLLoader();

    loader.load(url, (geometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
      });
      material.shininess = 30;

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(0, 0, 0);

      mesh.geometry.computeBoundingSphere();
      if (mesh.geometry.boundingSphere) {
        const sphere = mesh.geometry.boundingSphere;
        mesh.position.set(
          sphere.center.x * mesh.scale.x * -1,
          sphere.center.y * mesh.scale.y * -1,
          sphere.center.z * mesh.scale.z * -1
        );

        camera.position.set(0, 0, sphere.radius * mesh.scale.z * 3);
      }

      this.scene.add(mesh);

      this.container.appendChild(renderer.domElement);
      if (this.container.children.length > 1) {
        this.container.firstChild.remove();
      }
      const controls = new trackballControls(camera, renderer.domElement);
      this.onLoadCompleted.emit(true);
      const render = this.createRender(renderer, this.scene, camera);
      const animate = this.createAnimate(() => {
        controls.update();
        topLight.position.copy(camera.up);
        headLight.position.copy(camera.position);
      });
      controls.addEventListener('change', render);
      animate();
      render();
    });
  }

  clear() {
    this.scene.dispose();
  }
}
