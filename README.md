# WebApp
![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen)

## Table of Contents
- [WebApp](#webapp)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [User Requirements](#user-requirements)
  - [Prerequisites](#prerequisites)
  - [Available Scripts](#available-scripts)
  - [API Endpoints](#api-endpoints)
  - [HTTP Response Messages](#http-response-messages)
  - [Instructions](#instructions)
  - [Testing the Service](#testing-the-service)

## Introduction
WebApp is built on **Node.js**, a server-side JavaScript runtime environment that enables the development of fast and scalable network applications.

## User Requirements
- Users can create a new account with email address, password, first name, and last name.
- `account_created` is auto-set to the current timestamp upon successful user creation.
- Users cannot set values for `account_created` and `account_updated`. Any provided values are ignored. Passwords are not returned in the response.
- Email addresses serve as the username.
- Passwords are stored securely using BCrypt hashing with a salt.
- Users can update only their first name, last name, and password.
- The `account_updated` timestamp is refreshed upon successful user updates.
- Users can only alter their own account information.
- Users can retrieve all of their account details except for the password.

## Prerequisites
- Visual Studio Code (IDE)
- POSTMAN (for API testing)
- MySQL Database
- Node.js
- Digital Ocean (Hosting)

## Available Scripts
- **Development Server:** `npm start`
- **Run Tests:** `npx jest`

## API Endpoints
- **Health Check:** `GET` - `http://localhost:3000/healthz/`
- **List Assignments:** `GET` - `http://localhost:3000/v1/assignments/`
- **Create Assignment:** `POST` - `http://localhost:3000/v1/assignments/`
- **View Assignment:** `GET` - `http://localhost:3000/v1/assignments/{id}`
- **Delete Assignment:** `DELETE` - `http://localhost:3000/v1/assignments/{id}`
- **Update Assignment:** `PUT` - `http://localhost:3000/v1/assignments/{id}`

## HTTP Response Messages
- `200 OK` - The request succeeded.
- `201 Created` - A new resource was created as a result.
- `204 No Content` - The request succeeded with no content to return.
- `400 Bad Request` - Invalid request syntax.
- `401 Unauthorized` - Authentication required.
- `403 Forbidden` - Valid request but the server refuses action.
- `500 Internal Server Error` - The server encountered an error.
- `503 Service Unavailable` - The server is currently unavailable.

## Instructions
1. Clone or download and unzip the repository.
2. Create the required files in your preferred IDE.
3. Install dependencies and start the server using `npm start`.
4. Use Postman to test the APIs.
5. Monitor the database to reflect on the operations conducted via APIs.
6. Ensure the returned status codes align with the requirements.

## Testing the Service
- **Service Status:** `http://localhost:8080/healthz/` should return `200 OK`.
- **View Assignments:** `http://localhost:8080/cloud/assignments/` should return `204 No Content`.
