const $ = el => document.querySelector(el);
const loginForm = $('#login-form');
const loginSpan = $('#login-form span');
const registerForm = $('#register-form');
const registerSpan = $('#register-form span');
const logoutButton = $('#close-session');

loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const username = $('#login-username').value;
    const password = $('#login-password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Error al iniciar sesión');
        loginSpan.innerText = 'Sesión iniciada correctamente. Entrando...';
        loginSpan.style.color = 'green';
        window.location.href = '/protected';
    } catch (error) {
        loginSpan.innerText = error.message;
        loginSpan.style.color = 'red';
    }
});

registerForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const username = $('#register-username').value;
    const password = $('#register-password').value;
    const confirmPassword = $('#register-confirm-password').value;

    if (password !== confirmPassword) {
        registerSpan.innerText = 'Las contraseñas no coinciden';
        registerSpan.style.color = 'red';
        return;
    }

    try {
        const registerResponse = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!registerResponse.ok) throw new Error(await registerResponse.text());

        registerSpan.innerText = 'Usuario registrado. Entrando...';
        registerSpan.style.color = 'green';
        setTimeout(() => {
            window.location.href = '/protected';
        }, 1000);
    } catch (error) {
        registerSpan.innerText = error.message;
        registerSpan.style.color = 'red';
    }
});

logoutButton?.addEventListener('click', async event => {
    event.preventDefault();
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/';
});