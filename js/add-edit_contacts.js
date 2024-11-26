const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let contacts = {};
let currentActiveContact = '';

/**
 * Initializes the contacts page by rendering the contact list.
 * @async
 * @function
 */
async function initContacts() {
    await init();
    renderContactList();
}

/**
 * Renders the contact list by fetching contacts from the database and sorting them alphabetically.
 * @async
 * @function
 */
async function renderContactList() {
    let contactsList = document.getElementById('contactslist');
    contacts = await createContactsObjectFromDatabase();
    contacts = sortByNameAscending(contacts);
    contactsList.innerHTML = getContactListHTMLbyAlphabet();
}

/**
 * Creates an object representing contacts from the database.
 * @async
 * @function
 * @returns {Promise<object[]>} A promise that resolves to an array of contact objects.
 */
async function createContactsObjectFromDatabase() {
    let contactsFromDatabase = await getContactsFromDatabase();
    let contacts = [];
    for (let contactId in contactsFromDatabase) {
        let contact = {
            id: contactId,
            name: contactsFromDatabase[contactId].name,
            initials: generateNameInitials(contactsFromDatabase[contactId].name),
            phone: contactsFromDatabase[contactId].phone,
            email: contactsFromDatabase[contactId].email,
            color: contactsFromDatabase[contactId].colorcode
        };
        contacts[contactId] = contact;
    }
    return contacts;
}

/**
 * Gets the indexes of contacts whose names start with the specified letter.
 * @function
 * @param {string} letter - The letter to filter contacts by.
 * @returns {string[]} An array of contact IDs.
 */
function getContactsIndexesByLetter(letter) {
    const result = Object.keys(contacts).filter(key => contacts[key].name[0].toUpperCase() === letter);
    return result;
}

/**
 * Generates HTML for the contact list, grouped alphabetically.
 * @function
 * @returns {string} The HTML string for the contact list.
 */
function getContactListHTMLbyAlphabet() {
    let htmlContent = "";
    const alphabetContacts = {};
    alphabet.forEach(letter => {
        alphabetContacts[letter] = [];
    });
    Object.keys(contacts).forEach(key => {
        const contact = contacts[key];
        const firstLetter = mapSpecialCharacterToAlphabet(contact.name[0]);
        if (alphabetContacts[firstLetter]) {
            alphabetContacts[firstLetter].push(key);
        } else {
            alphabetContacts[firstLetter] = [key];
        }
    });
    for (const letter of alphabet) {
        const contactIndexes = alphabetContacts[letter] || [];
        if (contactIndexes.length > 0) {
            htmlContent += getAlphabeticalHeaderHTML(letter);
            contactIndexes.forEach(contactIndex => {
                htmlContent += getContactEntryHTML(contactIndex);
            });
        }
    }
    return htmlContent;
}

/**
 * Maps special characters to their respective alphabetical equivalents.
 * @function
 * @param {string} letter - The letter to map.
 * @returns {string} The mapped letter.
 */
function mapSpecialCharacterToAlphabet(letter) {
    switch (letter) {
        case 'Ä':
        case 'ä':
            return 'A';
        case 'Ö':
        case 'ö':
            return 'O';
        case 'Ü':
        case 'ü':
            return 'U';
        default:
            return letter.toUpperCase();
    }
}

/**
 * Displays the single view of a contact and marks it as active. Sets up the UI accordingly
 * @function
 * @param {string} contactIndex - The ID of the contact to display.
 */
function renderContactSingleView(contactIndex) {
    showContactDetailsAreaIfHidden();
    showContactSingleView();
    markPreviousContactsAsInactive();
    currentActiveContact = contactIndex;
    markContactAsActive();
    loadContactSingleviewInfoInFields();
    showEditContactMobileButton();
}

/**
 * Shows the contact details area if it is hidden.
 * @function
 */
function showContactDetailsAreaIfHidden() {
    let element = document.getElementById("contact-details-area");
    let display = window.getComputedStyle(element).visibility;
    if (display === "hidden") {
        element.classList.add('show');
    }
}

/**
 * Hides the contact details area.
 * @function
 */
