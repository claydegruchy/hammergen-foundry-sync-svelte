import { get } from "svelte/store";
import { gameSettings } from "./gameSettings.js";

let foundryTypeMap = {
	trapping: "item",
	ammunition: "item",
	container: "item",
	weapon: "item",
	armour: "item",
}


const careerMapper = hammergenCareer => { }

let findType = (foundryType) => {
	return foundryTypeMap[foundryType] || foundryType
}


export async function hammergenCharacterToFoundryActor(hammergenChar, foundryActor) {

	console.log("starting hammergenCharacterToFoundryActor", "copying from", hammergenChar, "to", foundryActor)


	// these are the fields we should attempt to extract from
	const hammergenCharItemFields = [
		"carriedItems",
		"equippedItems",
		"mutations",
		"prayers",
		"skills",
		"spells",
		"storedItems",
		"talents",
		"traits",
	]




	let uiFeedback = []


	const mappingTable = get(gameSettings.getStore("mappingTable"));
	console.log("mapping table", mappingTable)

	if (!mappingTable) {
		uiFeedback.push("Error: Could not find local mapping table.")
		return uiFeedback
	}


	console.log("starting map")



	console.group("inital preperation")

	console.log("removing old items", foundryActor.items)
	if (foundryActor.items) {

		await foundryActor.deleteEmbeddedDocuments("Item", foundryActor.items.filter(n => n.type != "container").map(n => n.id))
		try {
			await foundryActor.deleteEmbeddedDocuments("Item", foundryActor.items.filter(n => n.type == "container").map(n => n.id))
		} catch (error) {
			if (foundryActor.items.filter(n => n.type == "container".length > 0)) {
				uiFeedback.push(`Error: Due to Foundry version compatibility issues, bags cannot be deleted automatically with WFRP4e. Sadly, you must update to version 12 and the latest WFRP version to fix this.`)
			}
		}

	}
	console.groupEnd("inital preperation")



	console.group("mapping")


	let characteristicUpdates = {}


	console.group("base characteristics")
	// base characteristics
	for (const [k, v] of Object.entries(hammergenChar.baseAttributes)) {
		console.log("updating", k)
		characteristicUpdates["data.characteristics." + k.toLocaleLowerCase() + ".initial"] = v
	}
	console.groupEnd("base characteristics")

	console.group("characteristic advances")
	// characteristic advances
	for (const [k, v] of Object.entries(hammergenChar.attributeAdvances)) {
		console.log("updating", k)
		characteristicUpdates["data.characteristics." + k.toLocaleLowerCase() + ".advances"] = v
	}
	console.groupEnd("characteristic advances")





	console.group("mapping itemlikes")




	for (const field of hammergenCharItemFields) {

		console.group(field)

		let items = []
		let quantities = []

		for (const { number, wh: { id, object: { name } } } of hammergenChar[field]) {
			const mappedFoundryItem = mappingTable.find(item => item.HammergenId == id)

			if (!mappedFoundryItem) {
				uiFeedback.push(`Not Added: Could not find "${name}" with ID ${id} in mapping table.`)
				continue
			}

			let {
				FoundryId,
				HammergenId,
				Note, Name
			} = mappedFoundryItem

			const foundryItem = game.items.find(item => item.id == FoundryId)

			if (!foundryItem) {
				uiFeedback.push(`Not Added: Could not find "${name}" with ID ${id} in foundry (mapping table may be out of date).`)
				continue
			}

			console.log("Adding", Name, FoundryId)


			if (Note != "") {
				uiFeedback.push(`Added: "${Name}" Note: ${Note}`)
			}

			items.push(foundryItem)
			quantities.push(number)

		}

		try {
			console.group("bulk adding itemlikes")
			console.log("adding", items.length, "items")
			const addedItems = await foundryActor.createEmbeddedDocuments("Item", items);
			addedItems.forEach((item, i) => {
				// different items need to have their quantity increased in different ways
				if (getProperty(item, "system.advances")) item.update({ "system.advances": { force: true, value: quantities[i] } })
				if (getProperty(item, "system.quantity.value")) item.update({ "system.quantity.value": quantities[i] })
			})

		} catch (error) {
			console.error(error)
		}
		console.groupEnd("bulk adding itemlikes")


		console.groupEnd(field)
	}


	// adding money




	console.groupEnd("mapping itemlikes")
	console.groupEnd("mapping")




	console.group("updating characteristics")
	foundryActor.update(characteristicUpdates);
	console.groupEnd("updating characteristics")



	// other "special" fields that need consideration
	// hammergenChar, foundryActor
	console.log("careerPath")
	// the archetecture of the chareer system in hammergen is such that the SECOND career level is the naming career, and that the other careers are nested under that.
	// while accurate to the books, this is pretty hard for a mapping tool maker to unpick
	hammergenChar.career.current = true

	for (const { current, number, wh: { id, object: { name } } } of [...hammergenChar.careerPath, hammergenChar.career,]) {
		console.log(number, id, name, current)
		const mappedFoundryItem = mappingTable.find(item => item.HammergenId == id)

		let {
			FoundryId,
			HammergenId,
			Note, Name
		} = mappedFoundryItem

		const foundryItem = game.items.find(item => item.id == FoundryId)

		const relatedCareers = game.items.filter(n => n.type == "career").filter(n => n.careergroup.value == foundryItem.careergroup.value)
		const mappedCareer = relatedCareers.find(n => n.system.level.value == number)
		if (!mappedCareer) {
			uiFeedback.push(`Not Added: Career ${name} level ${number} could not be found in Foundry`)
		}

		console.log(foundryItem, mappedCareer.name)
		const [item] = await foundryActor.createEmbeddedDocuments("Item", [mappedCareer]);
		console.log(item, getProperty(item, "current.value"))
		if (current) {
			// current
			console.log("setting as current career", item.name)
			await item.update({ "system.current.value": true })
			// await item.update({ "current": { value: true } })
		}
		else {
			// complete
			console.log("setting as complete career", item.name)
			await item.update({ "system.complete": { value: true } })

		}
		// game.items.filter(item => item.)

	}
	console.log(foundryActor)


	console.log("name")
	await foundryActor.update({ "name": hammergenChar.name })

	console.log("notes", hammergenChar.notes)
	await foundryActor.update({ "system.details.gmnotes.value": `<p>${hammergenChar.notes}</p>` })
	console.log("description", hammergenChar.description)
	await foundryActor.update({ "system.details.biography.value": `<p>${hammergenChar.description}</p>` })
	console.log("fate", hammergenChar.fate)
	await foundryActor.update({ "system.status.fate.value": hammergenChar.fate })
	console.log("fortune", hammergenChar.fortune)
	await foundryActor.update({ "system.status.fortune.value": hammergenChar.fortune })
	console.log("resilience", hammergenChar.resilience)
	await foundryActor.update({ "system.status.resilience.value": hammergenChar.resilience })
	console.log("resolve", hammergenChar.resolve)
	await foundryActor.update({ "system.status.resolve.value": hammergenChar.resolve })
	console.log("sin", hammergenChar.sin)
	await foundryActor.update({ "system.status.sin.value": hammergenChar.sin })
	console.log("corruption", hammergenChar.corruption)
	await foundryActor.update({ "system.status.corruption.value": hammergenChar.corruption })
	console.log("spentExp", "currentExp")
	await foundryActor.update({
		"system.details.experience": {
			spent: hammergenChar.spentExp,
			total: hammergenChar.currentExp + hammergenChar.spentExp,
			force: true
		}
	})
	// console.log("species")
	// console.log("standing")
	// console.log("money")
	// console.log("brass")
	// console.log("silver")
	// console.log("gold")


	uiFeedback.push(`Character ${hammergenChar.name} updated successfully`)
	return uiFeedback


	// ####### updating foundry #######
	//    let path = "data.characteristics.ag.initial";
	//    let strength = getProperty(targetActor.data, path); // Safely fetches the value

	//    targetActor.update("data.characteristics.vs.value", 1); // safely updates value

	//    let actor = game.actors.get(targetActor.id); // Replace with actual actor ID
	//    targetActor.update({ [path]: 10 });

}


