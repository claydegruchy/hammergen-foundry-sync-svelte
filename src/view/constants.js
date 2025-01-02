/**
 * Defines the main constants for module name and label.
 *
 * @type {{moduleId: string, moduleLabel: string}}
 */
const constants = {
	moduleId: 'hammergen-foundry-sync-svelte',
	moduleLabel: `Hammergen Foundry sync`
};

/**
 * @type {ESSettingConstants} Defines the Foundry game setting keys.
 */
const settings = {
	mappedCharacters: {
		name: "Mapped characters",
		hint: 'A mapping of character names and IDs',
		default: [],
		scope: 'world',
		config: true,

		//       name: 'My Setting', // can also be an i18n key
		//       hint: 'A description of the registered setting and its behavior.', // can also be an i18n key
		//       scope: 'world',     // "world" = sync to db, "client" = local storage
		//       config: true,       // false if you dont want it to show in module config
		//       type: Object,       // Number, Boolean, String, or even a custom class or DataModel
		//       default: { update: false },
	},
	apiKey: {
		default: null,
		scope: 'world',
		config: true,
	},
}

/**
 * @type {ESSessionConstants} Defines all the module session storage static constants.
 */
const sessionConstants = {
};


export { constants, sessionConstants, settings };