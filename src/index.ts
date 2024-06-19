/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import healthCheckApiDocOverrides from './api/healthcheck/documentation/1.0.0/overrides.json';
import authApiDocOverrides from './api/auth/documentation/1.0.0/overrides.json';
import userPluginApiDocOverrides from './extensions/users-permissions/documentation/1.0.0/overrides.json';
import bootstrapUsersPermissionsPlugin from './extensions/users-permissions/lifecycle/bootstrap';
import postApiDocPost from './api/post/documentation/1.0.0/post.json';
import postApiDocOverrides from './api/post/documentation/1.0.0/overrides.json';
import addSchoolData from './api/school/lifecycle/bootstrap';
import setupPermissions from '../config/functions/bootstrap';

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    async register({ strapi }) {
        if (strapi.plugin('documentation')) {
            const docOverrideService = strapi.plugin('documentation').service('override');
            docOverrideService.registerOverride(healthCheckApiDocOverrides);
            docOverrideService.registerOverride(authApiDocOverrides);
            docOverrideService.registerOverride(userPluginApiDocOverrides);
            postApiDocOverrides.paths['/posts'] = {
                ...postApiDocPost['/posts'],
                ...postApiDocOverrides.paths['/posts'],
            };
            docOverrideService.registerOverride(postApiDocOverrides);
        }
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async bootstrap({ strapi }) {
        await bootstrapUsersPermissionsPlugin();
        await addSchoolData(strapi);
        await setupPermissions({ strapi });
    },
};
