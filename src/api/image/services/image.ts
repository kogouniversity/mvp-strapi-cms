/**
 * image service
 */

import { factories } from '@strapi/strapi';

type Options = {
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
};

export default factories.createCoreService('api::image.image', ({ strapi }) => ({
    async storeImage(imageData, profileName: string, options: Options) {
        // upload original image. create an image profile entry named "original"
        const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
            data: {},
            files: imageData,
        });

        if (uploadedFiles.length === 0) {
            throw new Error('Image upload failed');
        }

        const originalImage = uploadedFiles[0];

        // resize origianl image based on the give options, create an image profile with given profile name
        const resizedImage = await strapi.plugins.upload.services.upload.resize(originalImage, options);

        const originalProfile = await strapi.entityService.create('api::image-profile.image-profile', {
            data: {
                image: {
                    id: originalImage.id,
                },
                profileName: 'original',
                width: originalImage.width,
                height: originalImage.height,
            },
        });

        const resizedProfile = await strapi.entityService.create('api::image-profile.image-profile', {
            data: {
                image: {
                    id: resizedImage.id,
                },
                // eslint-disable-next-line object-shorthand
                profileName: profileName,
                width: options.width || resizedImage.width,
                height: options.height || resizedImage.height,
            },
        });

        // create an image collection entry with the created profiles
        const imageCollection = await strapi.entityService.create('api::image.image', {
            data: {
                profiles: [originalProfile.id, resizedProfile.id],
            },
        });

        // return image id
        return imageCollection.id;
    },

    async retrieveImage(imageId: string, profileName: string) {
        // retrieve and return the matching image profile
        const imageProfile = await strapi.entityService.findMany('api::image-profile.image-profile', {
            field: ['image', 'profileName'],
            filters: {
                image: {
                    id: imageId,
                },
                // eslint-disable-next-line object-shorthand
                profileName: profileName,
            },
            populate: {
                image: true,
            },
        });

        if (!imageProfile) {
            throw new Error('Image profile not found');
        }

        return imageProfile[0];
    },
}));
