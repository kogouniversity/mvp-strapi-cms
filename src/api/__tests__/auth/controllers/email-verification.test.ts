import { mountGlobalStrapi } from '../../../../utils/strapi';
import emailVerifController from '../../../auth/controllers/email-verification';

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
    confirm: true,
};
const mockAuthenticatedRole = {
    id: 1,
};

describe('Auth/Controller/Email-Verification', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = {
            state: {
                user: {
                    id: mockUser.id,
                },
            },
            request: {
                body: {
                    code: '',
                },
            },
            badRequest: jest.fn(),
            send: jest.fn(),
        };
    });
    describe('valid verification code', () => {
        beforeEach(() => {
            mountGlobalStrapi({
                service: jest.fn().mockImplementation((serviceName: string) => {
                    if (serviceName === 'plugin::users-permissions.emailVerification')
                        return { getEmailVerificationCode: jest.fn().mockResolvedValue('a1b2c3') };
                    return undefined;
                }),
                entityService: {
                    findMany: jest.fn().mockImplementation((model: string) => {
                        if (model === 'plugin::users-permissions.role')
                            return new Promise(resolve => {
                                resolve([mockAuthenticatedRole]);
                            });
                        return undefined;
                    }),
                    update: jest.fn().mockImplementation((model: string) => {
                        if (model === 'plugin::users-permissions.user')
                            return new Promise(resolve => {
                                resolve(mockUser);
                            });
                        return undefined;
                    }),
                },
            });
        });
        it('should return user data and success message', async () => {
            ctx.request.body.code = 'a1b2c3';
            await emailVerifController.confirmCode(ctx);
            expect(strapi.entityService.update).toHaveBeenCalledWith('plugin::users-permissions.user', mockUser.id, {
                data: {
                    confirmed: true,
                    role: mockAuthenticatedRole.id,
                },
            });
            expect(ctx.send).toHaveBeenCalledWith(
                {
                    message: 'User is authenticated',
                    user: mockUser,
                },
                200,
            );
        });
    });
    describe('invalid verification code', () => {
        it('should return fail if the code is not found', async () => {
            mountGlobalStrapi({
                service() {
                    return { getEmailVerificationCode: jest.fn().mockResolvedValue(null) };
                },
            });
            await emailVerifController.confirmCode(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('The verification code is not found, or is expired.');
        });
        it('should return fail if the given code is not matched', async () => {
            mountGlobalStrapi({
                service(serviceName: string) {
                    if (serviceName === 'plugin::users-permissions.emailVerification')
                        return { getEmailVerificationCode: jest.fn().mockResolvedValue('a1b2c3') };
                    return undefined;
                },
            });
            ctx.request.body.code = 'aaa111';
            await emailVerifController.confirmCode(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('The verification code is not matched.');
        });
    });
});

/*
{
    "message": "User is authenticated",
    "user": {
        "id": 17,
        "username": "test",
        "email": "test@sfu.ca",
        "provider": "local",
        "password": "$2a$10$skuNY6HqxJtlC5CEB4oS2OZhqzcFiVBhmMB6zH5XbwIyIESArCicm",
        "resetPasswordToken": null,
        "confirmationToken": null,
        "confirmed": true,
        "blocked": false,
        "createdAt": "2024-03-25T07:36:34.582Z",
        "updatedAt": "2024-03-25T07:37:01.330Z"
    }
}
*/
