document.getElementById('loginBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
  
    if (email && password) {
      // Send email and password to backend API for authentication
      const response = await fetch('https://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        // On successful login, redirect to ERP page
        chrome.tabs.create({ url: "erp_page.html" });
      } else {
        errorMsg.textContent = 'Login failed, please try again!';
      }
    } else {
      errorMsg.textContent = 'Please enter both email and password!';
    }
  });
  