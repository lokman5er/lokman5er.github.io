updateClock();

var data = [];
var dataCounter = 0;

var now = new Date();
var month = now.getMonth();
month++;
month = month < 10 ? '0' + month : month;
var todaysAnnouncement;
var todayIsAnAnnouncement;

function getDateString(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

var todayWithoutTime = getDateString(now);

const url = window.location.search;
const urlParams = new URLSearchParams(url);
const urlPara = urlParams.get('urlPara');

var notFirstTimeCalling = false;

function getPrayerTimes() {
    fetch(`http://localhost:9999/api/getPrayerTimes?urlPara=${urlPara}`)
        .then(res => {
            // Check if the status is not 200
            if (res.status !== 200) {
                dataCounter++
                updateText()
                return Promise.reject(); // Return a rejected Promise to stop executing the rest of the code in this function
            }
            return res.json();
        })
        .then(json => {
            data = json['times']
        })
        .then(() => {
            if (notFirstTimeCalling) {
                updateText();
            } else {
                notFirstTimeCalling = true;
            }
        })
        .catch(() => { }); // Catch the rejected Promise
}



const infoTitle = document.querySelector('.l-4-1 ')
const infoText = document.querySelector('.l-4-2')
const infoSource = document.querySelector('.l-4-3')

infoText.innerHTML = ""

const infobox = [infoTitle, infoText, infoSource]

var todaysKnowledge;

function getVersesOrHadiths() {
    fetch("versesAndHadiths.json")
        .then(response => response.json())
        .then(json => {
            todaysKnowledge = json[0]
            infoTitle.innerHTML = infoTitleLanguages[todaysKnowledge['type']]['tr']
            infoText.innerHTML = todaysKnowledge['tr']
            infoSource.innerHTML = todaysKnowledge['source']
            autoSizeText();
        })
}

var announcements = []

function getAllAnnouncements() {
    fetch(`http://localhost:9999/api/getAllAnnouncements?urlPara=${urlPara}`)
        .then(res => {
            // Check if the status is not 200
            if (res.status !== 200) {
                updateInfobox()
                return Promise.reject(); // Return a rejected Promise to stop executing the rest of the code in this function
            }
            return res.json();
        })
        .then(json => {
            announcements = json['result'];
        })
        .then(() => updateInfobox())
        .catch(() => { }); // Catch the rejected Promise
}


function updateInfobox() {

    if (announcements.length > 0) {

        var todayWithoutTime = getDateString(now);

        if (announcements[0]['startDate'] <= todayWithoutTime && announcements[0]['endDate'] >= todayWithoutTime) {
            //announcement for today, show announcement
            todayIsAnAnnouncement = true;
            todaysAnnouncement = announcements[0]['text']
            infoTitle.innerText = 'BILDIRI'
            infoText.innerText = todaysAnnouncement['tr']
            infoSource.style.display = 'none'
        } else {
            //no announcements for today, show one hadith or vers
            todayIsAnAnnouncement = false;
            getVersesOrHadiths()
        }
    } else {
        getVersesOrHadiths();
    }
}

function whatIsNextPrayer() {
    // Get current time
    var currentHours = now.getHours();
    currentHours = currentHours < 10 ? "0" + currentHours : currentHours;
    var currentMinutes = now.getMinutes();
    currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    var currentTime = currentHours + ":" + currentMinutes;

    // Find the next prayer by looping through the prayer times
    for (var i = 0; i < todaysPrayerTimes.length; i++) {

        // if (i === 0 && currentTime < todaysPrayerTimes[0]) {
        //     animateSvg(4)
        //     break;
        // }

        if (currentTime < todaysPrayerTimes[i] || i === todaysPrayerTimes.length - 1) {
            if (i === todaysPrayerTimes.length - 1 && currentTime > todaysPrayerTimes[i]) {
                animateSvg(4);
            }
            else if (i === todaysPrayerTimes.length - 1 && currentTime < todaysPrayerTimes[i]) {
                animateSvg(3);
            }
            else {
                animateSvg(i === 0 ? 4 : i - 1);
            }
            break;
        }
    }
}


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
        // new day
        now = new Date();
        month = now.getMonth();
        month++;
        //datum oben anpassen im html
        getAllAnnouncements();
        getPrayerTimes(); //
        updateImportantDates();
    }
}


