// ../utils/list_helper.js
const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const maxLikes = blogs.reduce((maxLikes, blog) => {
    return blog.likes > maxLikes.likes ? blog : maxLikes
  }, blogs[0])

  console.log(maxLikes.title, maxLikes.author, maxLikes.likes)

  return {
    title: maxLikes.title,
    author: maxLikes.author,
    likes: maxLikes.likes
  }
}

module.exports = {
  totalLikes,
  favoriteBlog
}