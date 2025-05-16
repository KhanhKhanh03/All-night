// Thiết lập Three.js
const scene = new THREE.Scene();
// Xóa nền của scene
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Bật alpha để hỗ trợ độ trong suốt
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Đặt kích thước renderer và thêm vào container-robo
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("robo-container").appendChild(renderer.domElement);

// Thêm ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Tải mô hình 3D
const loader = new THREE.GLTFLoader();
loader.load(
  // Sử dụng mô hình TechieBot.glb
  "3d/TechieBot.glb",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    // Điều chỉnh vị trí/tỷ lệ mô hình
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% đã tải");
  },
  (error) => {
    console.error("Lỗi khi tải mô hình:", error);
  }
);

// Đặt vị trí camera
camera.position.z = 5;

// Vòng lặp animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Xử lý thay đổi kích thước cửa sổ
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
