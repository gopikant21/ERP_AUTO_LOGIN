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

let credentials = "";

async function getCredentials(email) {
  try {
    const response = await fetch("http://localhost:3000/get-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send email to identify user
    });

    if (response.ok) {
      credentials = await response.json();
      console.log("Credentials retrieved:", credentials);
    } else {
      console.error("Failed to fetch credentials");
    }
  } catch (error) {
    console.error("Error fetching credentials:", error);
  }
}

function auto_fill() {
  getCredentials(email)
    .then((cred) => {
      console.log(cred);
      // Use 'cred' to auto-fill the form
    })
    .catch((error) => {
      console.error("Error retrieving credentials:", error);
    });

  let cred = getCredentials(email)();
  console.log(cred);

  if (cred != null) {
    console.log(cred);
    
  } else {
    console.error("credentials not found");
    alert("an error occur: credentials not found");
  }
}

auto_fill();
