// ../utils/list_helper.js
const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])
  // console.log('Top Author: ', topAuthor, 'Authors count: ', authorCounts[topAuthor])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}


const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const maxLikes = blogs.reduce((maxLikes, blog) => {
    return blog.likes > maxLikes.likes ? blog : maxLikes
  }, blogs[0])

  // console.log('Favorite Blog: ', maxLikes.title, 'Aothor: ', maxLikes.author, 'Likes', maxLikes.likes)

  return {
    title: maxLikes.title,
    author: maxLikes.author,
    likes: maxLikes.likes
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = _.groupBy(blogs, 'author')
  const authorTotalLikes = _.mapValues(authorLikes, (blogs) => _.sumBy(blogs, 'likes'))
  const topAuthor = _.maxBy(_.keys(authorTotalLikes), (author) => authorTotalLikes[author])
  // console.log('Top Author: ', topAuthor, 'Likes: ', authorTotalLikes[topAuthor])

  return {
    author: topAuthor,
    likes: authorTotalLikes[topAuthor]
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}