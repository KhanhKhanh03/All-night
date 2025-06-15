class VoiceRecognitionHandler {
  constructor() {
    this.recognition = null;
    this.isActive = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;

    if ("webkitSpeechRecognition" in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = "vi-VN"; // Sử dụng tiếng Việt
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        if (this.onResultCallback) {
          const speechResult = event.results[0][0].transcript;
          this.onResultCallback(speechResult);
        }
      };

      this.recognition.onerror = (event) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.onEndCallback && this.isActive) {
          this.onEndCallback();
          this.start(); // Tiếp tục nhận diện nếu đang active
        }
      };
    } else {
      console.error("Trình duyệt không hỗ trợ Speech Recognition");
    }
  }

  start() {
    if (this.recognition && !this.isActive) {
      this.isActive = true;
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition && this.isActive) {
      this.isActive = false;
      this.recognition.stop();
    }
  }

  setOnResult(callback) {
    this.onResultCallback = callback;
  }

  setOnError(callback) {
    this.onErrorCallback = callback;
  }

  setOnEnd(callback) {
    this.onEndCallback = callback;
  }
}

// Xuất class để sử dụng ở file khác
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = VoiceRecognitionHandler;
} else {
  window.VoiceRecognitionHandler = VoiceRecognitionHandler;
}
