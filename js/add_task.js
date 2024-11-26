let taskStatus = "to-do";
let subtasks = [];
let assignedContacts = [];
let assignableContacts = {};
let maxNumberOfAssignedContactsShown = 4;

/**
 * Initializes the "Add Task" functionality, including form generation, contact rendering, and event listener registration.
 * @async
 * @function
 */
async function initAddTask() {
    await init();
    document.getElementById('form-content').innerHTML = await generateAddTaskFormHTML();
    setMinDueDateForTaskForm();
    renderAssignableContacts();
    registerTaskFromEventListeners();   
}

/**
 * Sets the minimum allowable due date in a task form to today's date.
 * This function retrieves the current date, formats it as 'YYYY-MM-DD', 
 * and sets it as the 'min' attribute of an input field with the id 'task_date'.
 * @function
 */
function setMinDueDateForTaskForm() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task_date').setAttribute('min', today);
}


/**
 * Renders the list of contacts that can be assigned to a task.
 * @async
 * @function
 * @returns {Promise<string>} The HTML string for the assignable contacts and no contacts message.
 */
async function renderAssignableContacts() {
    assignableContacts = await getContactsFromDatabase();
    assignableContacts = sortByNameAscending(assignableContacts);
    let html = generateAssignableContactsHTML();
    html += generateNoContactsToShowMessageHTML();
    return html;
}

/**
 * Registers event listeners for task-related form inputs and interactions.
 * @function
 */
function registerTaskFromEventListeners(){
    document.getElementById('input-subtasks').addEventListener('keydown', handleKeyboardInput);
    document.getElementById('task_title').addEventListener('keydown', preventSubmit);
    window.addEventListener("click", closeDropdownsByOutsideClick);
}

/**
 * Submits the task creation form if it is valid, saves the task to the database, 
 * it then refreshes the board (if user on board page) or forwards the user to the board page.
 * @async
 * @function
 */
async function submitCreateTaskForm() {
    if (checkTaskFormValidity()) {
        let newTask = generateTaskObjektFromFormData();
        await saveNewTaskToDatabase(newTask);
        toggleSubmitButton();
        showToastmessage('Task created successfully!');

        if(getCurrentPagename() == "board"){
            await refreshBoard();
            closeOverlay();
        }

        if(getCurrentPagename() == "add_task"){
            setTimeout(() => {
                window.location.href = 'board.html';
            }, 1800);
        }
    }
}

/**
 * Submits the task update form if it is valid, updates the task in the database, and updates the task card content.
 * @async
 * @function
 * @param {string} taskId - The ID of the task to update.
 */
async function submitSaveTaskForm(taskId) {
    if (checkTaskFormValidity()) {
        let task = generateTaskObjektFromFormData();
        tasks[taskId] = task;      
        await updateOnDatabase('tasks/' + taskId, task);
        showToastmessage('Task successfully updated!');
        updateTaskCardContent(taskId);
        closeOverlay();
    }
}

/**
 * Submits the task deletion form, removes the task from the database, and refreshes the board.
 * @async
 * @function
 * @param {string} taskId - The ID of the task to delete.
 */
async function submitDeleteTaskForm(taskId){
    await deleteFromDatabase('tasks/' + taskId);
    refreshBoard();
    showToastmessage("Task successfully deleted");
    closeOverlay();
}

/**
 * Checks the validity of the task form.
 * @function
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function checkTaskFormValidity(){
    const form = document.getElementById('addtask-form');
    return form.checkValidity();
}

/**
 * Generates a task object from the form data.
 * @function
 * @returns {object} The task object.
 */
function generateTaskObjektFromFormData() {
    let newTask = {
        'title': document.getElementById('task_title').value,
        'description': document.getElementById('task_description').value,
        'assigned_to': assignedContacts,
        'date': document.getElementById('task_date').value,
        'priority': document.querySelector('input[name="priority"]:checked').value,
        'category': document.getElementById('task_category').value,
        'subtasks': generateSubtaskObjekt(),
        'status': taskStatus
    };
    return newTask;
}

/**
 * Generates a list of subtasks as an array of objects.
 * @function
 * @returns {object[]} The list of subtasks.
 */
function generateSubtaskObjekt() {
    let subtaskObject = [];
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = {
            'title': subtasks[i],
            'done': false
        }
        subtaskObject.push(subtask);
    }
    return subtaskObject;
}

/**
 * Saves a new task to the database and clears the form, then triggers the toast message.
 * @async
 * @function
 * @param {object} newTask - The new task to save.
 */
