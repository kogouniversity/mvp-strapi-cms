import { mountGlobalStrapi } from '../../../../utils/strapi';
import resetPasswordController from '../../../auth/controllers/reset-password';

let ctx;
let strapi;

const mockUser = {
    id: 3,
    username: 'testUser',
    email: 'test1@strapi.com',
    password: '',
    confirmed: false,
};

describe('Auth/Controller/Reset-Password', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = {
            request: {
                body: {
                    identifier: '',
                    code: '',
                    resetPasswordToken: '',
                    newPassword: '',
                },
            },
            badRequest: jest.fn(),
            send: jest.fn(),
        };
        strapi = mountGlobalStrapi({
            service() {
                return {
                    createEmailVerificationCodeForUser: jest.fn().mockResolvedValue({ code: '', expires: 0 }),
                    sendVerificationEmail: jest.fn().mockResolvedValue(null),
                    getEmailVerificationCode: jest.fn().mockResolvedValue('123qwe'),
                    issueResetPasswordToken: jest.fn().mockResolvedValue('resetsecret'),
                    getRefreshToken: jest.fn().mockResolvedValue('refreshsecret'),
                    verifyRefreshToken: jest.fn().mockResolvedValue(mockUser),
                };
            },
            entityService: {
                findMany: jest.fn().mockImplementation((model: string) => {
                    if (model === 'plugin::users-permissions.user')
                        return new Promise(resolve => {
                            resolve([mockUser]);
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
    it('should send a verification email', async () => {
        ctx.request.body.identifier = mockUser.email;
        await resetPasswordController.sendCodeToResetPassword(ctx);
        expect(strapi.entityService.findMany).toHaveBeenCalledWith('plugin::users-permissions.user', {
            filters: { email: mockUser.email },
        });
        expect(ctx.send).toHaveBeenCalledWith(
            {
                message: `New verification code is sent to ${mockUser.email}.`,
                expires: 0,
                identifier: mockUser.email,
            },
            200,
        );
    });
    it('should verify the code and issue reset password token if the code is correct', async () => {
        ctx.request.body.identifier = mockUser.email;
        ctx.request.body.code = '123qwe';
        await resetPasswordController.confirmCodeForNewPassword(ctx);
        expect(strapi.entityService.update).toHaveBeenCalledWith('plugin::users-permissions.user', mockUser.id, {
            data: {
                resetPasswordToken: 'resetsecret',
            },
        });
        expect(ctx.send).toHaveBeenCalledWith(
            {
                message: 'Code is correct',
                resetPasswordToken: 'resetsecret',
            },
            200,
        );
    });
    describe('should return error', () => {
        beforeEach(() => {
            strapi = mountGlobalStrapi({
                service() {
                    return {
                        getEmailVerificationCode: jest.fn().mockResolvedValue('456qwe'),
                        issueResetPasswordToken: jest.fn().mockResolvedValue('resetsecret'),
                        getRefreshToken: jest.fn().mockResolvedValue('refreshsecret'),
                        verifyRefreshToken: jest.fn().mockResolvedValue({ err: '' }),
                    };
                },
                entityService: {
                    findMany: jest.fn().mockImplementation((model: string) => {
                        if (model === 'plugin::users-permissions.user')
                            return new Promise(resolve => {
                                resolve([mockUser]);
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
        it('if the code does not match', async () => {
            ctx.request.body.identifier = mockUser.email;
            ctx.request.body.code = '123qwe';
            await resetPasswordController.confirmCodeForNewPassword(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Code is incorrect.');
        });
    });

    describe('should change the password', () => {
        beforeEach(() => {
            strapi = mountGlobalStrapi({
                service() {
                    return {
                        verifyResetPasswordToken: jest.fn().mockResolvedValue({ success: true, decode: { id: 3 } }),
                    };
                },
                entityService: {
                    update: jest.fn().mockImplementation((model: string) => {
                        if (model === 'plugin::users-permissions.user')
                            return new Promise(resolve => {
                                resolve({
                                    id: 3,
                                    username: 'testUser',
                                    email: 'test1@strapi.com',
                                    password: '@@Qwe123',
                                    confirmed: false,
                                });
                            });
                        return undefined;
                    }),
                },
            });
        });
        it('should let the user change the password if the resetPasswordToken is valid', async () => {
            ctx.request.body.newPassword = '@@Qwe123';
            ctx.request.body.resetPasswordToken = 'resetsecret';
            await resetPasswordController.setNewPassword(ctx);

            expect(strapi.entityService.update).toHaveBeenCalledWith('plugin::users-permissions.user', mockUser.id, {
                data: {
                    password: ctx.request.body.newPassword,
                },
            });
            expect(ctx.send).toHaveBeenCalledWith({
                message: 'Password has changed.',
                user: {
                    confirmed: mockUser.confirmed,
                    email: mockUser.email,
                    id: mockUser.id,
                    password: ctx.request.body.newPassword,
                    username: mockUser.username,
                },
            });
        });
        it('should return error if the resetPasswordToken is invalid', async () => {
            mountGlobalStrapi({
                service() {
                    return {
                        verifyResetPasswordToken: jest
                            .fn()
                            .mockResolvedValue({ success: false, error: { message: '' } }),
                    };
                },
            });
            ctx.request.body.newPassword = '@@Qwe123';
            ctx.request.body.resetPasswordToken = '';
            await resetPasswordController.setNewPassword(ctx);
            expect(ctx.badRequest).toHaveBeenCalledWith('Invalid ResetPasswordToken.');
        });
    });
});
