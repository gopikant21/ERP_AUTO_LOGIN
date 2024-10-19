document.getElementById("saveBtn").addEventListener("click", async function () {
  let email = document.getElementById("email").value;
  let erp_username = document.getElementById("erp-username").value;
  let erp_password = document.getElementById("erp-password").value;
  let food = document.getElementById("favorite-food").value;
  let song = document.getElementById("favorite-song").value;
  let school = document.getElementById("first-school").value;

  // Store all the credentials in Chrome storage
  chrome.storage.local.set(
    {
      email: email,
      erp_username: erp_username,
      erp_password: erp_password,
      favorite_food: food,
      favorite_song: song,
      first_school: school
    },
    function () {
      console.log('Credentials saved successfully.');
    }
  );
});
