import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { extname, resolve, sep } from 'node:path'

// A dependency-free preview stays available while development tools are updated.
const root = fileURLToPath(new URL('../dist/', import.meta.url))
const portIndex = process.argv.indexOf('--port')
const port = portIndex >= 0 ? Number(process.argv[portIndex + 1]) : 4173
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port')
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.json': 'application/json',
  '.map': 'application/json',
}
const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end()
      return
    }
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const target = resolve(root, '.' + (path === '/' ? '/index.html' : path))
    if (!target.startsWith(resolve(root) + sep)) {
      response.writeHead(403).end()
      return
    }
    const body = await readFile(target)
    response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found')
  }
})
server.listen(port, '127.0.0.1', () => console.log(`Fathom preview: http://127.0.0.1:${port}`))
process.on('SIGINT', () => server.close())
process.on('SIGTERM', () => server.close())
