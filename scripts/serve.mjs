import { fileURLToPath } from 'node:url';
import { createStaticServer } from './static-server.mjs';

const port = Number(process.env.PORT ?? 4175);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const server = createStaticServer(fileURLToPath(new URL('../dist/', import.meta.url)));
server.on('error', (error) => {
  console.error(`Could not start the preview server: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));

for (const signal of /** @type {const} */ (['SIGINT', 'SIGTERM'])) {
  process.once(signal, () => server.close());
}
