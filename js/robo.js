// Khai báo biến toàn cục (được định nghĩa từ chatbox.js)
let isChatMode = true;
let isListening = false; // Sẽ được cập nhật từ chatbox.js

// Cập nhật kích thước renderer khi cửa sổ thay đổi
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
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
let model = null;
let mixer = null;
let greetingAction = null;
let idleAction = null;

loader.load(
  "3d/TechieBotHi.glb",
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, 1, 0);
    model.scale.set(2.5, 2.5, 2.5);

    mixer = new THREE.AnimationMixer(model);

    // Debug và gán animation
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      console.log("Available animation:", clip.name); // Log để kiểm tra tên
      if (clip.name.toLowerCase().includes("armatureaction")) {
        // Khớp với tên từ glTF Viewer
        greetingAction = action;
      } else if (clip.name.toLowerCase().includes("idle")) {
        idleAction = action;
      }
    });

    if (greetingAction) {
      console.log("Greeting animation loaded successfully:", greetingAction);
    } else {
      console.warn("No greeting animation found. Check animation name.");
    }

    if (idleAction) idleAction.play();
    else if (greetingAction) greetingAction.play(); // Phát greeting nếu không có idle

    animate();
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
  if (mixer) mixer.update(0.016); // Cập nhật animation
  renderer.render(scene, camera);
}
// Hàm phát animation chào
window.playRobotGreeting = function () {
  if (greetingAction) {
    console.log("Playing greeting animation");
    if (idleAction) idleAction.stop();
    greetingAction.reset().play(); // Phát animation chào
    setTimeout(() => {
      if (idleAction && !isListening) idleAction.play(); // Quay lại idle
    }, 2000); // Điều chỉnh thời gian dựa trên độ dài animation (2 giây mặc định)
  } else {
    console.warn("Greeting action not available");
  }
};

// Hàm dừng animation
window.stopRobotAnimation = function () {
  if (greetingAction) greetingAction.stop();
  if (idleAction) idleAction.stop();
};

// Hàm tiếp tục animation
window.playRobotAnimation = function () {
  if (idleAction && !isListening) {
    idleAction.play();
  }
};

// Xuất hàm speakText
window.speakText = function (text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
};
