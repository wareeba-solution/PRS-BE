# Patient Registration System Backend

A Node.js Express API for hospital patient registration workflow that allows patients to register remotely before their hospital visit.

## Overview

The Patient Registration System streamlines the patient onboarding process by:

1. Sending unique registration links to patients via email or SMS
2. Allowing patients to complete registration forms remotely
3. Generating verification codes upon submission
4. Enabling front desk staff to retrieve patient information using verification codes

## Features

- JWT authentication for secure access to protected endpoints
- Role-based access control (front desk staff, admin)
- Email and SMS notifications
- Secure registration links with expiration
- Verification code generation
- MongoDB database integration
- Swagger API documentation

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Nodemailer for email services
- Twilio for SMS services
- Swagger for API documentation

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- npm or yarn

