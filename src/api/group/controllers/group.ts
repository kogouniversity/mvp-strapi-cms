/**
 * group controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::group.group', ({ strapi }) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async create(ctx: any) {
        const { user } = ctx.state;
        const { name, description, tags } = ctx.request.body;

        if (!tags) return ctx.badRequest('At least one tag is required');

        // for all tags
        const userTags = tags.map(async tag => {
            // check if the tag exists
            const originalTags = await strapi.entityService.findMany('api::tag.tag', {
                filters: {
                    value: tag,
                },
            });
            // if the tag does not exist, create the tag and put the tag id into userTags
            if (originalTags.length === 0) {
                const newTag = await strapi.entityService.create('api::tag.tag', {
                    data: {
                        value: tag,
                    },
                });
                userTags.push(newTag.id);
            }
            // if the tag exists, put the tag id into userTags
            else {
                userTags.push(originalTags[0].id);
            }
        });

        const newGroup = await strapi.query('api::group.group').create({
            data: {
                name,
                description,
                tags: userTags.map(tag => tag.id),
                owner: user,
                users: [user],
                userCount: 1,
            },
        });

        return ctx.send(newGroup);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(ctx: any) {
        const { user } = ctx.state;
        const { groupId } = ctx.params;

        const groups = await strapi.entityService.findMany('api::group.group', {
            filters: {
                id: groupId,
            },
            populate: ['users'],
        });

        if (groups.length === 0) {
            return ctx.badRequest('No such group');
        }
        const group = groups[0];
        const userIds = group.users.map(u => u.id);

        if (!userIds.includes(user.id)) {
            userIds.push(user.id);
        } else {
            return ctx.badRequest('User already in the group');
        }

        const updatedGroup = await strapi.entityService.update('api::group.group', group.id, {
            data: {
                users: userIds,
            },
            populate: ['users'],
        });

        return ctx.send(updatedGroup);
    },
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
                imageProfile: profileImage.id,
            },
        });

        ctx.send(group);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    async following(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const userId = user.id;

        const { page, pageSize } = ctx.query;
        const pageNum = parseInt(page, 10);
        const pageSizeNum = parseInt(pageSize, 10);

        const totalGroups = await strapi.entityService.count('api::group.group', {
            filters: {
                users: userId,
            },
        });

        const pageCountNum = Math.ceil(totalGroups / pageSizeNum);

        // if pageNum exceeds the total number of pages, return an empty array
        if (pageNum > pageCountNum) {
            return ctx.send({
                data: [],
                meta: {
                    pagination: {
                        page: pageNum,
                        pageSize: pageSizeNum,
                        pageCount: pageCountNum,
                        total: totalGroups,
                    },
                },
            });
        }

        const startNum = (pageNum - 1) * pageSizeNum;

        const userGroups = await strapi.entityService.findMany('api::group.group', {
            filters: {
                users: userId,
            },
            start: startNum,
            limit: pageSizeNum,
            sort: 'userCount:desc',
        });

        const response = {
            data: userGroups.map(group => ({
                id: group.id,
                attributes: group,
            })),
            meta: {
                pagination: {
                    page: pageNum,
                    pageSize: pageSizeNum,
                    pageCount: pageCountNum,
                    total: totalGroups,
                },
            },
        };

        ctx.send(response);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    async unfollow(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const { groupId } = ctx.params;

        const userGroups = await strapi.entityService.findMany('api::group.group', {
            filters: {
                id: groupId,
                users: user.id,
            },
            populate: ['users'],
        });

        if (userGroups.length === 0) {
            return ctx.badRequest('User is not in the group');
        }

        const userGroup = await strapi.query('api::group.group').update({
            where: { id: userGroups[0].id },
            data: {
                users: userGroups[0].users.filter(u => u.id !== user.id),
            },
            populate: ['users'],
        });

        ctx.send(userGroup);
    },
}));
