import { SvelteApplication } from '#runtime/svelte/application';

import BasicAppShell from './BasicAppShell.svelte';
import {
   constants,
   settings
} from './constants';

import { gameSettings } from './gameSettings';


export default class BasicApplication extends SvelteApplication {
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */

   constructor(options) {
      super(options);

      /**
       * Register a world game setting w/ TJSGameSettings. This makes a client setting / localstorage store available
       * to serialize the app state.
       */
      // console.log({ settings })
      for (const [key, value] of Object.entries(settings)) {
         console.log("creating store for", key, "with", value)
         gameSettings.register({
            namespace: constants.moduleId,
            key: key,
            options: {
               ...value
            }
         });



      }


   }



   static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: 'TemplateESM.title',  // Automatically localized from `lang/en.json`.
         width: 500,
         height: 'auto',
         resizable: true,
         svelte: {
            class: BasicAppShell,
            target: document.body,
         }
      });
   }
}