/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import healthCheckApiDocOverrides from './api/healthcheck/documentation/1.0.0/overrides.json';
import authApiDocOverrides from './api/auth/documentation/1.0.0/overrides.json';
import userPluginApiDocOverrides from './extensions/users-permissions/documentation/1.0.0/overrides.json';
import bootstrapUsersPermissionsPlugin from './extensions/users-permissions/lifecycle/bootstrap';
import postApiDocPost from './api/post/documentation/1.0.0/post.json';
import postApiDocOverrides from './api/post/documentation/1.0.0/overrides.json';

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

    async bootstrap({ strapi }) {
        await bootstrapUsersPermissionsPlugin();

        strapi.db.lifecycles.subscribe({
            models: ['plugin::users-permissions.user'],

            async beforeUpdate(event) {
                const { data } = event.params;
                const UserWithGroups = await strapi.query('plugin::users-permissions.user').findOne({
                    where: { UUID: data.UUID },
                    populate: ['groups'],
                });

                // Store the state in a separate variable instead of modifying event.state
                // eslint-disable-next-line no-param-reassign
                event.state = {
                    previousGroups: UserWithGroups ? UserWithGroups.groups : [],
                };
            },

            async afterUpdate(event) {
                const { result, state } = event;
                const UserWithGroups = await strapi.query('plugin::users-permissions.user').findOne({
                    where: { UUID: result.UUID },
                    populate: ['groups'],
                });

                // Extract the IDs of groups before and after update
                const previousGroupIds = state.previousGroups.map(group => group.id);
                const currentGroupIds = UserWithGroups.groups.map(group => group.id);

                // Find the added and removed group ID
                const addedGroupId = currentGroupIds.filter(id => !previousGroupIds.includes(id));
                const removedGroupId = previousGroupIds.filter(id => !currentGroupIds.includes(id));

                // Trigger the lifecycles of the added or removed group
                if (addedGroupId.length > 0) {
                    const addedGroup = await strapi.query('api::group.group').findOne({
                        where: { id: addedGroupId[0] },
                    });
                    const userCount = addedGroup.userCount + 1;
                    await strapi.query('api::group.group').update({
                        where: { id: addedGroupId[0] },
                        data: {
                            userCount,
                        },
                    });
                } else if (removedGroupId.length > 0) {
                    const removedGroup = await strapi.query('api::group.group').findOne({
                        where: { id: removedGroupId[0] },
                    });
                    const userCount = removedGroup.userCount - 1;
                    await strapi.query('api::group.group').update({
                        where: { id: removedGroupId[0] },
                        data: {
                            userCount,
                        },
                    });
                }
            },

            async beforeDelete(event) {
                const { params } = event;

                const Groups = await strapi.query('plugin::users-permissions.user').findOne({
                    where: { id: params.where.id },
                    populate: ['groups'],
                });

                const GroupIds = Groups.groups.map(group => group.id);

                await Promise.all(
                    GroupIds.map(async groupId => {
                        const removedGroup = await strapi.query('api::group.group').findOne({ where: { id: groupId } });
                        const userCount = removedGroup.userCount - 1;
                        return strapi.query('api::group.group').update({ where: { id: groupId }, data: { userCount } });
                    }),
                );
            },
        });
    },
};
