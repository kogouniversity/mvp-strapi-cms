/**
 * image service
 */

import { factories } from '@strapi/strapi';
// eslint-disable-next-line import/no-unresolved
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

type Breakpoint = {
    width: number;
    height: number;
};

type Breakpoints = {
    post: Breakpoint;
    profile: Breakpoint;
};

export default factories.createCoreService('api::image.image', ({ strapi }) => ({
    async storeImage(imageData, profileName: string) {
        const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
            data: {},
            files: imageData,
        });

        if (uploadedFiles.length === 0) {
            throw new Error('Image upload failed');
        }

        // create an image collection first
        const imageCollection = await strapi.entityService.create('api::image.image', {
            data: {
                publishedAt: new Date(),
            },
        });

        // upload original image. create an image profile entry named "original"
        const originalImage = uploadedFiles[0];
        const originalProfile = await strapi.entityService.create('api::image-profile.image-profile', {
            data: {
                profileName: 'original',
                src: originalImage.url,
                width: originalImage.width,
                height: originalImage.height,
                publishedAt: new Date(),
            },
        });

        // resize origianl image based on the give options, create an image profile with given profile name
        // let resizedProfile;
        // if(profileName === 'profilePhoto') {
        const breakpoints: Breakpoints = strapi.config.get('plugin.upload.breakpoints');
        const profileBreakpoint = breakpoints.profile;

        const originalFileResponse = await strapi.entityService.findOne('plugin::upload.file', originalImage.id);
        const originalFilePath = path.join(strapi.dirs.static.public, originalFileResponse.url);
        const originalFileBuffer = fs.readFileSync(originalFilePath);

        const resizedBuffer = await sharp(originalFileBuffer)
            .resize({ width: profileBreakpoint.width, height: profileBreakpoint.height, fit: 'inside' })
            .toBuffer();

        const extension = path.extname(originalImage.name);
        const baseName = path.basename(originalImage.name, extension);
        const resizedImageName = `${baseName}_resized${extension}`;

        const tempFilePath = path.join('/tmp', resizedImageName);

        fs.writeFileSync(tempFilePath, resizedBuffer);
        const resizedImage = await strapi.plugins.upload.services.upload.upload({
            data: {},
            files: {
                // eslint-disable-next-line object-shorthand
                path: tempFilePath,
                name: resizedImageName,
                type: originalImage.mime,
            },
        });
        fs.unlinkSync(tempFilePath);

        const resizedFile = resizedImage[0];
        const resizedProfile = await strapi.entityService.create('api::image-profile.image-profile', {
            data: {
                // eslint-disable-next-line object-shorthand
                profileName: profileName,
                src: resizedFile.url,
                width: profileBreakpoint.width,
                height: profileBreakpoint.height,
                image: imageCollection.id,
                publishedAt: new Date(),
            },
        });

        // update the image collection entry with the created profiles
        await strapi.entityService.update('api::image.image', imageCollection.id, {
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
