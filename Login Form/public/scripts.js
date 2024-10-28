// Add an event listener to the Google sign-up button
document.getElementById('googleSignUpBtn').addEventListener('click', function() {
    // Redirect the user to the Google OAuth authentication URL
    window.location.href = '/auth/google';
});

// Add an event listener to the GitHub sign-up button
document.getElementById('githubSignUpBtn').addEventListener('click', function() {
    // Redirect the user to the GitHub OAuth authentication URL
    window.location.href = '/auth/github';
});

// The rest of your existing code
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.getElementById('signUpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User registered successfully');
            document.getElementById('signUpForm').reset();
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'success.html';
        } else {
            alert(data.message);
        }
    });
});
