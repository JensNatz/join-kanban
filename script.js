/**
 * Initializes the page by forwarding the user if not logged in and setting up basic page content.
 * @async
 * @function init
 * @returns {Promise<void>}
 */
async function init() {
    forwardUserIfNotLoggedIn();
    initBasicPageContent();
}

/**
 * Forwards the user to the login page if they are not logged in.
 * @function forwardUserIfNotLoggedIn
 */
function forwardUserIfNotLoggedIn() {
    if (checkUserLoginstatus() === "not logged in") {
        window.location.href = "index.html";
    }
}

/**
 * Initializes basic page content, including the header and navbar, if the user is logged in.
 * @async
 * @function initBasicPageContent
 * @returns {Promise<void>}
 */
async function initBasicPageContent() {
    await includeHTML();
    if (checkUserLoginstatus() != "not logged in") {
        setHeaderUserInitials();
        setNavbarLinks();
        window.addEventListener("click", handleSubmenue);
    }
}

/**
 * Sets the user initials in the header based on the username stored in localStorage.
 * @function setHeaderUserInitials
 */
function setHeaderUserInitials() {
    document.getElementById('header-options').innerHTML = getHeaderOptionsHTML();
    let initilasContainer = document.getElementById('user-logo');
    let username = getFromLocalStorage('username');
    initilasContainer.innerHTML = generateNameInitials(username);    
}

/**
 * Sets up the navbar links if the user is logged in and highlights the active page.
 * @function setNavbarLinks
 */
function setNavbarLinks() {
    if (checkUserLoginstatus() != "not logged in") {
        document.getElementById('navbar').innerHTML = getNavbarLinksHTML();
        setActivePageInNavbar();
    }
}

/**
 * Highlights the active page in the navbar by adding an active class to the corresponding link.
 * @function setActivePageInNavbar
 */
function setActivePageInNavbar() {
    let currentPage = getCurrentPagename();
    let currentActiveLink = document.getElementById(`link-${currentPage}`);
    if (currentActiveLink !== null) {
        currentActiveLink.classList.add('navbar-link-active');
    }
}

/**
 * Gets the current page name from the URL.
 * @function getCurrentPagename
 * @returns {string} The current page name without file extension.
 */
function getCurrentPagename() {
    let path = window.location.pathname;
    let pagename = path.split("/").pop().split(".")[0];
    return pagename;
}

/**
 * Displays a toast message for 3 seconds.
 * @function showToastmessage
 * @param {string} message - The message to display in the toast.
 */
function showToastmessage(message) {
    const toast = document.getElementById('toastmessage');
    toast.innerHTML = message;
    toast.classList.add('toastmessage-show');
    setTimeout(() => {
        toast.classList.remove('toastmessage-show');
    }, 3000);
}

/**
 * Toggles the visibility of the sub-menu in the header.
 * @function toggleSubmenue
 */
function toggleSubmenue() {
    document.getElementById('submenue').classList.toggle('d-none');
}

/**
 * Handles the sub-menu toggle by hiding it if a click occurs outside the user logo or sub-menu.
 * @function handleSubmenue
 */
function handleSubmenue() {
    let submenue = document.getElementById("submenue");
    let userLogo = document.getElementById("user-logo");
    if (!submenue.contains(event.target) && !userLogo.contains(event.target)) {
        submenue.classList.add('d-none');
    }
}

/**
 * Checks the user's login status by retrieving the username from localStorage.
 * @function checkUserLoginstatus
 * @returns {string} 'guest', 'user', or 'not logged in' depending on the user's login status.
 */
function checkUserLoginstatus() {
    if (getFromLocalStorage('username')) {
        if (getFromLocalStorage('username') == 'guest') {
            return 'guest';
        }
        return 'user';
    }
    return 'not logged in';
}

/**
 * Retrieves a value from localStorage and parses it from JSON.
 * @function getFromLocalStorage
 * @param {string} key - The key to retrieve from localStorage.
 * @returns {*} The parsed value from localStorage.
 */
function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

/**
 * Saves the username in localStorage.
 * @function saveUserInLocalStorage
 * @param {string} username - The username to save.
 */
function saveUserInLocalStorage(username) {
    localStorage.setItem('username', JSON.stringify(username));
}

/**
 * Saves the user's email in localStorage.
 * @function saveEmailInLocalStorage
 * @param {string} email - The email to save.
 */
function saveEmailInLocalStorage(email) {
    localStorage.setItem('email', JSON.stringify(email));
}

/**
 * Saves the user ID in localStorage.
 * @function saveUserIdLocalStorage
 * @param {string} userId - The user ID to save.
 */
function saveUserIdLocalStorage(userId) {
    localStorage.setItem('userId', JSON.stringify(userId));
}

/**
 * Generates initials from a given name (first letter of first and last name).
 * @function generateNameInitials
 * @param {string} name - The full name to generate initials from.
 * @returns {string} The generated initials (up to two characters).
 */
function generateNameInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Generates a random color code between 0 and 8 for user logos or other elements.
 * @function setRandomColorCode
 * @returns {number} A random integer between 0 and 8.
 */
function setRandomColorCode() {
    return Math.floor(Math.random() * 9);
}

/**
 * Logs the user out by removing user-related data from localStorage and redirecting to the login page.
 * @function logOutUser
 */
function logOutUser() {
    removeFromLocalStorage('username');
    removeFromLocalStorage('email');
    removeFromLocalStorage('userId');
    window.location.href = 'index.html';
}

/**
 * Removes a specific key from localStorage.
 * @function removeFromLocalStorage
 * @param {string} key - The key to remove from localStorage.
 */
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Handles changes in the password field and updates the visibility icon based on the field's state.
 * @function handlePasswordFieldChange
 * @param {string} fieldId - The ID of the password field.
 * @param {string} iconId - The ID of the visibility icon.
 */
function handlePasswordFieldChange(fieldId, iconId) {
    const passField = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);

    if (passField.value === '') {
        updatePasswordIcon(icon, 'no-password');
        passField.type = 'password';
    } else {
        updatePasswordIcon(icon, passField.type === 'password' ? 'password-invisible' : 'password-visible');
    }
}

/**
 * Updates the password visibility icon's class based on the current state.
 * @function updatePasswordIcon
 * @param {HTMLElement} icon - The icon element to update.
 * @param {string} state - The state of the password field ('no-password', 'password-visible', 'password-invisible').
 */
function updatePasswordIcon(icon, state) {
    icon.className = `input-password-icon ${state}`;
}

/**
 * Toggles the visibility of the password field and updates the visibility icon.
 * @function showHidePass
 * @param {string} fieldId - The ID of the password field.
 * @param {string} iconId - The ID of the visibility icon.
 */
function showHidePass(fieldId, iconId) {
    const passField = document.getElementById(fieldId);
    passField.type = passField.type === 'password' ? 'text' : 'password';
    handlePasswordFieldChange(fieldId, iconId);
}