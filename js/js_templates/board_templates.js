maxNumberOfDescriptionCharacters = 40;

/**
 * Renders a "no tasks" message based on the provided ID.
 * @param {string} taskType - The type of task (e.g., 'todo', 'in_progress', 'feedback', 'done').
 * @returns {string} - The corresponding "no tasks" HTML.
 */
function getNoTasksHTML(taskType) {
    let message = ''  
    switch (taskType) {
        case 'todo':
            message = 'To do';
            break;
        case 'in_progress':
            message = 'in Progress';
            break;
        case 'feedback':
            message = 'awaiting Feedback';
            break;
        case 'done':
            message = 'done';
            break;
        default:
            message = 'available';
    }
    let html = `<div id="no-tasks-message-${taskType}" class="no-task-div d-flex-c-c"><span class="board-task-content">No tasks ${message}</span></div>`;
    return html;    
}


function getHTML(key) {
    return `
    <div id="task-${key}" draggable="true" ondragstart="startDragging('${key}')" ondragend="stopDragging('${key}')" onclick="slideInBoardOverlay('${key}')" class="active-task-div d-flex-clm gap16 cursor">
        ${getTaskCardContentHTML(key)}
    </div>
    `;
}

function getTaskCardContentHTML(key) {
    return `
         <div class="d-flex-bw-c">
            ${returnCategoryBG(tasks[key]['category'])}
            ${returnEditStatusButtonHTML(key)}
         </div>
        <div class="d-flex-clm">
            <span class="bord-task-headline">${tasks[key].title}</span>
            <span class="board-task-content">${truncateString(tasks[key].description)}</span>
        </div>
        <div id="subtask_todo_container-${key}" class="d-flex-bw-c">${getSubtaskHTML(key)}</div>
        <div class="d-flex-bw-c">
            <div class="user-badges d-flex">${getUsersForTasks(key)}</div>
            <img src="${returnPrioIMG(key)}">
        </div>
    `;
}


function returnCategoryBG(key) {
    return `
            <div class="d-flex task-${key == 'Technical Task' ? 'technical' : 'userstory'}-category">
                <label class="board-task-categorie">${key}</label>
            </div>
        `;
}

function returnEditStatusButtonHTML(taskId) {
    return `
            <div class="cursor status-menu-area">
                <div class="status-menu-button" onclick="toggleStatusMenu('${taskId}')"></div>
                ${returnEditStatusMenuHTML(taskId)}
            </div>
        `;
}

function returnEditStatusMenuHTML(taskId) {
    return `
            <div id="status-menu-${taskId}" class="status-menu d-none">
                ${returnEditStatusMenuItemsHTML(taskId)}
            </div>
        `;
}

function returnEditStatusMenuItemsHTML(taskId) {
    let html = '';
    if (tasks[taskId].status != 'to-do'){
        html += `<div class="status-menu-item" onclick="setTaskStatusViaMenu('${taskId}', 'to-do')">To do</div>`
    }
    if (tasks[taskId].status != 'progress'){
        html += `<div class="status-menu-item" onclick="setTaskStatusViaMenu('${taskId}', 'progress')">In progress</div>`
    }
    if (tasks[taskId].status != 'feedback'){
        html += `<div class="status-menu-item" onclick="setTaskStatusViaMenu('${taskId}', 'feedback')">Await feedback</div>`
    }
    if (tasks[taskId].status != 'done'){
        html += `<div class="status-menu-item" onclick="setTaskStatusViaMenu('${taskId}', 'done')">Done</div>`
    }

    return html;
}


function returnPrioIMG(key) {
    if (tasks[key].priority == 'low') {
        return './assets/img/icon_priority_low.png';
    } else if (tasks[key].priority == 'medium') {
        return './assets/img/icon_priority_medium.png';
    } else if (tasks[key].priority == 'urgent') {
        return './assets/img/icon_priority_high.png';
    }
}


function getCountOfDoneSubtasksForTasks(key) {
    let doneCount = 0;

    if (tasks[key].subtasks) {
        for (let i = 0; i < tasks[key].subtasks.length; i++) {
            const subtask = tasks[key].subtasks[i];
            if (subtask.done) {
                doneCount++
            }
        }
    }
    return doneCount;
}


function getSubtaskHTML(key) {
    if (!("subtasks" in tasks[key] && tasks[key].subtasks.length > 0)) {
        return ``;
    } else {
        const progressPercentage = getSubtaskProgress(key);
        return `
            <div class="progress-container">
                <svg class="progress-bar" xmlns="http://www.w3.org/2000/svg">
                  <rect width="${progressPercentage}%" class="progressbar-filler"></rect>
                </svg>
            </div>
            <span class="bord-task-subtask">${getCountOfDoneSubtasksForTasks(key)}/${tasks[key].subtasks.length} Subtasks</span>
        `;
    }
}


function getSubtaskProgress(key) {
    const task = tasks[key];
    if (!task.subtasks || task.subtasks.length === 0) {
        return 0;
    }
    const doneSubtasks = getDoneSubtasksForTasks(key);
    const totalSubtasks = task.subtasks.length;
    return (doneSubtasks / totalSubtasks) * 100;
}


