async function addSchoolGroup(strapi) {
    // load all schools
    const schools = await strapi.query('api::school.school').findMany({
        populate: {
            schoolAddress: true,
            group: true,
        },
    });

    await Promise.all(
        schools.map(async school => {
            // check if the corresponding group exists
            const schoolgroup = await strapi.query('api::group.group').findOne({
                where: {
                    name: school.schoolName,
                    isSchool: true,
                },
            });
            // if the school has no group
            if (school.group === null) {
                // if no corresponding group exists, create a new group
                if (!schoolgroup) {
                    const existingAddress = await strapi.query('api::address.address').findOne({
                        where: {
                            id: school.schoolAddress.id,
                        },
                    });
                    const newGroup = await strapi.query('api::group.group').create({
                        data: {
                            name: school.schoolName,
                            address: existingAddress,
                            hasAddress: true,
                            description: `Group for ${school.schoolName} students`,
                            isSchool: true,
                        },
                    });
                    await strapi.query('api::school.school').update({
                        where: { id: school.id },
                        data: {
                            group: newGroup.id,
                        },
                    });
                } else {
                    // if the corresponding group exists, update the school with the group
                    await strapi.query('api::school.school').update({
                        where: { id: school.id },
                        data: {
                            group: schoolgroup.id,
                        },
                    });
                }
            }
        }),
    );
}

export default addSchoolGroup;
