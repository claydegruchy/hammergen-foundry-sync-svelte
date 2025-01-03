import { downloadAttribs } from "./hammergen-api"



export async function hammergenCharacterToFoundryActor(hammergenChar, foundryActor) {
	// if (Object.keys(cache).length < 1) {
	// 	await downloadAttribs()
	// }

	const formatName = str => str.trim().toLocaleLowerCase().replace(/[^a-zA-Z]/g, "")




	let cache = await downloadAttribs()


	let map = {}

	let i = 0
	console.log("starting")
	for (let [type, hammerItems] of Object.entries(cache)) {
		if (type == "item") type = "trapping"
		let foundryItems = game.items.filter((item, i) => item.type == type)
		console.log("starting", type, foundryItems.length, hammerItems.length)
		map[type] = { found: [], notFound: [], skipped: [], hammerItemsTotal: hammerItems.length, foundryItemsTotal: foundryItems.length }

		for (const hammerItem of hammerItems) {
			let skip = false
			if (skip) continue
			if (!hammerItem.source[1]) {
				map[type].skipped.push(formatName(hammerItem.name))
				continue
			}
			let match = foundryItems.find(foundryItem => formatName(hammerItem.name) == formatName(foundryItem.name))
			if (match) {
				// console.log("match", hammerItem.name, match.name)
				map[type].found.push(formatName(hammerItem.name))

			} else {
				// console.error("match not found", hammerItem.name, match)
				map[type].notFound.push(formatName(hammerItem.name))
			}



		}


		// for (const item of items) {
		// 	if (item.name == )
		// }
		// if (items.length < 1) console.log("no real", type)
	}
	console.log(map)









	let itemsToFind = []





	// if(source[1])

	return


	// get actor
	console.log("loaded foundry actor", foundryActor)



	// get character
	console.log("loaded hmmergen character", hammergenChar)

	// perform map
	// update object
	let updateObject = {
		name: hammergenChar.name
	}
	// base characteristics
	for (const [k, v] of Object.entries(hammergenChar.baseAttributes)) {
		updateObject["data.characteristics." + k.toLocaleLowerCase() + ".initial"] = v
	}

	// characteristic advances
	for (const [k, v] of Object.entries(hammergenChar.attributeAdvances)) {
		updateObject["data.characteristics." + k.toLocaleLowerCase() + ".advances"] = v
	}

	let mappingTable = {}
	let warnings = []
	// skills
	let skillsToAdd = []




	return
	for (const { number, wh: { id, object: { name } } } of hammergenChar.skills) {


		let skill = game.items.filter((item, i) => item.type == "skill")
			.find(item => item.name.trim() == name.trim())


		if (skill) {
			// console.log("found", name)
			skillsToAdd.push(skill)
			mappingTable[id] = skill.id
		} else {
			console.error("skill not found", id, name,)
			warnings.push(`Couldnt find ${name}`)
			console.log("starting fuzzy search")
			// name.replace(/[^a-zA-Z\s]/g, "").split(" ")

		}

		// loop up local value here
	}

	// let exampleSkill = "Outdoor Survival"


	console.log(mappingTable)


	//    targetActor.update({ [path]: 10 });


	// get current talents
	// console.log(updateObject, foundryActor.itemCategories.talent)




	// let path = "data.characteristics.ag.initial";
	// let strength = getProperty(foundryActor.data, path); // Safely fetches the value
	// console.log({ strength, path })


	function validator(ud) {
		// return
		console.group("pathCheck")

		// validate
		for (const [path, val] of Object.entries(ud)) {
			const found = getProperty(foundryActor.data, path)
			if (found != 0 && !found) {
				console.error("path not found", path, val)
			} else {
				console.log("path found", path, found)

			}

		}
		console.groupEnd()
	}
	// validator(updateObject)



	// console.log("updating actor...", foundryActor.data)
	// foundryActor.update(updateObject);
	// console.log("update complete", foundryActor.data)





	// ####### updating foundry #######
	//    let path = "data.characteristics.ag.initial";
	//    let strength = getProperty(targetActor.data, path); // Safely fetches the value

	//    targetActor.update("data.characteristics.vs.value", 1);

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