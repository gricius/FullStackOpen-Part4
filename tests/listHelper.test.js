// ../tests/listHelper.test.js
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs, equals the sum of their likes', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/blog1',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 15,
        __v: 0
      }
    ]

    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(25)
  })

  test('when list is empty, equals 0', () => {
    const emptyList = []
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {
  test('when list has only one blog, that blog is the favorite', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has multiple blogs, returns the blog with most likes', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/blog1',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 15,
        __v: 0
      }
    ]

    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual({
      title: 'Blog 2',
      author: 'Author 2',
      likes: 15
    })
  })

  test('when list is empty, returns null', () => {
    const emptyList = []
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toBeNull()
  })
})

describe('most blogs', () => {
  test('when list has only one blog, that author is the top blogger', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has multiple blogs, returns the top blogger with most blogs', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/blog1',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 15,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f0',
        title: 'Blog 3',
        author: 'Author 1',
        url: 'http://example.com/blog3',
        likes: 8,
        __v: 0
      }
    ]

    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Author 1',
      blogs: 2
    })
  })

  test('when list is empty, returns null', () => {
    const emptyList = []
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toBeNull()
  })
})

describe('most likes', () => {
  test('when list has only one blog, that author has the most likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has multiple blogs, returns the top blogger with most likes', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/blog1',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 15,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f0',
        title: 'Blog 3',
        author: 'Author 1',
        url: 'http://example.com/blog3',
        likes: 8,
        __v: 0
      }
    ]

    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Author 1',
      likes: 18
    })
  })

  test('when list is empty, returns null', () => {
    const emptyList = []
    const result = listHelper.mostLikes(emptyList)
    expect(result).toBeNull()
  })
})