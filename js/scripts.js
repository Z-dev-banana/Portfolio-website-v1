/*!
* Start Bootstrap - One Page Wonder v6.0.5 (https://startbootstrap.com/theme/one-page-wonder)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-one-page-wonder/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const syscheck = document.querySelector('.syst');
const devcheck = document.querySelector('.devo');
const webcheck = document.querySelector('.webs');

function sysMode() {
    console.log("sys press")
    if(syscheck.style.color == "aliceblue"){
        console.log("alice")
        syscheck.style.color = 'black';
        syscheck.value = "selected";
        devcheck.style.color = 'aliceblue';
        devcheck.value = "unselected";
        webcheck.style.color = 'aliceblue';
        webcheck.value = "unselected";
        console.log(syscheck.value)
    } else if (syscheck.style.color == "black") {
        console.log("black")
        syscheck.style.color = 'aliceblue';
        syscheck.value = "unselected";
    }

}

function devMode() {
    console.log("dev press")
    if(devcheck.style.color == "aliceblue"){
        console.log("alice")
        syscheck.style.color = 'aliceblue';
        syscheck.value = "unselected";
        devcheck.style.color = 'black';
        devcheck.value = "selected";
        webcheck.style.color = 'aliceblue';
        webcheck.value = "unselected";
        console.log(devcheck.value)
    } else if (devcheck.style.color == "black") {
        console.log("black")
        devcheck.style.color = 'aliceblue';
        devcheck.value = "unselected";
    }
}

function webMode() {
    console.log("web press")
    if(webcheck.style.color == "aliceblue"){
        console.log("alice")
        syscheck.style.color = 'aliceblue';
        syscheck.value = "unselected";
        devcheck.style.color = 'aliceblue';
        devcheck.value = "unselected";
        webcheck.style.color = 'black';
        webcheck.value = "selected";
        console.log(webcheck.value)
    } else if (webcheck.style.color == "black") {
        console.log("black")
        webcheck.style.color = 'aliceblue';
        webcheck.value = "unselected";
    }
}

function SessionRecord() {
    if (sessionStorage.hits) {
        sessionStorage.hits=Number(sessionStorage.hits)+1;
    } else {
        sessionStorage.hits=1;
    }
    document.getElementById('counter').innerHTML="Counter is at: " + sessionStorage.hits;
}

function highlightSimilar(highlight) {
    let text = document.getElementById("text").innerHTML;
    highlight = `<b>` + highlight + `</b>`;
    if (text.includes(`<mark>${highlight}</mark>`)) {
        let unhighlight = `<mark>` + highlight + `</mark>`;
        let re = new RegExp(unhighlight, "g");
        let newText = text.replace(re, highlight);
        document.getElementById('text').innerHTML = newText;
    } else if (!text.includes(`<mark>${highlight}</mark>`)) {
        let re = new RegExp(highlight, "g");
        let newText = text.replace(re, `<mark>${highlight}</mark>`);
        document.getElementById('text').innerHTML = newText;
    }
    
}