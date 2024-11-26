async function generateAddTaskFormHTML(taskId) {
    let title = '';
    let description = '';
    let dueDate = '';
    let priority = 'medium'; 
    let category = '';

    if (taskId !== undefined) {
        title = tasks[taskId].title;
        description = tasks[taskId].description;
        dueDate = tasks[taskId].date;
        priority = tasks[taskId].priority;
        category = tasks[taskId].category;
    }

    return `${generateTaskFormHeadlineHTML(taskId)}
        <form id="addtask-form" class="${taskId !== undefined ? 'task-details' : 'addtask-form'} m-t-24" onsubmit="return false">
            <div class="addtask-form-container d-flex ${taskId !== undefined ? 'd-flex-clm' : ''} gap24">
                <div class="addtaskform-left d-flex-clm">
                    <label for="task_title">Title <span class="required-asterix">*</span></label>
                    <input type="text" name="title" id="task_title" class="m-t-4" placeholder="Enter a title" value="${title}" required oninput="toggleSubmitButton()">
                    <label class="m-t-24" for="task_description">Description</label>
                    <textarea rows="4" name="description" id="task_description" class="m-t-4" placeholder="Enter a description">${description}</textarea>
                    <label class="m-t-24" for="assigned_to">Assigned to</label>
                    <div id="contact-list-area" class="contact-list-area">
                        <div class="input-container" style="z-index: 2;">
                            <input class="input-filter-contacts m-t-4" id="assigned_to" type="text" placeholder="Select contacts to assign" oninput="filterContacts()" onfocus="showContacts()">
                            <div id="input-drowdownarrow-icon" class="input-drowdownarrow-icon" onclick="toogleContacts()"></div>
                        </div>
                        <div id="contacts" class="contacts">
                            ${await renderAssignableContacts()}
                        </div>
                        <div id="assigned-contacts" class="assigned-contacts d-flex gap4 m-t-8">
                        
                        </div>
                    </div>
                </div>
                <div class="addtaskform-divider ${taskId !== undefined ? 'd-none' : ''}"></div>
                <div class="addtaskform-right d-flex-clm">
                    <label for="task_date">Due Date <span class="required-asterix">*</span></label>
                    <input type="date" name="date" id="task_date" class="m-t-4" value="${dueDate}" required oninput="toggleSubmitButton()">
                    <label class="m-t-24">Prio</label>
                    <div class="priority-buttons d-flex gap8 m-t-4">
                        <input type="radio" id="priority1" name="priority" value="urgent" ${priority === 'urgent' ? 'checked' : ''}>
                        <label for="priority1" class="d-flex-c-c gap8">Urgent<div class="priority-button-img priority-button-img-high"></div></label>
                        <input type="radio" id="priority2" name="priority" value="medium" ${priority === 'medium' ? 'checked' : ''}>
                        <label for="priority2" class="d-flex-c-c gap8">Medium<div class="priority-button-img priority-button-img-medium"></div></label>
                        <input type="radio" id="priority3" name="priority" value="low" ${priority === 'low' ? 'checked' : ''}>
                        <label for="priority3" class="d-flex-c-c gap8">Low<div class="priority-button-img priority-button-img-low"></div></label>
                    </div>
                    <label class="m-t-24" for="task_category">Category <span class="required-asterix">*</span></label>
                    <div id="category-dropdown-area" class="category-dropdown-area m-t-4">
                        <div class="input-container" style="z-index: 2;">
                            <input id="task_category" type="text" placeholder="Select task category" readonly required value="${category}" onfocus="showCategories()">
                            <div id="category-drowdownarrow-icon" class="input-drowdownarrow-icon" onclick="toogleCategories()"></div>
                        </div>
                        <div id="task-categories" class="category-dropdown">
                            <div class="category-dropdown-entry" value="Technical Task" onclick="setCategory('Technical Task')">Technical Task</div>
                            <div class="category-dropdown-entry" value="User Story" onclick="setCategory('User Story')">User Story</div>
                        </div>
                    </div>
                    <label class="m-t-24" for="input-subtasks">Subtasks</label>
                    <div class="input-container m-t-4">
                        <input id="input-subtasks" type="text" name="subtasks" oninput="toogleControlsForSubtaskInput()">
                        <img class="input-subtasks-icon" id="input-subtasks-icon" src="./assets/img/icon_add.png" alt="+">
                        <div id="input-subtasks-controls" class="input-subtasks-controls d-none d-flex-c-c gap4">
                            <img src="./assets/img/icon_close.png" alt="" onclick="clearSubtasksInputField()">
                            <div class="input-subtasks-controls-divider"></div>
                            <img src="./assets/img/icon_success.png" alt="" onclick="addSubtaskToList()">
                        </div>
                    </div>
                    <ul class="subtasks-list m-t-8" id="subtasks-list"></ul>
                </div>
            </div>
            <div class="d-flex-bw-st m-t-24 m-b-24">
                <span class="a-self-end"><span class="required-asterix">*</span> This field is required</span>
                <div class="d-flex gap8">
                    ${generateTaskFormSubmitbuttonsHTML(taskId)}
                </div>
            </div>
        </form>`;
}

