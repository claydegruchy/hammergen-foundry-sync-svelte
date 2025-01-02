<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
   import { ApplicationShell } from "#runtime/svelte/component/application";
   import Main from "./Main.svelte";

   export let elementRoot;
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <main>
      <Main></Main>
   </main>
</ApplicationShell>

<style lang="scss">
    div {
      display: flex;
      flex-direction: column;
      gap: 8px;

      padding-top: 0.5rem;
      margin-top: 0.1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.75);
   }

   section {
      --tjs-folder-contents-margin: 0;
      --tjs-folder-contents-padding: 0;
      --tjs-folder-details-margin-left: 0;
      --tjs-folder-details-padding-left: 0;
      --tjs-folder-summary-margin: 0;
      --tjs-folder-summary-font-size: 1.05rem;
      --tjs-folder-summary-width: 100%;

      color: #f0f0e0;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 0.25rem;
      padding: 0.25rem;

      button:focus-visible {
         outline: 4px dotted orange;
      }
   }
</style>
