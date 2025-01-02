import { TJSGameSettings } from '#runtime/svelte/store/fvtt/settings';

import { constants } from './constants';

/**
 * Provides a shared instance of TJSGameSettings across all demos. TJSGameSettings creates Svelte stores that are
 * synchronized with Foundry game settings.
 *
 * Demos that use this `gameSettings`:
 * - src/view/svelte/application/app-state/client-setting
 * - src/view/standard-components/side-slide-layer
 *
 * @type {TJSGameSettings}
 */
export const gameSettings = new TJSGameSettings(constants.moduleId);