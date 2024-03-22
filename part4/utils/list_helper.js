const lo = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)

    return blogs.length === 0
        ? 0
        : total
}

const favoriteBlog = (blogs) => {
    const favBlogIndex = blogs.reduce((maxIndex, blog, currIndex) => {
        return blog.likes > blogs[maxIndex].likes ? currIndex : maxIndex
    }, 0)

    return blogs.length === 0
        ? {}
        : blogs[favBlogIndex]
}

const mostBlogs = (blogs) => {
    const authorCounts = lo.countBy(blogs, 'author')
    const maxAuthor = lo.maxBy(Object.entries(authorCounts), ([_, count]) => count)
    return blogs.length === 0
        ? {}
        : { 'author': maxAuthor[0], 'blogs': maxAuthor[1] }
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((author, blog) => {
        author[blog.author] = (author[blog.author] === undefined) ? blog.likes : author[blog.author] + blog.likes
        return author
    }, {})
    const maxAuthor = lo.maxBy(Object.entries(authorLikes), ([_, likes]) => likes)
    
    return blogs.length === 0
        ? {}
        : { 'author': maxAuthor[0], 'likes': maxAuthor[1] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}