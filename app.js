updateClock();

const data = [];
const starterDayPrayers = [];
var now = new Date();

var prayerTimesForToday = []


// fetch('https://ezanvakti.herokuapp.com/vakitler/11023')
//     .then(res => res.json())
//     .then(json => {
//         for (let i = 0; i < json.length; i++) {

//             data.push({
//                 sabah: json[i]['Imsak'],
//                 ogle: json[i]['Ogle'],
//                 ikindi: json[i]['Ikindi'],
//                 aksam: json[i]['Aksam'],
//                 yatsi: json[i]['Yatsi'],
//                 ayinSekli: json[i]['AyinSekliURL'],
//                 hicriTarih: json[i]['HicriTarihUzun']
//             })


//         }
//         console.log(`data:`, data)
//     })
// .then(() => {
//     updateText();
// })
// .then(() => {
//     whatIsNextPrayer();
// })
//https://ezanvakti.herokuapp.com/vakitler/11023

fetch("prayerTimes.json")
    .then(response => response.json())
    .then(json => {
        data.push(json[0])
        console.log(`data`, data)
    })



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
                activateSvg(ogleSVG, ".ogle")
            } else if (prayerCounter == todaysPrayerTimes.length - 1 && todaysPrayerTimes[prayerCounter] > currentTime) {
                console.log(2)

            } else {
                activateSvg(sabahSVG, ".sabah")

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

    updateTimeSvg(sabahSVG, sabahRaw);
    updateTimeSvg(ogleSVG, ogleRaw);
    updateTimeSvg(ikindiSVG, ikindiRaw);
    updateTimeSvg(aksamSVG, aksamRaw);
    updateTimeSvg(yatsiSVG, yatsiRaw);

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

function updateTimeSvg(el, raw) {
    el.querySelector('.hour1').innerHTML = raw.substring(0, 1)
    el.querySelector('.hour2').innerHTML = raw.substring(1, 2)
    el.querySelector('.minute1').innerHTML = raw.substring(3, 4)
    el.querySelector('.minute2').innerHTML = raw.substring(4, 5)
}

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

monthsDe = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
monthsTurkish = ["Oca‎k", "Şubat‎", "Mart‎", "Nisan‎", "Mayıs‎", "Haziran‎", "Temmuz‎", "Ağustos‎", "Eylül‎", "Ekim‎", "Kasım‎", "Aralık‎"]
monthsTurkish1 = ["Oca‎", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki‎", "Kas", "Ara"]
monthsAr = [
    "الفجر",
    "الظهر",
    "العصر",
    "المغرب",
    "العشاء"
]
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
    tr: "SABAH",
    de: "MORGEN",
    ar: "الفجر"
}, {
    tr: "ÖĞLE",
    de: "MITTAG",
    ar: "الظهر"
}, {
    tr: "İKİNDİ",
    de: "NACHMITTAG",
    ar: "العصر"
}, {
    tr: "AKŞAM",
    de: "ABEND",
    ar: "المغرب"
}, {
    tr: "YATSI",
    de: "NACHT",
    ar: "العشاء"
}]

function checkIfNextPrayer() {
    const currentTime2 = hours + ":" + minutes;

    if (todaysPrayerTimes.indexOf(currentTime2) !== -1) {
        let idx = todaysPrayerTimes.indexOf(currentTime2);
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
                importantDate1Month.innerText = monthsDe[0]
                importantDate1Year.innerText = importantDate1Date.slice(6, 10)

                importantDate2Day.innerText = importantDate2Date.slice(0, 2)
                importantDate2Month.innerText = importantDate2Date.slice(3, 5)
                importantDate2Year.innerText = importantDate2Date.slice(6, 10)

                break;
            }

        }
    }

}

//get importantDatesCounter 

updateImportantDates();


//1. set opacity to 0
//2. change text
//3. set opacity to 1



var rndCounter = 0
setInterval(() => {
    importantDate1Month.innerText = monthsTurkish1[rndCounter];
    rndCounter++
    if (rndCounter == monthsTurkish1.length) rndCounter = 0
}, 3000)



var a = document.querySelector('.ogle')




function activateSvg(el, elClass) {
    const stop1 = el.querySelector('#stop1');
    const stop2 = el.querySelector('#stop2');
    const style = el.querySelector('#style');

    document.querySelector(elClass).style.opacity = "0"

    setTimeout(() => {

        document.querySelector(elClass).style.width = "43vw"

        let topDistance = parseFloat(getComputedStyle(document.querySelector(elClass)).top)
        console.log(topDistance)
        topDistance = topDistance * 0.55
        console.log(topDistance)
        document.querySelector(elClass).style.top = `${topDistance}px`
        document.querySelector(elClass).style.opacity = "1"

    }, 1000)

    d3.select(stop1)
        .transition()
        .delay(1000)
        .attr('stop-color', "#11b6c4")

    d3.select(stop2)
        .transition()
        .delay(1000)
        .attr('stop-color', "#0c7f82")

    d3.select(style)
        .transition()
        .delay(1000)
        .duration(0)
        .text(".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}.cls-4{fill:#0c7f82;}")

}



