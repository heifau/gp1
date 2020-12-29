// const myWorker = new Worker("mww1w.js");

onmessage = function (e) {
    console.log('Worker: Message received from main script');
    postMessage("Worker: Message received from main script");
}

var postcount = 0;

function intPost() {
    postcount += 1;
    postMessage("intPost: "+ postcount.toString());
}

const myposter= setInterval(intPost, 3000)

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
                imagedata.data[pixelindex + 0] = 0; // (100 * (sum % 7)) % 255; // R
                imagedata.data[pixelindex + 1] = 0; // G
                imagedata.data[pixelindex + 2] = 0; // B
                imagedata.data[pixelindex + 3] = 255; // alpha                
            }
        }
    }
    datelast = datenow;
}

