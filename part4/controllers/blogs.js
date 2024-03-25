const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
  
    const savedBlog = await blog.save()
    return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    } catch (error) {
        next(error)
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