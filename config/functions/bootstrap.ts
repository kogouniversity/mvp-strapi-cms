import { Strapi } from '@strapi/strapi';

const setupPermissions = async (strapi: Strapi) => {
    const roleName = 'authenticated';
    const role = await strapi.query('plugin::users-permissions.role').findOne({ 
        where: { 
            type: roleName,
        }, 
    });

    const permissions = {
        // JIN can edit here :)
        'api::comment.comment': ['create', 'find', 'update', 'delete', 'findOne'],
        'api::group.group': ['create', 'find', 'update', 'delete', 'findOne', 'following', 'nearbySearch', 'update', 'uploadProfilePhoto'],
        'api::post.post': ['create', 'find', 'update', 'delete', 'findOne', 'allPosts', 'schoolPosts', 'uploadPostPhotos', 'like', 'removeLike'],
        'api::tag.tag': ['create', 'find', 'update', 'delete', 'findOne'],
        'plugin::upload.content-api': ['upload'],
        'plugin::users-permissions.auth': ['changePassword'], 
        'plugin::users-permissions.user': ['me', 'destroy'],
        'plugin::users-permissions.userProfile': ['updateProfilePhoto'],
    };

    const allPermissionsToCreate = Object.entries(permissions).flatMap(([controller, actions]) =>
        actions.map(async (action) => {
          const updatedPermission = await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: `${controller}.${action}`,
              role: role.id,
            },
          });
          return updatedPermission;
        })
      );

    await Promise.all(allPermissionsToCreate);
};


export default async ({ strapi }: { strapi: Strapi }) => {
    try {
      await setupPermissions(strapi);
    } catch (error) {
        throw new Error(error);
    }
  };