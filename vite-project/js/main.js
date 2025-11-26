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

window.addEventListener("DOMContentLoaded", () => {
  const constraints = {
    video: { facingMode: { ideal: "environment" } },
    audio: false,
  };

  const cameraView = document.querySelector("#camera-view");
  const cameraSensor = document.querySelector("#camera-sensor");
  const cameraTrigger = document.querySelector("#cameraTrigger");

  const albumInput = document.querySelector("#album");
  const artistaInput = document.querySelector("#artista");
  const listaRegistros = document.querySelector("#lista-registros");

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

  
  cameraTrigger.addEventListener("click", () => {
    const album = albumInput.value.trim();
    const artista = artistaInput.value.trim();

    if (!album || !artista) {
      alert("Preencha o nome do álbum e do artista!");
      return;
    }

    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;

    const ctx = cameraSensor.getContext("2d");
    ctx.drawImage(cameraView, 0, 0);

    const foto = cameraSensor.toDataURL("image/webp");

    adicionarRegistro(album, artista, foto);

    albumInput.value = "";
    artistaInput.value = "";
  });

  
  function adicionarRegistro(album, artista, foto) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Álbum:</strong> ${album}<br>
      <strong>Artista:</strong> ${artista}<br>
      <img src="${foto}" width="150">
      <hr>
    `;
    listaRegistros.appendChild(li);
  }
});
