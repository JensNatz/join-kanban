/**
 * Fetches and includes HTML content from specified files into elements with the attribute `w3-include-html`.
 * This function scans the document for elements with the `w3-include-html` attribute, fetches the content
 * from the file specified in the attribute, and injects it into the corresponding elements. If the file 
 * cannot be loaded, an error message is displayed instead.
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when all HTML content has been included.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}
