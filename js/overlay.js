/**
 * Loads HTML content into the overlay element.
 * This function fetches content from the specified file and inserts it into the element
 * with the ID 'overlay-content'. If the file cannot be loaded, an error message is displayed instead.
 * 
 * @async
 * @function
 * @param {string} file - The URL of the HTML file to be loaded into the overlay.
 * @returns {Promise<void>} A promise that resolves when the content has been loaded into the overlay.
 */
async function loadFormIntoOverlay(file) {
    let overlay = document.getElementById('overlay-content');
    let resp = await fetch(file);
    if (resp.ok) {
        overlay.innerHTML = await resp.text();
    } else {
        overlay.innerHTML = 'Page not found';
    }
}

/**
 * Slides in the overlay container and makes the overlay visible.
 * This function adds the 'show' class to the overlay and the 'overlay-slide-in' class
 * to the overlay container to create a sliding effect.
 * 
 * @function
 * @returns {void}
 */
function slideInOverlay() {
    document.getElementById('overlay').classList.add('show');
    document.getElementById('overlay-container').classList.add('overlay-slide-in');
}

/**
 * Closes the overlay by sliding out the overlay container and hiding the overlay.
 * This function removes the 'overlay-slide-in' class from the overlay container to
 * reverse the sliding effect and then hides the overlay after a short delay.
 * 
 * @function
 * @returns {void}
 */
function closeOverlay() {
    document.getElementById('overlay-container').classList.remove('overlay-slide-in');
    setTimeout(() => {
        document.getElementById('overlay').classList.remove('show');
    }, 150);
}
