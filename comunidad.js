// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Secciones del foro
const secciones = ['arte', 'juegos', 'retos'];

// Cargar comentarios al iniciar
secciones.forEach(async (seccion) => {
  const contenedor = document.querySelector(`#content-${seccion}`);
  const post = contenedor.querySelector('.post');
  const counter = post.querySelector('.counter');

  const comentariosRef = collection(db, 'comunidad', seccion, 'comentarios');

  // Escuchar en tiempo real
  onSnapshot(comentariosRef, (snapshot) => {
    const comentariosExistentes = post.querySelectorAll('.comment');
    comentariosExistentes.forEach(c => c.remove());

    let total = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.className = 'comment';
      div.textContent = `💬 ${data.texto}`;
      div.style.cssText = 'margin-top:0.5rem;padding:0.5rem;background:#111;border:1px solid #0ff;border-radius:5px;';
      post.appendChild(div);
      total++;
    });

    counter.textContent = `${total} 💬`;
  });
});

// Guardar nuevo comentario
document.querySelectorAll('.comment-box').forEach((box, index) => {
  const button = box.querySelector('button');
  const textarea = box.querySelector('textarea');
  const seccion = secciones[index];

  button.addEventListener('click', async () => {
    const texto = textarea.value.trim();
    if (texto !== '') {
      try {
        await addDoc(collection(db, 'comunidad', seccion, 'comentarios'), {
          texto: texto,
          fecha: new Date()
        });
        textarea.value = '';
      } catch (error) {
        console.error(`Error al guardar comentario en ${seccion}:`, error);
      }
    }
  });
});
