// 1. Suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBkVb8zenJDjsPSFRCiEmcsOHYhKdquT7M",
  authDomain: "check-ai-9303f.firebaseapp.com",
  projectId: "check-ai-9303f",
  storageBucket: "check-ai-9303f.firebasestorage.app",
  messagingSenderId: "732538707024",
  appId: "1:732538707024:web:d467b1246c7dcb16030555",
  measurementId: "G-TZ2QDNKD6P"
};

// 2. Importação dos módulos necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 3. Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- FUNÇÃO DE LOGIN (Com Login Master Adicionado) ---
window.fazerLogin = async (email, senha) => {
    if (event) event.preventDefault();

    // --- INÍCIO DA LÓGICA DO USUÁRIO MASTER ---
    const MASTER_USER = "vidalborges";
    const MASTER_PASS = "Vid@!214161";

    if (email === MASTER_USER && senha === MASTER_PASS) {
        console.log("Acesso Master Detectado!");
        localStorage.setItem("userType", "admin"); // Define como admin para ter acesso total
        window.location.href = "admin.html"; // Te joga direto para a tela principal
        return; // Para o código aqui e não executa o Firebase
    }
    // --- FIM DA LÓGICA DO USUÁRIO MASTER ---

    try {
        console.log("Tentando realizar login via Firebase...");
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        
        if (userDoc.exists()) {
            const dados = userDoc.data();
            console.log("Acesso concedido:", dados.tipo);
            localStorage.setItem("userType", dados.tipo);
            window.location.href = `${dados.tipo}.html`;
        } else {
            alert("Erro: Perfil de usuário não configurado no banco de dados.");
        }
    } catch (error) {
        console.error("Erro no login:", error.message);
        alert("Falha no login: Verifique seus dados ou a conexão.");
    }
};

// --- FUNÇÃO PARA CADASTRAR NOVOS USUÁRIOS ---
window.cadastrarUsuario = async (nome, empresa, email, senha, tipo) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, senha);
        await setDoc(doc(db, "usuarios", res.user.uid), {
            nome: nome,
            empresa: empresa,
            email: email,
            tipo: tipo,
            criadoEm: new Date()
        });
        alert("Usuário " + nome + " cadastrado com sucesso!");
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
};