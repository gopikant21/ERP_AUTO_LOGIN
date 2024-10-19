const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.labels"];


// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Gets the most recent message from a specific Gmail address where the snippet starts with the given text.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} sender The email address of the sender you want to search for.
 * @param {string} snippetPrefix The beginning of the snippet you're looking for.
 */
async function getRecentOTPFromSender(auth, sender, snippetPrefix) {
  const gmail = google.gmail({ version: "v1", auth });
  try {
    // Search for the recent messages from the specified sender
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `from:${sender} is:unread`, // Search query to filter by sender
      maxResults: 10, // Fetch up to 10 messages for safety (you can adjust this)
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.log("No messages found from the specified sender.");
      return;
    }

    // Loop through the messages and check if the snippet starts with the desired text
    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });
      const snippet = msg.data.snippet;

      if (snippet.startsWith(snippetPrefix)) {
        // Use regex to extract the OTP (assumed to be a number in the message)
        const otpMatch = snippet.match(/\d{4,6}/); // Adjust if OTP has a different length
        if (otpMatch) {
          const otp = otpMatch[0];
          console.log(`Found OTP: ${otp}`);
          // Mark the message as read by modifying its labels
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            resource: {
              removeLabelIds: ["UNREAD"], // Remove the UNREAD label
            },
          });
          console.log("Message marked as read.");
          return otp; // Return the OTP if found
        } else {
          console.log("No OTP found in the message snippet.");
        }
        return; // Stop after finding the first matching message
      }
    }

    console.log("No message found with the specified snippet.");
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Listen for messages from the client
  ws.on("message", (message) => {
    const messageStr = message.toString(); // Converts buffer to string
    console.log("Received message as string:", messageStr);

    if (messageStr === "fetch") {
      console.log("Fetching OTP based on client request...");

      // Define a recursive function to fetch the OTP
      const fetchOtpWithRetry = async (attempts = 0, maxAttempts = 10) => {
        try {
          const auth = await authorize(); // Ensure authorized before fetching OTP
          const otp = await getRecentOTPFromSender(
            auth,
            "erpkgp@adm.iitkgp.ac.in",
            "The OTP for Sign In in ERP Portal of IIT Kharagpur is"
          );

          if (otp) {
            console.log("OTP:", otp);
            ws.send(otp); // Send the OTP back to the client
          } else {
            console.log("OTP not found, retrying...");
            if (attempts < maxAttempts) {
              attempts++;
              setTimeout(() => fetchOtpWithRetry(attempts, maxAttempts), 3000); // Wait 3 seconds before retrying
            } else {
              ws.send("No OTP found after multiple attempts"); // Notify client after max attempts
            }
          }
        } catch (error) {
          console.error("Failed to fetch OTP:", error);
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(() => fetchOtpWithRetry(attempts, maxAttempts), 3000); // Wait 3 seconds before retrying
          } else {
            ws.send("Error fetching OTP after multiple attempts"); // Notify client after max attempts
          }
        }
      };

      fetchOtpWithRetry(); // Start the OTP fetching process
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the WebSocket server
console.log("WebSocket server is running on ws://localhost:8080");

// Example usage:
// Call authorize() and pass the sender's email and the desired snippet start
/*authorize()
  .then((auth) =>
    getRecentOTPFromSender(
      auth,
      "erpkgp@adm.iitkgp.ac.in",
      "The OTP for Sign In in ERP Portal of IIT Kharagpur is"
    )
  )
  .catch(console.error);*/
