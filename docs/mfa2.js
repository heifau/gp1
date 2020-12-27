var canvas;
var ctx;      // canvas.getContext('2d');
var drawcount = 0;
var datelast = 0;
var drawfps = 0;

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
}

function drawlinetopointer(startx, starty) {
    ctx.moveTo(startx, starty); ctx.lineTo(pointer.x, pointer.y);
}

function draw() {
    let datenow = Date.now();
    drawcount += 1;
    ctx.save();
    ctx.fillStyle = "rgba(200, 75, 99, 0.384)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Courier New";
    ctx.fillStyle = "black";
    drawfps = (50 * drawfps + 1000 / (datenow - datelast)) / 51;
    ctx.fillText(drawcount.toString() + ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    ctx.fillText(pointer.id.toString() + " " + pointer.type.toString() + " " + pointer.prim.toString(), 10, 100);

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#808000';
    ctx.lineCap = 'butt';
    // ctx.moveTo(innerWidth / 2, innerHeight / 2);  ctx.lineTo(pointer.x, pointer.y);
    drawlinetopointer(innerWidth / 2, innerHeight / 2)
    for (by = 10; by < (innerHeight - 10 - 20); by += 20) {
        for (bx = 10; bx < (innerWidth - 10 - 20); bx += 20) {
            drawlinetopointer(bx, by)
        }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    datelast = datenow;
}

function anim() {
    requestAnimationFrame(anim);
    draw();
}

