import { get } from "svelte/store";
import { gameSettings } from "./gameSettings.js";

const base = "https://hammergen-production-waxikk2naa-ew.a.run.app/api/wh/"
// const base = "http://127.0.0.1:8082/api/wh/"
const cache = {}


export async function loginToHammergen(username, password) {
	console.log("Starting", "loginToHammergen")

	const formData = new FormData();
	formData.append('username', username);
	formData.append('password', password);

	try {
		const { accessToken } = await fetch("https://hammergen-production-waxikk2naa-ew.a.run.app/api/token", {
			method: "POST",
			body: formData
		}).then(r => r.json())
		if (!accessToken) throw "404"
		const apiKey = gameSettings.getStore("apiKey")
		apiKey.set(accessToken)
		return true

	} catch (error) {
		console.error(error)
		return false

	}


}

async function hammergenApiWrapper(path) {
	console.log("Starting", "hammergenApiWrapper", base + path)

	const apiKey = get(gameSettings.getStore("apiKey"));
	let options = {}
	if (apiKey) {
		options = { headers: { Authorization: 'Bearer ' + apiKey } }
	}

	const response = await fetch(base + path, options).then(r => r.json())
	console.log(response)
	if (Array.isArray(response.data)) {
		return response.data.map(item => ({ id: item.id, ...item.object }))
	} else {
		return response.data.object
	}
}



export async function getCharacters() {
	console.log("Starting", "getCharacters")


	try {
		// let res = await fetch(base + 'character').then(r => r.json())
		// let characters = res.data.map(item => item.object)
		return hammergenApiWrapper('character')
		// return characters
	} catch (error) {
		return []
	}
}


export async function getCharacter(hammergenCharacterId) {
	console.log("Starting", "getCharacter")
	let r = await hammergenApiWrapper('character/' + hammergenCharacterId + "?full=true")
	console.log(r)
	return r
}

import mappingTableLocal from "./mappingTableLocal.csv"
export async function getMappingTable() {
	console.log("Starting", "getMappingTable")
	return mappingTableLocal


	fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS8ygCgKBLilt6C_JTROnL3mPDtkq0a9ZOQ345fhLRD-X8__RUk3GxtU3lJz0Zo19TCLyNrzkZtQzDp/pub?gid=1882191290&single=true&output=csv')

		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text();
		})
}	