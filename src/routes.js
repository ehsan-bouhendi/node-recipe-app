const express = require('express')
const { getDbConnection } = require('./database')

const router = express.Router()

router.get('/', (req, res) => {
	res.render('home', { title: 'Recipe App' })
})

async function searchRecipes(req, res) {
	const searchText = req.params.text ?? req.query.search ?? ''
	if (typeof searchText !== 'string') {
		return res.sendStatus(400)
	}
	const db = await getDbConnection()
	const recipes = searchText
		? await db.all(
			'SELECT * FROM recipes WHERE instr(lower(title), lower(?)) > 0 OR instr(lower(ingredients), lower(?)) > 0',
			[searchText, searchText]
		)
		: await db.all('SELECT * FROM recipes')
	res.render('recipes', { recipes, searchText })
}

router.get('/recipes', searchRecipes)
router.search('/recipes/:text', searchRecipes)

router.get('/recipes/:id', async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', [recipeId])
	if (!recipe) {
		return res.status(404).render('recipe', { recipe })
	}
	res.render('recipe', { recipe })
})

router.post('/recipes', async (req, res) => {
	const db = await getDbConnection()
	const { title, ingredients, method } = req.body
	await db.run('INSERT INTO recipes (title, ingredients, method) VALUES (?, ?, ?)', [title, ingredients, method])
	res.redirect('/recipes')
})

router.post('/recipes/:id/edit', async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const { title, ingredients, method } = req.body
	await db.run('UPDATE recipes SET title = ?, ingredients = ?, method = ? WHERE id = ?', [
		title,
		ingredients,
		method,
		recipeId,
	])
	res.redirect(`/recipes/${recipeId}`)
})

module.exports = router
