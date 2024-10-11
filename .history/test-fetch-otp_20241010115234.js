const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
require("dotenv").config();

const config = {
  imap: {
    user: process.env.EMAIL_USER, // Use environment variables
    password: process.env.EMAIL_PASSWORD, // Use environment variables
    host: process.env.EMAIL_HOST, // Use environment variables
    port: process.env.EMAIL_PORT, // Use environment variables
    tls: true,
    authTimeout: 3000,
  },
};

function fetch_otp() {
  // Connect to the IMAP server
  imaps
    .connect(config)
    .then((connection) => {
      return connection.openBox("INBOX").then(() => {
        // Search for unread emails from the specific email address
        const searchCriteria = [
          // 'UNSEEN', // Search for unread emails
          ["FROM", process.env.OTP_SENDER], // Specify the sender's email ID
          //['SINCE', new Date()] // Optional: Search emails from today
        ];

        const fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false,
        };

        // Search for the emails
        return connection
          .search(searchCriteria, fetchOptions)
          .then((messages) => {
            messages.forEach((item) => {
              const all = item.parts.find((part) => part.which === "TEXT");
              const id = item.attributes.uid;
              const idHeader = "Imap-Id: " + id + "\r\n";

              simpleParser(idHeader + all.body, (err, mail) => {
                if (err) {
                  console.error("Error parsing email:", err);
                  return;
                }

                // Extract OTP using regex (adjust if needed)
                const otpRegex = /\b\d{6}\b/; // Example for 6-digit OTP
                const match = mail.text.match(otpRegex);
                if (match) {
                  console.log("OTP found:", match[0]);
                } else {
                  console.log("No OTP found in this email");
                }
              });
            });

            if (messages.length === 0) {
              console.log("No new emails from the specified sender.");
            }
          });
      });
    })
    .catch((err) => {
      console.error("Connection error:", err);
    });
}


fetch_otp();