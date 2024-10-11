/*chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'activate') {
      // Functionality you want to execute when the button is clicked
      console.log('Content script activated!');
      // Add your specific functionality here
      auto_fill();
      //alert('Content script has been activated!');
  }
});*/

console.log("in content.js");

let email = "";

chrome.storage.local.get(["email"], function (result) {
  if (result.email) {
    console.log("Email retrieved:", result.email);
    // Now you can use the email here
    email = result.email;
  } else {
    console.log("No email found in storage");
  }
});

chrome.runtime.sendMessage({ action: "getCredentials", email: email }, function(response) {
  if (response.credentials) {
    console.log("Credentials received:", response.credentials);
    // Use the credentials here
  } else {
    console.error("Error:", response.error);
  }
});




async function getCredentials(email) {
  try {
    const response = await fetch("http://localhost:3000/get-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send email to identify user
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const credentials = await response.json();
    console.log(credentials);

  } catch (error) {
    console.error("Error fetching credentials:", error);
  }
}*/

/*function auto_fill() {
  getCredentials(email)
    .then((credentials) => {
      console.log(credentials);
      if (credentials != undefined) {
        // Use 'cred' to auto-fill the form
        // Example usage: auto-filling a login form with ERP credentials
        document.getElementById("user_id").value = credentials.erp_username;
        document.getElementById("password").value = credentials.erp_password;

        // Create a MutationObserver to watch for changes in the DOM
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const questionElement = document.getElementById("question");

            // Check if the question element has appeared
            if (questionElement) {
              let question = questionElement.innerHTML;
              let ans = document.getElementById("answer").value;

              // Fill in the answer based on the question
              if (question === "name of the first school you attended") {
                ans = credentials.school;
              } else if (question === "your favorite song") {
                ans = credentials.song;
              } else if (question === "your favorite food") {
                ans = credentials.food;
              }

              // Programmatically click the "Get OTP" button
              document.getElementById("getotp").click();
              console.log("get-otp clicked");

              // Stop observing once the question has been handled
              observer.disconnect();
            }
          });
        });

        // Start observing the target node (the document body) for configured mutations
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        console.log("no credentials found!!");
      }
    })
    .catch((error) => {
      console.error("Error retrieving credentials:", error);
    });
}*/

//auto_fill();
