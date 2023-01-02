// Get references to the forms on the page
const form = document.getElementById('reg-form');
const loginForm = document.getElementById('log-form');
const changePasswordForm = document.getElementById('change-pw-form');
const anForm = document.getElementById('new-an');

// Get references to the input fields for the new announcement form
const startDateEl = document.getElementById('start-date');
const endDateEl = document.getElementById('end-date');
const anTr = document.getElementById('new-tr');
const anAr = document.getElementById('new-ar');
const anDe = document.getElementById('new-de');

// Get reference to the submit button for the new announcement form
const anSubmit = document.getElementById('an-submit');

// Helper function to send a request to the server
async function sendRequest(url, options) {
    // Send the request to the given URL with the given options
    // and return the response as JSON
    return fetch(url, options)
        .then((res) => res.json());
}

// Event listener for the register form's submit event
form.addEventListener('submit', registerUser);

// Function to handle the submission of the register form
async function registerUser(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields
    const username = document.getElementById('r-username').value;
    const password = document.getElementById('r-password').value;
    const urlPara = document.getElementById('r-url-para').value;

    // Send a POST request to the server to register a new user
    const result = await sendRequest('http://localhost:9999/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            urlPara
        })
    });

    // If the request was successful, show a success alert
    // Otherwise, show an error alert with the error message
    if (result.status === 'ok') {
        alert('Success');
    } else {
        alert(result.error);
    }
}

// Event listener for the login form's submit event
loginForm.addEventListener('submit', login);

// Function to handle the submission of the login form
async function login(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields
    const username = document.getElementById('l-username').value;
    const password = document.getElementById('l-password').value;


    // Send a POST request to the server to login
    const result = await sendRequest('http://localhost:9999/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    // If the request was successful, store the returned token in local storage
    // and show a success alert
    // Otherwise, show an error alert with the error message
    if (result.status === 'ok') {
        console.log('Got the token: ', result.data);
        localStorage.setItem('token', result.data);
        alert('Success');
    } else {
        alert(result.error);
    }
}

// Event listener for the change password form's submit event
changePasswordForm.addEventListener('submit', changePassword);

// Function to handle the submission of the change password form
async function changePassword(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the value of the password input field
    const password = document.getElementById('c-pw-password').value;

    // Send a POST request to the server to change the user's password
    const result = await sendRequest('http://localhost:9999/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newpassword: password,
            token: localStorage.getItem('token')
        })
    });

    // If the request was successful, show a success alert
    // Otherwise, show an error alert with the error message
    if (result.status === 'ok') {
        alert('Success');
    } else {
        alert(result.error);
    }
}

// Set the current date as the minimum value for the start and end date fields
startDateEl.valueAsDate = new Date();
endDateEl.valueAsDate = new Date();
startDateEl.setAttribute('min', startDateEl.value);
endDateEl.setAttribute('min', startDateEl.value);

// Event listener for the start date field's change event
startDateEl.addEventListener('change', () => {
    // If the end date is earlier than the start date, set the end date to the start date
    if (endDateEl.value < startDateEl.value) {
        endDateEl.valueAsDate = startDateEl.valueAsDate;
    }
    // Set the minimum value for the end date field to the start date
    endDateEl.setAttribute('min', startDateEl.value);
    console.log(startDateEl.value);
});

// Event listener for the new announcement form's submit event
anForm.addEventListener('submit', newAnnouncement);

// Function to handle the submission of the new announcement form
async function newAnnouncement(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields
    const anTr = anTr.value;
    const anAr = anAr.value;
    const anDe = anDe.value;
    const startDate = startDateEl.value;
    const endDate = endDateEl.value;


    // Send a POST request to the server to create a new announcement
    const result = await sendRequest('http://localhost:9999/api/new-an', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: {
                tr: anTr,
                ar: anAr,
                de: anDe
            },
            startDate,
            endDate,
            token: localStorage.getItem('token')
        })
    });



    // If the request was successful, show a success alert
    // Otherwise, show an error alert with the error message
    if (result.status === 'ok') {
        alert('Success');
    } else {
        alert(result.error);
    }
}

// Event listener for the window's resize event
window.addEventListener('resize', () => {
    // If the window width is greater than 830 pixels
    if (window.innerWidth > 830) {
        // Get the elements with the class 'an-mid-left' and 'an-mid-right'
        const newAn = document.querySelector('.an-mid-left');
        const anList = document.querySelector('.an-mid-right');

        // Remove the 'display' CSS attribute from both elements
        newAn.style.display = '';
        anList.style.display = '';
    } else {
        buttonNewAn.removeAttribute("disabled");
        buttonAns.setAttribute("disabled", "");
    }
});





function updateSubmitButton() {
    // Get the values of the input fields
    const anTr = document.getElementById('new-tr').value;
    const anAr = document.getElementById('new-ar').value;
    const anDe = document.getElementById('new-de').value;

    // Get the submit button
    const submitButton = document.getElementById('an-submit');

    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (anTr && anAr && anDe) {
        submitButton.removeAttribute('disabled');
    } else {
        submitButton.setAttribute('disabled', true);
    }
}

const anTrInput = document.getElementById('new-tr');
const anArInput = document.getElementById('new-ar');
const anDeInput = document.getElementById('new-de');

anTrInput.addEventListener('input', updateSubmitButton);
anArInput.addEventListener('input', updateSubmitButton);
anDeInput.addEventListener('input', updateSubmitButton);


const buttonAns = document.querySelector('.b-1')
const buttonNewAn = document.querySelector('.b-2')
const newAn = document.querySelector('.an-mid-left')
const anList = document.querySelector('.an-mid-right')
const title = document.querySelector('.title')

buttonNewAn.addEventListener('click', () => {
    buttonAns.removeAttribute("disabled");
    buttonNewAn.setAttribute("disabled", "");
    anList.style.display = "none";
    newAn.style.display = "block";
    title.innerText = "YENI DUYURU"
})


buttonAns.addEventListener('click', () => {
    buttonNewAn.removeAttribute("disabled");
    buttonAns.setAttribute("disabled", "");
    anList.style.display = "block";
    newAn.style.display = "none";
    title.innerText = "DUYURULAR"
})