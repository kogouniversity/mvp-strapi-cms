import { strapiSetUp, strapiCleanUp } from './helpers/strapi';

beforeAll(async () => {
    await strapiSetUp();
});

afterAll(async () => {
    await strapiCleanUp();
});

it('strapi is defined', () => {
    expect(strapi).toBeDefined();
});
