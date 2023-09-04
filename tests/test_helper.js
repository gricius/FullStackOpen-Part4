const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'http://example.com/blog1',
    likes: 10
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'http://example.com/blog2',
    likes: 15
  },
  {
    title: 'Blog 3',
    author: 'Author 1',
    url: 'http://example.com/blog3',
    likes: 8
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Author 1', url: 'http://example.com/blog3', likes: 8 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}