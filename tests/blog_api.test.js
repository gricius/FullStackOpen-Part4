const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}
)

test ('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type',/application\/json/)
}
)

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(3)
}
)

/*
Write a test that verifies that the unique identifier property of the blog posts is named id
*/

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
}
)

afterAll(async () => {
  await mongoose.connection.close()
})