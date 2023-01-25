updateClock();

const serverUrl = "https://namaz-backend.herokuapp.com"

var now = new Date();

var todaysAnnouncement;
var todayIsAnAnnouncement;


function getDateString(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
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

var initalRun = true;

const infoTitle = document.querySelector('.l-4-1 ')
const infoText = document.querySelector('.l-4-2')
const infoSource = document.querySelector('.l-4-3')

infoText.innerHTML = ""

const infobox = [infoTitle, infoText, infoSource]

var todaysKnowledge;
var todaysKnowledgeArray;
var todaysKnowledgeSourceArabic;

function getVersesOrHadiths() {
    fetch("versesAndHadiths.json")
        .then(response => response.json())
        .then(json => {
            todaysKnowledgeArray = json
            todaysKnowledge = json[now.getDate() - 1]
            infoTitle.innerHTML = prayerLng == 0 ? infoTitleLanguages[todaysKnowledge['type']]['tr'] : prayerLng == 1 ? infoTitleLanguages[todaysKnowledge['type']]['ar'] : infoTitleLanguages[todaysKnowledge['type']]['de']
            infoText.innerHTML = prayerLng == 0 ? todaysKnowledge['tr'] : prayerLng == 1 ? todaysKnowledge['ar'] : todaysKnowledge['de']


            var sourceNumbers = todaysKnowledge['source'].match(/\d+/g).map(Number);
            todaysKnowledgeSourceArabic = `[${convertToArabic(sourceNumbers[0])}:${convertToArabic(sourceNumbers[1])}]`

            infoSource.innerHTML = todaysKnowledge['source']

            infoSource.innerHTML = prayerLng == 1 ? todaysKnowledgeSourceArabic : todaysKnowledge['source']

            autoSizeText();
        })
}


var announcements = []

function getAllAnnouncements() {
    fetch(`${serverUrl}/api/getAllAnnouncements?urlPara=${urlPara}`)
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
        .catch(() => {
            updateInfobox()
            console.log('error')
        }); // Catch the rejected Promise
}


function updateInfobox() {
    todayIsAnAnnouncement = false;
    infoSource.style.display = 'block'
    if (announcements.length > 0) {

        var todayWithoutTime = getDateString(now);

        if (announcements[0]['startDate'] <= todayWithoutTime && announcements[0]['endDate'] >= todayWithoutTime) {
            //announcement for today, show announcement
            todayIsAnAnnouncement = true;
            todaysAnnouncement = announcements[0]['text']
            infoTitle.innerText = prayerLng === 1 ? "رسالة" : prayerLng === 0 ? "DUYURU" : "MITTEILUNG";
            infoText.innerText = prayerLng == 0 ? todaysAnnouncement['tr'] : prayerLng === 1 ? todaysAnnouncement['ar'] : todaysAnnouncement['de']
            infoSource.style.display = 'none'
        } else {
            //no announcements for today, show one hadith or vers
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
        fontSizeImportantDatesTr = 'n'
        fontSizeImportantDatesAr = 'n'
        fontSizeImportantDatesDe = 'n'
        now = new Date();
        initalRun = false;
        getAllAnnouncements();
        getNextImportantDate(importantDates)
        updateText();

        setTimeout(() => {
            fetchMonthlyData();
        }, 10000)

    } else if (minutes == "00") {
        getAllAnnouncements();
    }
}


const dateNormal = document.querySelector('.dateNormal');
const monthNormal = document.querySelector('.monthNormal');
const yearNormal = document.querySelector('.yearNormal');

const dateHicri = document.querySelector('.dateHicri');
const monthHicri = document.querySelector('.monthHicri');
const yearHicri = document.querySelector('.yearHicri');


function convertToArabic(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let arabicNum = '';
    number = number.toString();
    for (let i = 0; i < number.length; i++) {
        arabicNum += arabicNumbers[parseInt(number[i])];
    }
    return arabicNum;
}


const moonDirection = ["dolunay", "d1", "d2", "d3", "d4", "d5", "d6", "d65", "d7", "sondordun", "sd1", "sd2", "sd3", "sd4", "sd5", "sd6", "yeniAy", "r1", "r2", "r3", "r4", "r45", "r5", "ilkdordun", "i1", "i2", "i3", "i4", "i5", "i6", "i7"];

// ictima und ruyet beide mit yeniAy ersetzen

const moonElements = [
    document.querySelector('.moon1'),
    document.querySelector('.moon2'),
    document.querySelector('.moon3'),
    document.querySelector('.moon4'),
    document.querySelector('.moon5')]

function updateMoonSvgs() {
    var moonUrlToday = monthlyData[monthlyDataPointer]['shapeMoon']

    if (moonUrlToday === "ictima" || moonUrlToday === 'ruyet') {
        moonUrlToday = 'yeniAy'
        var moonIndex3 = moonDirection.indexOf(moonUrlToday)
    } else {
        var moonIndex3 = moonDirection.indexOf(moonUrlToday)
    }

    moonElements[2].setAttribute('src', `images/moons/${moonUrlToday}.svg`)

    var moonIndex2 = (moonIndex3 - 1 + moonDirection.length) % moonDirection.length
    moonElements[1].setAttribute('src', `images/moons/${moonDirection[moonIndex2]}.svg`)

    var moonIndex1 = (moonIndex3 - 2 + moonDirection.length) % moonDirection.length
    moonElements[0].setAttribute('src', `images/moons/${moonDirection[moonIndex1]}.svg`)

    var moonIndex4 = (moonIndex3 + 1) % moonDirection.length
    moonElements[3].setAttribute('src', `images/moons/${moonDirection[moonIndex4]}.svg`)

    var moonIndex5 = (moonIndex3 + 2) % moonDirection.length
    moonElements[4].setAttribute('src', `images/moons/${moonDirection[moonIndex5]}.svg`)
}

var todaysPrayerTimes = []
var isRamadan = false;
var hijriRaw;
function updateText() {
    isRamadan = false;
    yearHicri.style.display = 'visible'

    let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    let month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth + 1
    let year = now.getFullYear();
    let targetDate = `${day}.${month}.${year}`
    monthlyDataPointer = monthlyData.findIndex(element => element.gregorianDateShort === targetDate)

    sabahRaw = calcSabah(monthlyData[monthlyDataPointer]['fajr']);
    ogleRaw = monthlyData[monthlyDataPointer]['dhuhr'];
    ikindiRaw = monthlyData[monthlyDataPointer]['asr'];
    aksamRaw = monthlyData[monthlyDataPointer]['maghrib'];
    yatsiRaw = monthlyData[monthlyDataPointer]['isha'];

    todaysPrayerTimes = []
    todaysPrayerTimes.push(sabahRaw, ogleRaw, ikindiRaw, aksamRaw, yatsiRaw);

    updateMoonSvgs()

    updateTimeSvg(sabahSVG, sabahRaw);
    updateTimeSvg(ogleSVG, ogleRaw);
    updateTimeSvg(ikindiSVG, ikindiRaw);
    updateTimeSvg(aksamSVG, aksamRaw);
    updateTimeSvg(yatsiSVG, yatsiRaw);

    dateNormal.innerText = day
    monthNormal.innerHTML = month;
    yearNormal.innerHTML = year

    hijriRaw = monthlyData[monthlyDataPointer]['hijriDate'].split('.');
    hijriRaw.push(convertToArabic(hijriRaw[0]))
    //ramadan is true
    if (hijriRaw[1] == '9') {
        isRamadan = true;
        yearHicri.style.display = 'none'
        dateHicri.innerHTML = 'Ramazan'
        monthHicri.innerHTML = hijriRaw[0]
    } else {
        dateHicri.innerHTML = (parseInt(hijriRaw[0]) < 10) ? `0${hijriRaw[0]}` : hijriRaw[0]
        monthHicri.innerHTML = (parseInt(hijriRaw[1]) < 10) ? `0${hijriRaw[1]}` : hijriRaw[1]
        yearHicri.innerHTML = hijriRaw[2]
    }

};

function calcSabah(time) {
    let hr = parseInt(time.substring(0, 2));
    let mn = parseInt(time.substring(3, 5));

    if (urlPara === '11023') {

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

    } else {

        hr++;

        if (mn < 10) {
            mn = "0" + mn
        }

        if (hr < 10) {
            hr = "0" + hr
        }

        return hr + ":" + mn;

    }

}

function updateTimeSvg(el, raw) {
    el.querySelector('.hour1').innerHTML = raw.substring(0, 1)
    el.querySelector('.hour2').innerHTML = raw.substring(1, 2)
    el.querySelector('.minute1').innerHTML = raw.substring(3, 4)
    el.querySelector('.minute2').innerHTML = raw.substring(4, 5)
}

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
        "ar": "آية قرآنية",
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
var importantDatesPointer = 0;

function updateImportantDates() {
    fetch("importantDates.json")
        .then(response => response.json())
        .then(json => { importantDates = json })
        .then(() => getNextImportantDate(importantDates))

}

function getNextImportantDate(arr) {

    importantDate1.style.backgroundColor = '#d5e7ea'
    importantDate1.style.color = '#3b6773'

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
            importantDatesPointer = i
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


            autoSizeText();

            break;
        }

    }
}

