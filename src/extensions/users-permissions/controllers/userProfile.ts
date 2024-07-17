import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    async updateProfilePhoto(ctx: any): Promise<void> {
        if (!ctx.is('multipart')) {
            return ctx.badRequest('Multipart request expected.');
        }
        const { files } = ctx.request;

        if (!files || !files.image) {
            return ctx.badRequest('Image file is required.');
        }

        const imageService = strapi.service('api::image.image');

        const imageCollectionId = await imageService.storeImage(files.image, 'profilePhoto');
        const { id } = ctx.params;

        const profileImage = await imageService.retrieveImage(imageCollectionId, 'profilePhoto');

        const user = await strapi.entityService.update('plugin::users-permissions.user', id, {
            data: {
                imageProfile: profileImage.id,
            },
        });

        ctx.send(user);
    },
}));
