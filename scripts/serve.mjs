import { fileURLToPath } from 'node:url';
import { createStaticServer } from './static-server.mjs';
import { getLandingPort } from './config.mjs';

const port = getLandingPort();

const server = createStaticServer(fileURLToPath(new URL('../dist/', import.meta.url)));
server.on('error', (error) => {
  console.error(`Could not start the preview server: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));

for (const signal of /** @type {const} */ (['SIGINT', 'SIGTERM'])) {
  process.once(signal, () => server.close());
}
