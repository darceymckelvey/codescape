// function to linearly interpolation between aa0 and a1
// weight w should be in the range [0.0, 1.0]
function interpolate(a0, a1, w) {
    return (a1 - a0) * w + a0;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// create pseudo-random direction vector
// works for any number of grid cords
function randomGradient(ix, iy) {
    let w = 32n;
    let s = w / 2n; // rotation width
    let m = (1n << w) - 1n;

    let a = BigInt(ix) % m;
    let b = BigInt(iy) % m;
    a = (a * 3284157443n) % m;
    b = (b ^ (a << s) | (a >> w-s)) % m;
    b = (b * 1911520717n) % m;
    a = (a ^ (b << s) | (b >> w-s)) % m;
    a = (a * 2048419325n) % m;
    a = Number(a);

    let random = a * (3.14159265 / 2147483648);

   return new Vector2(Math.cos(random), Math.sin(random));
};

// computes the dot product of the distance and gradient vectors
function dotGridGradient(ix, iy, x, y) {
    // get gradient from integer coordinates
    let  gradient = randomGradient(ix,iy);

    // compute the distance vector
    let dx = x - ix;
    let dy = y - iy;

    // compute the dot-product
    return (dx*gradient.x + dy*gradient.y);
};

// compute PERLIN NOISE at X,Y
function noise(x,y){
    // grid cell coordinates
    let x0 = Math.floor(x);
    let x1 = x0 + 1;
    let y0 = Math.floor(y);
    let y1 = y0 + 1;

    // interpolation weights
    // could also use higher order polynomial/s-curve
    let sx = x - x0;
    let sy = y - y0;

    // interpolate between grid point gradients
    let n0, n1, ix0, ix1, value;

    n0 = dotGridGradient(x0, y0, x, y);
    n1 = dotGridGradient(x0, y0, x, y);
    ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(x0, y0, x, y);
    n1 = dotGridGradient(x0, y0, x, y);
    ix1 = interpolate(n0, n1, sx);

    value = interpolate(ix0, ix1, sy);
    return value;
}

// for (let i = 0; i < 100; i++) {
//     for (let j = 0; j < 100; j++) {
//         let n = noise(i / 10, j / 10);
//         console.log(n);
//     }
// }

