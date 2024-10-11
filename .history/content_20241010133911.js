let email = "";

chrome.storage.local.get(['email'], function(result) {
    if (result.email) {
      console.log('Email retrieved:', result.email);
      // Now you can use the email here
      email = result.email;
    } else {
      console.log('No email found in storage');
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

  let credentials = getCredentials(email);


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
        document.getElementById("get-otp").click();
        console.log("get-otp clicked");

        // Stop observing once the question has been handled
        observer.disconnect();
      }
    });
  });

  // Start observing the target node (the document body) for configured mutations
  observer.observe(document.body, { childList: true, subtree: true });


  /*setTimeout(() => {
    let questionElement = document.getElementById("question");
    
    // Check if the question element exists
    if (questionElement) {
      let question = questionElement.innerHTML;
      let ans = document.getElementById("answer").value;
      if (question == "name of the first school you attended") {
        ans = credentials.school;
      } else if (question == "your favorite song") {
        ans = credentials.song;
      } else if (question == "your favorite food") {
        ans = credentials.food;
      }

      // Programmatically click the "Get OTP" button after 5 seconds
      document.getElementById("get-otp").click();
      console.log("get-otp button clicked");
    } else {
      console.log("Question element not found, skipping OTP click.");
    }
  }, 5000);

  // Programmatically click the "Get OTP" button
  document.getElementById("get-otp").click();
  console.log("get-otp clicked");*/
  
}



// Listen for page load to trigger autofill (this runs the function when the page is loaded)
window.addEventListener("load", function () {
  // Check if we're on the ERP login page (you can check URL or page title, etc.)
  if (window.location.href.includes("https://erp.iitkgp.ac.in/SSOAdministration/login.htm")) {
    // Replace with the actual ERP login page URL
    getCredentials(email);
    auto_fill();
  }
});
