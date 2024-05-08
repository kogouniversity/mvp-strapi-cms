/**
 * post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async create(ctx: any) {
        const { user } = ctx.state;
        const { title, content, group } = ctx.request.body.data;
        console.log(ctx.request.body.data)

        // check if ctx.request.body has group(the group must be provided in the request body)
        if (!group) {
            return ctx.badRequest('Group is required.', {
                errors: {
                    group: 'Group is required.',
                },
            });
        }

        // check if the group is one of ctx.state.user's groups(the user has to be in the group to create a post)
        // 1. find all the groups
        const userGroups = await strapi.entityService.findMany('api::group.group', {
            filters: { users: user.id },
            populate: { users: true },
        }) || [];

        // 2. check if the group is in the user's groups
        const isUserInGroup = userGroups.find(g => g.id === group.id);
        if (!isUserInGroup) {
            return ctx.badRequest('User is not a member of the provided group.', {
                errors: {
                    group: 'User is not a member of the provided group.',
                },
            });
        }

        // 3. create a new post
        const newPost = await strapi.query('api::post.post').create({
            data:{
                title,
                content,
                group: group.id,
                author: user.id,
            }
        });

        return ctx.send(newPost);
    },
}));
