/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * comment controller
 */

import { factories } from '@strapi/strapi';
import redis from '../../../utils/redis';

export default factories.createCoreController('api::comment.comment', () => ({
    async like(ctx: any) {
        const { user } = ctx.state;
        const { commentId } = ctx.params;

        const liked = await redis().sismember(`comment-${commentId}-likes`, user.id);

        if (!liked) {
            await redis().sadd(`comment-${commentId}-likes`, user.id);
            const likesNum = await redis().scard(`comment-${commentId}-likes`);
            await strapi.entityService.update('api::comment.comment', commentId, {
                data: {
                    likes: likesNum,
                },
            });
            return user.id;
        }
        return ctx.badRequest('User already liked the comment');
    },

    async removeLike(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const { commentId } = ctx.params;

        const isLiked = await redis().sismember(`comment-${commentId}-likes`, user.id);

        if (isLiked) {
            await redis().srem(`comment-${commentId}-likes`, user.id);
            const likesNum = await redis().scard(`comment-${commentId}-likes`);
            await strapi.entityService.update('api::comment.comment', commentId, {
                data: {
                    likes: likesNum,
                },
            });
            return user.id;
        }
        return ctx.badRequest("User didn't like this comment before");
    },
}));
