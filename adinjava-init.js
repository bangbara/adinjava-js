// adinjava-init.js

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLzGkG5xGGW2G2H0Oen0guG3FnfL7hY4g",
  authDomain: "invertible-oath-349115.firebaseapp.com",
  projectId: "invertible-oath-349115",
  storageBucket: "invertible-oath-349115.appspot.com",
  messagingSenderId: "671241605067",
  appId: "1:671241605067:web:17e923f8055293be10704e"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Cek status login
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Pengguna login
    const userNameEl = document.getElementById("userName");
    const userStatusEl = document.getElementById("userStatus");

    db.collection("members").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (userNameEl) userNameEl.innerText = data.nama || user.email;
        if (userStatusEl) userStatusEl.innerText = data.jenis || "Classic";
      }
    });

    // Redirect otomatis jika sedang di halaman login
    const currentPage = window.location.pathname;
    if (currentPage.includes("login")) {
      window.location.href = "/p/beranda.html";
    }
  } else {
    // Jika belum login dan bukan di login/register, arahkan ke login
    const allowed = ["login", "register", "reset"];
    if (!allowed.some(path => window.location.pathname.includes(path))) {
      window.location.href = "/p/login.html";
    }
  }
});

// Fungsi logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "/p/login.html";
  });
}

// Event listener tombol logout jika ada
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
