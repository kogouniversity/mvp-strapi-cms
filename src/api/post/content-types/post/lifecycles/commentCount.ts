// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCommentCount(event: any) {
    const { result } = event;

    if (result.comments) {
        const commentCount = result.comments.count;
        await strapi.query('api::post.post').update({
            where: { id: result.id },
            data: {
                commentCount,
            },
        });
    }
}
