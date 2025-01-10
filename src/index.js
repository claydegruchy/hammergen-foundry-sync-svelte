import BasicApplication from './view/BasicApplication.js';
// here we have the hook to start our app at startup
// Hooks.once('ready', () => new BasicApplication().render(true, { focus: true }));


// here we will insert a button into settings
// this is done at render point
// we insert the button as raw HTML then lock onto it with an event from html for its selector
Hooks.on('renderSettings', (playerList, html) => {

	const target = html.find(`#settings-game`)

	// insert a button at the end of this element
	target.append(
		`<button data-action="hammergen-sync">
            Hammergen Sync
        </button>`
	);

	const button = html.find(`[data-action="hammergen-sync"]`)

	html.on('click', '[data-action="hammergen-sync"]', (event) =>
		new BasicApplication().render(true, { focus: true })
	)

});

