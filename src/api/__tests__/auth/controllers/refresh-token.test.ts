import { mountGlobalStrapi } from '../../../../utils/strapi';
import refreshTokenController from '../../../auth/controllers/refresh-token';

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

describe('Auth/Controller/Resend-Email-Verification', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = {
            state: {
                user: mockUser,
            },
            request: {
                body: {
                    refreshToken: '',
                },
            },
            badRequest: jest.fn(),
            send: jest.fn(),
        };
        mountGlobalStrapi({
            service() {
                return {
                    getRefreshToken: jest.fn().mockResolvedValue('refreshsecret'),
                    verifyRefreshToken: jest.fn().mockResolvedValue(null),
                };
            },
            plugins: {
                'users-permissions': {
                    services: {
                        jwt: {
                            issue: jest.fn().mockReturnValue('newjwtsecret'),
                        },
                    },
                },
            },
        });
    });
    it('should return a new jwt access token', async () => {
        ctx.request.body.refreshToken = 'refreshsecret';
        await refreshTokenController.handler(ctx);
        expect(ctx.send).toHaveBeenCalledWith(
            {
                message: `New Access Token is issued.`,
                jwt: 'newjwtsecret',
            },
            200,
        );
    });
    it('should error if refresh token is not matched', async () => {
        await refreshTokenController.handler(ctx);
        expect(ctx.badRequest).toHaveBeenCalledWith('Refresh token is not matched.');
    });
});
