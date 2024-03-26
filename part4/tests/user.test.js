const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('secret', 10)
      const user = new User({ username: 'root', passwordHash })
      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.getUserDb()

        const newUser = {
            username: 'test',
            name: 'Test Guy',
            password: 'testpassword'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.getUserDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
  })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.getUserDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'Pa55word'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.getUserDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode if missing username', async () => {
        const usersAtStart = await helper.getUserDb()

        const newUser = {
            name: 'Superuser',
            password: 'Pa55word'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.getUserDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with username with less than 3 characters', async () => {
        const usersAtStart = await helper.getUserDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'Pa55word'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.getUserDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode if missing password', async () => {
        const usersAtStart = await helper.getUserDb()

        const newUser = {
            username: 'superuser',
            name: 'Superuser',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.getUserDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with password with less than 3 characters', async () => {
        const usersAtStart = await helper.getUserDb()

        const newUser = {
            username: 'superuser',
            name: 'Superuser',
            password: 'Pa'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.getUserDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(() => {
    mongoose.connection.close()
})