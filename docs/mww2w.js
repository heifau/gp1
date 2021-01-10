
// myWorker.postMessage([by, centerX, centerY, scale, curr_iter, innerWidth, innerHeight]);
var by, centerX, centerY, scale, curr_iter, innerWidth, innerHeight;
var result = [];


onmessage = function (e) {
    // console.log('Worker input: ', e.data);
    let result = e.data;
    by = e.data[0];
    centerX = e.data[1];
    centerY = e.data[2];
    scale= e.data[3];
    curr_iter = e.data[4];
    innerWidth = e.data[5];
    innerHeight = e.data[6];
    let cy = scale * (by / innerHeight -0.5) + centerY;
    for (bx = 1; bx < (innerWidth - 1); bx += 1) {
        let sum = mandel2(scale * (bx / innerWidth -0.5) + centerX, cy, 0, 0, curr_iter);
        result.push(sum);
    };
    // console.log('Worker output: ', result);
    postMessage(result);
}

// function intPost() {    postMessage("intPost: " + postcount.toString()) }
// const myposter = setInterval(intPost, 100)

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
        if ((Math.abs(x - xold) + Math.abs(y - yold)) < 0.00000001) {
            iter = 923456;    /* Set to max for the color plotting */
            break        /* We are inside the Mandelbrot set, leave the while loop */
        };

        period += 1
        if (period > 20) {
            period = 0;
            xold = x;
            yold = y;
        }
    }
    if (iter === max_iter) {
        return 923457;
    } else {
        return iter;
    }
}
