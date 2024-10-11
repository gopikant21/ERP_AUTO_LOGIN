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
    tlsOptions: {
            rejectUnauthorized: false // Disables certificate validation
    },
    authTimeout: 10000
  },
};

function fetchOtpFromEmail() {
    return new Promise((resolve, reject) => {
        const imap = new Imap({
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASSWORD,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        imap.once('ready', () => {
            imap.openBox('INBOX', true, (err, box) => {
                if (err) reject(err);

                imap.search([['FROM', OTP_SENDER]], (err, results) => {
                    if (err) reject(err);

                    if (!results || results.length === 0) {
                        reject('No OTP email found');
                        return;
                    }

                    const latestEmailId = results[results.length - 1];

                    const fetch = imap.fetch(latestEmailId, { bodies: '' });

                    fetch.on('message', msg => {
                        msg.on('body', stream => {
                            simpleParser(stream, (err, parsed) => {
                                if (err) reject(err);

                                const { text } = parsed;

                                // Extract OTP using a regex (assuming OTP is a 6-digit number)
                                const otpMatch = text.match(/\d{6}/);
                                //console.log(otpMatch, otpMatch[0]);
                                if (otpMatch) {
                                    resolve(otpMatch[0]);
                                } else {
                                    reject('OTP not found in email');
                                }
                            });
                        });
                    });

                    fetch.once('error', err => {
                        reject(err);
                    });

                    fetch.once('end', () => {
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', err => {
            reject(err);
        });

        imap.once('end', () => {
            console.log('Connection ended');
        });

        imap.connect();
    });
}


async function fetch_otp() {
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
                const match = mail.subject.match(otpRegex);
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


//fetch_otp();
