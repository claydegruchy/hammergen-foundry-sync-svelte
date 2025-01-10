<script>
   import { getCharacters, getCharacter, getMappingTable, loginToHammergen } from "./hammergen-api.ts";
   import { hammergenCharacterToFoundryActor } from "./valueMapper.js";

   import { gameSettings } from "./gameSettings.js";
   //    console.log(gameSettings.getStore(settings.appStateClient), 123);
   //   console.log(gameSettings.getStore("somekey"), 123);

   const apiKey = gameSettings.getStore("apiKey");
   const mappedCharacters = gameSettings.getStore("mappedCharacters");
   const mappingTable = gameSettings.getStore("mappingTable");
   const lastUpdate = gameSettings.getStore("lastUpdate");

   // remove blank entries to prevent bloat (premature optimisation)
   mappedCharacters.subscribe((change) => {
      for (const [k, v] of Object.entries(change)) {
         if (!v) {
            delete change[k];
            $mappedCharacters = change;
         }
      }
   });

   let updateMappingTableLoading = "";
   async function updateMappingTable() {
      updateMappingTableLoading = "Loading...";
      try {
         $mappingTable = await getMappingTable();
         updateMappingTableLoading = `Success (${$mappingTable.length} entries loaded)`;
         $lastUpdate = new Date();
         setTimeout(() => (updateMappingTableLoading = ""), 3000);
      } catch (error) {
         updateMappingTableLoading = `Error: {${error}}`;
      }
   }

   let foundryActors = [];
   let hammergenCharacters = [];

   let refreshCharacterListLoading = "";
   async function refreshCharacterList() {
      refreshCharacterListLoading = "Loading...";
      try {
         foundryActors = [...game.actors];
         hammergenCharacters = await getCharacters();
         refreshCharacterListLoading = `Success`;
         $lastUpdate = new Date();
         setTimeout(() => (refreshCharacterListLoading = ""), 3000);
      } catch (error) {
         refreshCharacterListLoading = `Error: {${error}}`;
      }
   }

   let uiFeedback = [];
   async function downloadCharacter(hammergenId, foundryId) {
      clearUiFeedback();
      // get hammergen character
      uiFeedback.push(`Loading Character from Hammergen`);
      const hammergenCharacter = await getCharacter(hammergenId);
      console.log({ hammergenCharacter });
      // get foundry character
      uiFeedback.push(`Loading Actor from Foundry`);
      const foundryActor = await game.actors.get(foundryId);
      // load and run
      // console.log("characters found", hammergenCharacter, foundryActor);
      uiFeedback.push(`Starting import system...`);
      uiFeedback = uiFeedback;
      try {
         let out = await hammergenCharacterToFoundryActor(hammergenCharacter, foundryActor);
         uiFeedback = [...uiFeedback, ...out];
      } catch (error) {
         console.error(error);
         uiFeedback.push(`Error: Failed. Import system encountered an error: ${error}`);
      }
      // display uifeedback
      uiFeedback = uiFeedback;
      refreshCharacterList();
   }
   async function uploadCharacter(hammergenId, foundryId) {
      //
   }

   function clearUiFeedback() {
      uiFeedback = [];
   }

   refreshCharacterList();

   let openLoginModal = false;
   let username = "";
   let password = "";

   let startLoginLoading = "";

   async function startLogin() {
      startLoginLoading = "Logging in...";
      let result = await loginToHammergen(username, password);
      console.log({result})
      if (result) {
         startLoginLoading = "Login successful";
         openLoginModal = false;
         let username = "";
         let password = "";
         setTimeout(() => (startLoginLoading = ""), 3000);
         return;
      }
      startLoginLoading = "Login failed, please check username/password";
      setTimeout(() => (startLoginLoading = ""), 3000);
   }
</script>

<div>
   {#if openLoginModal}
      <div class="flex padding">
         <label for=""
            >Email
            <input type="email" bind:value={username} />
         </label>
         <label for="">
            Password
            <input type="password" bind:value={password} />
         </label>
         <button on:click={startLogin}>Login</button>
      </div>
   {/if}
   <div class="flex">
      <button on:click={updateMappingTable}
         >Update Mapping Table {#if updateMappingTableLoading}
            <div>
               {updateMappingTableLoading}
            </div>
         {/if}</button
      >
      <button on:click={refreshCharacterList}
         >Refresh Character List {#if refreshCharacterListLoading}
            <div>
               {refreshCharacterListLoading}
            </div>
         {/if}</button
      >
      {#if !$apiKey}
         {#if !openLoginModal}
            <button on:click={() => (openLoginModal = true)}>Open Login Modal</button>
         {:else}
            <button on:click={() => (openLoginModal = false)}
               >Close Login Modal <div>{startLoginLoading}</div></button
            >
         {/if}
      {:else}
         <button on:click={() => ($apiKey = null)}
            >Logout <div>{startLoginLoading}</div></button
         >
      {/if}
   </div>
   <div>
      <div>Foundry:</div>
      <table>
         <thead>
            <th>Foundry Actor ({foundryActors.length})</th>
            <th>Hammergen Character ({hammergenCharacters.length})</th>
            <th>Operations</th>
         </thead>

         <tbody>
            {#each foundryActors as actor}
               <tr>
                  <td>
                     <select disabled>
                        <option>{actor.name}</option>
                     </select>
                  </td>
                  <td>
                     <select
                        bind:value={$mappedCharacters[actor.id]}
                        on:change={() => {
                           console.log($mappedCharacters);
                        }}
                     >
                        <option value={undefined}>None</option>
                        {#each hammergenCharacters as actor}
                           <option value={actor.id}>
                              {actor.name}
                           </option>
                        {/each}
                     </select>
                  </td>
                  <td>
                     {#if $mappedCharacters[actor.id]}
                        <div class="flex">
                           <!-- <button title="Upload">Upload</button> -->
                           <button
                              title="Download"
                              on:click={() => downloadCharacter($mappedCharacters[actor.id], actor.id)}>Download</button
                           >
                        </div>
                     {/if}
                  </td>
               </tr>
            {/each}
         </tbody>
      </table>
      {#if uiFeedback.length > 0}
         <h3>Operation outcome</h3>
         {#each uiFeedback as feedback}
            <div>
               {feedback}
            </div>
         {/each}
      {/if}
   </div>
</div>

<style>
   select,
   input {
      background-color: #d1d1d1;
   }
   .flex {
      display: flex;
   }
</style>
