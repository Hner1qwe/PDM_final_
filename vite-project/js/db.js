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
    showResult("Banco de dados aberto com sucesso!");
  } catch (e) {
    showResult("Erro ao criar banco de dados: " + e.message)
  }
}

window.addEventListener("DOMContentLoaded", async event => {
  createDB();
  document.getElementById("input");
  document.getElementById("cameraTrigger").addEventListener("click", addData);
  document.getElementById("btnListar").addEventListener("click", getData);
});

async function addData() {
  const tx = await db.transaction('albuns', 'readwrite');
  const store = tx.objectStore('albuns');
  store.add({ album: 'album', foto: 'foto', artista: 'artista' });
  await tx.done;
}

async function getData() {
  if (db == undefined) {
    showResult("O banco de dados está fechado.");
    return;
  }

  const tx = await db.transaction('albuns', 'readonly')
  const store = tx.objectStore('albuns');
  const value = await store.getAll();
  if (value) {
    showResult("Dados do banco: " + JSON.stringify(value))
  } else {
    showResult("Não há dados no banco.")
  }
}

function showResult(text) {
  document.querySelector("output").innerHTML = text;
}