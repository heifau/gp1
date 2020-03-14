var postadr = "/SetSpeed";
var postadr = "http://192.168.178.36:8888/SetSpeed";
var postadr = "donotpost";
var cnt = 0;
var xstr = 0;
var lasts = 0;
var hftimers = [];
var iv = [0, 0, 0, 0]; //Intervall Array
var sp = [0, 0, 0, 0]; //Speed array

var starttime;

function ocstop() {
    for (tl = hftimers.pop(); tl !== undefined; tl = hftimers.pop()) {
        clearInterval(tl);
    };
};

function myonrestch(xhttp) {
    // sessionStorage.resz = Number(sessionStorage.resz) + 1;
};

function hff1() {
    let [jetzt, currs] = currspeed();
    let x = (xmax - 2) * jetzt / Math.pow(1.02, iv[0]) / 800;
    let y = ymax - 2 - currs / 2.6;
    if (cnt <= 0) {
        ctx.beginPath();
        ctx.moveTo(0, ymax / 2);
        ctx.lineTo(1, ymax / 2);
        ctx.stroke();
        cnt = 2;
        xstr = 2;
    } else if (x < xmax) {
        ctx.lineTo(x, y);
        ctx.stroke();
        cnt += 1;
        xstr = Math.pow(1.02, iv[0])
    } else {
        currs = 0;
        ocstop();
    };
    if (postadr !== "donotpost") {
        var xhttp = new XMLHttpRequest();
        var sendparam = "LED=" + currs.toFixed();
        xhttp.onreadystatechange = function () {
            myonrestch(this);
        };
        xhttp.open("POST", postadr, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(sendparam);
    };
};

function currspeed() {
    let jetzt = Date.now() - starttime;
    let currs = 7;
    let currt = 0;
    let i = 0;
    // jetzt = cnt;
    for (i = 1; i < iv.length; i++) {
        currt = currt + iv[i] * Math.pow(1.02, iv[0]);
        if (jetzt < currt) { break; };
    };
    if (i < sp.length) {
        let tars = sp[i];
        let sign = (tars > lasts) ? 1 : -1;
        currs = lasts + sign * (sp[0] / 10 + 1);
        currs = (sign > 0) ? Math.min(currs, tars) : Math.max(currs, tars);
        lasts = currs;

    } else {
        currs = 0;
    };
    return [jetzt, currs];
};

function ocstart() {
    cnt = 0;
    xstr = 0;
    starttime = Date.now();
    hftimers.push(setInterval(hff1, 1000 / 250));
    ocupdate();
};

function ocupdate() {
    for (let i = 0; i < sp.length; i++) {
        let ivs = document.getElementById("S" + (1 + i * 2).toFixed()).value;
        iv[i] = parseInt(ivs, 10);
        let sps = document.getElementById("S" + (2 + i * 2).toFixed()).value;
        sp[i] = parseInt(sps, 10);
    };
};

function occlear() {
    ctx.clearRect(0, 0, xmax, ymax);
};

function onin(num) {
    inp = document.getElementById("S" + (num).toFixed());
    outp = document.getElementById("O" + (num).toFixed());
    outp.value = inp.value;
    ocupdate();
};


// after html element creation...
var canv = document.getElementById("myCanvas");
var ctx = canv.getContext("2d");
var xmax = ctx.canvas.width;
var ymax = ctx.canvas.height;
