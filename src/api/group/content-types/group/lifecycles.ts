export default {
    async afterUpdate(event) {
        console.log('lifecycle for group is triggered!');

        const { result } = event;

        if (result.users) {
            const userCount = result.users.count;
            await strapi.query('api::group.group').update({
                where: { id: result.id },
                data: {
                    userCount,
                },
            });
        }
    },
};
