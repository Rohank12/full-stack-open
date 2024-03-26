const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    return response.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {
    const user = request.user

    const blog = new Blog ({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
    //make it so that the user who created the blog is the only one who can delete it
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (user._id.toString() === blog.user.toString()) {
        try {
            await Blog.findByIdAndDelete(request.params.id)
            return response.status(204).end()
        } catch (error) {
            next(error)
        }
    } else {
        return response.status(401).json({ error: 'user not authorized to delete this blog' })
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
        return response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter