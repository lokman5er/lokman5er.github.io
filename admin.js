updateTable()

const form = document.getElementById('reg-form')
form.addEventListener('submit', registerUser)


async function registerUser(event) {
    event.preventDefault()
    const username = document.getElementById('r-username').value
    const password = document.getElementById('r-password').value
    const urlPara = document.getElementById('r-url-para').value

    const result = await fetch('http://localhost:9999/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            urlPara
        })
    })
        .then((res) => res.json())

    if (result.status === 'ok') {
        alert('Success')
    } else {
        alert(result.error)
    }
}


const loginForm = document.getElementById('log-form')
loginForm.addEventListener('submit', login)

async function login(event) {
    event.preventDefault()
    const username = document.getElementById('l-username').value
    const password = document.getElementById('l-password').value

    const result = await fetch('http://localhost:9999/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then((res) => res.json())

    if (result.status === 'ok') {
        console.log('Got the token: ', result.data);
        localStorage.setItem('token', result.data)
        alert('Success')
    } else {
        alert(result.error)
    }
}

const changePasswordForm = document.getElementById('change-pw-form')
changePasswordForm.addEventListener('submit', changePassword)

async function changePassword(event) {
    event.preventDefault()
    const password = document.getElementById('c-pw-password').value

    const result = await fetch('http://localhost:9999/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newpassword: password,
            token: localStorage.getItem('token')
        })
    })
        .then((res) => res.json())

    if (result.status === 'ok') {
        alert('Success')
    } else {
        alert(result.error)
    }

}



const anForm = document.getElementById('new-an')


anForm.addEventListener('submit', newAnnouncement)
const startDateEl = document.getElementById('start-date')
const endDateEl = document.getElementById('end-date')
startDateEl.valueAsDate = new Date();
endDateEl.valueAsDate = new Date();
startDateEl.setAttribute('min', startDateEl.value)
endDateEl.setAttribute('min', startDateEl.value)

startDateEl.addEventListener('change', () => {
    if (endDateEl.value < startDateEl.value) {
        endDateEl.valueAsDate = startDateEl.valueAsDate
    }
    endDateEl.setAttribute('min', startDateEl.value)
    console.log(startDateEl.value)
})

const anTr = document.getElementById('new-tr')
const anAr = document.getElementById('new-ar')
const anDe = document.getElementById('new-de')

const anSubmit = document.getElementById('an-submit')


function enableSubmitButton() {
    if (anTr.value.length && anAr.value.length && anDe.value.length) {
        anSubmit.removeAttribute('disabled');
    } else {
        anSubmit.setAttribute('disabled', 'true');
    }
}


async function newAnnouncement(event) {
    event.preventDefault()

    const anTr = document.getElementById('new-tr').value
    const anAr = document.getElementById('new-ar').value
    const anDe = document.getElementById('new-de').value
    const anStartDate = document.getElementById('start-date').value
    const anEndDate = document.getElementById('end-date').value

    const result = await fetch('http://localhost:9999/api/new-an', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('token'),
            text: {
                tr: anTr,
                ar: anAr,
                de: anDe
            },
            startDate: anStartDate,
            endDate: anEndDate
        })

    })
        .then(() => updateTable())

}



function updateTable() {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:9999/api/get-All-an?token=${token}`)
        .then((data) => { return data.json() })
        .then((jsonData) => {
            jsonData = jsonData.result
            let tableData = "";
            idx = 0;
            jsonData.map((values) => {
                idx++
                start = values.startDate.substring(8, 10) + "." + values.startDate.substring(5, 7) + "." + values.startDate.substring(0, 4)
                end = values.endDate.substring(8, 10) + "." + values.endDate.substring(5, 7) + "." + values.endDate.substring(0, 4)
                tableData +=
                    `<tr id="tr${idx}">
                        <td>${idx}</td>
                        <td>${values.text.tr}</td>
                        <td>${values.text.ar}</td>
                        <td>${values.text.de}</td>
                        <td class="startDate">${start.substring(0, 10)}</td>
                        <td>${end}</td>
                        <td><button onclick="deletePressed(tr${idx})">Delete</button></td>
                    </tr>`;

                document.getElementById('table-body').innerHTML = tableData;


            })


        })
}

async function deletePressed(el) {
    // console.log(el)

    startDate = el.querySelector('.startDate').innerText
    startDateFormated = startDate.substring(6, 10) + "-" + startDate.substring(3, 5) + "-" + startDate.substring(0, 2)

    await fetch('http://localhost:9999/api/deleteAnnouncement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('token'),
            startDate: startDateFormated
        })

    })
        .then(() => updateTable())


}

async function getPrayerTimes() {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:9999/api/getPrayerTimes?token=${token}`)
        .then((data) => { return data.json() })
        .then((data) => { console.log(data) })
    console.log("test3")
}


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



window.addEventListener('resize', () => {
    if (window.innerWidth > 830) {
        newAn.style.display = '';
        anList.style.display = '';
    } else {
        buttonNewAn.removeAttribute("disabled");
        buttonAns.setAttribute("disabled", "");
    }
});