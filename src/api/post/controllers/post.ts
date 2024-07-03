/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * post controller
 */

import { factories } from '@strapi/strapi';
import { MeiliSearch } from 'meilisearch';
import redis from '../../../utils/redis';

const client = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_API_KEY,
});

const postIndex = client.index('post');

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async find(ctx: any) {
        const { q, _start = 0, _limit = 15, _sort = 'createdAt:desc' } = ctx.query;

        if (q) {
            // if query parameter is provided
            // search for posts, users, groups, tags, and comments
            try {
                // search for the posts with the keyword
                const queryWords = q.split(' ').join(' ');
                await postIndex.updateSortableAttributes(['createdAt', 'likes', 'viewCount']);
                const postSearchResult = await postIndex.search(queryWords, {
                    offset: _start,
                    limit: _limit,
                    sort: [_sort],
                });
                return ctx.send(postSearchResult.hits);
            } catch (error) {
                return ctx.badRequest('Meilisearch error:', error);
            }
        }
        // if query parameter is not provided, return all the posts
        const { result } = await super.find(ctx);
        return ctx.send(result);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async create(ctx: any) {
        const { user } = ctx.state;
        const { title, content, group } = ctx.request.body.data;

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
        const userGroups =
            (await strapi.entityService.findMany('api::group.group', {
                filters: { users: user.id },
                populate: { users: true },
            })) || [];

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
            data: {
                title,
                content,
                group: group.id,
                author: user.id,
                likes: 0,
            },
        });

        return ctx.send(newPost);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async schoolPosts(ctx: any): Promise<void> {
        // All posts from the user's school excluding the user's posts
        const { user } = ctx.state;
        const userId = user.id;

        const schoolGroups = await strapi.entityService.findMany('api::group.group', {
            filters: {
                users: userId,
                isSchool: true,
            },
        });
        const schoolGroup = schoolGroups[0];

        const posts = await strapi.entityService.findMany('api::post.post', {
            filters: {
                group: {
                    id: {
                        $eq: schoolGroup.id,
                    },
                },
                author: {
                    id: {
                        $ne: userId,
                    },
                },
            },
            sort: { createdAt: 'desc' },
            populate: { group: true },
        });

        ctx.send(posts);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async allPosts(ctx: any) {
        // All posts from the user's groups excluding the user's posts
        const { user } = ctx.state;
        const userId = user.id;

        const allGroups = await strapi.entityService.findMany('api::group.group', {
            filters: {
                users: userId,
            },
        });
        const groupIds = allGroups.map(group => group.id);

        const posts = await strapi.entityService.findMany('api::post.post', {
            filters: {
                group: {
                    id: {
                        $in: groupIds,
                    },
                },
                author: {
                    id: {
                        $ne: userId,
                    },
                },
            },
            sort: { createdAt: 'desc' },
            populate: { group: true },
        });

        ctx.send(posts);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    async uploadPostPhotos(ctx: any): Promise<void> {
        if (!ctx.is('multipart')) {
            return ctx.badRequest('Multipart request expected.');
        }

        const { files } = ctx.request;

        if (!files || !files.image) {
            return ctx.badRequest('Image file is required.');
        }

        const imageService = strapi.service('api::image.image');
        const imageCollectionId = await imageService.storeImage(files.image, 'postPhoto');

        const { id } = ctx.params;

        const photoImages = await imageService.retrieveImage(imageCollectionId, 'postPhoto');

        const post = await strapi.entityService.update('api::post.post', id, {
            data: {
                image_posts: photoImages.map(imagePost => imagePost.id),
            },
        });

        ctx.send(post);
    },

    async likeCheck(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const { postId } = ctx.params;

        return redis().sismember(`post-${postId}-likes`, user.id);
    },

    async like(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const { postId } = ctx.params;
        // check if post'likes already have userid
        const isLiked = await redis().sismember(`post-${postId}-likes`, user.id);

        if (!isLiked) {
            // user haven't liked the post
            await redis().sadd(`post-${postId}-likes`, user.id);
            // const likesNum = await strapi.entityService.findOne("api::post.post", postId, {
            //     fields: ['likes'],
            // })
            const likeNums = await redis().scard(`post-${postId}-likes`);
            await strapi.entityService.update('api::post.post', postId, {
                data: {
                    likes: likeNums,
                },
            });
            return user.id;
        }
        return ctx.badRequest('User already liked the post');
    },

    async removeLike(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const { postId } = ctx.params;
        // delete user from redis set of the post
        const isLiked = await redis().sismember(`post-${postId}-likes`, user.id);

        if (isLiked) {
            await redis().srem(`post-${postId}-likes`, user.id);
            const likeNums = await redis().scard(`post-${postId}-likes`);
            await strapi.entityService.update('api::post.post', postId, {
                data: {
                    likes: likeNums,
                },
            });
            return user.id;
        }
        return ctx.badRequest("User didn't like this post before");
    },

    async view(ctx: any): Promise<void> {
        const { user } = ctx.state;
        const { postId } = ctx.params;

        // check if post'views already have userid
        const isViewed = await redis().sismember(`post-${postId}-views`, user.id);

        if (!isViewed) {
            // user haven't viewed the post
            await redis().sadd(`post-${postId}-views`, user.id);
            const viewNums = await redis().scard(`post-${postId}-views`);
            await strapi.entityService.update('api::post.post', postId, {
                data: {
                    views: viewNums,
                },
            });
            return user.id;
        }
        return ctx.badRequest('User already viewed the post');
    },
}));
