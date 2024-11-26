/**
 * Validates the user sign-up form and processes the sign-up.
 * Prevents form submission, checks if the passwords match, and if the 
 * form fields are correctly filled out. If valid, creates new user objects 
 * and sends them to the database. Shows a success message and redirects to 
 * the login page after a short delay.
 * 
 * @returns {void}
 */
async function validateUserSignUp() {
    event.preventDefault();
    let username = document.getElementById('name');
    let password = document.getElementById('password');
    let passwordConfirm = document.getElementById('passwordC');
    let emailUser = document.getElementById('email');
    hideErrorMessage();
    if (password.value != passwordConfirm.value) {
        showErrorMessage();
        return;
    }
    if (username.value && emailUser.value && password.value && password.value === passwordConfirm.value) {
        const { user, contact } = createNewUserObjectsForDatabase(username, password, emailUser);
        await postNewUser(user, contact);
        showToastmessage('You signed up successfully');
        setTimeout(() => {
            forwardingSignupToLogin();
        }, 3000);
    }
}

/**
 * Displays an error message when the password and password confirmation 
 * do not match in the sign-up form.
 * 
 * @returns {void}
 */
function showErrorMessage() {
    document.getElementById('password').classList.add('error');
    document.getElementById('passwordC').classList.add('error');
    document.getElementById('error-message').classList.remove('d-none');
}

/**
 * Hides the error message when the password and password confirmation 
 * match in the sign-up form.
 * 
 * @returns {void}
 */
function hideErrorMessage() {
    document.getElementById('password').classList.remove('error');
    document.getElementById('passwordC').classList.remove('error');
    document.getElementById('error-message').classList.add('d-none');
}

/**
 * Creates two new objects: one for the user and one for their contact information.
 * These objects are populated with data from the sign-up form and sent to the database.
 * 
 * @param {HTMLElement} username - The username field from the sign-up form.
 * @param {HTMLElement} password - The password field from the sign-up form.
 * @param {HTMLElement} email - The email field from the sign-up form.
 * @returns {Object} An object containing the user and contact data.
 */
function createNewUserObjectsForDatabase(username, password, email) {
    let user = {
        username: username.value,
        password: password.value,
        email: email.value
    };
    let contact = {
        name: username.value,
        email: email.value,
        phone: '',
        colorcode: setRandomColorCode()
    };
    return { user, contact };
}

/**
 * Sends the new user and contact data to the database.
 * If an error occurs, it displays an error message to the user.
 * 
 * @param {Object} user - The user object containing the new user's data.
 * @param {Object} contact - The contact object containing the new user's contact data.
 * @returns {Promise<void>}
 */
async function postNewUser(user, contact) {
    try {
        await postToDatabase('users/', user);
        await postToDatabase('contacts/', contact);
    } catch (error) {
        showToastmessage('An error occurred. Please try again.');
    }
}

/**
 * Redirects the user to the login page after successful sign-up.
 * 
 * @returns {void}
 */
function forwardingSignupToLogin() {
    window.location.href = "index.html";
}

/**
 * Toggles the sign-up button's enabled state based on whether 
 * the privacy policy checkbox is checked.
 * If the checkbox is checked, the button is enabled; otherwise, it is disabled.
 * 
 * @returns {void}
 */
function toggleSignupButton() {
    const checkbox = document.getElementById("remember");
    if (checkbox.checked) {
        document.getElementById("signup-button").disabled = false;
    } else {
        document.getElementById("signup-button").disabled = true;
    }
}
