const base = "https://hammergen-production-waxikk2naa-ew.a.run.app/api/wh/"
// const base = "http://127.0.0.1:8082/api/wh/"
const cache = {}


async function hammergenApiWrapper(path) {
	const response = await fetch(base + path).then(r => r.json())
	console.log(response)
	if (Array.isArray(response.data)) {
		return response.data.map(item => ({ id: item.id, ...item.object }))
	} else {
		return response.data.object
	}
}

import attribCache from "./workarea/hammergen-dump.json"
export async function downloadAttribs() {
	console.log("downloadAttribs", attribCache)


	return attribCache

	const cacheItems = [
		"prayer",
		"spell",
		"talent",
		"mutation",
		"rune",
		"skill",
		"career",
		"item",
		"trait",
	]


	for (const path of cacheItems) {
		try {
			cache[path] = await hammergenApiWrapper(path)
		} catch (error) {
			console.error(error)
		}
	}
	console.log(cache)
	return cache
}


export async function getCharacters() {

	const cacheItems = [
		'character'
	]


	try {
		// let res = await fetch(base + 'character').then(r => r.json())
		// let characters = res.data.map(item => item.object)
		return hammergenApiWrapper('character')
		// return characters
	} catch (error) {
		return []
	}
}


import exampleHammergenChar from "./workarea/examples/hammergen-full-character.json"
export async function getCharacter(hammergenCharacterId) {

	if (hammergenCharacterId == "800000000000000000000001") {
		return exampleHammergenChar.data.object
	}
	return await hammergenApiWrapper('character/' + hammergenCharacterId + "?full=true")
}

import mappingTableLocal from "./mappingTableLocal.csv"
export async function getMappingTable() {
	return mappingTableLocal


	fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS8ygCgKBLilt6C_JTROnL3mPDtkq0a9ZOQ345fhLRD-X8__RUk3GxtU3lJz0Zo19TCLyNrzkZtQzDp/pub?gid=1882191290&single=true&output=csv')

		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text();
		})
}	