// "fel": {
// 	"type": "Number",
// 	"label": "CHAR.Fel",
// 	"abrev": "CHARAbbrev.Fel",
// 	"initial": 30,
// 	"modifier": 0,
// 	"advances": 0,
// 	"bonusMod": 0,
// 	"calculationBonusModifier": 0,
// 	"value": 30,
// 	"bonus": 3,
// 	"cost": 25,
// 	"key": "fel"
// }





// fragment: get all careers or soemthing

// let actor = ui.activeWindow?.actor
// let trappings = [];
// let docs = [];
// let packs = game.wfrp4e.tags.getPacksWithTag("career");
// for (let p of packs) {
//      let careers = (await p.getDocuments()).filter(x=>x.type == 'career');
//      docs = docs.concat(careers);
// }

// if (actor) {
//      let careers = actor.itemTypes['career'];
//      for (let c of careers) { 
//           trappings = trappings.concat(game.wfrp4e.config.classTrappings[c.class.value].split(',').map(x=>x.trim()))
//           trappings = trappings.concat(c.trappings.map(x=>x.trim()))
//           if (c.level.value != 1) {
//                let prevCareers =  docs.filter(x=>x.careergroup?.value == c.careergroup.value && x.level?.value < c.level.value);
//                for (let pc of prevCareers) {
//                     trappings = trappings.concat(pc.trappings.map(x=>x.trim()))
//                }
//           }
//      }
//      trappings = [...new Set(trappings )];
//      for (let t of trappings) {
//           let item = await game.wfrp4e.utility.findItem(t);
//           if (item) {
//                await actor.createEmbeddedDocuments("Item", [item.toObject()])
//           }
//      }
// }

// get current talents
// console.log(updateObject, foundryActor.itemCategories.talent)



// something that removed or replaces talents:

// const replacementTable = {
// 	'Shieldsman': "KILJx6FozXCWz6Ug",
// 	'Feint': "xepSUhs8LXSMMXbf",
// 	'Reversal': "Q2ALWttunlH8VBcU",
// 	'Beat Blade': "33DNKYXoitrQmewx"
// };

// const items = [];
// const deletes = [];

// for (const [talent, newTalentId] of Object.entries(replacementTable)) {
// 	const existingTalents = actor.items.filter(t => t.name === talent);
// 	if (!existingTalents) continue;

// 	const item = await fromUuid(`Compendium.khaine-houserules.khaine-talents.${newTalentId}`);
// 	if (!item) {
// 		console.log("talent-replacement failed, compendium item not found", { actor, oldTalentName: talent, compendiumId: newTalentId });
// 		continue;
// 	}

// 	const data = item.toObject();
// 	data.system.advances.value = existingTalents[0].system.Advances;

// 	console.log("talent-replacement", { actor, oldTalentName: talent, newTalentName: item.name, data });

// 	deletes.push(...existingTalents.map(t => t._id));
// 	items.push(data);
// }

// await actor.createEmbeddedDocuments("Item", items);
// await actor.deleteEmbeddedDocuments("Item", deletes);