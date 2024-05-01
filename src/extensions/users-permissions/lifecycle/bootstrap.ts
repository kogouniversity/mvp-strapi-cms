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
