/* eslint-disable no-param-reassign */

import registerOverride from './controllers/registerOverride';
import emailVerificationService from './services/emailVerification';
import refreshTokenService from './services/refrehToken';
import resetPasswordTokenService from './services/resetPasswordToken';

export default plugin => {
    console.log('Custom users-permissions plugin loaded');
    plugin.services.emailVerification = emailVerificationService;
    plugin.services.refreshToken = refreshTokenService;
    plugin.services.resetPasswordToken = resetPasswordTokenService;
    console.log('Registered controllers:', plugin.controllers);

    console.log('Registered routes:', plugin.routes['content-api'].routes);

    // extension of register controller
    const { register } = plugin.controllers.auth;
    plugin.controllers.auth.register = registerOverride(register);

    return plugin;
};
