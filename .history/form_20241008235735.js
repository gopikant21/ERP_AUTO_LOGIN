document.getElementById("saveBtn").addEventListener("click", async function () {
  const email = document.getElementById("email").value;
  const email_password = document.getElementById("email-password").value;
  const erp_username = document.getElementById("erp-username").value;
  const erp_password = document.getElementById("erp-password").value;
  const food = document.getElementById("favorite-food").value;
  const song = document.getElementById("favorite-song").value;
  const school = document.getElementById("first-school").value;

  const msg = document.getElementById("msg");

  if (email && email_password && erp_username && erp_password && food && song && school) {
    // Send ERP credentials to backend API to save in the database
    const response = await fetch("http://localhost:3000/save-credentials", {
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
                msg.textContent = 'Credentials saved successfully!';
                msg.style.color = 'green';

                // Close the current page
                window.close();  // This will close the page if opened by a script
            } else {
                msg.textContent = 'Failed to save credentials. Please try again.';
                msg.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            msg.textContent = 'An error occurred. Please try again.';
            msg.style.color = 'red';
        }
    } else {
        msg.textContent = 'Please fill in all fields.';
        msg.style.color = 'red';
    }
