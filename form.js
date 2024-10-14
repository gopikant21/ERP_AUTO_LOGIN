document.getElementById("saveBtn").addEventListener("click", async function () {
  let email = document.getElementById("email").value;
  let email_password = document.getElementById("email-password").value;
  let erp_username = document.getElementById("erp-username").value;
  let erp_password = document.getElementById("erp-password").value;
  let food = document.getElementById("favorite-food").value;
  let song = document.getElementById("favorite-song").value;
  let school = document.getElementById("first-school").value;




// Store email in Chrome storage
chrome.storage.local.set({ email: email }, function() {
  console.log('Email saved:', email);
});

  // Check if all fields are filled
  if (email && email_password && erp_username && erp_password && food && song && school) {
    try {
      // Send ERP credentials to backend API to save in the database
      const response = await fetch("https://erp-auto-login.onrender.com/save-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          email_password,
          erp_username,
          erp_password,
          food,
          song,
          school,
        }),
      });

      if (response.ok) {
        // Show success alert
        alert('Credentials saved successfully!');
        
        // Close the current page
        window.close(); // This will close the page if opened by a script
      } else {
        // Show failure alert
        alert('Failed to save credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Show error alert
      alert('An error occurred. Please try again.');
    }
  } else {
    // Show alert if not all fields are filled
    alert('Please fill in all fields.');
  }
});
