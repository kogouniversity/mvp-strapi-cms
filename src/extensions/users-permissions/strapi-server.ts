/* eslint-disable no-param-reassign */

import registerOverride from './controllers/registerOverride';
import emailVerificationService from './services/emailVerification';
import refreshTokenService from './services/refrehToken';
import resetPasswordTokenService from './services/resetPasswordToken';
import userProfileController from './controllers/userProfile';

export default plugin => {
    plugin.services.emailVerification = emailVerificationService;
    plugin.services.refreshToken = refreshTokenService;
    plugin.services.resetPasswordToken = resetPasswordTokenService;
    plugin.controllers.userProfile = userProfileController;

    // extension of register controller
    const { register } = plugin.controllers.auth;
    plugin.controllers.auth.register = registerOverride(register);

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/users/:id/profilePhoto',
        handler: 'userProfile.updateProfilePhoto',
        config: {
            prefix: '',
            middlewares: [],
            policies: [],
        },
    });

    return plugin;
};
