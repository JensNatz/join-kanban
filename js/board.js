let tasks = {};
let taskContacts = {};
let todoTask = {};
let progressTask = {};
let feedbackTask = {};
let doneTask = {};
let doneSubtasks = [];
let currentDraggedElement;
let contactObject = {};
let maxNumberOfAssignedContactsShownInCard = 4;

/**
 * Initializes the task board by loading tasks and contacts from the database and rendering the board.
 * @async
 * @function initBoard
 * @returns {Promise<void>}
 */
async function initBoard() {
    await init();
    await loadTasksFromDatabase('tasks');
    contactObject = await createContactsObjectFromDatabase();
    refreshBoard();
    renderAssignableContacts();
}

/**
 * Refreshes the task board by reloading tasks from the database, filtering tasks by status, and rendering the board.
 * @async
 * @function refreshBoard
 * @returns {Promise<void>}
 */
async function refreshBoard() {
    await loadTasksFromDatabase();
    filterTasksStatus();
    renderBoard();
}

/**
 * Loads tasks from the database into the global `tasks` variable.
 * @async
 * @function loadTasksFromDatabase
 * @param {string} [collectionName='tasks'] - The name of the database collection to load tasks from.
 * @returns {Promise<void>}
 */
async function loadTasksFromDatabase(collectionName = 'tasks') {
    tasks = await loadFromDatabase(collectionName);
}

/**
 * Renders all tasks on the board based on their status.
 * @function renderBoard
 */
function renderBoard() {
    renderTodoTasks();
    renderProgressTasks();
    renderFeedbackTasks();
    renderDoneTasks();
}

/**
 * Renders tasks into the corresponding board column based on task type.
 * @param {string} taskType - The type of tasks (e.g., 'todo', 'in_progress', 'feedback', 'done').
 * @param {object} taskList - The list of tasks for the given type.
 * @param {string} containerId - The ID of the HTML container where the tasks will be rendered.
 */
function renderTasks(taskType, taskList, containerId) {
    let taskContent = document.getElementById(containerId);
    let html = '';
    if (Object.keys(taskList).length == 0) {
        html += `<div class="d-flex-clm no-tasks-container">
                    ${getNoTasksHTML(taskType)}
                    <div id="highlight_${taskType}_container" class="drag-area-highlight notasks-highlight"></div>
                </div>`;
    } else {
        for (const key in taskList) {
            html += getHTML(key);
        }
        html += `<div id="highlight_${taskType}_container" class="drag-area-highlight"></div>`;
    }
    taskContent.innerHTML = html;
}

/**
 * Renders "To-Do" tasks into the corresponding board column.
 * This function delegates the task rendering to the `renderTasks` function,
 * passing the "To-Do" task type, task data, and container ID.
 * @function renderTodoTasks
 */
function renderTodoTasks() {
    renderTasks('todo', todoTask, 'todo_tasks');
}

/**
 * Renders "In Progress" tasks into the corresponding board column.
 * This function delegates the task rendering to the `renderTasks` function,
 * passing the "In Progress" task type, task data, and container ID.
 * @function renderProgressTasks
 */
function renderProgressTasks() {
    renderTasks('in_progress', progressTask, 'in_progress_tasks');
}

/**
 * Renders "Awaiting Feedback" tasks into the corresponding board column.
 * This function delegates the task rendering to the `renderTasks` function,
 * passing the "Awaiting Feedback" task type, task data, and container ID.
 * @function renderFeedbackTasks
 */
function renderFeedbackTasks() {
    renderTasks('feedback', feedbackTask, 'await_feedback_tasks');
}

/**
 * Renders "Done" tasks into the corresponding board column.
 * This function delegates the task rendering to the `renderTasks` function,
 * passing the "Done" task type, task data, and container ID.
 * @function renderDoneTasks
 */
function renderDoneTasks() {
    renderTasks('done', doneTask, 'done_tasks');
}

/**
 * Searches tasks by their title or description, and categorizes them into status columns.
 * @function searchTasks
 */
function searchTasks() {
    let searchInputRef = document.getElementById('search_input');
    let searchInput = searchInputRef.value.toLowerCase();

    todoTask = {};
    progressTask = {};
    feedbackTask = {};
    doneTask = {};

    for (let taskId in tasks) {
        let task = tasks[taskId];
        let title = task.title.toLowerCase();
        let description = task.description.toLowerCase();

        if (title.includes(searchInput) || description.includes(searchInput)) {
            switch (task.status) {
                case 'to-do':
                    todoTask[taskId] = task;
                    break;
                case 'progress':
                    progressTask[taskId] = task;
                    break;
                case 'feedback':
                    feedbackTask[taskId] = task;
                    break;
                case 'done':
                    doneTask[taskId] = task;
                    break;
            }
        }
    }
    renderBoard();
}

