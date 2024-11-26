function getContactEntryHTML(contactIndex) {
    return `
        <div id="contactentry-${contactIndex}" class="contactlist-entry d-flex-ac" onclick="renderContactSingleView('${contactIndex}')">
            <div class="entry-initials d-flex-c-c" style="background-color: ${getBackgroundColorByColorcode(contacts[contactIndex].color)}">
                ${contacts[contactIndex].initials}
            </div>
            <div class="contact-data d-flex-clm">
                <span class="contact-name">${contacts[contactIndex].name}${contacts[contactIndex].email == getFromLocalStorage('email') ? ' (You)' : ''}</span>
                <span class="contact-email">${contacts[contactIndex].email}</span>
            </div>
        </div>
    `;
}

function getAlphabeticalHeaderHTML(letter) {
    return `
        <div class="alphabetical-header d-flex-ac">
            ${letter}
        </div>
    `;
}

function getBackgroundColorByColorcode(colorcode) {
    const colors = [
        "#ff7a00",
        "#9327ff",
        "#6e52ff",
        "#fc71ff",
        "#ffbb2b",
        "#00bee8",
        "#ff4646",
        "#462f8a",
        "#1fd7c1",
    ];

    if (colorcode >= 0 && colorcode <= 8) {
        return colors[colorcode];
    } else {
        return "#000000";
    }
};

function sortByNameAscending(data) {
    const entries = Object.entries(data);
    entries.sort((a, b) => {
        const nameA = a[1].name.toUpperCase();
        const nameB = b[1].name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    const sortedData = Object.fromEntries(entries);
    return sortedData;
}