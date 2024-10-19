console.log("in content.js");

let credentials = {};

// Retrieve all stored credentials
chrome.storage.local.get(
  [
    "email",
    "erp_username",
    "erp_password",
    "favorite_food",
    "favorite_song",
    "first_school",
  ],
  function (result) {
    // Store retrieved values in the credentials object
    credentials.email = result.email || "";
    credentials.erp_username = result.erp_username || "";
    credentials.erp_password = result.erp_password || "";
    credentials.favorite_food = result.favorite_food || "";
    credentials.favorite_song = result.favorite_song || "";
    credentials.first_school = result.first_school || "";

    // Log the credentials object to verify
    console.log("Retrieved Credentials Object:", credentials);
  }
);

// Add a message listener to trigger autofill when the button is clicked
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Checking for startAutofill message...");
  if (request.action === "startAutofill") {
    console.log("Starting autofill process...");
    auto_fill(credentials);
  } else {
    alert("Start autofill button is not clicked!");
  }
});

// This function will autofill the form with the ERP credentials
function auto_fill(credentials) {
  // Autofill username and password
  document.getElementById("user_id").value = credentials.erp_username;
  document.getElementById("password").value = credentials.erp_password;

  // Set an interval to repeatedly check for the question element
  const checkInterval = setInterval(() => {
    let questionElement = document.getElementById("question");
    

    // Check if the question element has appeared
    if (questionElement) {
      let question = questionElement.innerHTML;
      let ans = document.getElementById("answer");
      console.log("Security Question:", question);

      // Fill in the answer based on the security question
      if (question === "name of the first school you attended") {
        ans.value = credentials.first_school; // Corrected to match stored key
      } else if (question === "your favorite song") {
        ans.value = credentials.favorite_song;
      } else if (question === "your favorite food") {
        ans.value = credentials.favorite_food;
      }

      console.log("Answer Field:", ans.value);

      
      

      if (ans.value) {
        console.log("Answer filled in, proceeding to get OTP...:", ans.value);
        // Stop checking once the question has been handled
        clearInterval(checkInterval);
        // Click the "Get OTP" button after filling the answer
        document.getElementById("getotp").click();
        console.log("get-otp clicked");

        // After the "Get OTP" button is clicked, fetch the OTP
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = function () {
          console.log("Connected to WebSocket server");
          // Notify the server to fetch the OTP
          setTimeout(() => {
            socket.send("fetch");
          }, 5000);
          console.log("Message sent");
        };

        socket.onmessage = function (event) {
          console.log("New OTP received:", event.data);
          // Update your form field with the OTP
          document.getElementById("email_otp1").value = event.data;
          // Submit the form
          document.getElementById("loginFormSubmitButton").click();
        };

        socket.onclose = function () {
          console.log("Disconnected from WebSocket server");
        };

        socket.onerror = function (error) {
          console.error("WebSocket error:", error);
        };
      }
    } else {
      console.log("Question element not found, checking again...");
    }
  }, 1000); // Check every 1000 milliseconds (1 second)
}
