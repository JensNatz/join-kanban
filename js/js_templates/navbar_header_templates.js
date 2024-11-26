function getNavbarLinksHTML() {
    return `
        <a id="link-summary" class="navbar-link" href="summary.html">
            <img class="navbar-icon navbar-icon-grey" src="assets/img/icon_summary_grey.png" alt="summary">
            <img class="navbar-icon navbar-icon-white" src="assets/img/icon_summary_white.png" alt="summary">
            <span class="navbar-link-text">Summary</span> 
        </a>
        <a id="link-add_task" class="navbar-link" href="add_task.html">
            <img class="navbar-icon navbar-icon-grey" src="assets/img/icon_addtasks_grey.png" alt="add task">
            <img class="navbar-icon navbar-icon-white" src="assets/img/icon_addtasks_white.png" alt="add task">
            <span class="navbar-link-text">Add Task</span> 
        </a>
        <a id="link-board" class="navbar-link" href="board.html">
            <img class="navbar-icon navbar-icon-grey" src="assets/img/icon_board_grey.png" alt="board">
            <img class="navbar-icon navbar-icon-white" src="assets/img/icon_board_white.png" alt="board">
            <span class="navbar-link-text">Board</span> 
        </a>
        <a id="link-contacts" class="navbar-link" href="contacts.html">
            <img class="navbar-icon navbar-icon-grey" src="assets/img/icon_contacts_grey.png" alt="contacts">
            <img class="navbar-icon navbar-icon-white" src="assets/img/icon_contacts_white.png" alt="contacts">
            <span class="navbar-link-text">Contacts</span>
        </a>
    `;
}

function getHeaderOptionsHTML() {
    return `
        <a href="help.html">
            <img class="desktop_help_symbol" src="./assets/img/icon_help.png" alt="">
        </a>
        <div id="user-logo" class="user-logo d-flex-c-c" onclick="toggleSubmenue()">

        </div>`;
}