activateFromTop = true;
deactiveFromTop = true;
function animateSvg(idx) {
    switch (idx) {
        case 0:
            el = sabahSVG;
            elClass = '.sabah';
            activateFromTop = true;
            aVal = '2%'

            //following are for deactivating the active status
            dEl = yatsiSVG;
            dElClass = '.yatsi';
            deactiveFromTop = false;
            dVal = '5%'
            break;
        case 1:
            el = ogleSVG;
            elClass = '.ogle';
            activateFromTop = true;
            aVal = '23.5%'

            dEl = sabahSVG;
            dElClass = '.sabah';
            deactiveFromTop = true;
            dVal = '5%'
            break;
        case 2:
            el = ikindiSVG;
            elClass = '.ikindi';
            activateFromTop = true;
            aVal = '50%'

            dEl = ogleSVG;
            dElClass = '.ogle';
            deactiveFromTop = true;
            dVal = '25%'


            break;
        case 3:
            el = aksamSVG;
            elClass = '.aksam';
            activateFromTop = false;
            aVal = '23.3%';

            dEl = ikindiSVG;
            dElClass = '.ikindi';
            deactiveFromTop = true;
            dVal = '50%'

            break;
        case 4:
            el = yatsiSVG;
            elClass = '.yatsi';
            activateFromTop = false;
            aVal = '2.5%';

            dEl = aksamSVG;
            dElClass = '.aksam';
            deactiveFromTop = false;
            dVal = '25%'

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
    if (activateFromTop) {
        document.querySelector(elClass).style.top = aVal

    } else {
        document.querySelector(elClass).style.bottom = aVal
    }

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

    if (deactiveFromTop) {
        document.querySelector(dElClass).style.top = dVal

    } else {
        document.querySelector(dElClass).style.bottom = dVal
    }
}



var namazText = []

//get the text element inside svg for prayer names
var sabahSVG, ogleSVG, ikindiSVG, aksamSVG, yatsiSVG;

function getSvgElements() {


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
}
const changeLanguages = [importantDate1Text, importantDate2Text]
const ramadanLanguages = [dateHicri, monthHicri]
prayerLng = 0
//change text every 20s
const changeLanguage = (language, fontSize) => {
    d3.selectAll(namazText)
        .transition()
        .duration(1000)
        .style("opacity", "0")
        .transition()
        .duration(0)
        .attr("font-size", fontSize)
        .transition()
        .duration(1000)
        .delay(50)
        .style("opacity", "1");

    d3.selectAll(infobox)
        .transition()
        .duration(1000)
        .style("opacity", "0")
        .transition()
        .duration(1000)
        .delay(50)
        .style("opacity", "1");

    d3.selectAll(changeLanguages)
        .transition()
        .duration(1000)
        .style("opacity", "0")
        .transition()
        .duration(1000)
        .delay(50)
        .style("opacity", "1");

    if (isRamadan) {
        d3.selectAll(ramadanLanguages)
            .transition()
            .duration(1000)
            .style("opacity", "0")
            .transition()
            .duration(1000)
            .delay(50)
            .style("opacity", "1");

    }

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

        importantDate1Text.innerHTML = language === "ar" ? importantDates[importantDatesPointer]['ar'] : language === "tr" ? importantDates[importantDatesPointer]['tr'] : importantDates[importantDatesPointer]['de']
        importantDate2Text.innerHTML = language === "ar" ? importantDates[importantDatesPointer + 1]['ar'] : language === "tr" ? importantDates[importantDatesPointer + 1]['tr'] : importantDates[importantDatesPointer + 1]['de']

        if (language === "ar") {
            importantDate1Text.style.fontFamily = "Hafs"
            importantDate2Text.style.fontFamily = "Hafs"

            infoText.style.fontFamily = 'Hafs'
            infoText.setAttribute("dir", "rtl")
            if (!todayIsAnAnnouncement) {
                infoSource.style.textAlign = "left"
                infoSource.setAttribute("dir", "rtl")
                infoSource.innerHTML = todaysKnowledgeSourceArabic
            }

            infoTitle.style.fontFamily = 'Hafs'

            namazText.forEach((text) => {
                text.setAttribute('style', 'font-family: Hafs')
            });

            importantDate1Text.style.fontStyle = 'normal'
            importantDate2Text.style.fontStyle = 'normal'
        } else if (language === "de") {
            importantDate1Text.style.fontFamily = "'Montserrat', sans-serif"
            importantDate2Text.style.fontFamily = "'Montserrat', sans-serif"

            infoText.style.fontFamily = "'Montserrat', sans-serif"
            infoText.setAttribute("dir", "ltr")

            if (!todayIsAnAnnouncement) {
                infoSource.style.textAlign = "right"
                infoSource.setAttribute("dir", "ltr")
                infoSource.innerHTML = todaysKnowledge['source']
            }

            infoTitle.style.fontFamily = "'Montserrat', sans-serif"
            namazText.forEach((text) => {
                text.setAttribute('style', 'font-family: Montserrat, sans-serif')
            });

            importantDate1Text.style.fontStyle = 'italic'
            importantDate2Text.style.fontStyle = 'italic'

        }

        if (isRamadan) {
            if (language === "ar") {
                monthHicri.innerHTML = "رمضان"
                monthHicri.fontFamily = 'Hafs'
                dateHicri.fontFamily = 'Hafs'
                dateHicri.innerHTML = hijriRaw[3]

            } else if (language === "de") {
                monthHicri.innerHTML = hijriRaw[0]
                dateHicri.innerHTML = 'RAMADAN'
                monthHicri.fontFamily = "'Montserrat', sans-serif"
                dateHicri.fontFamily = "'Montserrat', sans-serif"

            } else {
                dateHicri.innerHTML = 'RAMAZAN'
            }
        }





        if (fontSizeImportantDatesDe === "n" || fontSizeImportantDatesTr === "n" || fontSizeImportantDatesAr === "n") {
            infoText.style.fontSize = "2.5vw"
            importantDate1Text.style.fontSize = "4vw"
            importantDate2Text.style.fontSize = "4vw"
            autoSizeText();
        } else {

            if (language === "tr") {
                infoText.style.fontSize = fontSizeInfoTr
                importantDate1Text.style.fontSize = fontSizeImportantDatesTr
                importantDate2Text.style.fontSize = fontSizeImportantDatesTr
            } else if (language === "ar") {
                infoText.style.fontSize = fontSizeInfoAr
                importantDate1Text.style.fontSize = fontSizeImportantDatesAr
                importantDate2Text.style.fontSize = fontSizeImportantDatesAr
            } else {
                infoText.style.fontSize = fontSizeInfoDe
                importantDate1Text.style.fontSize = fontSizeImportantDatesDe
                importantDate2Text.style.fontSize = fontSizeImportantDatesDe
            }

        }



    }, 1000);
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



