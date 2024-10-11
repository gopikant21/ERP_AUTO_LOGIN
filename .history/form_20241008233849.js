document.getElementById('saveBtn').addEventListener('click', async function() {
  const email = document.getElementById('email').value;
    const email_password = document.getElementById('email-password').value;  
  const erp_username = document.getElementById('erp-username').value;
    const erp_password = document.getElementById('erp-password').value;
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
  