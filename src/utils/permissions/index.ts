/* eslint-disable @typescript-eslint/no-explicit-any */
async function scope(
    ctx: any,
    roleName: string,
    callback: () => unknown,
): Promise<void> {
    const roles = await strapi.service('plugin::users-permissions.role').find();

    const userRoleId = ctx.state.user.role.id;

    const roleToSwitch = await strapi
        .service('plugin::users-permissions.role')
        .findOne(roles.filter(role => role.type === roleName)[0].id);

    await strapi.entityService.update(
        'plugin::users-permissions.user',
        ctx.state.user.id,
        {
            data: {
                role: roleToSwitch.id,
            },
        },
    );

    callback();

    await strapi.entityService.update(
        'plugin::users-permissions.user',
        ctx.state.user.id,
        {
            data: {
                role: userRoleId,
            },
        },
    );
}

export { scope };
