# what is this
this is a tool that lets users migrate [hammergen](https://hammergen.net/) characters and [foundry wfrp 4e system](https://foundryvtt.com/packages/wfrp4e) actors between each system.

this is also mega early development so beware

# how it works
the plan is simple: a big mapping table. the table is just a google sheet (public [here](https://docs.google.com/spreadsheets/d/1wAtf6zVBo8AHSJfFJOyodfEE2uA3okLfEPxhNu1HMHw/edit?usp=sharing)) and works as a simple map between hammergenId and foundryId for each item (trapping, skill, talents, etc). the logic for this is [here](https://github.com/claydegruchy/hammergen-foundry-sync-svelte/blob/3ad44b5b9ed586fad052e0d0fb5bd70e9a5d694d/src/view/valueMapper.js#L21)



# implimentation notes to self
i cant just add a PR that adds a function to export a character to hammergen as the import to foundry is onerous with its requirements: every talent and skill (all of which are `items` in foundry) need to define their name, stats, etc which is a big pain to keep. its better just to have a mapping table and sync locally.

one option could be including the froundry ID in every item in hammergen that but thats just moving the difficulty around; imagine the pain if theres a code refactor on the foundry wfrp4e system side.



# other things to fix
- talent Unshakeable is spelt Unshakable in rulebook
- career levels cannot be searched by their level name, only the base career name. this makes mapping difficult but not impossible, it just means i need to do some roundabout stuff by reflecting off the inital linked character (which is always career level 2 in hammergen it seems) then using the level of that career to assign to the actor in foundry
- Animal Training (Pegasus) missing 
- Lore (Magick) spelt without a k
