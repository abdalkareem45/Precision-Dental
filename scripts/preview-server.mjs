import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('../_site/', import.meta.url));
export const previewPrefix = '/precision-dental/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

export async function startPreviewServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (!url.pathname.startsWith(previewPrefix)) {
        response.writeHead(404).end();
        return;
      }
      let relative = decodeURIComponent(url.pathname.slice(previewPrefix.length));
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      const filename = path.resolve(site, relative);
      if (!filename.startsWith(path.resolve(site) + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      const body = await readFile(filename);
      response.writeHead(200, { 'Content-Type': types[path.extname(filename)] ?? 'application/octet-stream' }).end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => {
      server.closeAllConnections();
      server.close(resolve);
    }),
  };
}

export const browserOptions = {
  ...(process.platform === 'win32' ? { channel: 'chrome' } : {}),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
};
