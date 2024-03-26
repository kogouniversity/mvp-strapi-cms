/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import healthCheckApiDocOverrides from './api/healthcheck/documentation/1.0.0/overrides.json';
import authApiDocOverrides from './api/auth/documentation/1.0.0/overrides.json';
import userPluginApiDocOverrides from './extensions/users-permissions/documentation/1.0.0/overrides.json';

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) {
        const docOverrideService = strapi.plugin('documentation').service('override');
        docOverrideService.registerOverride(healthCheckApiDocOverrides);
        docOverrideService.registerOverride(authApiDocOverrides);
        docOverrideService.registerOverride(userPluginApiDocOverrides);
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    bootstrap(/* { strapi } */) {},
};
