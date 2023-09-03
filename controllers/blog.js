const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
}
)

/*
write blogsRouter.post() to save a new blog post to the database.
if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.
*/
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: (body.likes === undefined) ? 0 : body.likes
  }
  )

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
}
)

module.exports = blogsRouter