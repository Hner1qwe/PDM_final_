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
var constraints = { video: { facingMode: "user" }, audio: false };

const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger");
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      let track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Ocorreu um Erro.", error);
    });
}
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};
window.addEventListener("load", cameraStart, false);