const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const dashboardView = document.getElementById('dashboardView');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');

const regUsername = document.getElementById('regUsername');
const regPassword = document.getElementById('regPassword');
const regError = document.getElementById('regError');
const regSuccess = document.getElementById('regSuccess');
const registerBtn = document.getElementById('registerBtn');

const welcomeMsg = document.getElementById('welcomeMsg');
const logoutBtn = document.getElementById('logoutBtn');

const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// --- View switching ---
function showView(view) {
  loginView.classList.add('hidden');
  registerView.classList.add('hidden');
  dashboardView.classList.add('hidden');
  view.classList.remove('hidden');
}

showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  regError.textContent = '';
  regSuccess.textContent = '';
  showView(registerView);
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  loginError.textContent = '';
  showView(loginView);
});

// --- Password hashing (SHA-256, no plain text storage) ---
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  return JSON.parse(localStorage.getItem('authUsers')) || [];
}
function saveUsers(users) {
  localStorage.setItem('authUsers', JSON.stringify(users));
}

// --- Registration ---
registerBtn.addEventListener('click', async () => {
  regError.textContent = '';
  regSuccess.textContent = '';

  const username = regUsername.value.trim();
  const password = regPassword.value;

  if (username === '' || password === '') {
    regError.textContent = 'Please fill in all fields.';
    return;
  }

  const passwordRule = /^(?=.*[0-9]).{8,}$/;
  if (!passwordRule.test(password)) {
    regError.textContent = 'Password must be at least 8 characters and include a number.';
    return;
  }

  const users = getUsers();
  const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    regError.textContent = 'This username/email is already registered.';
    return;
  }

  const passwordHash = await hashPassword(password);
  users.push({ username, passwordHash });
  saveUsers(users);

  regSuccess.textContent = 'Registration successful! You can now log in.';
  regUsername.value = '';
  regPassword.value = '';

  setTimeout(() => showView(loginView), 1200);
});

// --- Login ---
loginBtn.addEventListener('click', async () => {
  loginError.textContent = '';

  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (username === '' || password === '') {
    loginError.textContent = 'Please fill in all fields.';
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  const passwordHash = await hashPassword(password);

  // Generic error — doesn't reveal whether username or password was wrong
  if (!user || user.passwordHash !== passwordHash) {
    loginError.textContent = 'Invalid username or password.';
    return;
  }

  localStorage.setItem('authSession', username);
  loginUsername.value = '';
  loginPassword.value = '';
  showDashboard(username);
});

// --- Dashboard / session ---
function showDashboard(username) {
  welcomeMsg.textContent = `Welcome, ${username}! You are logged in.`;
  showView(dashboardView);
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('authSession');
  showView(loginView);
});

// --- On page load: check session (protected route behavior) ---
window.addEventListener('DOMContentLoaded', () => {
  const session = localStorage.getItem('authSession');
  if (session) {
    showDashboard(session);
  } else {
    showView(loginView);
  }
});
