import PerlinNoise from '../utils/Noise.js';
import chalk from 'chalk';

// Biome class for biome properties and rendering
class Biome {
    constructor(name, symbol, color, isWater = false) {
        this.name = name;
        this.symbol = symbol;
        this.color = color;
        this.isWater = isWater;  // Flag for water biomes (for special behavior)
    }
}

// Define biomes with more nuanced symbols, colors, and water flag
const BIOMES = [
    new Biome('Ocean', '~', chalk.blue, true),             // Water biome
    new Biome('Beach', '.', chalk.yellow),
    new Biome('Grassland', ',', chalk.green),
    new Biome('Forest', 'T', chalk.greenBright),
    new Biome('Mountain', '^', chalk.gray),
    new Biome('Snow', '*', chalk.white),
    new Biome('Desert', '.', chalk.hex('#D2B48C')),
    new Biome('Swamp', '&', chalk.green.dim),
    new Biome('Jungle', 'J', chalk.hex('#228B22')),
    new Biome('Plains', 'O', chalk.hex('#F5DEB3'))
];

// Biome map for easy reference by type
const Biomes = {
    WATER: BIOMES[0],
    SAND: BIOMES[1],
    GRASS: BIOMES[2],
    FOREST: BIOMES[3],
    MOUNTAIN: BIOMES[4],
    SNOW: BIOMES[5],
    DESERT: BIOMES[6],
    SWAMP: BIOMES[7],
    JUNGLE: BIOMES[8],
    PLAINS: BIOMES[9]
};

// Map Generator class to create world maps using multiple noise layers
class MapGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.perlin = new PerlinNoise();
        this.temperatureNoise = new PerlinNoise();  // Layer for temperature control
        this.moistureNoise = new PerlinNoise();    // Layer for moisture control
        this.elevationNoise = new PerlinNoise();    // Layer for elevation control
        this.map = this.generateMap();
    }

    // Normalize a value to a scale of 0 to 1
    normalize(value, min = -1, max = 1) {
        return (value - min) / (max - min);
    }

    // Generate the map with enhanced layers for temperature, moisture, and elevation
    generateMap() {
        const map = [];
        const scaleFactor = 0.08;  // Adjusted scale for better results

        // Loop through the height and width of the map
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                // Get different layers of noise (temperature, moisture, and elevation)
                const temperature = this.temperatureNoise.noise(x * scaleFactor, y * scaleFactor);
                const moisture = this.moistureNoise.noise(x * scaleFactor, y * scaleFactor);
                const elevation = this.elevationNoise.noise(x * scaleFactor, y * scaleFactor);

                // Normalize the values for easier biome selection
                const normalizedTemperature = this.normalize(temperature);
                const normalizedMoisture = this.normalize(moisture);
                const normalizedElevation = this.normalize(elevation);

                // Calculate the biome based on these values
                const biome = this.getBiome(normalizedTemperature, normalizedMoisture, normalizedElevation);
                row.push(biome);
            }
            map.push(row);
        }
        return map;
    }

    // Determine the biome based on the normalized noise values
    getBiome(temperature, moisture, elevation) {
        // Water biomes (based on moisture and elevation)
        if (elevation < 0.2) return Biomes.WATER;        // Oceans or lakes
        if (moisture > 0.8) return Biomes.SAND;          // Beaches and deserts

        // Biomes with varying temperature and moisture
        if (temperature < 0.2) return Biomes.SNOW;      // Cold, snowy areas
        if (temperature < 0.4) return Biomes.MOUNTAIN;  // Mountains with cold temperature
        if (moisture < 0.3) return Biomes.DESERT;       // Dry desert areas

        // Grassland and plains (moderate temperature and moisture)
        if (temperature < 0.6) return Biomes.PLAINS;    // Plains with moderate temperature
        if (moisture < 0.5) return Biomes.GRASS;        // Grasslands (dry regions)

        // Swampy and forested areas
        if (moisture > 0.5) return Biomes.SWAMP;        // Swamps (high moisture)
        if (elevation > 0.3) return Biomes.FOREST;      // Forests in moderate elevation
        if (temperature > 0.5) return Biomes.JUNGLE;    // Lush jungles with warmth

        return Biomes.GRASS;                            // Default to grasslands
    }

    // Render the map in a visually appealing way
    renderMap() {
        let renderedMap = '';
        for (const row of this.map) {
            for (const cell of row) {
                renderedMap += cell.color(cell.symbol); // Use biome color and symbol for rendering
            }
            renderedMap += '\n';
        }
        console.log(renderedMap);
    }
}

export default MapGenerator;

// Example usage: Generate and display a 100x100 map
const generator = new MapGenerator(100, 100); // 100x100 grid
generator.renderMap();
