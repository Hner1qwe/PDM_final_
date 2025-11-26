if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js", { type: "module" });
      console.log("Service worker registrada!");
    } catch (err) {
      console.error("Falha ao registrar service worker: ", err);
    }
  });
}

import { addData } from "./db";

window.addEventListener("DOMContentLoaded", () => {
  const constraints = {
    video: { facingMode: { ideal: "environment" } },
    audio: false,
  };

  const cameraView = document.querySelector("#camera-view");
  const cameraSensor = document.querySelector("#camera-sensor");
  const cameraTrigger = document.querySelector("#cameraTrigger");

  async function cameraStart() {
    try {
      console.log("Pedindo permissão da câmera...");

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      cameraView.setAttribute("playsinline", "");
      cameraView.srcObject = stream;

      cameraView.onloadedmetadata = () => {
        cameraView.play().catch(err => console.error("Erro ao dar play:", err));
      };

      console.log("Câmera iniciada!");
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
      alert("Erro ao acessar a câmera: " + error.message);
    }
  }

  cameraStart();


  cameraTrigger.addEventListener("click", async () => {

    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;

    const ctx = cameraSensor.getContext("2d");
    ctx.drawImage(cameraView, 0, 0);

    const foto = cameraSensor.toDataURL("image/webp");

    await addData(foto);
  });
});
