class PerlinNoise {
    constructor({ dimensions = 3, size = 256, seed = null } = {}) {
        this.dimensions = dimensions; // Supports 3D now
        this.size = size;
        this.seed = seed;

        const random = seed ? this.seededRandom(seed) : Math.random;

        // Step 1: Generate permutation array and shuffle
        this.permutation = Array.from({ length: size }, (_, i) => i);
        this.shuffleArray(this.permutation, random);
        this.permutation = [...this.permutation, ...this.permutation];  // Duplicate to avoid overflow

        // Step 2: Generate gradients for N-D (3D now)
        this.gradients = this.generateGradients(size, dimensions, random);
    }

    // Function for generating seeded random values
    seededRandom(seed) {
        let value = seed % 2147483647;
        return () => {
            value = (value * 16807) % 2147483647;
            return (value - 1) / 2147483646;
        };
    }

    // Shuffle the array using a random function (Knuth Shuffle)
    shuffleArray(array, randomFn) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(randomFn() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Swap elements
        }
    }

    // Generate gradients: Random vectors (normalized)
    generateGradients(size, dimensions, randomFn) {
        const gradients = [];
        for (let i = 0; i < size; i++) {
            const vector = Array.from({ length: dimensions }, () => randomFn() * 2 - 1); // Random vector in [-1, 1]
            const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v ** 2, 0)); // Normalize vector
            gradients.push(vector.map(v => v / magnitude)); // Normalize the vector to unit length
        }
        return gradients;
    }

    // Fade function for smooth transition
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // Linear interpolation
    lerp(a, b, t) {
        return a + t * (b - a);
    }

    // Dot product between the gradient vector and the distance vector
    dotGridGradient(ix, iy, iz, x, y, z) {
        // Correctly calculate the permutation indices and ensure they wrap around
        const permX = this.permutation[ix % this.size];
        const permY = this.permutation[iy % this.size];
        const permZ = this.permutation[iz % this.size];
        
        const permIndex = this.permutation[(permX + permY + permZ) % this.size];

        // Fetch the corresponding gradient
        const gradient = this.gradients[permIndex];

        // Calculate the distance vector
        const dx = x - ix, dy = y - iy, dz = z - iz;

        // Return the dot product between the gradient and the distance vector
        return gradient[0] * dx + gradient[1] * dy + gradient[2] * dz;
    }

    // Main noise generation method
    noise(x, y, z) {
        const x0 = Math.floor(x), x1 = x0 + 1;
        const y0 = Math.floor(y), y1 = y0 + 1;
        const z0 = Math.floor(z), z1 = z0 + 1;

        const sx = this.fade(x - x0), sy = this.fade(y - y0), sz = this.fade(z - z0);

        // Dot products at the grid points
        const n000 = this.dotGridGradient(x0, y0, z0, x, y, z);
        const n001 = this.dotGridGradient(x0, y0, z1, x, y, z);
        const n010 = this.dotGridGradient(x0, y1, z0, x, y, z);
        const n011 = this.dotGridGradient(x0, y1, z1, x, y, z);
        const n100 = this.dotGridGradient(x1, y0, z0, x, y, z);
        const n101 = this.dotGridGradient(x1, y0, z1, x, y, z);
        const n110 = this.dotGridGradient(x1, y1, z0, x, y, z);
        const n111 = this.dotGridGradient(x1, y1, z1, x, y, z);

        // Interpolate between the values
        const ix0 = this.lerp(n000, n100, sx), ix1 = this.lerp(n010, n110, sx);
        const iy0 = this.lerp(ix0, ix1, sy);

        const ix2 = this.lerp(n001, n101, sx), ix3 = this.lerp(n011, n111, sx);
        const iy1 = this.lerp(ix2, ix3, sy);

        // Final interpolation
        return this.lerp(iy0, iy1, sz);
    }
}

export default PerlinNoise;
