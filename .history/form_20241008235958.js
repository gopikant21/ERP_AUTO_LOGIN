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

    try{

    }catch{

    }
     catch (error) {
      console.error('Error:', error);
  msg.textContent = 'An error occurred. Please try again.';
  msg.style.color = 'red';
}
} else {
msg.textContent = 'Please fill in all fields.';
msg.style.color = 'red';
}
});