setTimeout(() => {
    const ogleSvg = a.contentDocument;

    const ogleText = ogleSvg.querySelector('.ogleText');
    const ogleStyle = ogleSvg.querySelector('#ogleStyle');
    const stop1 = ogleSvg.querySelector('#stop1');
    const stop2 = ogleSvg.querySelector('#stop2');


    document.querySelector(".ogle").style.opacity = "0"

    setTimeout(() => {

        document.querySelector(".ogle").style.width = "43vw"
        // document.querySelector(".ogle").style.top = "23.5%"
        document.querySelector(".ogle").style.opacity = "1"

    }, 1000)

    d3.select(stop1)
        .transition()
        .delay(1000)
        .attr('stop-color', "#11b6c4")

    d3.select(stop2)
        .transition()
        .delay(1000)
        .attr('stop-color', "#0c7f82")

    d3.select(ogleStyle)
        .transition()
        .delay(1000)
        .duration(0)
        .text(".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}.cls-4{fill:#0c7f82;}")


}, 1000000)

const actvStyle = [
    ".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}.cls-4{fill:#0c7f82;}",
    ".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}.cls-4{fill:#0c7f82;}",
    ".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}",
    ".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}.cls-4{fill:#0c7f82;}",
    ".cls-1{fill:#11b6c4;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}.cls-4{fill:#0c7f82;}"
]

const actvStop1 = "#11b6c4"
const actvStop2 = "#0c7f82"

var namazText = []
namazTimesSvg = []

var sabahSVG, ogleSVG, ikindiSVG, aksamSVG, yatsiSVG;
setTimeout(() => {
    const sabahSvg = document.querySelector('.sabah')
    sabahSVG = sabahSvg.contentDocument;

    const ogleSvg = document.querySelector('.ogle')
    ogleSVG = ogleSvg.contentDocument;

    const ikindiSvg = document.querySelector('.ikindi')
    ikindiSVG = ikindiSvg.contentDocument;

    const aksamSvg = document.querySelector('.aksam')
    aksamSVG = aksamSvg.contentDocument;

    const yatsiSvg = document.querySelector('.yatsi')
    yatsiSVG = yatsiSvg.contentDocument;


    namazText.push(
        sabahSVG.querySelector('.text'),
        ogleSVG.querySelector('.text'),
        ikindiSVG.querySelector('.text'),
        aksamSVG.querySelector('.text'),
        yatsiSVG.querySelector('.text')
    )


    updateText();
    whatIsNextPrayer();

}, 4000)

prayerLng = 0

setInterval(() => {

    if (prayerLng == 0) {

        d3.selectAll(namazText)
            .transition()
            .duration(750)
            .style("opacity", "0")

            .transition()
            .duration(750)
            .delay(10)
            .style("opacity", "1")

        setTimeout(() => {
            namazText[0].innerHTML = prayerNames[0]["ar"]
            namazText[1].innerHTML = prayerNames[1]["ar"]
            namazText[2].innerHTML = prayerNames[2]["ar"]
            namazText[3].innerHTML = prayerNames[3]["ar"]
            namazText[4].innerHTML = prayerNames[4]["ar"]
        }, 751)

        prayerLng++
    } else if (prayerLng == 1) {



        d3.selectAll(namazText)
            .transition()
            .duration(750)
            .style("opacity", "0")

            .transition()
            .duration(0)
            .attr("font-size", "2.8em")

            .transition()
            .duration(750)
            .delay(10)
            .style("opacity", "1")

        setTimeout(() => {
            namazText[0].innerHTML = prayerNames[0]["de"]
            namazText[1].innerHTML = prayerNames[1]["de"]
            namazText[2].innerHTML = prayerNames[2]["de"]
            namazText[3].innerHTML = prayerNames[3]["de"]
            namazText[4].innerHTML = prayerNames[4]["de"]

            namazText[1].setAttribute("letter-spacing", "0.04em")
            namazText[2].setAttribute("letter-spacing", "0.04em")
        }, 751)

        prayerLng++
    } else {
        d3.selectAll(namazText)
            .transition()
            .duration(750)
            .style("opacity", "0")

            .transition()
            .duration(0)
            .attr("font-size", "5em")

            .transition()
            .duration(750)
            .delay(10)
            .style("opacity", "1")

        setTimeout(() => {
            namazText[0].innerHTML = prayerNames[0]["tr"]
            namazText[1].innerHTML = prayerNames[1]["tr"]
            namazText[2].innerHTML = prayerNames[2]["tr"]
            namazText[3].innerHTML = prayerNames[3]["tr"]
            namazText[4].innerHTML = prayerNames[4]["tr"]

            namazText[1].setAttribute("letter-spacing", "normal")
            namazText[2].setAttribute("letter-spacing", "normal")
        }, 751)

        prayerLng = 0
    }


}, 20000)

