# Login Authentication System

## About
A client-side authentication system featuring user registration, login validation, and a protected dashboard page. Built as part of the Oasis Infobyte (OIBSIP) Web Development & Designing internship — Level 2, Task 4.

## Tech Stack
- HTML5
- CSS3
- JavaScript (Vanilla) with `localStorage` and the Web Crypto API (SHA-256 hashing)

## Features
- Registration page with username/email and password fields
- Password validation: minimum 8 characters, at least 1 number
- Duplicate username/email check on registration
- Login page with generic error handling (does not reveal whether the username or password was incorrect)
- Protected dashboard: only accessible after a successful login; session persists across page refreshes
- Logout button clears the session and returns to the login page
- Passwords are never stored in plain text — hashed using SHA-256 via the Web Crypto API
- Basic form validation on both pages (no empty submissions)

## How to Run
1. Download `index.html`, `style.css`, and `script.js` into the same folder.
2. Open `index.html` in any web browser.
3. Register a new account, then log in with the same credentials.

## Folder Structure
```
WebDev-L2-LoginAuthSystem/
├── index.html
├── style.css
├── script.js
└── README.md
```
