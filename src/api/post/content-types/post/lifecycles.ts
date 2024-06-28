import { updateCommentCount } from './lifecycles/commentCount';

export default {
    async afterUpdate(event) {
        updateCommentCount(event);
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
