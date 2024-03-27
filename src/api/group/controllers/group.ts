/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/no-explicit-any */

export default {
    async nearbySearch(ctx: any): Promise<void> {
        const { longitude, latitude } = ctx.request.body;
        const { dist } = ctx.query;

        const knex = strapi.db.connection;
        // 5000m = 5km
        if (process.env.DATABASE_CLIENT === 'mysql') {
            const res = (await knex('Groups')
                .join('Addresses' as any)
                .where(
                    knex.raw(
                        `round(st_distance_sphere(
                            st_geomfromtext(CONCAT('  POINT(',Addresses.longitude%180, ' ', Addresses.latitude%90,')'  )),
                            st_geomfromtext('POINT(` +
                            (longitude % 180) +
                            ` ` +
                            (latitude % 90) +
                            `)')
                        )) <=` +
                            dist +
                            ` AND Groups.enabled = true`,
                    ),
                )
                .catch(error => {
                    ctx.badRequest(error);
                })) as any[];

            if (res.length !== 0) {
                ctx.send(res);
            } else {
                ctx.send('No result');
            }
        } else {
            ctx.send('Must use mysql for NearbySearch');
        }
    },
};
