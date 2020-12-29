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
    drawcount = 0;
}

function drawlinetopointer(startx, starty) {
    ctx.moveTo(startx, starty); ctx.lineTo(pointer.x, pointer.y);
}


function mandel1(c_r, c_i, z0_r, z0_i, max_iter) {
    let iter;
    let z_r = z0_r;
    let z_i = z0_i;
    let z_r_2, z_i_2;

    for (iter = 0; iter < max_iter; iter++) {
        z_r_2 = z_r * z_r;
        z_i_2 = z_i * z_i;

        if (z_r_2 + z_i_2 > 9)
            break;

        z_i = 2 * z_r * z_i + c_i;
        z_r = z_r_2 - z_i_2 + c_r;
    }
    return iter;
}


function mandel2(c_r, c_i, z0_r, z0_i, max_iter) {
    let x0 = c_r;
    let y0 = c_i;
    let x = z0_r;
    let y = z0_i;
    let x2 = 0;
    let y2 = 0;
    let iter = 0;
    let xold = 0;
    let yold = 0;
    let period = 0;

    while (((x2 + y2) <= 4) && (iter < max_iter)) {
        y = 2 * x * y + y0
        x = x2 - y2 + x0
        x2 = x * x
        y2 = y * y
        iter += 1
        if ((Math.abs(x - xold) + Math.abs(y - yold)) < 0.0001) {
            iter = max_iter;    /* Set to max for the color plotting */
            break        /* We are inside the Mandelbrot set, leave the while loop */
        };

        period += 1
        if (period > 20) {
            period = 0;
            xold = x;
            yold = y;
        }
    }
    return iter;
}

function draw() {
    let datenow = Date.now();
    drawcount += 1;
    ctx.save();
    let imagedata = ctx.createImageData(innerWidth, innerHeight);
    //    ctx.fillStyle = "rgba(200, 75, 99, 0.384)";
    //    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (by = 1; by < (innerHeight - 1); by += 1) {
        for (bx = 1; bx < (innerWidth - 1); bx += 1) {
            let pixelindex = (by * innerWidth + bx) * 4;
            let sum = mandel2(4 * (bx / innerWidth - 0.5) - 1, 4 * (by / innerHeight - 0.5), 0, 0, 1.5 ** drawcount);
            if (sum < 1.5 ** drawcount) {
                imagedata.data[pixelindex + 0] = (100 * (sum % 7)) % 255; // R
                imagedata.data[pixelindex + 1] = (100 * (sum % 11)) % 255; // G
                imagedata.data[pixelindex + 2] = (100 * (sum % 17)) % 255; // B
                imagedata.data[pixelindex + 3] = 255; // alpha                
            }
        }
    }
    ctx.putImageData(imagedata, 0, 0);
    ctx.font = "30px Courier New";
    ctx.fillStyle = "black";
    drawfps = (1 * drawfps + 1000 / (datenow - datelast)) / 2;
    ctx.fillText(drawcount.toString() + ' FPS=' + (Math.round(drawfps)).toString(), 10, 50);
    ctx.fillText(pointer.id.toString() + " " + pointer.type.toString() + " " + pointer.prim.toString(), 10, 100);
    ctx.restore();
    datelast = datenow;
}

function anim() {
    requestAnimationFrame(anim);
    draw();
}

