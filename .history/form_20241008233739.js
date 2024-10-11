document.getElementById('saveBtn').addEventListener('click', async function() {
  const email_username = document.getElementById('username').value;
    const email_password = document.getElementById('password').value;  
  const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const food = document.getElementById('favorite-food').value;
    const song = document.getElementById('favorite-song').value;
    const school = document.getElementById('first-school').value;
    
    const msg = document.getElementById('msg');
  
    if (username && password && food && song && school) {
      // Send ERP credentials to backend API to save in the database
      const response = await fetch('http://localhost:3000/save-credentials', {
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
  