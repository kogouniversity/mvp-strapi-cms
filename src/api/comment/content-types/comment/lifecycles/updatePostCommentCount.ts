export async function updatePostCommentCount(event, action: string) {
    const { params } = event;
    if (action === 'create') {
        const Post = await strapi.query('api::post.post').findOne({
            where: { id: params.data.post },
            populate: ['comments'],
        });
        const newcommentCount = Post.commentCount + 1;
        await strapi.query('api::post.post').update({
            where: { id: Post.id },
            data: {
                commentCount: newcommentCount,
            },
        });
    } else if (action === 'delete') {
        const commentWithPost = await strapi.query('api::comment.comment').findOne({
            where: { id: params.where.id },
            populate: ['post'],
        });
        const postId = commentWithPost.post.id;
        const newcommentCount = commentWithPost.post.commentCount - 1;
        await strapi.query('api::post.post').update({
            where: { id: postId },
            data: {
                commentCount: newcommentCount,
            },
        });
    }
}
