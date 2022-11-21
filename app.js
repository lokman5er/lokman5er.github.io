updateClock();

const data = [];
const starterDayPrayers = [];
var now = new Date();

var prayerTimesForToday = []

fetch('https://ezanvakti.herokuapp.com/vakitler/11023')
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




dataCounter = 0;

dateDay = now.getDay();
dateMonth = now.getMonth();
dateYear = now.getFullYear();

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

    if (hours == "00" && minutes == "00") updateText();
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

prayerNamesTR = ["Sabah", "Ögle", "Ikindi", "Aksam", "Yatsi"]
prayerNamesTR = ["Morgen", "Mittag", "Nachmittag", "Abend", "Nacht"]
prayerNamesTR = ["صلاة الفجر", "صلاة الظهر", "صلاة العصر", "aaصلاة العشاء", "dصلاة الليل"]

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
const right = document.querySelector('.right')
ay.addEventListener('click', () => {
    right.requestPictureInPicture().catch(err => { console.log(err) })
})