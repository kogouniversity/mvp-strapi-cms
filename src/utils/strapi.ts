export function mountGlobalStrapi(strapi: object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.strapi = strapi as any;
    return strapi;
}
