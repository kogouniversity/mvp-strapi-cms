// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUserCount(event: any) {
    const { result } = event;
    if (result.users) {
        const newUserCount = result.users.length || result.users.count;
        await strapi.db.query('api::group.group').update({
            where: { id: result.id },
            data: {
                userCount: newUserCount,
            },
        });
    }
}
