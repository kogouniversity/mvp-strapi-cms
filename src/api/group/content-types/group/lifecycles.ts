import { updateUserCount } from './lifecycles/userCount';

export default {
    async afterUpdate(event) {
        updateUserCount(event);
    },
};
