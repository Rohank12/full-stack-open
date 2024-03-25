const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject = new Blog(helper.initialBlog[0])

    await blogObject.save()
})

describe('when getting the blog(s) from the database', () => {
    test('the blog(s) are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there is only 1 blog', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 1)
    })

    test('verifying the unique identifier is id', async() => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
        assert.strictEqual(response.body[0].hasOwnProperty('_id'), false)
    })
})

describe('when adding a blog to the database', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlog.length + 1)

        const titles = response.body.map(blogs => blogs.title)
        assert(titles.includes('Canonical string reduction'))
    })

    test('if likes is not provided, the likes are 0', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlog.length + 1)

        const titles = response.body.map(blogs => blogs.title)
        assert(titles.includes('Canonical string reduction'))

        const likes = response.body.map(blogs => blogs.likes)
        assert(likes.includes(0))
    })

    test('cannot add when title missing', async () => {
        const newBlog = {
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await api.get('/api/blogs')
        assert.strictEqual(blogs.body.length, helper.initialBlog.length)
    })

    test('cannot add when url missing', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await api.get('/api/blogs')
        assert.strictEqual(blogs.body.length, helper.initialBlog.length)
    })

    test('cannot add when title and url missing', async () => {
        const newBlog = {
            author: "Edsger W. Dijkstra"
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await api.get('/api/blogs')
        assert.strictEqual(blogs.body.length, helper.initialBlog.length)
    })
})

describe('when deleting a blog from the database', () => {

    test('a blog can be deleted', async () => {
        const blogs = await api.get('/api/blogs')
        const blogToDelete = blogs.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAfterDeletion = await api.get('/api/blogs')

        assert.strictEqual(blogsAfterDeletion.body.length, helper.initialBlog.length - 1)
    })
})

describe('when updating a blog in the database', () => {
    test('a blog can update the likes', async () => {
        const blogs = await api.get('/api/blogs')
        const blogToUpdate = blogs.body[0]

        const updatedBlog = {
            ...blogToUpdate,
            likes: 10
        }
        
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(204)

        const blogsAfterUpdate = await api.get('/api/blogs')

        assert.strictEqual(blogsAfterUpdate.body.length, helper.initialBlog.length)
        assert.strictEqual(blogsAfterUpdate.body[0].likes, 10)

    })

    test('a blog can update the title', async () => {
        const blogs = await api.get('/api/blogs')
        const blogToUpdate = blogs.body[0]

        const updatedBlog = {
            ...blogToUpdate,
            title: 'Test Title'
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(204)

        const blogsAfterUpdate = await api.get('/api/blogs')
        assert.strictEqual(blogsAfterUpdate.body.length, helper.initialBlog.length)
        assert.strictEqual(blogsAfterUpdate.body[0].title, 'Test Title')
    })
})

after(async () => {
    await mongoose.connection.close()
})