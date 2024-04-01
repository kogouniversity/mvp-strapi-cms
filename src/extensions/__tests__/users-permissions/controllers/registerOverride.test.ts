import registerOverride from '../../../users-permissions/controllers/registerOverride';
import emailVerificationService from '../../../users-permissions/services/emailVerification';
import refreshTokenService from '../../../users-permissions/services/refrehToken';
import { mountGlobalStrapi } from '../../../../utils/strapi';

/**
 * Mock Strapi context
 */
let strapi;
let ctx;

/**
 * Fixtures
 */
const registerMock = jest.fn().mockResolvedValue(() => null);
const mockUnauthenticatedRole = {
    id: 353,
    type: 'Unauthenticated',
};
const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@strapi.com',
};

/**
 * Module mocks
 */
jest.mock('../../../users-permissions/services/emailVerification', () => ({
    sendVerificationEmail: jest.fn(),
}));
jest.mock('../../../users-permissions/services/refrehToken', () => ({
    issueRefeshToken: jest.fn().mockResolvedValue('refreshsecret'),
}));

describe('Auth/Controller/Register', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        strapi = mountGlobalStrapi({
            entityService: {
                findMany: jest.fn().mockImplementation((model: string) => {
                    if (model === 'plugin::users-permissions.role')
                        return new Promise(resolve => {
                            resolve([mockUnauthenticatedRole]);
                        });
                    if (model === 'api::school.school')
                        return new Promise(resolve => {
                            resolve([{ schoolEmailDomain: 'strapi.com' }]);
                        });
                    return null;
                }),
                update: jest.fn().mockImplementation((model: string) => {
                    if (model === 'plugin::users-permissions.user')
                        return new Promise(resolve => {
                            resolve(mockUser);
                        });
                    return null;
                }),
            },
        });

        ctx = {
            request: {
                body: {
                    username: mockUser.username,
                    email: mockUser.email,
                    password: '#Testpassword1',
                },
            },
            response: {
                body: { jwt: 'jwtsecret', user: mockUser },
            },
            badRequest: jest.fn(),
            send: jest.fn(),
        };
    });

    describe('valid request', () => {
        it('should return user, jwt, and refresh token', async () => {
            const registerFn = registerOverride(registerMock);
            await registerFn(ctx);
            expect(registerMock).toHaveBeenCalled();
            // expect user assigned the unauthenticated role
            expect(strapi.entityService.update).toHaveBeenCalledTimes(1);
            expect(strapi.entityService.update).toHaveBeenCalledWith('plugin::users-permissions.user', mockUser.id, {
                data: {
                    confirmed: false,
                    role: mockUnauthenticatedRole.id,
                },
            });
            // expect a verification email is sent
            expect(emailVerificationService.sendVerificationEmail).toHaveBeenCalledWith(mockUser.id, mockUser.email);
            // expect a refresh token is issued
            expect(refreshTokenService.issueRefeshToken).toHaveBeenCalledWith(mockUser.id);
            expect(ctx.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: mockUser,
                    refreshToken: 'refreshsecret',
                    emailVerification: {
                        message: `verification code is sent to ${mockUser.email}`,
                    },
                }),
                200,
            );
        });
    });

    describe('invalid username', () => {
        it('should error if username is not valid', async () => {
            const registerFn = registerOverride(registerMock);
            ctx.request.body.username = 'aaa';
            await registerFn(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Username must be between 6 to 15 characters.');
            ctx.request.body.username = 'test username';
            await registerFn(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Username must not contain a whitespace.');
            ctx.request.body.username = 'test!!username';
            await registerFn(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Username must not contain a special character.');
            expect(registerMock).not.toHaveBeenCalled();
        });
    });

    describe('invalid password', () => {
        it('should error if password is not valid', async () => {
            const registerFn = registerOverride(registerMock);
            ctx.request.body.password = 'aaa';
            await registerFn(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Password must be at least 8 characters.');
            ctx.request.body.password = '#Sample Pwrd1';
            await registerFn(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Password must not include a whitespace.');
            ctx.request.body.password = 'SamplePassword';
            await registerFn(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith(
                'Password must contain one uppercase letter, one number, and one special character.',
            );
            expect(registerMock).not.toHaveBeenCalled();
        });
    });

    describe('invalid email', () => {
        it('should error if email is not a valid format', async () => {
            ctx.request.body.email = 'invalidEmailFormat';
            const registerFn = registerOverride(registerMock);
            await registerFn(ctx);
            expect(registerMock).not.toHaveBeenCalled();
            expect(ctx.badRequest).toHaveBeenCalledWith('Invalid email format.');
        });
        it('should error if email is not a registered school email', async () => {
            ctx.request.body.email = 'random@gmail.com';
            const registerFn = registerOverride(registerMock);
            await registerFn(ctx);
            expect(registerMock).not.toHaveBeenCalled();
            expect(ctx.badRequest).toHaveBeenCalledWith('Given email is not a registered school domain.');
        });
    });
});

/*
{
    "data": null,
    "error": {
        "status": 400,
        "name": "BadRequestError",
        "message": "Bad email format.",
        "details": {}
    }
}

{
    "data": null,
    "error": {
        "status": 400,
        "name": "BadRequestError",
        "message": "Not a registered school domain",
        "details": {}
    }
}

{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTcxMTM0NTM3OCwiZXhwIjoxNzEzOTM3Mzc4fQ.lNv66HnpaWRHX6RDZ_grzlEiLDQfIPii1lVK1ySwvmI",
    "user": {
        "id": 13,
        "username": "test",
        "email": "test@sfu.ca",
        "provider": "local",
        "confirmed": false,
        "blocked": false,
        "createdAt": "2024-03-25T05:42:58.732Z",
        "updatedAt": "2024-03-25T05:42:58.732Z"
    },
    "emailVerification": {
        "message": "verification code is sent to test@sfu.ca",
    },
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTcxMTM0NTM3OSwiZXhwIjoxNzEzOTM3Mzc5fQ._ujESyJSV9lKE-QG4qRdXB8_tG1R10UFIxsacSeIkeo"
}

*/
