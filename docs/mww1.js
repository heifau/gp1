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
var myWorker = new Worker("mww1w.js");
var numberposted = 0;
var numberempfang = 0;
var curr_iter = 10;
var centerX = -1;
var centerY = 0;
var scale = 4;


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
    if (numberposted < 1) {
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
    let by = 1 + Math.trunc(Math.random() * (innerHeight - 1));
    by = Math.trunc(pointer.y)
    let byn = by;
    for (byn = by; byn < innerHeight; byn++) {
        if (picdata[byn].length === 0 || picdata[byn][4] < curr_iter) {
            numberposted += 1;
            myWorker.postMessage([byn, centerX, centerY, scale, curr_iter, innerWidth, innerHeight]);
            break;
        }
    }
    for (byn = by - 1; byn > 0; byn--) {
        if (picdata[byn].length === 0 || picdata[byn][4] < curr_iter) {
            numberposted += 1;
            myWorker.postMessage([byn, centerX, centerY, scale, curr_iter, innerWidth, innerHeight]);
            break;
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
    if (numberposted < 1) {
        post2Worker();
    }
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
        scale = scale * 0.8
    }
    else if (e.deltaY > 0) {
        scale = scale / 0.8
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
    canvas.on
    resize();
    anim()
}

window.onresize = function () {
    resize();
}

function resize() {
    myWorker.terminate();
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    imagedata = ctx.createImageData(innerWidth, innerHeight);
    picdata = new Array(innerHeight).fill([]);
    myWorker = new Worker("mww1w.js");
    myWorker.onmessage = onmessagehandler;
    numberposted = 0;
    numberempfang = 0;
    drawcount = 0;
    post2Worker();
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
    ctx.strokeText(drawcount.toString() + ' ' + numberempfang + ' ' + numberposted + ' ' + innerHeight+ ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    // ctx.fillText(drawcount.toString() + ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    ctx.strokeText("X=" + centerX.toString() + "  Y=" + centerY.toString() + "  S=" + scale.toString() + " C=" + curr_iter.toString(), 10, 100);
    // ctx.fillText("curr_iter " + curr_iter.toString(), 10, 100);
    ctx.restore();
    datelast = datenow;
}


function anim() {
    // requestAnimationFrame(anim);
    draw();
}