const dateNormal = document.querySelector('.dateNormal');
const monthNormal = document.querySelector('.monthNormal');
const yearNormal = document.querySelector('.yearNormal');

const dateHicri = document.querySelector('.dateHicri');
const monthHicri = document.querySelector('.monthHicri');
const yearHicri = document.querySelector('.yearHicri');



var todaysPrayerTimes = []

function updateText() {
    sabahRaw = calcSabah(data[dataCounter]['imsak']);
    ogleRaw = data[dataCounter]['oegle'];
    ikindiRaw = data[dataCounter]['ikindi'];
    aksamRaw = data[dataCounter]['aksam'];
    yatsiRaw = data[dataCounter]['yatsi'];

    todaysPrayerTimes.push(sabahRaw, ogleRaw, ikindiRaw, aksamRaw, yatsiRaw);

    updateTimeSvg(sabahSVG, sabahRaw);
    updateTimeSvg(ogleSVG, ogleRaw);
    updateTimeSvg(ikindiSVG, ikindiRaw);
    updateTimeSvg(aksamSVG, aksamRaw);
    updateTimeSvg(yatsiSVG, yatsiRaw);

    // hicriRaw = data[dataCounter]['hicriTarih'];
    // hicriInt = hicriRaw.match(/\d+/g)
    // hicriStr = hicriRaw.match(/[\u00C0-\u017Fa-zA-Z']+/g).join('')

    dateNormal.innerText = now.getDate();
    monthNormal.innerHTML = month;
    yearNormal.innerHTML = now.getFullYear();

    // dateHicri.innerText = hicriInt[0];
    // monthHicri.innerHTML = hicriStr;
    // yearHicri.innerHTML = hicriInt[1];

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

function updateTimeSvg(el, raw) {
    el.querySelector('.hour1').innerHTML = raw.substring(0, 1)
    el.querySelector('.hour2').innerHTML = raw.substring(1, 2)
    el.querySelector('.minute1').innerHTML = raw.substring(3, 4)
    el.querySelector('.minute2').innerHTML = raw.substring(4, 5)
}

monthsDe = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
monthsTurkish = ["Oca‎k", "Şubat‎", "Mart‎", "Nisan‎", "Mayıs‎", "Haziran‎", "Temmuz‎", "Ağustos‎", "Eylül‎", "Ekim‎", "Kasım‎", "Aralık‎"]
monthsTurkish1 = ["Oca‎", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki‎", "Kas", "Ara"]

const months = [
    {
        tr: "Oca‎k",
        de: "Jan",
        ar: "كانون الثاني"
    },
    {
        tr: "Şub",
        de: "Feb",
        ar: "شباط"
    },
    {
        tr: "‎Mart",
        de: "März",
        ar: "آذار"
    },
    {
        tr: "‎Nis",
        de: "Apr",
        ar: "نيسان"
    },
    {
        tr: "‎May",
        de: "Mai",
        ar: "أيار"
    },
    {
        tr: "Haz‎",
        de: "Juni",
        ar: "حزيران"
    },
    {
        tr: "‎Tem",
        de: "Juli",
        ar: "تموز "
    },
    {
        tr: "‎Ağu",
        de: "Aug",
        ar: "آب"
    },
    {
        tr: "‎Eyl",
        de: "Sep",
        ar: "أيلول"
    },
    {
        tr: "Ekim‎‎",
        de: "Okt",
        ar: "تشرين الأول"
    },
    {
        tr: "Kas‎",
        de: "Nov",
        ar: "تشرين الثاني"
    },
    {
        tr: "Ara‎",
        de: "Dez",
        ar: "كانون الأول"
    },
]

const prayerNames = [
    {
        tr: "SABAH",
        de: "MORGEN",
        ar: "الفجر"
    },
    {
        tr: "ÖĞLE",
        de: "MITTAG",
        ar: "الظهر"
    },
    {
        tr: "İKİNDİ",
        de: "NACHM.",
        ar: "العصر"
    },
    {
        tr: "AKŞAM",
        de: "ABEND",
        ar: "المغرب"
    },
    {
        tr: "YATSI",
        de: "NACHT",
        ar: "العشاء"
    }
]

const infoTitleLanguages = [
    {
        "tr": "AYET",
        "ar": "بيت شعر",
        "de": "VERS"
    },
    {
        "tr": "HADIS",
        "ar": "حديث",
        "de": "HADITH"
    }
]

function checkIfNextPrayer() {
    let currentTime = hours + ":" + minutes;

    if (todaysPrayerTimes.indexOf(currentTime) !== -1) {
        let idx = todaysPrayerTimes.indexOf(currentTime);
        animateSvg(idx)
    }

}








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
var importantDates;
function updateImportantDates() {

    importantDate1.style.backgroundColor = '#d5e7ea'
    importantDate1.style.color = '#3b6773'
    fetch("importantDates.json")
        .then(response => response.json())
        .then(json => { importantDates = json })
        .then(() => getNextImportantDate(importantDates))

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


                //eventuell fontsize resize hier hinzufügen
                break;
            }

        }
    }

}


