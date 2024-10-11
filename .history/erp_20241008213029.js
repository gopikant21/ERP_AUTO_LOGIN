document.getElementById('saveBtn').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('msg');
  
    if (username && password) {
      // Send ERP credentials to backend API to save in the database
      const response = await fetch('https://your-backend-url.com/save-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        msg.textContent = 'Credentials saved successfully!';
      } else {
        msg.textContent = 'Failed to save credentials, please try again.';
      }
    } else {
      msg.textContent = 'Please fill in both fields.';
    }
  });
  