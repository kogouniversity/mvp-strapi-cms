import { updatePostCommentCount } from './lifecycles/updatePostCommentCount';

export default {
    async afterCreate(event) {
        await updatePostCommentCount(event, 'create');
    },
    async beforeDelete(event) {
        await updatePostCommentCount(event, 'delete');
    },
    async beforeCreate(event) {
        // eslint-disable-next-line no-param-reassign
        event.params.data.publishedAt = new Date();
    },
    async beforeUpdate(event) {
        if (event.params.data.publishedAt === undefined) {
            // eslint-disable-next-line no-param-reassign
            event.params.data.publishedAt = new Date();
        }
    },
};