async function saveNewTaskToDatabase(newTask) {
    await postToDatabase('tasks/', newTask);
    clearForm();
    showToastmessage('Task added to board <img src="assets/img/icon_board_white.png">');
}

/**
 * Toggles the visibility of controls for the subtask input based on its content.
 * @function
 */
function toogleControlsForSubtaskInput() {
    if (document.getElementById('input-subtasks').value != '') {
        document.getElementById('input-subtasks-controls').classList.remove('d-none');
        document.getElementById('input-subtasks-icon').classList.add('d-none');
    } else {
        document.getElementById('input-subtasks-controls').classList.add('d-none');
        document.getElementById('input-subtasks-icon').classList.remove('d-none');
    }
}

/**
 * Handles keyboard input for the subtask input field, adds Subtask to list if pressed Key is "Enter"
 * @function
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyboardInput(event){
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtaskToList();
    }
}

/**
 * Clears the subtask input field and updates the controls.
 * @function
 */
function clearSubtasksInputField() {
    document.getElementById('input-subtasks').value = '';
    toogleControlsForSubtaskInput();
}

/**
 * Toggles the visibility of the subtask input field for a given task.
 * @function
 * @param {string} taskId - The ID of the task.
 */
function toggleSubtaskInputField(taskId) {
    document.getElementById('subtask-entry-' + taskId).classList.toggle('no-bullet');
    document.getElementById('subtask-entry-input-' + taskId).classList.toggle('d-none');
    document.getElementById('subtask-entry-text-' + taskId).classList.toggle('d-none');
    document.getElementById('subtask-editbtn-' + taskId).classList.toggle('d-none');
    document.getElementById('subtask-updatebtn-' + taskId).classList.toggle('d-none');
    document.getElementById('input-subtasks-controls-' + taskId).classList.toggle('d-none');
}

/**
 * Adds a new subtask to the list and updates the display.
 * @function
 */
function addSubtaskToList() {
    let subtask = document.getElementById('input-subtasks').value;
    if (subtask != '') {
        subtasks.push(subtask);
        renderSubtasksInList();
        clearSubtasksInputField();
    }
}

/**
 * Updates an existing subtask or deletes it if the input is empty.
 * @function
 * @param {string} taskId - The ID of the task.
 */
function updateSubtask(taskId) {
    let subtaskInput = document.getElementById('subtask-entry-input-' + taskId);
    if (subtaskInput.value == '') {
        deleteSubtask(taskId);
    } else {
        subtasks[taskId] = subtaskInput.value;
        renderSubtasksInList();
    }
}

/**
 * Deletes a subtask from the list and updates the display.
 * @function
 * @param {string} taskId - The ID of the task.
 */
function deleteSubtask(taskId) {
    subtasks.splice(taskId, 1);
    renderSubtasksInList();
}

/**
 * Renders the list of subtasks in the UI.
 * @function
 */
function renderSubtasksInList() {
    let list = document.getElementById('subtasks-list');
    list.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let entry = generateSubtaskEntryHTML(i);
        list.innerHTML += entry;
    }
}

/**
 * Toggles the state of the submit button based on the form validity.
 * @function
 */
function toggleSubmitButton() {
    const form = document.getElementById('addtask-form');
    if (form.checkValidity() && document.getElementById('task_category').value != '') {
        document.getElementById('submit-button').disabled = false;
    } else {
        document.getElementById('submit-button').disabled = true;
    }
}

/**
 * Clears the task form and resets the state.
 * @function
 * @param {Event} [event] - The event that triggered the function (optional).
 */
function clearForm(event) {
    if(event){
        event.preventDefault();
    }
    document.getElementById('addtask-form').reset();
    subtasks = [];
    assignedContacts = [];
    renderSubtasksInList();
    renderAssignedContactsInitials();
    toggleSubmitButton();
}

/**
 * Assigns a contact to the task by their ID.
 * @function
 * @param {string} contactId - The ID of the contact to assign.
 */
function assignContact(contactId) {
    assignedContacts.push(contactId);
}

/**
 * Unassigns a contact from the task by their ID.
 * @function
 * @param {string} contactId - The ID of the contact to unassign.
 */
function unAssignContact(contactId) {
    let index = assignedContacts.indexOf(contactId);
    assignedContacts.splice(index, 1);
}

