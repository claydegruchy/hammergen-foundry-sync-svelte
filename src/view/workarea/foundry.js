(async () => {
	console.log("lmao")
	const base = "https://hammergen-production-waxikk2naa-ew.a.run.app/api/wh/"
	// const base = "http://127.0.0.1:8082/api/wh/"

	const cache = {}

	async function getAttribs() {

		const cacheItems = [
			"prayer",
			"spell",
			"talent",
			"mutation",
			"rune",
			"skill",
			"career",
			"item",
			"character",
			"trait",
		]


		for (const path of cacheItems) {
			try {
				let result = await fetch(base + path).then(r => r.json())
				console.log(result, path)
				cache[path] = result
			} catch (error) {
				console.error(error)
			}
		}


	}

	getAttribs()



	// const res = await fetch(base + "character/800000000000000000000001?full=true").then(r => r.json())
	// console.log(res)
})()

// game.actors.getName("test");

