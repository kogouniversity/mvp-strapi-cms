import postController from '../../../post/controllers/post';
import { mountGlobalStrapi } from '../../../../utils/strapi';
import { Strapi } from '@strapi/strapi';

/**
 * Mock Strapi context
 */
let ctx;

/**
 * Fixtures
 */
const mockUser = {
    id: 3,
    username: 'testUser',
    email: 'test1@strapi.com',
    confirmed: false,
};

const mockBody = {
    data: {
        title: "Test post",
        content: "Test content",
        group: { id: 1 },
    },
}

describe('Post/Controller/Post', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = {
            state: {
                user: mockUser,
            },
            badRequest: jest.fn(),
            send: jest.fn(),
        };
    });
    it('should create a new post', async () => {
        
    });
    it('should return error if group is not provided', async () => {

    });
    it('should return error if user is not a member of the provided group', async () => {

    });
});