/**
 * Handles changes to a checkbox and updates the assigned contacts list accordingly.
 * @function
 * @param {HTMLInputElement} checkbox - The checkbox element that triggered the change.
 */
function handleCheckboxChange(checkbox) {
    let contactId = checkbox.value;
    if (checkbox.checked) {
        assignContact(contactId);
    } else {
        unAssignContact(contactId);
    }
    renderAssignedContactsInitials();
}

/**
 * Renders the initials of assigned contacts in the UI.
 * @function
 */
function renderAssignedContactsInitials() {
    let container = document.getElementById('assigned-contacts');
    container.innerHTML = '';
    for (let i = 0; i < assignedContacts.length && i < maxNumberOfAssignedContactsShown; i++) {
        let contactId = assignedContacts[i];
        container.innerHTML += generateContactInitialsHTML(contactId);
    }
    if (assignedContacts.length > maxNumberOfAssignedContactsShown){
        let additionalAssigendContacts = assignedContacts.length - maxNumberOfAssignedContactsShown;
        container.innerHTML += generateAdditionalContactsBadgeHTML(additionalAssigendContacts);
    }
}

/**
 * Shows the contacts dropdown.
 * @function
 */
function showContacts() {
    document.getElementById('contacts').classList.add('show');
    document.getElementById('input-drowdownarrow-icon').classList.add('icon-up');
}

/**
 * Hides the contacts dropdown.
 * @function
 */
function hideContacts() {
    document.getElementById('contacts').classList.remove('show');
    document.getElementById('input-drowdownarrow-icon').classList.remove('icon-up');
}

/**
 * Toggles the visibility of the contacts dropdown.
 * @function
 */
function toogleContacts() {
    document.getElementById('contacts').classList.toggle('show');
    document.getElementById('input-drowdownarrow-icon').classList.toggle('icon-up');
}

/**
 * Closes the contacts dropdown if a click is detected outside of it.
 * @function
 */
function closeDropdownsByOutsideClick() {
    const contactAreaContacts = document.getElementById("contact-list-area");
    if (contactAreaContacts && !contactAreaContacts.contains(event.target)) {
        hideContacts();
    }
    const contactAreaCategories = document.getElementById("category-dropdown-area");
    if (contactAreaCategories && !contactAreaCategories.contains(event.target)) {
        hideCategories();
    }
}

/**
 * Hides/shows entries in the list of contacts based on the search query.
 * @function
 */
function filterContacts() {
    let query = document.getElementById('assigned_to').value.toLowerCase();
    let entries = document.getElementsByClassName('contact-entry');
    let hiddenEntriesCounter = 0;
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let contactName = entry.querySelector('.contact-entry-name');
        if (!(contactName.innerHTML.toLowerCase().includes(query))) {
            entry.classList.add('d-none');
            hiddenEntriesCounter++;
        } else {
            entry.classList.remove('d-none');
        }
    }
    toggleNoContactsMessage(hiddenEntriesCounter, entries.length);
}

/**
 * Toggles the visibility of the no contacts message based on the number of hidden entries.
 * @function
 * @param {number} sumhiddenEntries - The number of hidden entries.
 * @param {number} sumAllEntries - The total number of entries.
 */
function toggleNoContactsMessage(sumhiddenEntries, sumAllEntries) {
    if (sumhiddenEntries == sumAllEntries) {
        document.getElementById('no-contacts-message').classList.remove('d-none');
    } else {
        document.getElementById('no-contacts-message').classList.add('d-none');
    }
}

/**
 * Sets the task category and updates the UI.
 * @function
 * @param {string} category - The category to set.
 */
function setCategory(category) {
    document.getElementById('task_category').value = category;
    hideCategories();
    toggleSubmitButton();
}

/**
 * Shows the task categories dropdown.
 * @function
 */
function showCategories() {
    document.getElementById('task-categories').classList.add('show');
    document.getElementById('category-drowdownarrow-icon').classList.add('icon-up');
}

/**
 * Hides the task categories dropdown.
 * @function
 */
function hideCategories() {
    document.getElementById('task-categories').classList.remove('show');
    document.getElementById('category-drowdownarrow-icon').classList.remove('icon-up');
}

/**
 * Toggles the visibility of the task categories dropdown.
 * @function
 */
function toogleCategories() {
    document.getElementById('task-categories').classList.toggle('show');
    document.getElementById('category-drowdownarrow-icon').classList.toggle('icon-up');
}

/**
 * Prevents the default form submission action on Enter key press.
 * @function
 */
function preventSubmit() {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}