function hideContactDetailsArea() {
    let element = document.getElementById("contact-details-area");
    element.classList.remove('show');
    hideEditContactMobileButton();
}

/**
 * Shows the contact single view section.
 * @function
 */
function showContactSingleView() {
    document.getElementById('contact-singleview').classList.remove('d-none');
}

/**
 * Hides the contact single view section.
 * @function
 */
function hideContactSingleView() {
    document.getElementById('contact-singleview').classList.add('d-none');
}

/**
 * Marks the previously active contact as inactive.
 * @function
 */
function markPreviousContactsAsInactive() {
    if (currentActiveContact != '') {
        document.getElementById(`contactentry-${currentActiveContact}`).classList.remove('contactlist-entry-active');
    }
}

/**
 * Marks the currently active contact as active.
 * @function
 */
function markContactAsActive() {
    document.getElementById(`contactentry-${currentActiveContact}`).classList.add('contactlist-entry-active');
}

/**
 * Loads the contact details into the single view fields.
 * @function
 */
function loadContactSingleviewInfoInFields() {
    let singleviewInitials = document.getElementById('singleview-initials');
    let singleviewName = document.getElementById('singleview-name');
    let singleviewEmail = document.getElementById('singleview-email');
    let singleviewPhone = document.getElementById('singleview-phone');
    singleviewInitials.innerHTML = contacts[currentActiveContact].initials;
    singleviewInitials.style['background-color'] = getBackgroundColorByColorcode(contacts[currentActiveContact].color);
    singleviewName.innerHTML = contacts[currentActiveContact].name;
    if (contacts[currentActiveContact].email == getFromLocalStorage('email')) {
        singleviewName.innerHTML += ' (You)';
    }
    singleviewEmail.innerHTML = contacts[currentActiveContact].email;
    singleviewPhone.innerHTML = contacts[currentActiveContact].phone;
}

/**
 * Opens the overlay for adding a new contact and slides it in.
 * @async
 * @function
 */
async function openAddNewContactOverlay() {
    await loadFormIntoOverlay('./assets/templates/new_contact_form.html');
    slideInOverlay();
}

/**
 * Opens the overlay for editing an existing contact, fills the fields with current data, and slides it in.
 * @async
 * @function
 */
async function openEditContactOverlay() {
    await loadFormIntoOverlay('./assets/templates/edit_contact_form.html');
    fillOverlayInputfields();
    slideInOverlay();
    showEditContactMobileButton();
}

/**
 * Fills the overlay input fields with the current contact's data.
 * @function
 */
function fillOverlayInputfields() {
    let initialsElement = document.getElementById('edit-contact-initials');
    initialsElement.innerHTML = contacts[currentActiveContact].initials;
    initialsElement.style['background-color'] = getBackgroundColorByColorcode(contacts[currentActiveContact].color);
    document.getElementById('contact-namefield').value = contacts[currentActiveContact].name;
    document.getElementById('contact-emailfield').value = contacts[currentActiveContact].email;
    document.getElementById('contact-phonefield').value = contacts[currentActiveContact].phone;
}

/**
 * Slides in the overlay by adding appropriate classes.
 * @function
 */
function slideInOverlay() {
    document.getElementById('overlay').classList.add('show');
    document.getElementById('overlay-container').classList.add('overlay-slide-in');
}

/**
 * Shows the button for editing contacts in the mobile view.
 * @function
 */
function showEditContactMobileButton() {
    document.getElementById('btn-newcontact-mobile').classList.add('d-none');
    document.getElementById('btn-editcontact-mobile').classList.remove('d-none');
}

/**
 * Hides the button for editing contacts in the mobile view.
 * @function
 */
function hideEditContactMobileButton() {
    document.getElementById('btn-newcontact-mobile').classList.remove('d-none');
    document.getElementById('btn-editcontact-mobile').classList.add('d-none');
}

/**
 * Shows the mobile menu for editing contacts.
 * @function
 */
function showEditContactMobileMenu() {
    document.getElementById('edit-contact-mobile-menu').classList.remove('d-none');
}

