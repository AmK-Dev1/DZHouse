// login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-main form');
    if (!form) return console.error('Login form not found!');
  
    form.addEventListener('submit', async e => {
      e.preventDefault(); 
  
      // 1) Collect credentials
      const email    = document.querySelector('input[type="email"]').value.trim();
      const password = document.querySelector('input[type="password"]').value;
  
      // 2) Send to login.php
      try {
        const res = await fetch('../../DZHouse/php/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const json = await res.json();
  
        if (!res.ok) {
          // show error message
          alert(json.error || 'Login failed');
          return;
        }
  
        // 3) Store user_id in localStorage
        localStorage.setItem('user_id', json.user_id);
        localStorage.setItem('role', json.role);
  
        // 4) Redirect to home or dashboard
        window.location.href = 'home.html';
  
      } catch (err) {
        console.error('Login error:', err);
        alert('Network error — please try again.');
      }
    });
  });
  