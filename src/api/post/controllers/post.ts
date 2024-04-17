/**
 * post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async create(ctx) {
        console.log('ctx: ', ctx);
        console.log('ctx.state: ', ctx.state);

        // check if ctx.request.body has group
        // check if the group is one of ctx.state.user's groups

        const newPost = await strapi.service('api::post.post').create(ctx);
        const sanitizedPost = await this.sanitizeOutput(newPost, ctx);
        ctx.body = sanitizedPost;
    },
}));
