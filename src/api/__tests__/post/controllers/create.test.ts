import postController from '../../../post/controllers/post';

jest.mock('@strapi/strapi', () => ({
        factories: {
            createCoreController: jest.fn((type, extend) =>
                extend({
                    strapi: {
                        entityService: {
                            findMany: jest.fn(),
                        },
                        query: jest.fn(() => ({
                            create: jest.fn(),
                        })),
                    },
                }),
            ),
        },
    }));

let ctx;
let mockStrapi;

// Fixtures
const mockUser = {
    id: 3,
    username: 'testUser',
    email: 'test1@strapi.com',
};

const mockBodyWithGroup = {
    data: {
        title: 'Test post',
        content: 'Test content',
        group: { id: 1 },
    },
};

const userGroups = [
    {
        id: 1,
        name: 'Group One',
        users: [{ id: 3 }],
    },
];

const newPost = {
    id: 1,
    title: 'Test post',
    content: 'Test content',
    group: { id: 1 },
};

describe('Post Controller Create Method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockStrapi = {
            entityService: {
                findMany: jest.fn().mockResolvedValue(userGroups),
            },
            query: jest.fn().mockReturnValue({
                create: jest.fn().mockResolvedValue(newPost),
            }),
        };
        ctx = {
            state: {
                user: mockUser,
            },
            badRequest: jest.fn(),
            request: {
                body: mockBodyWithGroup,
            },
            send: jest.fn(),
        };
        mockStrapi.entityService.findMany.mockResolvedValue(userGroups);
    });
    it('should create a new post', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (postController as any).create(ctx);
        ctx.send(newPost);
        expect(ctx.send).toHaveBeenCalledWith(newPost);
    });
    it('should return error if group is not provided', async () => {
        ctx.request.body.data.group = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (postController as any).create(ctx);
        expect(ctx.badRequest).toHaveBeenCalledWith('Group is required.', {
            errors: {
                group: 'Group is required.',
            },
        });
    });
    it('should return error if user is not a member of the provided group', async () => {
        mockStrapi.entityService.findMany.mockResolvedValue([]);
        ctx.request.body.data.group = { id: 1 };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (postController as any).create(ctx);
        expect(ctx.badRequest).toHaveBeenCalledWith('User is not a member of the provided group.', {
            errors: {
                group: 'User is not a member of the provided group.',
            },
        });
    });
});
