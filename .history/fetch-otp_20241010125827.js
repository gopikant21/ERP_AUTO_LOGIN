const Imap = require('imap');
const { simpleParser } = require("mailparser");
require("dotenv").config();



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

                imap.search([['FROM', process.env.OTP_SENDER]], (err, results) => {
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
                                console.log(otpMatch, otpMatch[0]);
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
            console.log('imap Connection ended');
        });

        imap.connect();
    });
}



fetchOtpFromEmail();