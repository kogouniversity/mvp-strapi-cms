import fs from 'fs';
import path from 'path';

async function addSchoolData(strapi) {
    const schoolDataPath = path.join(__dirname, '../schools.json');
    const schoolData = JSON.parse(fs.readFileSync(schoolDataPath, 'utf8'));

    await Promise.all(
        schoolData.map(async school => {
            const existingSchool = await strapi.db.query('api::school.school').findOne({
                where: { schoolName: school.schoolName },
            });

            if (!existingSchool) {
                const addressData = school.schoolAddress;
                const existingAddress = await strapi.db.query('api::address.address').findOne({
                    where: {
                        country: addressData.country,
                        city: addressData.city,
                        street_name: addressData.street_name,
                        postal_code: addressData.postal_code,
                    },
                });

                let address;
                if (!existingAddress) {
                    address = await strapi.db.query('api::address.address').create({
                        data: addressData,
                    });
                } else {
                    address = existingAddress;
                }

                await strapi.db.query('api::school.school').create({
                    data: {
                        schoolName: school.schoolName,
                        schoolEmailDomain: school.schoolEmailDomain,
                        abbreviation: school.abbreviation,
                        schoolAddress: address.id,
                    },
                });
            }
        }),
    );
}

export default addSchoolData;