function animateSvg(idx) {
    switch (idx) {
        case 0:
            el = sabahSVG;
            elClass = '.sabah';
            topVl = '2%'
            //following are for deactivating the active status
            dEl = yatsiSVG;
            dElClass = '.yatsi';
            dTopVl = '76.2%'
            break;
        case 1:
            el = ogleSVG;
            elClass = '.ogle';
            topVl = '23%'

            dEl = sabahSVG;
            dElClass = '.sabah';
            dTopVl = '5%'
            break;
        case 2:
            el = ikindiSVG;
            elClass = '.ikindi';
            topVl = '43%';

            dEl = ogleSVG;
            dElClass = '.ogle';
            dTopVl = '24.7%'
            break;
        case 3:
            el = aksamSVG;
            elClass = '.aksam';
            topVl = '60%';

            dEl = ikindiSVG;
            dElClass = '.ikindi';
            dTopVl = '44.4%'
            break;
        case 4:
            el = yatsiSVG;
            elClass = '.yatsi';
            topVl = '77%';

            dEl = aksamSVG;
            dElClass = '.aksam';
            dTopVl = '61%'
            break;
    }

    const s1 = el.querySelectorAll('#s1')
    const s2 = el.querySelector('#s2')
    const s3 = el.querySelector('#s3')
    const s4 = el.querySelector('#s4')

    const stop1 = el.querySelector('#stop1')
    const stop2 = el.querySelector('#stop2')

    d3.selectAll(s1)
        .transition()
        .duration(1000)
        .attr("fill", "#11b6c4")

    d3.select(s2)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient)")

    d3.select(s3)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient-2)")

    d3.select(s4)
        .transition()
        .duration(1000)
        .attr("fill", "#0c7f82")

    d3.select(stop1)
        .transition()
        .duration(1000)
        .attr("stop-color", "#11b6c4")

    d3.select(stop2)
        .transition()
        .duration(1000)
        .attr("stop-color", "#0c7f82")

    document.querySelector(elClass).style.width = "42.5vw"
    document.querySelector(elClass).style.top = topVl

    //deactive animation
    const dS1 = dEl.querySelectorAll('#s1')
    const dS2 = dEl.querySelector('#s2')
    const dS3 = dEl.querySelector('#s3')
    const dS4 = dEl.querySelector('#s4')

    const dStop1 = dEl.querySelector('#stop1')
    const dStop2 = dEl.querySelector('#stop2')

    d3.selectAll(dS1)
        .transition()
        .duration(1000)
        .attr("fill", "#2c7291")

    d3.select(dS2)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient)")

    d3.select(dS3)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient-2)")

    d3.select(dS4)
        .transition()
        .duration(1000)
        .attr("fill", "#1f5260")

    d3.select(dStop1)
        .transition()
        .duration(1000)
        .attr("stop-color", "#2c7291")

    d3.select(dStop2)
        .transition()
        .duration(1000)
        .attr("stop-color", "#1f5260")

    document.querySelector(dElClass).style.width = "37vw"
    document.querySelector(dElClass).style.top = dTopVl
}



