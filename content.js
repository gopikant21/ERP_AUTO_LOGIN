console.log("in content.js");

let email = "test@gmail.com";

chrome.storage.local.get(["email"], function (result) {
  if (result.email) {
    console.log("Email retrieved:", result.email);
    // Now you can use the email here
    email = result.email;

    chrome.runtime.sendMessage(
      { action: "getCredentials", email: email },
      function (response) {
        console.log("Response received:", response);
        if (response.credentials) {
          console.log("Credentials received:", response.credentials);
          const credentials = response.credentials;


          // Add a message listener to trigger autofill when the button is clicked
          chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
            console.log("checking startAutofill message recieved or not!!")
            if (request.action === "startAutofill"){
              console.log("Starting autofill process...");
              auto_fill(credentials);
            }else{
              alert("start autofill button is not clicked!!");
            }
          })
    

        } else {
          console.log("content.js: No credentials found");
          console.error("Error:", response.error);
        }
      }
    );
  } else {
    console.log("No email found in storage");
  }
});

/*async function getCredentials(email) {
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


// This function will autofill the form with the ERP credentials
function auto_fill(credentials) {
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
        let ans = document.getElementById("answer");

        // Fill in the answer based on the security question
        if (question === "name of the first school you attended") {
          ans.value = credentials.school;
        } else if (question === "your favorite song") {
          ans.value = credentials.song;
        } else if (question === "your favorite food") {
          ans.value = credentials.food;
        }

        // Stop observing once the question has been handled
        observer.disconnect();
         
        // Programmatically click the "Get OTP" button
        if (ans.value) {
          document.getElementById("getotp").click();
          console.log("get-otp clicked");
          // After the "Get OTP" button is clicked, fetch the OTP
          const socket = new WebSocket("ws://localhost:8080");

          socket.onopen = function () {
            console.log("Connected to WebSocket server");
            // Notify the server to fetch the OTP
            setTimeout(() => {
              socket.send("fetch-otp");
            }, 5000);

            console.log("mes sent");
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

        
      }else{
        console.log("question element not found!!");
      }
    });
  });

  // Start observing the target node (the document body) for configured mutations
  observer.observe(document.body, { childList: true, subtree: true });
 
}

/*Optionally, handle the OTP input using an API or similar logic
        fetch('http://localhost:3000/get_otp')
            .then(response => response.json())
            .then(data => {
                console.log(Retrieved OTP: ${data.otp});
            
                // Use OTP in your application
                setTimeout(function () {
                    // Retrieve OTP from email or other sources
                    let erp_otp = data.otp;
                    console.log(erp_otp);
          
                    document.getElementById("email_otp1").value = erp_otp;
          
                    // Submit the form
                    document.getElementById("loginFormSubmitButton").click();
                }, 20000); // Adjust delay as necessary
            })

            .catch(error => {
                console.error('Error fetching OTP:', error);
            });
        */

/*// This function will fetch the OTP and populate it in the form
async function handleOtpRetrieval() {
  try {
    // Call your `fetchOtp` function to retrieve the OTP from the email
    const otp = await fetchOtp();
    console.log("dvhs");
    
    // Once OTP is fetched, insert it into the OTP input field
    if (otp) {
      const otpInput = document.getElementById("otp"); // Change "otp" to the actual OTP input field ID
      otpInput.value = otp;

      // Optionally, automatically submit the form after filling the OTP
      document.getElementById("loginFormSubmitButton").click(); // Change "loginButton" to the actual submit button ID
      console.log("OTP filled and form submitted");
    } else {
      console.error("Failed to retrieve OTP");
    }
  } catch (error) {
    console.error("Error fetching OTP:", error);
  }
}


async function fetchOtp() {
  console.log("in fetchotp fuction")
  try {
    // Logic to fetch OTP from your email inbox
    // Example: Call an API that checks your email inbox and retrieves the OTP
    const response = await fetch('http://localhost:3000/get-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'gopikant@example.com' }) // Use your email or email stored in Chrome storage
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response);
    const result = await response.json();
    console.log(result.otp);
    return result.otp; // Assuming the OTP is returned in a field called 'otp'
  } catch (error) {
    console.error("Error fetching OTP from email:", error);
    return null; // Handle error case
  }
}*/
