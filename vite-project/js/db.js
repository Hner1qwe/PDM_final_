import { openDB } from "idb";

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
    console.log("Banco de dados aberto com sucesso!");
    return db;
  } catch (e) {
    alert("Erro ao criar banco de dados: " + e.message)
  }
}

window.addEventListener("DOMContentLoaded", async event => {
  await createDB();
  await listarData();
  document.getElementById("cameraTrigger").addEventListener("click", addData);
});

async function listarData() {
  if (db == undefined) {
    alert("O banco de dados está fechado.");
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

    const img = document.createElement("img");
    img.src = a.foto;
    img.width = 100;

    const title = document.createElement("h2");
    title.textContent = `${a.album}`;

    const artist = document.createElement("h3");
    artist.textContent = `${a.artista}`;

    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.classList.add("btn-excluir");
    btn.onclick = () => removeData(a.id);

    li.appendChild(title);
    li.appendChild(artist);
    li.appendChild(img);
    li.appendChild(btn);

    registrosSalvos.appendChild(li);
  });
}

export async function addData(foto) {
  if (db == undefined) {
    alert("O banco de dados está fechado.");
    return;
  }

  const albumInput = document.getElementById("album");
  const artistaInput = document.getElementById("artista");

  const albumName = albumInput.value;
  const albumArtist = artistaInput.value;

  if (!albumName || !albumArtist) {
    alert("Preencha os campos necessários!");
    return;
  }

  const tx = db.transaction('albuns', 'readwrite');
  const store = tx.objectStore('albuns');

  await store.add({ album: albumName, foto: foto, artista: albumArtist });

  await tx.done;

  albumInput.value = "";
  artistaInput.value = "";

  albumInput.focus();

  await listarData();
}

export async function removeData(id) {
  if (db == undefined) {
    alert("O banco de dados está fechado.");
    return;
  }

  const tx = db.transaction('albuns', 'readwrite');
  const store = tx.objectStore('albuns');

  await store.delete(id);
  await tx.done;

  await listarData();
}