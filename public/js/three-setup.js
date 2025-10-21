// three-setup.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
// GLTFLoader hanya tersedia di versi Three.js yang lama di CDN, 
// jadi kita panggil secara terpisah
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Pastikan GLTFLoader sudah dimuat dari index.html

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('webgl-container').appendChild(renderer.domElement);

let chipModel;

// Pencahayaan
const ambientLight = new THREE.AmbientLight(0x404040, 5); // Cahaya lembut
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(ambientLight, directionalLight);

// Background (Opsional: Nebula/Starry Field)
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.1, sizeAttenuation: true });
const starVertices = [];

for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Memuat Model Chip (Placeholder)
const loader = new THREE.GLTFLoader();
loader.load(
    'assets/models/chip_placeholder.gltf', // Ganti dengan path model 3D Anda
    function (gltf) {
        chipModel = gltf.scene;
        // Posisikan dan skalakan
        chipModel.position.set(0, 0, 0); 
        chipModel.scale.set(1, 1, 1); // Sesuaikan skala
        
        // Atur material untuk efek futuristik (misalnya, warna biru neon/metalik)
        chipModel.traverse((o) => {
            if (o.isMesh) {
                o.material = new THREE.MeshPhongMaterial({
                    color: 0x0055ff, 
                    specular: 0x00ffff, 
                    shininess: 100
                });
            }
        });
        
        scene.add(chipModel);
    },
    (xhr) => {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('An error happened loading the model:', error);
        // Jika gagal, buat kubus placeholder
        chipModel = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
        );
        scene.add(chipModel);
    }
);

camera.position.z = 3;

// Logika Animasi
function animate() {
    requestAnimationFrame(animate);

    if (chipModel) {
        // Animasi Putaran Berdasarkan Scroll
        // Gunakan variabel global window.scrollProgress dari main.js
        const rotationSpeed = 0.01; // Kecepatan putaran dasar
        const scrollFactor = window.scrollProgress || 0; // 0 sampai 1

        // Chip berputar pelan secara independen
        chipModel.rotation.y += rotationSpeed * 0.5; 
        chipModel.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;

        // Perubahan posisi Z (zoom in/out) berdasarkan scrollProgress
        // Dari Z=3 ke Z=0 selama fase deskripsi
        const targetZ = 3 - (scrollFactor * 3); 
        chipModel.position.z = targetZ;
        
        // Putaran Y tambahan berdasarkan scroll (dari 0 hingga 4*PI)
        chipModel.rotation.y += scrollFactor * Math.PI * 0.05; 
    }
    
    // Putar bintang di latar belakang
    stars.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

animate();

// Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
