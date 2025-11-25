if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try{
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module"});

        } catch (err) {
            console.log('service worker registro fail', err);
        }
    });
}

let posicaoInicial;
const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const map = document.getElementById('gmap_canvas');

const sucesso = (posicao) => {
posicaoInicial = posicao;
latitude.innerHTML = posicaoInicial.coords.latitude;
longitude.innerHTML = posicaoInicial.coords.longitude;
map.src = "https://maps.google.com/maps?q="+posicaoInicial.coords.latitude+","+posicaoInicial.coords.longitude+"&z=13&ie=UTF8&iwloc=&output=embed"
};

const erro = (error) => {

let errorMessage;
switch(error.code){
    case 0:
        errorMessage = "erro desconhecido"
        break;
    case 1:
        errorMessage = "permissão negada!"
        break;
    case 2:
        errorMessage = "captura de posição indisponivel"
        break;
    case 3:
        errorMessage = "timeout"
        break;            
}
console.log("ocorreu um erro" + errorMessage)
};
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });

      console.log('Service worker registrada! 🤓', reg);
    } catch (err) {
      console.log('😢 Service worker registro falhou: ', err);
    }
  });
}
window.addEventListener('load', async () => {
  
  try {
    const reg = await navigator.serviceWorker.register("./sw.js");
    console.log("Service Worker registrado", reg);
  } catch (err) {
    console.log("😧 Service worker registro falhou:", err);
  }

 
  const constraints = {
    video: {
      facingMode: { ideal: "environment" }, 
    },
    audio: false,
  };

  const cameraView = document.querySelector("#camera--view");
  const cameraOutput = document.querySelector("#camera--output");
  const cameraSensor = document.querySelector("#camera--sensor");
  const cameraTrigger = document.querySelector("#camera--trigger");

  async function cameraStart() {
    try {
      console.log("🔍 Pedindo permissão da câmera...");

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      
      cameraView.setAttribute("playsinline", true);

      cameraView.srcObject = stream;

      cameraView.onloadedmetadata = () => {
        cameraView.play().catch(err => console.error("Erro ao dar play:", err));
      };

      console.log("📸 Câmera iniciada!");

    } catch (error) {
      console.error("❌ Erro ao acessar a câmera:", error);
      alert("Erro ao acessar a câmera: " + error.message);
    }
  }
  
  cameraStart();
});