function generateTaskFormHeadlineHTML(taskId) {
    if (taskId === undefined) {
        return `<h1>Add task</h1>`;
    } else {
        return ``;
    }
}

function generateAssignableContactsHTML() {
    let html = '';
    for (const contact in assignableContacts) {
        html += generateContactCheckboxHTML(contact);
    }
    return html;
}

function generateNoContactsToShowMessageHTML() {
    return `<div id="no-contacts-message" class="d-none">No matching contacts</div>`
}

function generateContactCheckboxHTML(contactId) {
    let checked = '';
    if (assignedContacts.includes(contactId)){
        checked = "checked";
    }

    let html = `
        <div class="contact-entry d-flex-ac gap8">
            <input type="checkbox" id="contact-${contactId}" name=contact-${contactId}" value="${contactId}" ${checked} class="d-none" onchange="handleCheckboxChange(this)"> 
            <label for="contact-${contactId}" class="d-flex-ac f-1 gap8"">
                ${generateContactInitialsHTML(contactId)}<span class="contact-entry-name">${assignableContacts[contactId].name}${assignableContacts[contactId].email == getFromLocalStorage('email') ? ' (You)' : ''}</span>
                <div class="contact-checkbox"></div>
            </label >
        </div >`;
    return html;
}

function generateContactInitialsHTML(contactId) {
    return `
        <div class="contact-initials d-flex-c-c" style="background-color:${getBackgroundColorByColorcode(assignableContacts[contactId].colorcode)}" >
            ${generateNameInitials(assignableContacts[contactId].name)}
        </div>`;
}

function generateAdditionalContactsBadgeHTML(numberOfContacts) {
    return `
        <div class="contact-initials d-flex-c-c" style="background-color:#2A3647">
           +${numberOfContacts}
        </div>`;
}

function generateSubtaskEntryHTML(subtaskId) {
    return `
            <li id="subtask-entry-${subtaskId}" class="subtask-entry input-container">
                <span id="subtask-entry-text-${subtaskId}" class="subtask-entry-text" ondblclick="toggleSubtaskInputField(${subtaskId})">${subtasks[subtaskId]}</span>
                <input id="subtask-entry-input-${subtaskId}" class="subtask-entry-input d-none" type="text" value="${subtasks[subtaskId]}">
                <div id="input-subtasks-controls-${subtaskId}" class="input-subtasks-controls d-flex gap4 d-none">
                    <img id="subtask-editbtn-${subtaskId}" src="./assets/img/icon_edit.png" alt="" onclick="toggleSubtaskInputField(${subtaskId})">
                    <img id="subtask-updatebtn-${subtaskId}" class="d-none" src="./assets/img/icon_success.png" alt="" onclick="updateSubtask(${subtaskId})">
                    <div class="input-subtasks-controls-divider"></div>
                     <img src="./assets/img/icon_trash.png" alt="" onclick="deleteSubtask(${subtaskId})">
                </div>
            </li>`;
}

function generateTaskFormSubmitbuttonsHTML(taskId){
    if (taskId !== undefined) {
        return `
            <button id="submit-button" class="button-font d-flex-c-c gap8" type="submit" onclick="submitSaveTaskForm('${taskId}')">
                OK
                <img src="./assets/img/icon_success_white.png" alt="">
            </button>`;
    } else {
        return `
            <button class="btn-clear button-clear-font" onclick="clearForm(event)">Clear</button>
            <button id="submit-button" class="button-font d-flex-c-c gap8" type="submit" disabled onclick="submitCreateTaskForm()">
                Create task
                <img src="./assets/img/icon_success_white.png" alt="">
            </button>`;
    }
}