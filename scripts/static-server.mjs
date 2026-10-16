import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

/** @type {Record<string, string>} */
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
};

/** Dependency-free preview server, restricted to the selected static root.
 * @param {string} directory
 */
export function createStaticServer(directory) {
  // Canonicalize both sides: Windows may report the temp directory using its 8.3 alias.
  const rootDirectory = realpath(path.resolve(directory));

  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }

    try {
      const root = await rootDirectory;
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const filename = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      const resolved = await realpath(filename);
      const relative = path.relative(root, resolved);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }

      const content = await readFile(resolved);
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(resolved)] ?? 'application/octet-stream',
        'Content-Length': content.byteLength,
        'Cache-Control': 'no-cache',
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
}
