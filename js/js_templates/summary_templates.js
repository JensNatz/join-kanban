function getSummaryHTML() {
    return `
            <div class="d-flex-bw-c gap16">
                <a href="board.html" class="d-flex-c-c task-container gap16">
                    <div class="circle-bg circle-todo d-flex-c-c">
                    </div>
                    <div class="d-flex-clm-c">
                        <span class="task-numbers">${amountTasksToDo}</span>
                        <h5>To-do</h5>
                    </div>
                </a>
                <a href="board.html" class="d-flex-c-c task-container gap16">
                    <div class="circle-bg circle-done d-flex-c-c">
                    </div>
                    <div class="d-flex-clm-c">
                        <span class="task-numbers">${amountTasksDone}</span>
                        <h5>Done</h5>
                    </div>
                </a>
            </div>
            <a href="board.html" class="task-container">
                <div class="d-flex-even-c">
                    <div class="d-flex-bw-c gap8">
                        <div class="priority-high-container d-flex-c-c">
                            <img src="./assets/img/icon_priority_high_white.png" alt="">
                        </div>
                        <div class="d-flex-clm-c">
                            <span class="task-numbers">${amountTasksUrgent}</span>
                            <h5>Urgent</h5>
                        </div>
                    </div>
                    <div class="content-dividing-line"></div>
                    <div id="due_date" class="d-flex-clm d-flex-c-c gap4">
                        ${getDeadlineHTML()}
                    </div>
                </div>
            </a>
            <div class="d-flex-bw-c gap16">
                <a href="board.html" class="task-container d-flex-clm d-flex-c-c">
                    <span class="task-numbers">${tasks.length}</span>
                    <h5 class="txt-center">Tasks in <br>Board</h5>
                </a>
                <a href="board.html" class="task-container d-flex-clm d-flex-c-c">
                    <span class="task-numbers">${amountTasksInProgress}</span>
                    <h5 class="txt-center">Tasks in <br>Progress</h5>
                </a>
                <a href="board.html" class="task-container d-flex-clm d-flex-c-c">
                    <span class="task-numbers">${amountTasksFeedback}</span>
                    <h5 class="txt-center">Awaiting <br>Feedback</h5>
                </a>
            </div>
    `;
}

function getGreetingHTML() {
    const currentHour = new Date().getHours();
    let greetingMessage;
    if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = "Good afternoon";
    } else {
        greetingMessage = "Good evening";
    }

    if (checkUserLoginstatus()=='user') {
        return `<span class="greetings-daytime">${greetingMessage},</span>
                <span class="greetings-name">${getFromLocalStorage('username')}</span>`;
    } else {
        return `<span class="greetings-daytime">${greetingMessage}</span>`;
    }
}

function getDeadlineHTML(){
    let urgentTasks = tasks.filter(task => task.priority === "urgent");
    if (urgentTasks.length === 0) {
        return "<span>No upcoming Deadline</span>";
    } else {
        urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        let upcomingDate = urgentTasks[0].date;
        upcomingDate = formatDate(upcomingDate);
        return `<span>${upcomingDate}</span>
                <span>Upcoming Deadline</span>`
    }
} 

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
