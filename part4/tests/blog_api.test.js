const { test, after, beforeEach } = require('node:test')
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

test.only('blog(s) are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test.only("there is 1 blog", async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 1)
})

test.only("verify unique identifier is id", async() => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
    assert.strictEqual(response.body[0].hasOwnProperty('_id'), false)
})

test.only("a blog can be added", async () => {
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

test.only("likes become 0 if not provided", async () => {
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

test.only("title missing", async () => {
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

test.only("url missing", async () => {
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

test.only("title and url missing", async () => {
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

after(async () => {
    await mongoose.connection.close()
})