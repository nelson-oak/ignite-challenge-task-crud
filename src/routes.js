import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return response.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const {
        title,
        description
      } = request.body

      if (!title || !description) {
        const responseBody = {
          type: 'error',
          message: 'Title and Description cannot be empty'
        }
      
        return response.writeHead(400).end(JSON.stringify(responseBody))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      database.insert('tasks', task)

      return response.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body
      
      if (!title || !description) {
        const responseBody = {
          type: 'error',
          message: 'Title and Description cannot be empty'
        }
      
        return response.writeHead(400).end(JSON.stringify(responseBody))
      }

      // find
      const taskExists = database.getById('tasks', id)

      if (!taskExists) {
        const responseBody = {
          type: 'error',
          message: 'Task does not exists'
        }
      
        return response.writeHead(404).end(JSON.stringify(responseBody))
     
      }

      //update
      database.update('tasks', id, {
        title,
        description,
        updatedAt: new Date(),
      })

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params

      // find
      const taskExists = database.getById('tasks', id)

      if (!taskExists) {
        const responseBody = {
          type: 'error',
          message: 'Task does not exists'
        }
      
        return response.writeHead(404).end(JSON.stringify(responseBody))
      }

      if (taskExists.completedAt) {
        const responseBody = {
          type: 'error',
          message: 'Task has already been completed'
        }
      
        return response.writeHead(400).end(JSON.stringify(responseBody))
      }

      //update
      database.update('tasks', id, {
        completedAt: new Date(),
        updatedAt: new Date(),
      })

      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      // todo
      return response.writeHead(204).end()
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/import'),
    handler: (request, response) => {
      // todo
      return response.writeHead(204).end()
    }
  }
]