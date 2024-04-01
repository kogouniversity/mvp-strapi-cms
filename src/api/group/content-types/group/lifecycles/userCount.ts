// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUserCount(event: any) {
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
}
