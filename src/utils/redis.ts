/**
 * Redis Commands
 * https://redis.io/commands/
 */
export default function redis() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (strapi as any).redis.connections.default.client;
}
