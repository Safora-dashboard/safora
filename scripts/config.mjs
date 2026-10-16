/** Read only landing-page settings; inherited dashboard PORT values are ignored.
 * @param {NodeJS.ProcessEnv} [environment]
 */
export function getLandingPort(environment = process.env) {
  const port = Number(environment.LANDING_PORT ?? 4175);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('LANDING_PORT must be an integer between 1 and 65535.');
  }
  return port;
}
