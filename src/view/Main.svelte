<script>
   import { downloadAttribs, getCharacters, getCharacter } from "./hammergen-api.ts";
   import { hammergenCharacterToFoundryActor } from "./valueMapper.js";

   import { gameSettings } from "./gameSettings.js";
   import { settings } from "./constants.js";
   //    console.log(gameSettings.getStore(settings.appStateClient), 123);
   //   console.log(gameSettings.getStore("somekey"), 123);

   const apiKey = gameSettings.getStore("apiKey");
   const mappedCharacters = gameSettings.getStore("mappedCharacters");
   //    console.log(gameSettings.getStore(settings.settingSwitch), 321);

   let foundryActors = [];
   let hammergenCharacters = [];

   async function getActors() {
      foundryActors = [...game.actors];
      hammergenCharacters = await getCharacters();
   }
   let targetActor = game.actors.get("7ljsyrc2C1haA3io")


   async function sync() {
      hammergenCharacterToFoundryActor(await getCharacter("800000000000000000000001"), targetActor);
   }
   sync();

   //    console.log(targetActor.name, targetActor.data.data.characteristics);

   // Update the strength value
   //    actor.update({
   //       "data.abilities.str.value": actor.data.data.abilities.str.value + 1,
   //    });

   //    console.log(strength);

   //    targetActor.update()
</script>

<div>
   <button on:click={downloadAttribs}>Sync with Hammergen</button>
   <button on:click={getActors}>load actors</button>
   <button></button>
   <div>
      <div>Foundry:</div>
      {#each foundryActors as actor}
         <div>- {actor.name}</div>
      {/each}
      <div>Hammergen:</div>
      {#each hammergenCharacters as actor}
         <div>- {actor.name}</div>
      {/each}
   </div>
</div>
