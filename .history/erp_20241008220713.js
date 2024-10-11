document.getElementById('saveBtn').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const food = document.getElementById('username').value;
    const  = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    
    const msg = document.getElementById('msg');
  
    if (username && password) {
      // Send ERP credentials to backend API to save in the database
      const response = await fetch('https://localhost:3000/save-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, food, song, school })
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
  