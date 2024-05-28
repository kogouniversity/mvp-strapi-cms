/* eslint-disable no-param-reassign */

import registerOverride from './controllers/registerOverride';
import emailVerificationService from './services/emailVerification';
import refreshTokenService from './services/refrehToken';
import resetPasswordTokenService from './services/resetPasswordToken';

export default plugin => {
    plugin.services.emailVerification = emailVerificationService;
    plugin.services.refreshToken = refreshTokenService;
    plugin.services.resetPasswordToken = resetPasswordTokenService;
    // extension of register controller
    const { register } = plugin.controllers.auth;
    plugin.controllers.auth.register = registerOverride(register);

    return plugin;
};
