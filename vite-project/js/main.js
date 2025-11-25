
const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");


const formArea = document.querySelector("#form-area");
const inputAlbum = document.querySelector("#input-album");
const inputArtista = document.querySelector("#input-artista");
const saveInfo = document.querySelector("#save-info");


const lista = document.querySelector("#lista");


async function cameraStart() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });

        cameraView.srcObject = stream;

        cameraView.onloadedmetadata = () => {
            cameraView.play();
        };

    } catch (error) {
        alert("Erro ao acessar a câmera: " + error.message);
        console.error(error);
    }
}

cameraStart();


cameraTrigger.onclick = () => {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;

    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);

    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.style.display = "block";

    
    formArea.style.display = "block";
};


saveInfo.onclick = () => {
    const album = inputAlbum.value.trim();
    const artista = inputArtista.value.trim();

    if (album === "" || artista === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `<strong>${album}</strong> — ${artista}`;
    lista.appendChild(li);

  
    inputAlbum.value = "";
    inputArtista.value = "";

    alert("Registro salvo!");
};
