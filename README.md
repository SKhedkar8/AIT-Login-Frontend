# AIT Login System – Frontend

This repository contains the frontend of the AIT Login System, a full-stack user authentication application.

The frontend communicates with a Spring Boot backend through REST APIs and provides an interface for user registration, login, and dashboard access.

## Features

- Clean and responsive login interface.
- New user registration.
- Email and password input validation.
- Show/Hide password functionality.
- Backend API integration using JavaScript Fetch API.
- Personalized dashboard after successful login.
- Session persistence after browser refresh.
- Logout functionality.
- User-friendly success and error messages.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- Visual Studio Code
- Live Server

## Project Structure

```text
ait-frontend/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Backend Integration

The frontend communicates with the Spring Boot backend.

Backend API base URL:

`http://localhost:8080/api/users`

### Available API Operations

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Create a new account |
| POST | `/login` | Authenticate a user |
| GET | `/session` | Verify the login session |
| POST | `/logout` | End the login session |

## Running the Frontend

1. Clone or download this repository.
2. Open the `ait-frontend` folder in Visual Studio Code.
3. Open `index.html`.
4. Right-click and select **Open with Live Server**.
5. Make sure the Spring Boot backend and PostgreSQL database are running.

Frontend address:

`http://127.0.0.1:5500/index.html`

## Application Workflow

1. User opens the AIT Login System.
2. New users can create an account.
3. Registered users can log in.
4. The frontend sends credentials to the backend.
5. After successful authentication, the personalized dashboard appears.
6. The dashboard displays the user's name, email, and user ID.
7. Users can log out securely.

## Related Backend

The backend is developed separately using:

- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL

## Future Improvements

- Forgot password interface.
- User profile page.
- Improved dashboard functionality.
- Additional responsive design enhancements.

## Author

Developed as part of a full-stack application learning project.