/**
 * Filters tasks based on their status and categorizes them into separate groups.
 * @function filterTasksStatus
 */
function filterTasksStatus() {
    todoTask = {};
    progressTask = {};
    feedbackTask = {};
    doneTask = {};

    for (let taskId in tasks) {
        let task = tasks[taskId];
        switch (task.status) {
            case 'to-do':
                todoTask[taskId] = task;
                break;
            case 'progress':
                progressTask[taskId] = task;
                break;
            case 'feedback':
                feedbackTask[taskId] = task;
                break;
            case 'done':
                doneTask[taskId] = task;
                break;
        }
    }
}

/**
 * Retrieves and generates the HTML for the users assigned to a specific task.
 * @function getUsersForTasks
 * @param {string} key - The task ID used to retrieve the task.
 * @returns {string} The HTML representing the users assigned to the task.
 */
function getUsersForTasks(key) {
    let task = tasks[key];
    let html = "";

    if (task && task.assigned_to && task.assigned_to.length > 0) {
        for (let i = 0; i < task.assigned_to.length && i < maxNumberOfAssignedContactsShownInCard; i++) {
            let assignedContactId = task.assigned_to[i];  // Kontakt-ID aus dem Task
            html += generateBoardInitialsHTML(assignedContactId);
        }

        if (task.assigned_to.length > maxNumberOfAssignedContactsShownInCard){
            let additionalAssigendContacts = task.assigned_to.length-maxNumberOfAssignedContactsShownInCard;
            html += generateAdditionalInitalsBadgeHTML(additionalAssigendContacts);
        }
    } 
    return html;
}

/**
 * Starts dragging a task by setting the currently dragged element and adding a CSS class.
 * @function startDragging
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
    document.getElementById(`task-${id}`).classList.add('drag-task-rotate');
}

/**
 * Stops dragging a task by removing the rotation CSS class.
 * @function stopDragging
 * @param {string} id - The ID of the task that was being dragged.
 */
function stopDragging(id) {
    document.getElementById(`task-${id}`).classList.remove('drag-task-rotate');
}

/**
 * Allows a task to be dropped by preventing the default event behavior.
 * @function allowDrop
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves a task to a new category and re-renders the board.
 * @function moveTo
 * @param {string} newCategory - The new status category to move the task to.
 */
function moveTo(newCategory) {
    tasks[currentDraggedElement].status = newCategory;
    changeTaskStatus(currentDraggedElement);
    filterTasksStatus();
    renderBoard();
}

/**
 * Highlights the task area to indicate a valid drop target.
 * @function highlightTaskDiv
 * @param {string} taskType - The ID of the task area to highlight.
 */
function highlightTaskDiv(taskType) {
    document.getElementById(`highlight_${taskType}_container`).classList.add('show');
    let notaskMessageElement = document.getElementById(`no-tasks-message-${taskType}`);
    if (notaskMessageElement){
        notaskMessageElement.classList.add('hide');
    }
}

/**
 * Removes the highlight from the task area after the task is dragged out.
 * @function removeHighlightTaskDiv
 * @param {string} taskType - The ID of the task area to remove the highlight from.
 */
function removeHighlightTaskDiv(taskType) {
   document.getElementById(`highlight_${taskType}_container`).classList.remove('show');
   let notaskMessageElement = document.getElementById(`no-tasks-message-${taskType}`);
    if (notaskMessageElement){
        notaskMessageElement.classList.remove('hide');
    }
}

/**
 * Slides in the board overlay and loads the task details into it.
 * @function slideInBoardOverlay
 * @param {string} taskId - The ID of the task to load in the overlay.
 */
function slideInBoardOverlay(taskId) {
    loadTaskDetailsInOverlay(taskId);
    slideInOverlay();        
}

/**
 * Loads task details into the board overlay by generating HTML for the task.
 * @function loadTaskDetailsInOverlay
 * @param {string} taskId - The ID of the task whose details are loaded.
 */
function loadTaskDetailsInOverlay(taskId) {
    document.getElementById('overlay-content').innerHTML = returnBoardTaskDialog(taskId);
}

/**
 * Shows the add task overlay by loading the task content and sliding in the overlay.
 * @async
 * @function showAddTaskOverlay
 * @param {string} [taskId] - The ID of the task to edit, if provided.
 * @returns {Promise<void>}
 */
async function showAddTaskOverlay(taskId) {
    await loadTaskOverlayContent(taskId);
    slideInOverlay();
}

/**
 * Loads the content for adding or editing a task into the overlay.
 * @async
 * @function loadTaskOverlayContent
 * @param {string} [taskId] - The ID of the task to load.
 * @returns {Promise<void>}
 */
