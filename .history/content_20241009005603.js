const email = localStorage.getItem('email');

document.addEventListener('DOMContentLoaded', () => {
     // Replace with the actual user's email
    getCredentials(email);
});
  

async function getCredentials(email) {
    try {
      const response = await fetch('http://localhost:3000/get-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }) // Send email to identify user
      });
  
      if (response.ok) {
        const credentials = await response.json();
        console.log('Credentials retrieved:', credentials);
  
        // Example usage: auto-filling a login form with ERP credentials
        document.getElementById('user_id').value = credentials.erp_username;
        document.getElementById('password').value = credentials.erp_password;

        setTimeout(()=>{
            let question = document.getElementById('question').innerHTML;
        let ans = document.getElementById('answer').value;
        if(question == "name of the first school you attended"){
            ans = credentials.school;
        }else if(question == "your favorite song"){
            ans = credentials.school;
        }else if(question == "your favorite song"){
            ans = credentials.school;
        }
        }, 5000)

        



      } else {
        console.error('Failed to fetch credentials');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  }
  



// This function will autofill the ERP login form
function autofillERPLogin() {
    // Get the saved credentials and security answers from Chrome's storage
    chrome.storage.sync.get(['username', 'password', 'favoriteFood', 'favoriteSong', 'firstSchool'], function(data) {
        if (data.username && data.password) {
            // Select the input fields on the ERP login page and fill them with the saved values
            const usernameField = document.querySelector('#erp-username'); // Update with the correct field selector for the ERP username
            const passwordField = document.querySelector('#erp-password'); // Update with the correct field selector for the ERP password

            if (usernameField && passwordField) {
                usernameField.value = data.username;
                passwordField.value = data.password;
            }

            // Autofill the security questions (if present)
            const favoriteFoodField = document.querySelector('#erp-favorite-food'); // Update with the correct selector for favorite food
            const favoriteSongField = document.querySelector('#erp-favorite-song'); // Update with the correct selector for favorite song
            const firstSchoolField = document.querySelector('#erp-first-school'); // Update with the correct selector for first school

            if (favoriteFoodField && favoriteSongField && firstSchoolField) {
                favoriteFoodField.value = data.favoriteFood;
                favoriteSongField.value = data.favoriteSong;
                firstSchoolField.value = data.firstSchool;
            }

            console.log('ERP credentials and security answers autofilled');
        } else {
            console.log('No ERP credentials found in Chrome storage.');
        }
    });
}

// Listen for page load to trigger autofill (this runs the function when the page is loaded)
window.addEventListener('load', function() {
    // Check if we're on the ERP login page (you can check URL or page title, etc.)
    if (window.location.href.includes('erp-login-page-url')) { // Replace with the actual ERP login page URL
        autofillERPLogin();
    }
});