function getDoneSubtasksForTasks(key) {
    const task = tasks[key];
    if (!task.subtasks) return 0;

    return task.subtasks.filter(subtask => subtask.done === true).length;
}


function getSubtaskForOverlay(taskId) {
    if (tasks[taskId].subtasks) {
        let html = '';
        for (let i = 0; i < tasks[taskId].subtasks.length; i++) {
            const subtask = tasks[taskId].subtasks[i];
            let checked = '';
            if (subtask.done) {
                checked = 'checked';
            }
            html += `
               <input type="checkbox" id="checkbox-${i}" ${checked} class="subtask-checkbox d-none">
                <label for="checkbox-${i}" class="d-flex-st-c gap16 subtask-checkbox-label" onclick="changeSubtaskStatus('${taskId}', ${i})">
                    <div class="subtask-checkbox-icon"></div>
                    <span>${subtask.title}</span>
                </label>
            `;
        }
        return html;
    }
    return `No Subtasks in this Task`;
}


function returnBoardTaskDialog(taskId) {
    return `
    <section class="task-details d-flex-ac">
        <div class="d-flex-clm f-1 gap16">
            <div class="task-${tasks[taskId].category == 'Technical Task' ? 'technical' : 'userstory'}-category  d-flex">
                <label class="board-task-categorie">${tasks[taskId].category}</label>
            </div>
            <div class="d-flex-clm">
                <h1 class="m-t-8">${tasks[taskId].title}</h1>   
                <h4 class="m-t-16">${tasks[taskId].description}</h4>
            </div>
            <div class="d-flex-ac gap24 m-t-16">
                <div class="d-flex-clm gap8">
                    <span class="board-dialog-infos">Due date:</span>
                    <span class="board-dialog-infos">Priority:</span>
                </div>
                 <div class="d-flex-clm gap8">
                    <span class="contacts-phone-info">${formatDate(tasks[taskId].date)}</span>
                    <div class="d-flex-ac gap8">
                        <span class="board-dialog-priority">${tasks[taskId].priority}</span><img class="board-dialog-priority-icon" src="${returnPrioIMG(taskId)}">
                    </div>
                </div>  
            </div>
            <div class="d-flex-clm gap8 m-t-16">
                <span class="board-dialog-infos">Assigned To:</span>
                <div class="d-flex-clm gap8 m-l-8 m-t-8">
                     ${getAssingedContactsHTML(taskId)}
                </div>
            </div>
            <div class="d-flex-clm gap8">
                <span class="board-dialog-infos">Subtasks</span>
                <div id="subtasks" class="d-flex-clm">
                    <div class="d-flex-clm gap8 m-l-8 m-t-8">
                        ${getSubtaskForOverlay(taskId)}
                    </div>
                </div>

                <div class="d-flex-end-c gap8 m-t-8">
                    <div onclick="submitDeleteTaskForm('${(taskId)}')" class="d-flex-ac cursor">
                        <img src="./assets/img/icon_trash.png" alt="">
                        <div class="active-task-subheadline">Delete</div>
                    </div>
                    <div class="board-dialog-dividing-line"></div>
                    <div onclick="showAddTaskOverlay('${(taskId)}')" class="d-flex-ac cursor">
                        <img src="./assets/img/icon_edit.png" alt="">
                        <div class="active-task-subheadline">Edit</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
}

function getAssingedContactsHTML(taskId) {
    let html = ''
    if (tasks[taskId].assigned_to) {
        let assignedContacts = tasks[taskId].assigned_to;
        for (let i = 0; i < assignedContacts.length; i++) {
            assignedContactId = assignedContacts[i];
            html += generateContactEntryHTML(assignedContactId);
        }
    } else {
        html = "No contacts assigned";
    }

    return html;

}

function generateContactEntryHTML(assignedContactId) {
    return `
        <div class="d-flex-ac gap8">
             <div class="board-initials d-flex-c-c" style="background-color:${getBackgroundColorByColorcode(contactObject[assignedContactId].color)}">
                ${generateNameInitials(contactObject[assignedContactId].name)}
            </div>
            <span>${contactObject[assignedContactId].name}${contactObject[assignedContactId].email == getFromLocalStorage('email') ? ' (You)' : ''}</span>
        </div>`;
}


function generateBoardInitialsHTML(assignedContactId) {
    return `
        <div class="board-initials d-flex-c-c" style="background-color:${getBackgroundColorByColorcode(contactObject[assignedContactId].color)}" >
           ${generateNameInitials(contactObject[assignedContactId].name)}
        </div>`;
}

function generateAdditionalInitalsBadgeHTML(numberOfContacts) {
    return `
        <div class="board-initials d-flex-c-c" style="background-color:#2A3647">
            +${numberOfContacts}
        </div>`;
}

function formatDate(inputDate) {
    let dateParts = inputDate.split('-');
    let year = dateParts[0];
    let month = dateParts[1];
    let day = dateParts[2];
    let formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

function truncateString(str) {
    if (str.length > maxNumberOfDescriptionCharacters) {
        return str.slice(0, maxNumberOfDescriptionCharacters) + "...";
    }
    return str;
}