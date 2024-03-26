import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      return response.end(JSON.stringify([]))
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
      // todo
      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      // todo
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