<script>
   export let actor;

   let path = [];
   let f = actor.folder;
   while (f) {
      path.push(f);
      f = f.folder;
   }

   console.log(path);
</script>

<div class="wrap">
   {#each path as folder, i}
   {#if i > 0}/{/if}
      <div style={"background-color:" + folder.color}>
         {folder.name}
      </div>
   {/each}
</div>

<style>
   .wrap {
      display: inline-flex;
   }
</style>
