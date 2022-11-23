updateClock();

const data = [];
const starterDayPrayers = [];
var now = new Date();

var prayerTimesForToday = []

fetch('')
    .then(res => res.json())
    .then(json => {
        for (let i = 0; i < json.length; i++) {

            data.push({
                sabah: json[i]['Imsak'],
                ogle: json[i]['Ogle'],
                ikindi: json[i]['Ikindi'],
                aksam: json[i]['Aksam'],
                yatsi: json[i]['Yatsi'],
                ayinSekli: json[i]['AyinSekliURL'],
                hicriTarih: json[i]['HicriTarihUzun']
            })


        }
    })
    .then(() => {
        updateText();
    })
    .then(() => {
        whatIsNextPrayer();
    })
//https://ezanvakti.herokuapp.com/vakitler/11023


function whatIsNextPrayer() {
    var prayerCounter = 0;

    currentHours = now.getHours();
    if (currentHours < 10) {
        currentHours = "0" + currentHours;
    }
    currentMinutes = now.getMinutes();
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    currentTime = currentHours + ":" + currentMinutes;


    while (true) {
        if (currentTime < todaysPrayerTimes[prayerCounter] || prayerCounter == todaysPrayerTimes.length - 1) {
            //this is the next prayer
            if (prayerCounter == todaysPrayerTimes.length - 1 && todaysPrayerTimes[prayerCounter] < currentTime) {
                animateImg(prayerCounter);
            } else if (prayerCounter == todaysPrayerTimes.length - 1 && todaysPrayerTimes[prayerCounter] > currentTime) {
                animateImg(prayerCounter - 1);
            } else {
                animateImg(prayerCounter - 1);
            }
            break;
        }
        prayerCounter++;
    }
}



Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

dataCounter = 0;



//needed to start in exact second
setTimeout(function () {

    updateClock();

    runEveryMinute();

}, (60000 - now.getMilliseconds() - now.getSeconds() * 1000))

var interval = 60000;
var adjustedInterval = interval;
var expectedCycleTime = 0;

function runEveryMinute() {
    var now2 = Date.now()
    updateClock();
    checkIfNextPrayer();
    if (expectedCycleTime == 0) {
        expectedCycleTime = now2 + interval;
    }
    else {
        adjustedInterval = interval - (now2 - expectedCycleTime);
        expectedCycleTime += interval;
    }

    // function calls itself after delay of adjustedInterval
    setTimeout(function () {
        runEveryMinute();
    }, adjustedInterval);
}

var hours, minutes;

function updateClock() {

    now = new Date();
    hours = now.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    document.querySelector('.l-3-1').innerHTML = hours
    document.querySelector('.l-3-3').innerHTML = minutes

    if (hours == "00" && minutes == "00") {
        updateText();
        updateImportantDates();
    }
}


const dateNormal = document.querySelector('.dateNormal');
const monthNormal = document.querySelector('.monthNormal');
const yearNormal = document.querySelector('.yearNormal');

const dateHicri = document.querySelector('.dateHicri');
const monthHicri = document.querySelector('.monthHicri');
const yearHicri = document.querySelector('.yearHicri');

const sabahTime = document.querySelector('.sabahTime');
const ogleTime = document.querySelector('.ogleTime');
const ikindiTime = document.querySelector('.ikindiTime');
const aksamTime = document.querySelector('.aksamTime');
const yatsiTime = document.querySelector('.yatsiTime');

var todaysPrayerTimes = []

