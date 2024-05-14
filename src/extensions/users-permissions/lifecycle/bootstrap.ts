import { updateGroupUserCount } from './updateGroupUserCount';

async function bootstrap() {
    /**
     * Bootstrap User Roles
     */
    await strapi.entityService
        .findMany('plugin::users-permissions.role', {
            filters: { type: 'Unauthenticated' },
        })
        .then(queryResult => {
            if (queryResult.length === 0) {
                strapi.entityService.create('plugin::users-permissions.role', {
                    data: {
                        name: 'Unauthenticated',
                        type: 'Unauthenticated',
                        description: 'User role prior to the email verification.',
                    },
                });
            }
        });

    strapi.db.lifecycles.subscribe({
        models: ['plugin::users-permissions.user'],

        async beforeUpdate(event) {
            const { data } = event.params;
            const UserWithGroups = await strapi.query('plugin::users-permissions.user').findOne({
                where: { UUID: data.UUID },
                populate: ['groups'],
            });

            // eslint-disable-next-line no-param-reassign
            event.state = {
                previousGroups: UserWithGroups ? UserWithGroups.groups : [],
            };
        },

        async afterUpdate(event) {
            await updateGroupUserCount(event);
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
}

export default bootstrap;

/**

async function setPublicPermissions(newPermissions) {
  const publicRole = await strapi.query("plugin::users-permissions.role").findOne({
    where: {
      type: "public",
    },
  });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

async function importSeedData() {
  // Allow read of application content types
  await setPublicPermissions({
    {{ api name }}: [ {{ permission name }} ],
    // example --> article: [ "find" ],
  });
}
 */
