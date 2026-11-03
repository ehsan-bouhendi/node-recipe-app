const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const { initializeTestDb } = require('./test-database');

// Mock the database module to use test database
jest.mock('../src/database', () => ({
  getDbConnection: () => require('./test-database').getTestDbConnection()
}));

// Simple app setup for testing
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Simple mock for res.render
  app.use((req, res, next) => {
    res.render = (view, locals) => res.json({ view, locals });
    next();
  });
  
  app.use('/', routes);
  return app;
}

describe('Routes', () => {
  let app;
  let db;

  beforeEach(async () => {
    app = createTestApp();
    db = await initializeTestDb();
  });

  afterEach(async () => {
    if (db) {
      await db.close();
    }
  });

  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.view).toBe('home');
  });

  test('POST /recipes should create a new recipe', async () => {
    const newRecipe = {
      title: 'New Test Recipe',
      ingredients: 'New test ingredients',
      method: 'New test method'
    };

    const response = await request(app)
      .post('/recipes')
      .send(newRecipe);

    expect(response.status).toBe(302); // Redirect status
    expect(response.headers.location).toBe('/recipes');

    // Verify recipe was created
    const recipe = await db.get('SELECT * FROM recipes WHERE title = ?', [newRecipe.title]);
    expect(recipe).toBeDefined();
    expect(recipe.title).toBe(newRecipe.title);
  });

  test('POST /recipes should reject an empty or whitespace-only title', async () => {
    for (const title of ['', '   ']) {
      const response = await request(app)
        .post('/recipes')
        .send({ title, ingredients: 'Ingredients', method: 'Method' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Recipe title is required.');
    }

    expect(await db.get('SELECT * FROM recipes')).toBeUndefined();
  });

  test('DELETE /recipes/:id should delete the recipe and return 404 when requested', async () => {
    const { lastID } = await db.run(
      'INSERT INTO recipes (title, ingredients, method) VALUES (?, ?, ?)',
      ['Recipe to delete', 'Ingredients', 'Method']
    );

    const deleteResponse = await request(app).delete(`/recipes/${lastID}`);
    expect(deleteResponse.status).toBe(204);
    expect(await db.get('SELECT * FROM recipes WHERE id = ?', [lastID])).toBeUndefined();

    const detailResponse = await request(app).get(`/recipes/${lastID}`);
    expect(detailResponse.status).toBe(404);
  });
});