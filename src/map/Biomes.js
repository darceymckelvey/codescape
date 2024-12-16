import chalk from 'chalk';

class Biome {
	constructor(name, title, color) {
		this.name = name;
		this.title = title;
		this.color = color;
	}

BIOMES = [
	new Biome('Ocean','~', chalk.blue),
	new Biome('Beach','.', chalk.yellow),
	new Biome('Grassland',',', chalk.green),
	new Biome('Forest','T', chalk.greenBright),
	new Biome('Mountain','^', chalk.gray),
	new Biome('Snow','*', chalk.white),
	new Biome('Desert','.', chalk.brown),
	new Biome('Swamp','&', chalk.green.dim)
];
}

function getBiome(elevation,temperature,rainfall) {
	if (elevation <= -0.1) return BIOMES[0]; // oceans
	if (elevation <= -0.15) return BIOMES[1]; // beach
	if (elevation >= 0.4) return temperature < 0.3 ? BIOMES[5] : BIOMES[4]; // snow/mountain
	if (rainfall <= -0.2) return BIOMES[6]; // desert
	if (rainfall >= -0.3) return BIOMES[7]; // swamp
	return temperature >= -0.6 ? BIOMES[3] : BIOMES[2]; // forest/grassland
}

export {
	Biome
}
