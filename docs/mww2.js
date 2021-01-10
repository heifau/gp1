// Test/Aufruf mit
// cd /D C:\Users\heinz\OneDrive\Dokumente\GitHub\gp1\docs
// node static
// C:\Users\heinz\OneDrive\Dokumente\GitHub\gp1\docs>more static.js
// var static = require('node-static');
// var http = require('http');
// var file = new(static.Server)(__dirname, { cache: 1 });
// http.createServer(function (req, res) {
//   file.serve(req, res);
// }).listen(8080);
// dann http://localhost:8080/mww1.html

var canvas;
var ctx;      // canvas.getContext('2d');
var imagedata; //  ctx.createImageData(innerWidth, innerHeight);
var picdata; // [y][x+msg]
var drawcount = 0;
var datelast = 0;
var drawfps = 0;
const numWorkers = window.navigator.hardwareConcurrency - 2
// Anzahl der logischen Prozessoren abzgl. Reserve für andere Prozesse
var myWorkers = Array(numWorkers); // new Worker("mww2w.js");
var numberposted = 0;
var numberempfang = 0;
var curr_iter = 99999;
var centerX = -0.75;
var centerY = 0.1;
var scale = 1 / 16;


var pointer = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    id: "",
    type: "",
    prim: ""
};


function movehandler(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.id = e.pointerId;
    pointer.type = e.pointerType;
    pointer.prim = e.isPrimary;
    // console.log(pointer);
    if (numberposted < 0) {
        post2Worker();
    }
}

function downhandler(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.id = e.pointerId;
    pointer.type = e.pointerType;
    pointer.prim = e.isPrimary;
    // console.log("down");
    post2Worker();
}


function post2Worker() {
    // let by = 1 + Math.trunc(Math.random() * (innerHeight - 1));
    // by = Math.trunc(pointer.y)
    // let byn = by;
    datelast = Date.now();
    for (byn = 1; byn < innerHeight; byn++) {
        if (picdata[byn].length === 0 || picdata[byn][4] < curr_iter) {
            numberposted += 1;
            myWorkers[byn % numWorkers].postMessage([byn, centerX, centerY, scale, curr_iter, innerWidth, innerHeight]);
        }
    }
}

function onmessagehandler(e) {
    // console.log('Message received from worker', e.data);
    numberposted -= 1;
    numberempfang += 1;
    let by = e.data[0];
    picdata[by] = e.data;
    // for (by = 1; by < (innerHeight - 1); by += 1)
    // let bx = 1 + Math.trunc(Math.random() * (innerWidth - 1 - 20))
    for (bx = 1; bx < (innerWidth - 1); bx += 1) {
        let pixelindex = (by * innerWidth + bx) * 4;
        let sum = e.data[bx + 6];
        imagedata.data[pixelindex + 0] = (100 * (sum % 7)) % 255; // R
        imagedata.data[pixelindex + 1] = (100 * (sum % 11)) % 255; // G
        imagedata.data[pixelindex + 2] = (100 * (sum % 17)) % 255; // B
        // imagedata.data[pixelindex + 0] = 0; // R
        // imagedata.data[pixelindex + 1] = 0; // G
        // imagedata.data[pixelindex + 2] = 0; // B
        imagedata.data[pixelindex + 3] = 255; // alpha                

    };
    draw();
};

function onwheelhandler(e) {
    // console.log("onwheel", e.deltaX, e.deltaY, e.deltaZ) // +-500, +- 125, +-0
    e.preventDefault();

    if (e.deltaX < 0) {
        curr_iter = Math.max(Math.trunc(curr_iter * 0.8 - 1), 1);
        draw();
        return;
    };
    if (e.deltaX > 0) {
        curr_iter = Math.min(Math.trunc(curr_iter / 0.8 + 1), 99999);
        draw();
        return;
    }

    if (e.deltaY < 0) {
        scale = scale * 2
    }
    else if (e.deltaY > 0) {
        scale = scale / 2
    }

    // Restrict scale
    // Apply scale transform
    // el.style.transform = `scale(${scale})`;

    centerX = centerX + scale * (e.clientX / innerWidth - 0.5);
    centerY = centerY + scale * (e.clientY / innerHeight - 0.5);
    resize();
}




window.onload = function myfunction() {
    canvas = document.getElementById('mycanvas');
    ctx = canvas.getContext('2d');
    canvas.onpointermove = movehandler;
    canvas.onpointerdown = downhandler;
    canvas.onwheel = onwheelhandler;
    resize();
    anim()
}

window.onresize = function () {
    resize();
}

function resize() {
    for (let i = 0; i < numWorkers; i++) {
        if (myWorkers[i] !== undefined) {
            myWorkers[i].terminate()
        };
        myWorkers[i] = new Worker("mww2w.js");
        myWorkers[i].onmessage = onmessagehandler;
    };
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    imagedata = ctx.createImageData(innerWidth, innerHeight);
    picdata = new Array(innerHeight).fill([]);
    numberposted = 0;
    numberempfang = 0;
    drawcount = 0;
}



function draw() {
    let datenow = Date.now();
    drawcount += 1;
    ctx.save();
    //    ctx.fillStyle = "rgba(200, 75, 99, 0.384)";
    //    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imagedata, 0, 0);
    ctx.font = "30px Courier New";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    drawfps = (1 * drawfps + 1000 / (datenow - datelast)) / 2;
    ctx.strokeText(drawcount.toString() + ' ' + numberempfang + ' ' + numberposted + ' ' + innerHeight + ' Time=' + (Math.round((datenow - datelast))).toString(), 10, 50);
    // ctx.fillText(drawcount.toString() + ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    ctx.strokeText("X=" + centerX.toString() + "  Y=" + centerY.toString() + "  S=" + scale.toString() + " C=" + curr_iter.toString(), 10, 100);
    // ctx.fillText("curr_iter " + curr_iter.toString(), 10, 100);
    ctx.restore();
}


function anim() {
    // requestAnimationFrame(anim);
    draw();
}

