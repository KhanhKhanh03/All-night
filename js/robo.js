// const logo = document.querySelector(".header .right-buttons .logo img");
// const chatArea = document.getElementById("chat-area");
// const roboContainer = document.getElementById("robo-container");

// // Thêm sự kiện click cho logo
// if (logo) {
//   logo.addEventListener("click", () => {
//     if (chatArea.style.display !== "none") {
//       chatArea.style.display = "none";
//       roboContainer.style.display = "block";
//     } else {
//       chatArea.style.display = "block";
//       roboContainer.style.display = "none";
//     }
//     console.log("Toggled 3D model, chat-area display:", chatArea.style.display);
//   });
// } else {
//   console.error("Logo not found");
// }

// // Cập nhật kích thước renderer khi cửa sổ thay đổi
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// const scene = new THREE.Scene();
// scene.background = null;

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.getElementById("robo-container").appendChild(renderer.domElement);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(0, 1, 1);
// scene.add(directionalLight);

// const loader = new THREE.GLTFLoader();
// let model = null;

// loader.load(
//   "3d/TechieBot.glb",
//   (gltf) => {
//     model = gltf.scene;
//     scene.add(model);
//     model.position.set(0, 1, 0); // Điều chỉnh vị trí
//     model.scale.set(2.5, 2.5, 2.5);
//     animate(); // Bắt đầu animation sau khi tải mô hình
//   },
//   (xhr) => {
//     console.log((xhr.loaded / xhr.total) * 100 + "% đã tải");
//   },
//   (error) => {
//     console.error("Lỗi khi tải mô hình:", error);
//   }
// );

// camera.position.z = 5;

// // Animation và âm thanh
// let rotationSpeed = 0;
// const speechSynthesis = window.speechSynthesis;

// function speakText(text) {
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = "vi-VN"; // Sử dụng tiếng Việt
//   utterance.volume = 1; // Âm lượng (0 đến 1)
//   utterance.rate = 1; // Tốc độ nói
//   utterance.pitch = 1; // Cao độ
//   speechSynthesis.speak(utterance);
//   startTalkingAnimation(); // Kích hoạt animation khi nói
// }

// function startTalkingAnimation() {
//   if (model) {
//     rotationSpeed = 0.05; // Bắt đầu xoay
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);
//   if (model) {
//     model.rotation.y += rotationSpeed; // Xoay nhẹ khi nói
//     if (rotationSpeed > 0) rotationSpeed *= 0.95; // Giảm tốc độ xoay dần
//   }
//   renderer.render(scene, camera);
// }

// // Xử lý thay đổi kích thước cửa sổ
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Xuất hàm speakText để sử dụng ở file khác
// window.speakText = speakText;

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
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("robo-container").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

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

camera.position.z = 5;

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
