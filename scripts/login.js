document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Prijavi korisnika s Firebase autentifikacijom
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Provjeri u Firestoreu je li korisnik admin
            const userDoc = await db.collection('users').doc(user.uid).collection('documents').doc('user-info').get();

            if (userDoc.exists && userDoc.data().admin === true) {
                // Ako korisnik postoji i ima admin prava, preusmjeri ga na index.html
                window.location.href = 'index.html'; 
            } else {
                throw new Error('Insufficient permissions');
            }
        } catch (error) {
            console.error(error);
            errorMessage.style.display = 'block'; // Prikaz poruke o pogrešci
            errorMessage.textContent = 'Invalid email, password, or insufficient permissions!';
        }
    });
});
