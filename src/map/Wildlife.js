class Wildlife {
	constructor(name, symbol) {
		this.name = name;
		this.symbol = symbol;
	}

	WILDLIFE_TYPES = [
		new Wildlife('Rabbit', 'r'),
		new Wildlife('Deer', 'd'),
		new Wildlife('Bear', 'B'),
		new Wildlife('Wolf', 'W')
	];

	generateWildlife(width,height,count) {
		const wildlife = [];
		for (let i = 0; i < count; i++) {
			const x = Math.floor(Math.random() * width);
			const y = Math.floor(Math.random() * height);
			const type = WILDLIFE_TYPES[Math.floor(Math.random() * WILDLIFE_TYPES.length)];
			wildlife.push({x,y,type});
		}
		return wildlife;
	}
}

export default Wildlife;