async function loadTaskOverlayContent(taskId) {
    loadAssigendContactsOf(taskId);
    loadStatusOf(taskId);
    document.getElementById('overlay-content').innerHTML = await generateAddTaskFormHTML(taskId);
    setMinDueDateForTaskForm();
    renderAssignedContactsInitials();
    loadSubtasksOf(taskId);
    renderSubtasksInList();
    registerTaskFromEventListeners();
}

/**
 * Loads the contacts assigned to a task.
 * @function loadAssigendContactsOf
 * @param {string} taskId - The ID of the task to load contacts for.
 */
function loadAssigendContactsOf(taskId) {
    assignedContacts = [];
    if (taskId !== undefined && tasks[taskId].assigned_to) {
        assignedContacts = tasks[taskId].assigned_to;
    }
}

/**
 * Loads the status of a task.
 * @function loadStatusOf
 * @param {string} taskId - The ID of the task to load the status for.
 */
function loadStatusOf(taskId) {
    if (taskId !== undefined) {
        taskStatus = tasks[taskId].status;
    }
}

/**
 * Loads the subtasks of a task.
 * @function loadSubtasksOf
 * @param {string} taskId - The ID of the task to load subtasks for.
 */
function loadSubtasksOf(taskId) {
    subtasks = [];
    if (taskId !== undefined && tasks[taskId].subtasks) {
        for (let i = 0; i < tasks[taskId].subtasks.length; i++) {
            let subtask = tasks[taskId].subtasks[i];
            subtasks.push(subtask.title);
        }
    }
}

/**
 * Handles the add task button action and decides whether to show the overlay or navigate to a new page.
 * @function handleAddTaskButton
 * @param {string} status - The status of the new task to be added.
 */
function handleAddTaskButton(status) { 
    if (window.innerWidth <= 800) {
        window.location.href = "add_task.html";
    } else {
        taskStatus = status;
        showAddTaskOverlay();
    }
}

/**
 * Changes the status of a task and updates it in the database.
 * @async
 * @function changeTaskStatus
 * @param {string} taskId - The ID of the task whose status is being changed.
 * @returns {Promise<void>}
 */
async function changeTaskStatus(taskId) {
    let newSubtaskStatus = tasks[taskId].status;
    await updateOnDatabase(`tasks/${taskId}/status`, newSubtaskStatus);
}

/**
 * Toggles the status of a subtask and updates it in the database.
 * @async
 * @function changeSubtaskStatus
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {string} subtaskId - The ID of the subtask being updated.
 * @returns {Promise<void>}
 */
async function changeSubtaskStatus(taskId, subtaskId) {
    let newSubtaskStatus = tasks[taskId].subtasks[subtaskId].done = !tasks[taskId].subtasks[subtaskId].done;
    await updateOnDatabase(`tasks/${taskId}/subtasks/${subtaskId}/done/`, newSubtaskStatus);
    updateSubtasksProgressbar(taskId);
}

/**
 * Updates the progress bar of the subtasks for a specific task.
 * @function updateSubtasksProgressbar
 * @param {string} taskId - The ID of the task whose progress bar needs updating.
 */
function updateSubtasksProgressbar(taskId) {
    document.getElementById(`subtask_todo_container-${taskId}`).innerHTML = getSubtaskHTML(taskId);
}

/**
 * Updates the content of a task card on the board.
 * @function updateTaskCardContent
 * @param {string} taskId - The ID of the task whose card content needs updating.
 */
function updateTaskCardContent(taskId) {
    document.getElementById(`task-${taskId}`).innerHTML = getTaskCardContentHTML(taskId);
}

/**
 * Toggles the visibility of the status menu for a specific task while hiding all other status menus.
 * @function toggleStatusMenu
 * @param {string} taskId - The ID of the task whose status menu should be toggled.
 */
function toggleStatusMenu(taskId) {
    event.stopPropagation();
    const menues = document.getElementsByClassName('status-menu');
    for (const menu of menues) {
        if(menu.id == `status-menu-${taskId}`){
            menu.classList.toggle('d-none');
        }
        else {
            menu.classList.add('d-none');
        }
    }
}

/**
 * Sets the status of a task via the status menu and updates the task status in the database.
 * @async
 * @function setTaskStatusViaMenu
 * @param {string} taskId - The ID of the task whose status is being updated.
 * @param {string} status - The new status to assign to the task.
 * @returns {Promise<void>}
 */
async function setTaskStatusViaMenu(taskId, status) {
    event.stopPropagation();
    tasks[taskId].status = status;
    await changeTaskStatus(taskId)
    filterTasksStatus();
    renderBoard();
}