var namazText = []

//get the text element inside svg for prayer names
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

const changeLanguages = [importantDate1Text, importantDate2Text]

prayerLng = 0
//change text every 20s
const changeLanguage = (language, fontSize) => {
    d3.selectAll(namazText)
        .transition()
        .duration(750)
        .style("opacity", "0")
        .transition()
        .duration(0)
        .attr("font-size", fontSize)
        .transition()
        .duration(750)
        .delay(10)
        .style("opacity", "1");

    d3.selectAll(infobox)
        .transition()
        .duration(750)
        .style("opacity", "0")
        .transition()
        .duration(750)
        .delay(10)
        .style("opacity", "1");

    d3.selectAll(changeLanguages)
        .transition()
        .duration(750)
        .style("opacity", "0")
        .transition()
        .duration(750)
        .delay(10)
        .style("opacity", "1");

    setTimeout(() => {
        namazText.forEach((text, index) => {
            text.innerHTML = prayerNames[index][language];
        });


        if (todayIsAnAnnouncement) {
            infoTitle.innerHTML = language === "ar" ? "رسالة" : language === "tr" ? "DUYURU" : "MITTEILUNG";
            infoText.innerHTML = todaysAnnouncement[language];
        } else {
            infoTitle.innerHTML = infoTitleLanguages[todaysKnowledge['type']][language]
            infoText.innerHTML = todaysKnowledge[language]
        }

        if (language === "ar") {
            infoText.setAttribute("dir", "rtl")
            infoSource.style.textAlign = "left"
        } else {
            infoText.setAttribute("dir", "ltr")
            infoSource.style.textAlign = "right"
        }

        importantDate1Text.innerHTML = language === "ar" ? importantDates[importantDatesCounter]['ar'] : language === "tr" ? importantDates[importantDatesCounter]['tr'] : importantDates[importantDatesCounter]['de']
        importantDate2Text.innerHTML = language === "ar" ? importantDates[importantDatesCounter + 1]['ar'] : language === "tr" ? importantDates[importantDatesCounter + 1]['tr'] : importantDates[importantDatesCounter + 1]['de']



        infoText.style.fontSize = "4vh"
        importantDate1Text.style.fontSize = "3vw"
        importantDate2Text.style.fontSize = "2vw"
        autoSizeText();

    }, 751);
};

setInterval(() => {
    if (prayerLng === 0) {
        changeLanguage("ar", "5em");
        prayerLng++;
    } else if (prayerLng === 1) {
        changeLanguage("de", "4.2em");
        prayerLng++;
    } else {
        changeLanguage("tr", "5em");
        prayerLng = 0;
    }
}, 30000);



function autoSizeText() {
    var elements = document.querySelectorAll('.resize');

    if (elements.length <= 0) {
        return;
    }

    for (var i = 0; i < elements.length; i++) {
        (function (el) {
            var resizeText = function () {
                var elNewFontSize = (parseInt(window.getComputedStyle(el).fontSize.slice(0, -2)) - 1) + 'px';
                el.style.fontSize = elNewFontSize;
            };

            while (el.scrollHeight > el.offsetHeight) {
                resizeText();
            }
        })(elements[i]);
    }

    if (importantDate1Text.style.fontSize < importantDate2Text.style.fontSize) {
        importantDate2Text.style.fontSize = importantDate1Text.style.fontSize
    } else if (importantDate1Text.style.fontSize > importantDate2Text.style.fontSize) {
        importantDate1Text.style.fontSize = importantDate2Text.style.fontSize
    }
}



getPrayerTimes()
getAllAnnouncements();
updateImportantDates();


// function getMoonData() {

//     fetch(`http://localhost:9999/api/getMoonPhase`, {})
//         .then(res => res.json())
//         .then(json => {
//             console.log(json['properties']['data']['fracillum']);
//         });
// }

// getMoonData()


function loadMoonSVGs(input) {
    return 1 / 30;
}

console.log(loadMoonSVGs(0.8))

addEventListener("resize", (event) => { autoSizeText() });