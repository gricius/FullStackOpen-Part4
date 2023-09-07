// ;;/tests/blog_api.test.js
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

let token

beforeAll(async () => {
  const userCredentials = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api
    .post('/api/login')
    .send(userCredentials)
    .expect(200)

  token = response.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
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

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
}
)

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization',`Bearer ${token}`)
    .expect(201)
    .expect('Content-Type',/application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[3].likes).toBe(0)
}
)

test('if the title or url properties are missing from the request data, the status code 400 Bad Request', async () => {
  const newBlog = {
    author: 'Test Author',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization',`Bearer ${token}`)
    .expect(400)
}
)

test('updating the information of an individual blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[0].likes).toBe(100)
}
)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret',10)
    const user = new User({ username: 'root',passwordHash })

    await user.save()
  }
  )

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type',/application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'testpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type',/application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if invalid username or password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'te',
      name: 'Test User',
      password: 'te'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type',/application\/json/)
    expect(result.body.error).toContain('username or password too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('adding a blog without a valid token returns 401 Unauthorized', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Unauthorized Author',
      url: 'http://unauthorizedurl.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type',/application\/json/)
  })
})

describe('creation and deletion of a blog', () => {
  beforeAll(async () => {
    const userCredentials = {
      username: 'root',
      password: 'sekret'
    }

    const response = await api
      .post('/api/login')
      .send(userCredentials)


    token = response.body.token
  })

  test('creating when authorised', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization',`Bearer ${token}`)
      .expect(201)
      .expect('Content-Type',/application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain('Test Blog')
  }
  )

  test('deleting when authorised', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization',`Bearer ${token}`)
      .expect(201)
      .expect('Content-Type',/application\/json/)
    // Get the id of the new blog
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
    // Delete the blog
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization',`Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

test('an authorized user cannot delete blogs they haven\'t created', async () => {
  // Create a new user
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type',/application\/json/)
  // Login as the new user
  const userCredentials = {
    username: 'testuser',
    password: 'testpassword'
  }

  const response = await api
    .post('/api/login')
    .send(userCredentials)
    .set('Authorization',`Bearer ${token}`)
    .expect(200)

  const newToken = response.body.token
  // Create a new blog
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization',`Bearer ${newToken}`)
    .expect(201)
    .expect('Content-Type',/application\/json/)
  // Get the id of the new blog
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
  // Try to delete the blog as the original user
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization',`Bearer ${token}`)
    .expect(403)
    .expect('Content-Type',/application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).toContain(blogToDelete.title)
})

afterAll(async () => {
  await mongoose.connection.close()
}
)