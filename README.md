# ERP Auto-Login Automation

This project automates the login process for the **ERP Portal of IIT Kharagpur**. It retrieves the One-Time Password (OTP) from your Gmail inbox and automatically logs you into the ERP system using WebSockets and a simple client-server setup.

**Note:** This project is intended to work locally on your machine and is not deployed online. You can follow the instructions below to set it up and use it.

## Features
- Automatically fetches OTP from your Gmail inbox.
- Automatically fills out the ERP login form with your username, password, random security question and OTP.
- Uses WebSocket to handle communication between the client and server for OTP retrieval.
- Works with desktop Chrome (using a Chrome extension).
- **Chrome stores your credentials locally**, so there's no need to fill the form repeatedly after the first time.

## Prerequisites

To run this project, you will need the following:

1. **Node.js** installed on your system. You can download it from [here](https://nodejs.org/).
2. **Google API OAuth2 credentials** for accessing your Gmail account (for fetching OTP).
3. **WebSocket-enabled browser** for client-server communication.

## Setup Instructions

### 1. Clone the Repository
First, clone this repository to your local machine:
```bash
git clone https://github.com/your-username/erp-auto-login.git
cd gmail-api
```

### 2. Install Dependencies
Install the required Node.js dependencies:
```bash
npm install
```

### 3. Set Up Gmail API Credentials
This project uses the Gmail API to fetch OTPs from your Gmail inbox. You'll need to set up a Google Cloud project to generate OAuth2 credentials.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the **Gmail API**.
3. Generate OAuth2 credentials (client ID and client secret) and download the `credentials.json` file.
4. Place the `credentials.json` file in the root of the project directory.

### 4. Run the Project
After setting up your Gmail API credentials, you can start the server:
```bash
node index.js
```

This will start a WebSocket server that listens for client requests to fetch OTPs.

### 5. How to Use (Local Setup)

#### **A. Chrome Desktop (Using Chrome Extension)**

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click on **Load unpacked** and select the `chrome-extension` folder from this repository.
4. Once the extension is installed, it will **automatically redirect you to a form page** where you can enter your ERP credentials (username and password) only once.
   - **No need to repeatedly fill out the form**—Chrome will store your credentials locally, and the extension will auto-fill them for you whenever you access the ERP portal.
   - After filling in your credentials, the extension will fetch the OTP and log you in automatically.
5. Open the ERP login page, and the extension will handle the login process for you.

### 6. Customizing for Your Login
- Make sure your Gmail API is authorized to read messages from your inbox.

### 7. Running in Development
This project is not deployed to a server, so it runs locally. You can run it on your own system using the steps above. To stop the project, simply press `Ctrl + C` in the terminal where the server is running.

## Issues and Limitations
- This project requires a Gmail account to fetch OTPs, and it is limited to the sender email and snippet patterns you define.
- The project is designed to run locally and does not have an online deployment.
- Ensure you handle your credentials carefully and avoid exposing sensitive information.

## License
This project is licensed under the MIT License. Feel free to fork and modify it as needed.
