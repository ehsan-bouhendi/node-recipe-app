# Recipe App

This is a small, purposefully-incomplete recipe app intended to be used in some Copilot workshops. 

- Built with Node.js, Express, Handlebars, and Sqlite.
- Scafholds a database with seed data on first launch.
- Handles the creation, listing, searching, and editing of recipes.

Use the search form above the recipe list to find recipes by name or ingredients.
Search matches literal substrings, ignoring case. Clear the input and search again
to show all recipes. API clients can also send `SEARCH /recipes/:text`, with the
search text URL-encoded.

Some ideas of what to add:

- A `/recipes/random` endpoint to select a random recipe.
- A way to delete recipes within the web application.
- Support for multiple units of measurement on recipes. 

## Requirements

**Right click the following Codespaces button to open your Codespace in a new tab:**

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1026168589)

You can also run locally with the help of Dev Containers. If you want to run outside of a container, the setup should be the following commands in your terminal:

```bash
npm install
npm start
```
Visit `http://localhost:3000` to start managing your recipes.

## License

This project is licensed under the terms of the MIT open source license. Please refer to [MIT](https://github.com/github-samples/node-recipe-app/blob/main/LICENSE) for the full terms.

## Support & Contributions

There is no support for this repository. It will periodically be updated as the needs for workshops where it is used evolves. We do not currently accept contributions. 
