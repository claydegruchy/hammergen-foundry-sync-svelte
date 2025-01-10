# What is this
This is a tool that lets users migrate [hammergen](https://hammergen.net/) characters to [foundry wfrp 4e system](https://foundryvtt.com/packages/wfrp4e) actors

![ScreenRecording2025-01-09at15 52 47-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/d4e987fb-5360-4664-8620-572b3bc8bfef)

Currently this system only support moving characters from hammergen to foundry, not the reverse.

# How do I use it?
Once installed and enabled, you'll find a new entry in the Settings menu in game called "Hammergen Sync", this will open the sync window. Then:
1. Login to your Hammergen account
2. Find the character that you want to overwrite in Foundry in the Foundry column
3. Select the character you want to download in the Hammergen column
4. Hit the download button

## Issues
### Not all items exist
After a sync, check the `Operation Outcome` area for any notes or errors. Not everything can be perfectly mapped so there are cases where an item needed to be switched out for another (ie no "parchment" in Foundry, so "paper" is used instead), and some items just can't be mapped or don't exist between both Mutations and Grouped Lore skills suffer quite a bit here.
### Bag curse
If you are running an older version of the WFRP4e module then you might need to delete the extra bags. Due to a bug in the WFRP module in Foundry, bags can't be auto deleted. Only an issue if you're syncing many times but deleting 25 bags can get pretty annoying so it may be worth not including bags in Hammergen.

# How it works
Its a big mapping table. the table is just a google sheet (public [here](https://docs.google.com/spreadsheets/d/1wAtf6zVBo8AHSJfFJOyodfEE2uA3okLfEPxhNu1HMHw/edit?usp=sharing)) and works as a simple map between hammergenId and foundryId for each item (trapping, skill, talents, etc). the logic for this is [here](https://github.com/claydegruchy/hammergen-foundry-sync-svelte/blob/3ad44b5b9ed586fad052e0d0fb5bd70e9a5d694d/src/view/valueMapper.js#L21).

I have only added items/careers/etc that appear in the base WFRP 4e book as thats all I personally own.