function updateText() {
    sabahRaw = calcSabah(data[dataCounter]['sabah']);
    ogleRaw = data[dataCounter]['ogle'];
    ikindiRaw = data[dataCounter]['ikindi'];
    aksamRaw = data[dataCounter]['aksam'];
    yatsiRaw = data[dataCounter]['yatsi'];

    todaysPrayerTimes.push(sabahRaw, ogleRaw, ikindiRaw, aksamRaw, yatsiRaw);

    sabahTime.innerHTML = sabahRaw.substring(0, 2) + " : " + sabahRaw.substring(3, 5);
    ogleTime.innerHTML = ogleRaw.substring(0, 2) + " : " + ogleRaw.substring(3, 5);
    ikindiTime.innerHTML = ikindiRaw.substring(0, 2) + " : " + ikindiRaw.substring(3, 5);
    aksamTime.innerHTML = aksamRaw.substring(0, 2) + " : " + aksamRaw.substring(3, 5);
    yatsiTime.innerHTML = yatsiRaw.substring(0, 2) + " : " + yatsiRaw.substring(3, 5);

    hicriRaw = data[dataCounter]['hicriTarih'];
    hicriInt = hicriRaw.match(/\d+/g)
    hicriStr = hicriRaw.match(/[\u00C0-\u017Fa-zA-Z']+/g).join('')

    dateNormal.innerText = now.getDate();
    monthNormal.innerHTML = monthsTurkish[now.getMonth()];
    yearNormal.innerHTML = now.getFullYear();

    dateHicri.innerText = hicriInt[0];
    monthHicri.innerHTML = hicriStr;
    yearHicri.innerHTML = hicriInt[1];

};

function calcSabah(time) {
    let hr = parseInt(time.substring(0, 2));
    let mn = parseInt(time.substring(3, 5));

    mn = mn + 30;

    if (mn > 59) {
        hr++;
        dif = mn - 60;
        mn = dif;
    }

    if (mn < 10) {
        mn = "0" + mn
    }

    if (hr < 10) {
        hr = "0" + hr
    }
    return hr + ":" + mn;
}

monthsGerman = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
monthsTurkish = ["Ocak‎", "Şubat‎", "Mart‎", "Nisan‎", "Mayıs‎", "Haziran‎", "Temmuz‎", "Ağustos‎", "Eylül‎", "Ekim‎", "Kasım‎", "Aralık‎"]

prayerNamesTr = ["SABAH", "ÖĞLE", "İKİNDİ", "AKŞAM", "YATSI"]
prayerNamesDe = ["Morgen", "Mittag", "Nachmittag", "Abend", "Nacht"]
prayerNamesAr = [
    "الفجر",
    "الظهر",
    "العصر",
    "المغرب",
    "العشاء"
]

prayerNames = [{
    tr: "Sabah",
    gr: "Morgen",
    ar: "صلاة الفجر"
}, {
    tr: "Ögle",
    gr: "Mittag",
    ar: "صلاة الظهر"
}, {
    tr: "ikindi",
    gr: "Nachmittag",
    ar: "صلاة العصر"
}, {
    tr: "Aksam",
    gr: "Abend",
    ar: "صلاة المغرب"
}, {
    tr: "Yatsi",
    gr: "Nacht",
    ar: "صلاة العشاء"
}]

var prayerText = []

prayerText.push(
    document.querySelector('.sabahText'),
    document.querySelector('.ogleText'),
    document.querySelector('.ikindiText'),
    document.querySelector('.aksamText'),
    document.querySelector('.yatsiText'),
)

var imgNormal = []

imgNormal.push(
    document.querySelector('.sabahImgNormal'),
    document.querySelector('.ogleImgNormal'),
    document.querySelector('.ikindiImgNormal'),
    document.querySelector('.aksamImgNormal'),
    document.querySelector('.yatsiImgNormal')
)

var imgActive = []

imgActive.push(
    document.querySelector('.sabahImgActive'),
    document.querySelector('.ogleImgActive'),
    document.querySelector('.ikindiImgActive'),
    document.querySelector('.aksamImgActive'),
    document.querySelector('.yatsiImgActive')
)


function animateImg(idx) {
    imgNormal[idx].classList.remove('imgNormalAnimation')
    imgActive[idx].classList.remove('imgActiveAnimation')
    void imgNormal[idx].offsetWidth;
    void imgActive[idx].offsetWidth;
    imgNormal[idx].classList.add('imgNormalAnimation')
    imgActive[idx].classList.add('imgActiveAnimation')

    setTimeout(() => {
        imgNormal[idx].style.animationPlayState = "paused";
        imgActive[idx].style.animationPlayState = "paused";

    }, 4000)
}

// animateImg(0)
// animateImg(1)
// animateImg(2)
// animateImg(3)

function deAnimateImg(idx) {
    imgNormal[idx].style.animationPlayState = "running";
    imgActive[idx].style.animationPlayState = "running";
}
// function animateIkindi() {
//     ikindiImgNormal.classList.add('imgNormalAnimation')
//     ikindiImgActive.classList.add('imgActiveAnimation')
//     setTimeout(() => {
//         ikindiImgNormal.style.animationPlayState = "paused";
//         ikindiImgActive.style.animationPlayState = "paused";

//         setTimeout(() => {
//             ikindiImgNormal.style.animationPlayState = "running";
//             ikindiImgActive.style.animationPlayState = "running";

//         }, 8000)
//     }, 4000)
// }



function checkIfNextPrayer() {
    const currentTime2 = hours + ":" + minutes;

    if (todaysPrayerTimes.indexOf(currentTime2) !== -1) {
        let idx = todaysPrayerTimes.indexOf(currentTime2);
        animateImg(idx);
        deAnimateImg(idx - 1);
    }

}

const ay = document.querySelector('.l-1-3');
ay.addEventListener('click', () => {
    console.log("a")
})

var importantDatesCounter = 0;

const importantDate1 = document.querySelector('#box1')

const importantDate1Text = document.querySelector('.l-6-2-2')
const importantDate2Text = document.querySelector('.l-6-4-2')

const importantDate1Day = document.querySelector('#importantDate1Day')
const importantDate2Day = document.querySelector('#importantDate2Day')

const importantDate1Month = document.querySelector('#importantDate1Month')
const importantDate2Month = document.querySelector('#importantDate2Month')

const importantDate1Year = document.querySelector('#importantDate1Year')
const importantDate2Year = document.querySelector('#importantDate2Year')

//function to show important dates 
function updateImportantDates() {

    importantDate1.style.backgroundColor = '#d5e7ea'
    importantDate1.style.color = '#1f4e5f'
    fetch("importantDates.json")
        .then(response => response.json())
        .then(json => getNextImportantDate(json))

    function getNextImportantDate(arr) {
        for (let i = 0; i < arr.length; i++) {
            let jsonYear = arr[i]['date'].slice(6, 10);
            let jsonMonth = arr[i]['date'].slice(3, 5);
            let jsonDay = arr[i]['date'].slice(0, 2);

            let jsonDate = new Date(`${jsonYear}-${jsonMonth}-${jsonDay}`);

            if (now.withoutTime() - jsonDate.withoutTime() == 0) {
                importantDate1.style.backgroundColor = '#3db6c4'
                importantDate1.style.color = 'white'
            }

            if (now.withoutTime() <= jsonDate.withoutTime()) {
                importantDatesCounter = i
                importantDate1Text.innerText = arr[i]['tr']
                importantDate2Text.innerText = arr[i + 1]['tr']

                let importantDate1Date = arr[i]['date']
                let importantDate2Date = arr[i + 1]['date']

                importantDate1Day.innerText = importantDate1Date.slice(0, 2)
                importantDate1Month.innerText = importantDate1Date.slice(3, 5)
                importantDate1Year.innerText = importantDate1Date.slice(6, 10)

                importantDate2Day.innerText = importantDate2Date.slice(0, 2)
                importantDate2Month.innerText = importantDate2Date.slice(3, 5)
                importantDate2Year.innerText = importantDate2Date.slice(6, 10)

                console.log(arr[i]['tr'])
                break;
            }

        }
    }

}

//get importantDatesCounter 
//

updateImportantDates();


language = "tr"

//1. set opacity to 0
//2. change text
//3. set opacity to 1
setInterval(() => {
    if (language == "tr") {
        //de

        changeText(prayerNamesDe, "de")

        language = "de"
    } else if (language == "de") {
        //ar
        changeText(prayerNamesAr, "ar")


        language = "ar"
    } else {
        //tr
        changeText(prayerNamesTr)

        language = "tr"

    }
}, 30000)

function changeText(lang, chngSize) {

    prayerText[0].style.opacity = 0;
    prayerText[1].style.opacity = 0;
    prayerText[2].style.opacity = 0;
    prayerText[3].style.opacity = 0;
    prayerText[4].style.opacity = 0;

    setTimeout(() => {

        prayerText[0].innerText = lang[0];
        prayerText[1].innerText = lang[1];
        prayerText[2].innerText = lang[2];
        prayerText[3].innerText = lang[3];
        prayerText[4].innerText = lang[4];

        if (chngSize === "de") {
            prayerText[0].style.fontSize = "2vw"
            prayerText[1].style.fontSize = "2vw"
            prayerText[2].style.fontSize = "2vw"
            prayerText[3].style.fontSize = "2vw"
            prayerText[4].style.fontSize = "2vw"

            prayerText[1].style.letterSpacing = "0.1rem"
            prayerText[2].style.letterSpacing = "0.1rem"

        } else if (chngSize === "ar") {
            prayerText[0].style.fontSize = "3.5vw"
            prayerText[1].style.fontSize = "3.5vw"
            prayerText[2].style.fontSize = "3.5vw"
            prayerText[3].style.fontSize = "3.5vw"
            prayerText[4].style.fontSize = "3.5vw"


            prayerText[1].style.letterSpacing = "normal"
            prayerText[2].style.letterSpacing = "normal"
        }

        prayerText[0].style.opacity = 1;
        prayerText[1].style.opacity = 1;
        prayerText[2].style.opacity = 1;
        prayerText[3].style.opacity = 1;
        prayerText[4].style.opacity = 1;
        prayerText[5].style.opacity = 1;
    }, 1000)
}

