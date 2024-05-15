import path from 'path';
import fs from 'fs';
import addSchoolData from '../../../school/lifecycle/bootstrap';

jest.mock('fs');
jest.mock('path');

const mockSchoolData = [
    {
        schoolName: 'Simon Fraser University - Burnaby',
        schoolEmailDomain: 'sfu.ca',
        abbreviation: 'SFU',
        schoolAddress: {
            country: 'Canada',
            city: 'Burnaby',
            street_name: '8888 University Dr W',
            postal_code: 'V5A 1S6',
            alias: '',
            type: 'University',
        },
    },
];

describe('addSchoolData', () => {
    let strapi;
    beforeAll(() => {
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockSchoolData));
        (path.join as jest.Mock).mockReturnValue('mocked_path/schools.json');
    });

    beforeEach(() => {
        jest.clearAllMocks();
        strapi = {
            db: {
                query: jest.fn().mockReturnValue({
                    findOne: jest.fn().mockResolvedValue(null),
                    create: jest.fn().mockResolvedValue(null),
                    update: jest.fn().mockResolvedValue(null),
                }),
            },
        };
    });

    it('should add new school and new address if both do not exist', async () => {
        strapi.db.query.mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation(params => {
                if (params.data.street_name) {
                    return { id: 1 }; // new address created
                }
                return { id: 1 }; // new school created
            }),
            update: jest.fn(),
        });

        await addSchoolData(strapi);

        expect(strapi.db.query).toHaveBeenCalledWith('api::school.school');
        expect(strapi.db.query).toHaveBeenCalledWith('api::address.address');
        expect(strapi.db.query).toHaveBeenCalledTimes(4); // 2 findOne, 2 create
    });

    it('should only add new school if its address exists', async () => {
        strapi.db.query.mockReturnValue({
            findOne: jest.fn().mockImplementation(params => {
                if (params.where.schoolName) {
                    return null; // school does not exist
                }
                if (params.where.city) {
                    return { id: 1 }; // address exists
                }
                return null;
            }),
            create: jest.fn().mockReturnValue({ id: 1 }),
            update: jest.fn(),
        });

        await addSchoolData(strapi);

        expect(strapi.db.query).toHaveBeenCalledWith('api::school.school');
        expect(strapi.db.query).toHaveBeenCalledWith('api::address.address');
        expect(strapi.db.query).toHaveBeenCalledTimes(3); // 2 findOne, 1 create
    });

    it('should only add new address and update existing school if school exists', async () => {
        strapi.db.query.mockReturnValue({
            findOne: jest.fn().mockImplementation(params => {
                if (params.where.schoolName) {
                    return { id: 1 }; // school exists
                }
                if (params.where.city) {
                    return null; // address does not exist
                }
                return null;
            }),
            create: jest.fn().mockReturnValue({ id: 1 }),
            update: jest.fn().mockResolvedValue({}),
        });

        await addSchoolData(strapi);

        expect(strapi.db.query).toHaveBeenCalledWith('api::school.school');
        expect(strapi.db.query).toHaveBeenCalledWith('api::address.address');
        expect(strapi.db.query).toHaveBeenCalledTimes(4); // 2 findOne, 1 create, 1 update

        // Ensure the update call is correct
        const updateCall = strapi.db.query().update.mock.calls[0];
        expect(updateCall[0]).toEqual({
            where: { id: 1 },
            data: { schoolAddress: 1 },
        });
    });

    it('should skip both address and school', async () => {
        strapi.db.query.mockReturnValue({
            findOne: jest.fn().mockImplementation(params => {
                if (params.where.schoolName) {
                    return { id: 1 }; // school exists
                }
                if (params.where.city) {
                    return { id: 1 }; // address exists
                }
                return null;
            }),
            create: jest.fn(),
            update: jest.fn(),
        });

        await addSchoolData(strapi);

        expect(strapi.db.query).toHaveBeenCalledTimes(3);
        expect(strapi.db.query).not.toHaveBeenCalledWith('api::address.address', expect.anything());
        expect(strapi.db.query).not.toHaveBeenCalledWith('api::school.school', expect.anything());
    });
});
