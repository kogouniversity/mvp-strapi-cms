/* eslint-disable no-param-reassign */

import registerOverride from './controllers/registerOverride';
import emailVerificationService from './services/emailVerification';
import refreshTokenService from './services/refrehToken';

export default plugin => {
    plugin.services.emailVerification = emailVerificationService;
    plugin.services.refreshToken = refreshTokenService;

    // extension of register controller
    registerOverride(plugin);

    return plugin;
};
