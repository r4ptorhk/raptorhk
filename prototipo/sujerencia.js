// sugerencias.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  updateDoc, doc, increment, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sugerenciasRef = collection(db, "sugerencia");

// Enviar sugerencia
document.getElementById("sugerenciaForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const idea = document.getElementById("idea").value.trim();
  const categoria = document.getElementById("categoria").value;
  const mencion = document.querySelector("input[name='mencion']:checked").value;

  try {
    await addDoc(sugerenciasRef, {
      nombre,
      idea,
      categoria,
      mencion,
      votos: { fuego: 0, bombilla: 0, corazon: 0 },
      timestamp: serverTimestamp()
    });
    alert("¡Gracias por tu sugerencia! 🎉");
    this.reset();
    cargarIdeas();
  } catch (error) {
    console.error("Error al enviar sugerencia:", error);
  }
});

// Mostrar ideas
async function cargarIdeas() {
  const ideasContainer = document.querySelector(".ideas");
  ideasContainer.innerHTML = "<h2>🌟 Muro de Ideas</h2>";

  const snapshot = await getDocs(sugerenciasRef);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const ideaHTML = document.createElement("div");
    ideaHTML.className = "idea";
    ideaHTML.innerHTML = `
      <p><strong>@${data.nombre}:</strong> ${data.idea}</p>
      <div class="votos" data-id="${docSnap.id}">
        <span data-voto="fuego">🔥 ${data.votos?.fuego || 0}</span>
        <span data-voto="bombilla">💡 ${data.votos?.bombilla || 0}</span>
        <span data-voto="corazon">❤️ ${data.votos?.corazon || 0}</span>
      </div>
    `;
    ideasContainer.appendChild(ideaHTML);
  });
}

// Votar
document.addEventListener("click", async function (e) {
  if (e.target.closest(".votos span")) {
    const span = e.target;
    const voto = span.dataset.voto;
    const ideaId = span.closest(".votos").dataset.id;

    const ideaDoc = doc(db, "sugerencia", ideaId);
    await updateDoc(ideaDoc, {
      [`votos.${voto}`]: increment(1)
    });

    cargarIdeas();
  }
});

cargarIdeas();
