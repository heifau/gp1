// cd /D C:\Users\heinz\OneDrive\Dokumente\GitHub\gp1\docs
// cd C:/Users/heinz/OneDrive/Dokumente/GitHub/gp1/docs
// node static

// import * as THREE from "three"
// erfordert type module, erfordert http
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
const scale = 40;
const camera = new THREE.OrthographicCamera(
    -window.innerWidth / scale, window.innerWidth / scale, window.innerHeight / scale, -window.innerHeight / scale, 1, 10);
camera.position.set(0, 0, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var geometry, material, points, line;


// ein Würfel

geometry = new THREE.BoxGeometry(1, 1, 1);
material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

geometry = new THREE.PlaneBufferGeometry(4, 3, 1, 1);
// material = new THREE.MeshBasicMaterial({ color: 0x089080 });

material = new THREE.RawShaderMaterial({

    uniforms: {
        time: { value: Math.random() }
    },
    
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    side: THREE.DoubleSide,
    transparent: true

});


const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

//create lines
material = new THREE.LineBasicMaterial({ color: 0xff0000 });
points = [];
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(10, 0, 0));
geometry = new THREE.BufferGeometry().setFromPoints(points);
line = new THREE.Line(geometry, material);
scene.add(line);
material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
points = [];
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
geometry = new THREE.BufferGeometry().setFromPoints(points);
line = new THREE.Line(geometry, material);
scene.add(line);
material = new THREE.LineBasicMaterial({ color: 0x0000ff });
points = [];
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(0, 0, 10));
geometry = new THREE.BufferGeometry().setFromPoints(points);
line = new THREE.Line(geometry, material);
scene.add(line);

// 
const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.00;
    cube.rotation.y += 0.00;
    cube.rotation.z += 0.00;

    renderer.render(scene, camera);
};

animate();