/**
 * Hides the mobile menu for editing contacts.
 * @function
 */
function hideEditContactMobileMenu() {
    document.getElementById('edit-contact-mobile-menu').classList.add('d-none');
}

/**
 * Saves a new contact by getting data from the input fields and posting it to the database.
 * @async
 * @function
 */
async function saveNewContact() {
    const form = document.getElementById('addnew-contact-form');
    if (form.checkValidity()) {
        let contact = getContactFromInputfields();
        contact['colorcode'] = setRandomColorCode();
        let result = await postToDatabase("contacts/", contact);
        await renderContactList();
        renderContactSingleView(result.name);
        closeOverlay();
        showToastmessage('Contact successfully created!');
    }
}

/**
 * Saves changes to an existing contact by getting data from the input fields and updating the database.
 * @async
 * @function
 */
async function saveChangesToContact() {
    const form = document.getElementById('edit-contact-form');
    if (form.checkValidity()) {
        let contact = getContactFromInputfields();
        contact['colorcode'] = contacts[currentActiveContact].color;
        await updateOnDatabase("contacts/" + currentActiveContact, contact);
        if (contacts[currentActiveContact].email == getFromLocalStorage('email')) {
            await updateMyOwnUserData(contact);
        }
        await renderContactList();
        renderContactSingleView(currentActiveContact);
        closeOverlay();
        showToastmessage('Contact successfully updated!');
    }
}

/**
 * Deletes the currently active contact and removes it from assigned tasks if it is not the user's own contact.
 * @async
 * @function
 */
async function deleteContact() {
    if (contacts[currentActiveContact].email != getFromLocalStorage('email')) {
        await deleteFromDatabase('contacts/' + currentActiveContact);
        await removeContactFromAssignedTasks();
        currentActiveContact = '';
        await renderContactList();
        hideContactSingleView();
        showToastmessage('Contact successfully deleted!');
    } else {
        showToastmessage('Sorry, you can\'t delete yourself :-(');
    }
}

/**
 * Updates the user's own data with the new contact information.
 * @async
 * @function
 * @param {object} contactData - The new contact data.
 */
async function updateMyOwnUserData(contactData) {
    saveEmailInLocalStorage(contactData.email);
    saveUserInLocalStorage(contactData.name);
    userId = getFromLocalStorage('userId');
    await updateOnDatabase("users/" + userId + "/email/", contactData.email);
    await updateOnDatabase("users/" + userId + "/username/", contactData.name);
}

/**
 * Removes the contact from all tasks where it is assigned.
 * @async
 * @function
 */
async function removeContactFromAssignedTasks() {
    let tasks = await loadFromDatabase('tasks/');
    for (const taskId in tasks) {
        if (tasks[taskId].hasOwnProperty('assigned_to')) {
            let assignedContacts = tasks[taskId].assigned_to;
            let index = assignedContacts.indexOf(currentActiveContact);
            if (index !== -1) {
                assignedContacts.splice(index, 1);
                await updateOnDatabase('tasks/' + taskId + '/assigned_to/', assignedContacts);
            }
        }
    }
}

/**
 * Gets the contact data from the input fields.
 * @function
 * @returns {object} The contact data.
 */
function getContactFromInputfields() {
    let contact = {
        "name": document.getElementById('contact-namefield').value,
        "email": document.getElementById('contact-emailfield').value,
        "phone": document.getElementById('contact-phonefield').value
    };
    return contact;
}

/**
 * Deletes the contact via the overlay and closes the overlay.
 * @function
 */
function deleteContactViaOverlay() {
    deleteContact();
    closeOverlay();
    hideContactDetailsArea();
}

/**
 * Deletes the contact via the mobile menu and hides the mobile menu.
 * @function
 */
function deleteContactViaMobileMenu() {
    deleteContact();
    hideEditContactMobileMenu();
    hideContactDetailsArea();
}

/**
 * Opens the edit contact overlay via the mobile menu and hides the mobile menu.
 * @function
 */
function editContactViaMobileMenu() {
    openEditContactOverlay();
    hideEditContactMobileMenu();
}
