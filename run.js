const { exec } = require('child_process');

exec('nodemon index.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
});

exec('mongod', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
});

exec('start chrome http://localhost:3000/', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
});

const data = `# Express Vault Web Application

This is a simple web application built with Express.js and MongoDB that allows users to store and manage website credentials securely.

## Features

- User authentication (login and signup)
- Password encryption using mongoose-encryption
- Session management
- Saving and managing website credentials

## Prerequisites

- Node.js and npm installed
- MongoDB installed and running on mongodb://127.0.0.1:27017/vault

Press ctrl+c or close window to exist application...`;

console.log(data);
