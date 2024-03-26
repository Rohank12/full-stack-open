const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        user: "660307af54d0d9aaac9c80cd",
        __v: 0
      }
]

const getUserDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const getBlogDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlog,
    getUserDb,
    getBlogDb
}