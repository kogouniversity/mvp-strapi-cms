export async function updateGroupUserCount(event) {
    const { result, state } = event;
    const UserWithGroups = await strapi.query('plugin::users-permissions.user').findOne({
        where: { UUID: result.UUID },
        populate: ['groups'],
    });

    const previousGroupIds = state.previousGroups.map(group => group.id);
    const currentGroupIds = UserWithGroups.groups.map(group => group.id);

    const addedGroupId = currentGroupIds.filter(id => !previousGroupIds.includes(id));
    const removedGroupId = previousGroupIds.filter(id => !currentGroupIds.includes(id));

    if (addedGroupId.length > 0) {
        const addedGroup = await strapi.query('api::group.group').findOne({
            where: { id: addedGroupId[0] },
        });
        const userCount = addedGroup.userCount + 1;
        await strapi.query('api::group.group').update({
            where: { id: addedGroupId[0] },
            data: {
                userCount,
            },
        });
    } else if (removedGroupId.length > 0) {
        const removedGroup = await strapi.query('api::group.group').findOne({
            where: { id: removedGroupId[0] },
        });
        const userCount = removedGroup.userCount - 1;
        await strapi.query('api::group.group').update({
            where: { id: removedGroupId[0] },
            data: {
                userCount,
            },
        });
    }
}
