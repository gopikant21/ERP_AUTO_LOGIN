const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
require('dotenv').config();


const config = {
    imap: {
        user: process.env.EMAIL_USER,          // Use environment variables
        password: process.env.EMAIL_PASSWORD,  // Use environment variables
        host: process.env.EMAIL_HOST,          // Use environment variables
        port: process.env.EMAIL_PORT,          // Use environment variables
        tls: true,
        authTimeout: 3000
    }
};

function fetch_otp(){

}