var fontSizeInfoTr;
var fontSizeInfoAr;
var fontSizeInfoDe;
var fontSizeImportantDatesTr = 'n';
var fontSizeImportantDatesAr = 'n';
var fontSizeImportantDatesDe = 'n';

// prayerLng -> 0 : tr, 1 : ar, 2 : de
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

            if (el.id === "infoText") {
                if (prayerLng === 0) {
                    fontSizeInfoTr = infoText.style.fontSize;
                } else if (prayerLng === 1) {
                    fontSizeInfoAr = infoText.style.fontSize;
                } else if (prayerLng === 2) {
                    fontSizeInfoDe = infoText.style.fontSize;
                }
            }

        })(elements[i]);
    }

    if (importantDate1Text.style.fontSize < importantDate2Text.style.fontSize) {
        importantDate2Text.style.fontSize = importantDate1Text.style.fontSize
    } else if (importantDate1Text.style.fontSize > importantDate2Text.style.fontSize) {
        importantDate1Text.style.fontSize = importantDate2Text.style.fontSize
    }

    if (prayerLng === 0) {
        fontSizeImportantDatesTr = importantDate1Text.style.fontSize;
    } else if (prayerLng === 1) {
        fontSizeImportantDatesAr = importantDate1Text.style.fontSize;
    } else if (prayerLng === 2) {
        fontSizeImportantDatesDe = importantDate1Text.style.fontSize;
    }

}


addEventListener("resize", (event) => {
    fontSizeImportantDatesTr = 'n';
    fontSizeImportantDatesAr = 'n';
    fontSizeImportantDatesDe = 'n';
    autoSizeText()
});

var monthlyData;
var monthlyDataPointer = 0;

function fetchMonthlyData() {
    fetch(`${serverUrl}/api/getDailyData?urlPara=${urlPara}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.status !== 200) {
                return Promise.reject(); // Return a rejected Promise to stop executing the rest of the code in this function
            }
            console.log(data.data);
            monthlyData = data.data;
            if (initalRun) {
                getSvgElements()
            }
            if (urlPara) {
                getAllAnnouncements();
                updateImportantDates();
            }
        })
        .catch((error) => {
            console.log(`API request failed with status code ${error}`);
        })

}

fetchMonthlyData()
