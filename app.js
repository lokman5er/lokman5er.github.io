
const data = [
    {
        "sabah": "03:28",
        "ogle": "12:20"
    }
]

var sabahHour, sabahMinute, ogleHour, ogleMinute;

function transformData(data) {
    sabahT = data[0]["sabah"];
    sabahH = sabahT.substring(0, 2);
    sabahHour = parseInt(sabahT);
    sabahM = sabahT.substring(3, 5);
    sabahMinute = parseInt(sabahM);
}

transformData(data);

var now = new Date();
hours = now.getHours();
minutes = now.getMinutes();
seconds = now.getSeconds();
seconds++;
if (hours < 10) {
    hoursString = "0" + hours;
} else hoursString = hours;
if (minutes < 10) {
    minutesString = "0" + minutes;
} else minutesString = minutes;
document.querySelector('.l-3-1').innerHTML = hoursString
document.querySelector('.l-3-3').innerHTML = minutesString

// ? how to sync this with exact ms?
setTimeout(function () {
    setInterval(function () {
        seconds++;
        changed = false;

        //let time run
        if (seconds == 60) {
            minutes++;
            seconds = 0;
            changed = true;
        }
        if (minutes == 60) {
            hours++;
            minutes = 0;
            changed = true;
        }
        if (hours == 24) {
            hours = 0;
            changed = true;
        }

        //update html only when change appears
        if (changed) {

            if (hours < 10) {
                hoursString = "0" + hours;
            } else hoursString = hours;

            if (minutes < 10) {
                minutesString = "0" + minutes;
            } else minutesString = minutes;

            document.querySelector('.l-3-1').innerHTML = hoursString;
            document.querySelector('.l-3-3').innerHTML = minutesString;

            if (hours == sabahHour && minutes == sabahMinute) {
                sabahActiveAnimation();
            }
        }

        //check if next prayer is

    }, 1000)
}, 1000 - now.getMilliseconds())

function doDate() {

    var now = new Date();
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

}

// setInterval(doDate, 1000);

const sabahImgNormal = document.querySelector('.sabahImgNormal')
const sabahImgActive = document.querySelector('.sabahImgActive')
const sabahText = document.querySelector('.sabahText')
const sabahTime = document.querySelector('.sabahTime')

const ogleImgNormal = document.querySelector('.ogleImgNormal')
const ogleImgActive = document.querySelector('.ogleImgActive')
const ogleText = document.querySelector('.ogleText')
const ogleTime = document.querySelector('.ogleTime')

const ikindiImgNormal = document.querySelector('.ikindiImgNormal')
const ikindiImgActive = document.querySelector('.ikindiImgActive')
const ikindiText = document.querySelector('.ikindiText')
const ikindiTime = document.querySelector('.ikindiTime')

const aksamImgNormal = document.querySelector('.aksamImgNormal')
const aksamImgActive = document.querySelector('.aksamImgActive')
const aksamText = document.querySelector('.aksamText')
const aksamTime = document.querySelector('.aksamTime')

const yatsiImgNormal = document.querySelector('.yatsiImgNormal')
const yatsiImgActive = document.querySelector('.yatsiImgActive')
const yatsiText = document.querySelector('.yatsiText')
const yatsiTime = document.querySelector('.yatsiTime')

sabahTest = data[0]["sabah"];
hoursSabah = sabahTest.substring(0, 2);
minutesSabah = sabahTest.substring(3, 5);
sabahTime.innerText = hoursSabah + " : " + minutesSabah

function sabahActiveAnimation() {
    sabahImgNormal.style.opacity = 0;
    sabahImgActive.style.opacity = 1;
    sabahTime.style.fontWeight = "bold";
    sabahTime.style.top = "15.7%";
    sabahTime.style.right = "6%";
    sabahText.style.top = "5.1%";
    sabahText.style.right = "45%";
    sabahText.style.fontWeight = "bold";

}


// setTimeout(sabahActiveAnimation, 1500)
function sabahDeactivateAnimation() {
    sabahImgNormal.style.opacity = "sabahImgNormalDeactivate 1s linear forwards";
    // sabahImgActive.style.animation = "sabahImgDeactivate 1s linear forwards";
    // sabahText.style.animation = "sabahTextAnimationDeactivate linear forwards";
    // sabahTime.style.animation = "timeAnimationSabahDeactivate linear forwards";
}

function ogleActiveAnimation() {
    ogleImgNormal.style.animation = "ogleImgNormal 1s forwards";
    ogleImgActive.style.animation = "ogleImgActive 1s forwards";
    ogleText.style.animation = "ogleTextAnimation 0.5s linear forwards";
    ogleTime.style.animation = "timeAnimationOgle 0.5s linear forwards";
}

function ikindiActiveAnimation() {
    ikindiImgNormal.style.animation = "ikindiImgNormal 1s forwards";
    ikindiImgActive.style.animation = "ikindiImgActive 1s forwards";
    ikindiText.style.animation = "ikindiTextAnimation 0.5s linear forwards";
    ikindiTime.style.animation = "timeAnimationIkindi 0.5s linear forwards";
}

function aksamActiveAnimation() {
    aksamImgNormal.style.animation = "aksamImgNormal 1s forwards";
    aksamImgActive.style.animation = "aksamImgActive 1s forwards";
    aksamText.style.animation = "aksamTextAnimation 0.5s linear forwards";
    aksamTime.style.animation = "timeAnimationAksam 0.5s linear forwards";
}

function yatsiActiveAnimation() {
    yatsiImgNormal.style.animation = "yatsiImgNormal 1s forwards";
    yatsiImgActive.style.animation = "yatsiImgActive 1s forwards";
    yatsiText.style.animation = "yatsiTextAnimation 0.5s linear forwards";
    yatsiTime.style.animation = "timeAnimationYatsi 0.5s linear forwards";
}



// setTimeout(sabahActiveAnimation, 1000);
// setTimeout(ogleActiveAnimation, 5000);
// setTimeout(ikindiActiveAnimation, 5000);
// setTimeout(aksamActiveAnimation, 5000);
// setTimeout(yatsiActiveAnimation, 5000);

// sabahActiveAnimation();



