var canvas;
var ctx;      // canvas.getContext('2d');
var drawcount = 0;
var datelast = 0;
var drawfps = 0;

const myWorker = new Worker("mww1w.js");

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
}


window.onload = function myfunction() {
    canvas = document.getElementById('mycanvas');
    ctx = canvas.getContext('2d');
    canvas.onpointermove = movehandler;
    resize();
    anim()
}

window.onresize = function () {
    resize();
}
function resize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    drawcount = 0;
}

function drawlinetopointer(startx, starty) {
    ctx.moveTo(startx, starty); ctx.lineTo(pointer.x, pointer.y);
}



function draw() {
    let datenow = Date.now();
    drawcount += 1;
    ctx.save();
    let imagedata = ctx.createImageData(innerWidth, innerHeight);
    //    ctx.fillStyle = "rgba(200, 75, 99, 0.384)";
    //    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.putImageData(imagedata, 0, 0);

    drawfps = (1 * drawfps + 1000 / (datenow - datelast)) / 2;
    ctx.font = "30px Courier New";
    ctx.fillStyle = "black";
    ctx.strokeStyle= "white";
    ctx.strokeText(drawcount.toString() + ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    ctx.fillText(drawcount.toString() + ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    ctx.strokeText(pointer.id.toString() + " " + pointer.type.toString() + " " + pointer.prim.toString(), 10, 100);
    ctx.fillText(pointer.id.toString() + " " + pointer.type.toString() + " " + pointer.prim.toString(), 10, 100);
    ctx.restore();
    datelast = datenow;
}

function anim() {
    requestAnimationFrame(anim);
    draw();
}

