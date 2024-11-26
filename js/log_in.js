/**
 * Logs in a user by comparing form inputs (email and password) with stored user data from the database.
 * If a match is found, user information is saved in local storage and the user is redirected to the summary page.
 * 
 * @async
 * @function logInUser
 * @returns {Promise<void>} Redirects to the summary page upon successful login.
 * 
 * @description 
 * - Retrieves the email and password entered by the user in the login form.
 * - Loads all users from the database and searches for a matching email.
 * - If a matching email is found, checks if the password is correct.
 * - If the password is correct, stores the user's information in local storage and redirects to "summary.html".
 * - If no matching email is found or the password is incorrect, no action is taken.
 * 
 */ 
async function logInUser() {
    hideErrorMessage();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let users = await loadFromDatabase('users/');
    let userFound = false;
    for (let userId in users) {
        let user = users[userId];
        if (user.email === email) {
            userFound = true;
            if (user.password === password) {
                saveUserInformationInLocalStorage(user.username, user.email, userId);
                window.location.href = "summary.html";
            } else {
                showErrorMessage();
                return;
            }
        }
    }
    if (!userFound) {
        showErrorMessage();
    }
}

/**
 * Saves the logged-in user's information in Local Storage.
 *
 * @param {string} username - The name of the logged-in user.
 * @param {string} email - The email address of the logged-in user.
 * @param {string} userId - The Firebase User ID of the logged-in user.
 */
function saveUserInformationInLocalStorage(username,email,userId){
    saveUserInLocalStorage(username);
    saveEmailInLocalStorage(email);
    saveUserIdLocalStorage(userId);
}

/**
 * Logs in the user as a guest and saves 'guest' in Local Storage.
 * 
 * The guest username is saved in Local Storage for use on summary.html,
 * and the user is redirected to the summary page.
 * 
 */
function logInGuestUser(){
    saveUserInLocalStorage('guest');
    window.location.href="summary.html";
}

/**
 * This function describes to show an error message when
 * Password and /or Email is not the same how in the Database 
 * 
 */
function showErrorMessage() {
    document.getElementById('password').classList.add('error');
    document.getElementById('email').classList.add('error');
    document.getElementById('error-message').classList.remove('d-none');
}

/**
 * This function describes to hide an error message when
 * Password and /or Email is not the same how in the Database 
 * 
 */
function hideErrorMessage() {
    document.getElementById('password').classList.remove('error');
    document.getElementById('email').classList.remove('error');
    document.getElementById('error-message').classList.add('d-none');
}