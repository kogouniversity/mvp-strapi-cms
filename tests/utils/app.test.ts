import { strapiSetUp, strapiCleanUp } from './strapi';

beforeAll(async () => {
    await strapiSetUp();
});

afterAll(async () => {
    await strapiCleanUp();
});

it('strapi is defined', () => {
    expect(strapi).toBeDefined();
});
