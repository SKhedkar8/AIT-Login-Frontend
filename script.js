const API_URL = "http://localhost:8080/api/users";

// Form elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginFormElement = document.getElementById("loginFormElement");
const registerFormElement = document.getElementById("registerFormElement");

const message = document.getElementById("message");


// Switch between Login and Registration
document.getElementById("showRegister").addEventListener("click", function (e) {
    e.preventDefault();

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    showMessage("");
});

document.getElementById("showLogin").addEventListener("click", function (e) {
    e.preventDefault();

    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

    showMessage("");
});


// Display messages
function showMessage(text, success = false) {

    message.textContent = text;

    message.style.color = success ? "#15803d" : "#dc2626";

    message.style.fontWeight = "500";
}


// Get user-friendly API error messages
function getErrorMessage(data, response, operation) {

    if (response.status === 409) {
        return "This email is already registered. Please login.";
    }

    if (response.status === 401) {
        return "Invalid email or password. Please try again.";
    }

    if (response.status === 400) {

        if (data.message) {
            return data.message;
        }

        if (data.errors && Array.isArray(data.errors)) {
            return data.errors
                .map(error => error.defaultMessage || error.message)
                .filter(Boolean)
                .join(", ");
        }

        return "Please check your details and try again.";
    }

    if (response.status === 500) {
        return "Something went wrong on the server. Please try again later.";
    }

    return data.message || data.error ||
        `${operation} failed. Please try again.`;
}


// Safely read API response
async function readResponse(response) {

    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}


// Registration API
registerFormElement.addEventListener("submit", async function (e) {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const submitButton = registerFormElement.querySelector(
        'button[type="submit"]'
    );

    // Frontend validation
    if (fullName.length === 0) {
        showMessage("Please enter your full name.");
        return;
    }

    if (password.length < 8) {
        showMessage("Password must contain at least 8 characters.");
        return;
    }

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";

        showMessage("Creating your account...", true);

        const response = await fetch(`${API_URL}/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })

        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                getErrorMessage(data, response, "Registration")
            );
        }

        showMessage(
            "Registration successful! Please login.",
            true
        );

        registerFormElement.reset();

        // Return to login form
        setTimeout(() => {

            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");

            showMessage("");

        }, 1500);

    } catch (error) {

        if (error instanceof TypeError) {
            showMessage(
                "Unable to connect to the server. Please check whether the backend is running."
            );
        } else {
            showMessage(error.message);
        }

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Create Account";

    }

});


// Login API
loginFormElement.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const submitButton = loginFormElement.querySelector(
        'button[type="submit"]'
    );

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Logging In...";

        showMessage("Verifying your credentials...", true);

        const response = await fetch(`${API_URL}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                getErrorMessage(data, response, "Login")
            );
        }

        showDashboard(data);

    } catch (error) {

        if (error instanceof TypeError) {
            showMessage(
                "Unable to connect to the server. Please check whether the backend is running."
            );
        } else {
            showMessage(error.message);
        }

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Login";

    }

});


// Dashboard after successful login
function showDashboard(user) {

    const formSection = document.querySelector(".form-section");

    formSection.innerHTML = "";

    const dashboard = document.createElement("div");

    dashboard.className = "dashboard";

    const heading = document.createElement("h1");
    heading.textContent = "Welcome to AIT!";

    const greeting = document.createElement("h2");
    greeting.textContent = `Hello, ${user.fullName}!`;

    const description = document.createElement("p");

    description.textContent =
        "You have successfully logged in to your AIT account.";

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const userId = document.createElement("p");
    userId.textContent = `User ID: ${user.id ?? user.userId}`;

    const logoutButton = document.createElement("button");

    logoutButton.textContent = "Logout";

    logoutButton.addEventListener("click", logout);

    dashboard.append(
        heading,
        greeting,
        description,
        email,
        userId,
        logoutButton
    );

    formSection.appendChild(dashboard);

}


// Logout API
async function logout() {

    try {

        const response = await fetch(`${API_URL}/logout`, {

            method: "POST",

            credentials: "include"

        });

        if (!response.ok) {
            throw new Error("Logout failed. Please try again.");
        }

        location.reload();

    } catch (error) {

        alert(error.message);

    }

}


// Check existing login session when website loads
async function checkExistingSession() {

    try {

        const response = await fetch(`${API_URL}/session`, {

            method: "GET",

            credentials: "include"

        });

        if (!response.ok) {
            return;
        }

        const user = await response.json();

        if (user.loggedIn) {

            showDashboard({

                id: user.userId,

                fullName: user.fullName,

                email: user.email

            });

        }

    } catch (error) {

        console.log("Unable to check existing session.");

    }

}


// Automatically check session on page load
document.addEventListener(
    "DOMContentLoaded",
    checkExistingSession
);


// Show and Hide Password
document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", function () {

        const targetId = this.getAttribute("data-target");

        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            this.textContent = "Hide";

            this.setAttribute("aria-label", "Hide password");

        } else {

            passwordInput.type = "password";

            this.textContent = "Show";

            this.setAttribute("aria-label", "Show password");

        }

    });

});