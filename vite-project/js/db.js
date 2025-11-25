import { openDB } from "https://cdn.jsdelivr.net/npm/idb@7/+esm";

let db;

async function createDB() {
  db = await openDB("albunsDB", 1, {
    upgrade(db) {
      const store = db.createObjectStore("albuns", {
        keyPath: "id",
        autoIncrement: true
      });

      store.createIndex("album", "album");
      store.createIndex("artista", "artista");
      store.createIndex("foto", "foto");
    }
  });

  console.log("Banco de dados pronto.");
}

createDB();


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
    cameraView.play();
  } catch (error) {
    alert("Erro ao acessar câmera: " + error);
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


saveInfo.onclick = async () => {
  const album = inputAlbum.value.trim();
  const artista = inputArtista.value.trim();
  const foto = cameraOutput.src;

  if (!album || !artista || !foto) {
    alert("Preencha tudo antes de salvar!");
    return;
  }

  const data = { album, artista, foto };

  const tx = db.transaction("albuns", "readwrite");
  await tx.store.add(data);
  await tx.done;

  alert("Registro salvo!");

  inputAlbum.value = "";
  inputArtista.value = "";

  loadData();
};


async function loadData() {
  const registros = await db.getAll("albuns");
  lista.innerHTML = "";

  registros.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.album}</strong> — ${item.artista}
      <br>
      <img src="${item.foto}" style="width:120px; border-radius:10px; margin-top:5px;">
    `;
    lista.appendChild(li);
  });
}

loadData();
