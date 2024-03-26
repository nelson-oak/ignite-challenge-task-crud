import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (request, response) => {
  const { method, url } = request

  await json(request, response)

  const routeExists = routes.find(route => route.method === method && route.path.test(url))

  if (routeExists) {
    const routeParams = request.url.match(routeExists.path)

    const { query, ...params } = routeParams.groups

    request.params = params
    request.query = query ? extractQueryParams(query) : {}

    return routeExists.handler(request, response)
  }

  const responseBody = {
    type: 'error',
    message: 'Endpoint does not exists'
  }

  return response.writeHead(404).end(JSON.stringify(responseBody))
})

server.listen(3333, () => console.log('Server is running on port 3333...'))