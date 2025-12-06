const assert = require('assert');
const { test } = require('node:test');
const request = require('supertest');

// Import the server app but don't start it automatically
const app = require('../server.js');

// Test the server endpoints
test('GET / should return 200 status', async () => {
  const response = await request(app).get('/');
  assert.strictEqual(response.status, 200);
});

test('GET /api/tasks should return 200 status', async () => {
  const response = await request(app).get('/api/tasks');
  assert.strictEqual(response.status, 200);
});

test('POST /api/tasks should create a new task', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title: 'Test Task' })
    .set('Content-Type', 'application/json');

  assert.strictEqual(response.status, 201);
  assert.ok(response.body.id);
  assert.strictEqual(response.body.title, 'Test Task');
});

// Additional tests for other endpoints can be added here