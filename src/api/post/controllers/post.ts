/**
 * post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async create(ctx) {
        // check if ctx.request.body has group
        // check if the group is one of ctx.state.user's groups
        console.log(ctx.state.user);
        const newPost = await strapi.service('api::post.post').create(ctx);
        console.log(newPost);
        const sanitizedPost = await this.sanitizeOutput(newPost, ctx);
        console.log(sanitizedPost);
        ctx.body = sanitizedPost;
    },
}));
