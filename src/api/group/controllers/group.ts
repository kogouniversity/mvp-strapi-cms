/**
 * group controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::group.group', ({ strapi }) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async nearbySearch(ctx: any): Promise<void> {
        const { longitude, latitude } = ctx.request.body;
        const { dist } = ctx.query;

        const knex = strapi.db.connection;
        // 5000m = 5km
        if (process.env.DATABASE_CLIENT === 'mysql') {
            const res = (await knex('Groups')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .join('Addresses' as any)
                .where(
                    knex.raw(
                        `round(st_distance_sphere(
                        st_geomfromtext(CONCAT('  POINT(',Addresses.longitude%180, ' ', Addresses.latitude%90,')'  )),
                        st_geomfromtext('POINT(${longitude % 180} ${latitude % 90})')
                    )) <=${dist} AND Groups.enabled = true`,
                    ),
                )
                .catch(error => {
                    ctx.badRequest(error);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                })) as any[];

            if (res.length !== 0) {
                ctx.send(res);
            } else {
                ctx.send('No result');
            }
        } else {
            ctx.send('Must use mysql for NearbySearch');
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    async uploadProfilePhoto(ctx: any): Promise<void> {
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

        const group = await strapi.entityService.update('api::group.group', id, {
            data: {
                image_profile: profileImage.id,
            },
        });

        ctx.send(group);
    },
}));
