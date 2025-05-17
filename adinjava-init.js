// Inisialisasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLzGkG5xGGW2G2H0Oen0guG3FnfL7hY4g",
  authDomain: "invertible-oath-349115.firebaseapp.com",
  projectId: "invertible-oath-349115",
  storageBucket: "invertible-oath-349115.appspot.com",
  messagingSenderId: "671241605067",
  appId: "1:671241605067:web:17e923f8055293be10704e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Cek status login
auth.onAuthStateChanged(async (user) => {
  const currentPage = window.location.pathname;

  if (user) {
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();
    const name = user.displayName || userData?.name || "Pengguna";
    const status = userData?.status || "member";

    // Tampilkan nama dan status
    const nameEl = document.getElementById("userName");
    const statusEl = document.getElementById("userStatus");
    if (nameEl) nameEl.textContent = name;
    if (statusEl) statusEl.textContent = status;

    // Redirect jika di halaman login/register
    if (currentPage.includes("login") || currentPage.includes("register")) {
      window.location.href = "/p/dashboard.html";
    }
  } else {
    // Jika tidak login, arahkan ke login (kecuali di halaman login/register)
    if (!currentPage.includes("login") && !currentPage.includes("register")) {
      window.location.href = "/p/login.html";
    }
  }
});

// Fungsi Login
function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "/p/dashboard.html";
    })
    .catch((error) => {
      alert("Login gagal: " + error.message);
    });
}

// Fungsi Logout
function logout() {
  auth.signOut()
    .then(() => {
      window.location.href = "/p/login.html";
    })
    .catch((error) => {
      alert("Gagal logout: " + error.message);
    });
}

// Fungsi Register
function register(email, password, name) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({ displayName: name }).then(() => {
        // Simpan data ke Firestore
        return db.collection("users").doc(user.uid).set({
          name: name,
          email: email,
          status: "member",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    })
    .then(() => {
      alert("Pendaftaran berhasil. Silakan login.");
      window.location.href = "/p/login.html";
    })
    .catch((error) => {
      alert("Gagal daftar: " + error.message);
    });
}

// Fungsi Reset Password
function resetPassword(email) {
  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Email reset password telah dikirim.");
    })
    .catch((error) => {
      alert("Gagal mengirim reset password: " + error.message);
    });
}

// Fungsi Kirim Verifikasi Email
function sendVerificationEmail() {
  const user = auth.currentUser;
  if (user) {
    user.sendEmailVerification()
      .then(() => alert("Email verifikasi dikirim."))
      .catch((error) => alert("Gagal kirim verifikasi: " + error.message));
  }
}
