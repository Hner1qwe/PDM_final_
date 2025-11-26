import { openDB } from "idb";

function showResult(msg) {
  console.log(msg);
}

let db;

async function createDB() {
  try {
    db = await openDB('banco', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        switch (oldVersion) {
          case 0:
          case 1:
            const store = db.createObjectStore('albuns', {
              keyPath: 'id',
              autoIncrement: true
            });
            store.createIndex('foto', 'foto');
            store.createIndex('album', 'album');
            store.createIndex('artista', 'artista');
        }
      }
    });
    showResult("Banco de dados aberto com sucesso!");
    return db;
  } catch (e) {
    showResult("Erro ao criar banco de dados: " + e.message)
  }
}

window.addEventListener("DOMContentLoaded", async event => {
  await createDB();
  await listarData();
  document.getElementById("cameraTrigger").addEventListener("click", addData);
});

async function listarData() {
  if (db == undefined) {
    showResult("O banco de dados está fechado.");
    return;
  }

  const registrosSalvos = document.getElementById("registrosSalvos");
  registrosSalvos.innerHTML = "";

  const tx = db.transaction('albuns', 'readonly');
  const store = tx.objectStore('albuns');
  const value = await store.getAll();

  if (value.length === 0) {
    registrosSalvos.innerHTML = "<li>Nenhum registro salvo...</li>";
    return;
  }

  value.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.album} - ${a.artista} - ${a.foto}`;
    registrosSalvos.appendChild(li);
  });
}

async function addData() {
  if (db == undefined) {
    showResult("O banco de dados está fechado.");
    return;
  }

  const albumInput = document.getElementById("album");
  const artistaInput = document.getElementById("artista");

  const albumName = albumInput.value;
  const albumArtist = artistaInput.value;

  if (!albumName || !albumArtist) {
    showResult("Preencha todos os campos.");
    return;
  }

  const tx = db.transaction('albuns', 'readwrite');
  const store = tx.objectStore('albuns');

  await store.add({ album: albumName, foto: 'foto', artista: albumArtist });

  await tx.done;

  albumInput.value = "";
  artistaInput.value = "";

  albumInput.focus();

  await listarData();
}
