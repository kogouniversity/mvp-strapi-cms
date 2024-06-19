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
    async storeImage(imageData, photoName: string) {
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

        const breakpoints: Breakpoints = strapi.config.get('plugin.upload.breakpoints');
        let photoBreakpoint;

        // resize origianl image based on the give options, create image profile/posts with given photo name
        if (photoName === 'profilePhoto') {
            const originalImage = uploadedFiles[0];
            // upload original image. create an image profile entry named "original"
            const originalProfile = await strapi.entityService.create('api::image-profile.image-profile', {
                data: {
                    profileName: 'original',
                    src: originalImage.url,
                    width: originalImage.width,
                    height: originalImage.height,
                    publishedAt: new Date(),
                },
            });

            // get breakpoints
            photoBreakpoint = breakpoints.profile;

            // image size change
            const originalFileResponse = await strapi.entityService.findOne('plugin::upload.file', originalImage.id);
            const originalFilePath = path.join(strapi.dirs.static.public, originalFileResponse.url);
            const originalFileBuffer = fs.readFileSync(originalFilePath);

            const resizedBuffer = await sharp(originalFileBuffer)
                .resize({ width: photoBreakpoint.width, height: photoBreakpoint.height, fit: 'inside' })
                .toBuffer();

            const extension = path.extname(originalImage.name);
            const baseName = path.basename(originalImage.name, extension);
            const resizedImageName = `${baseName}_resized${extension}`;

            const tempFilePath = path.join('/tmp', resizedImageName);

            fs.writeFileSync(tempFilePath, resizedBuffer);
            const resizedImage = await strapi.plugins.upload.services.upload.upload({
                data: {},
                files: {
                    path: tempFilePath,
                    name: resizedImageName,
                    type: originalImage.mime,
                },
            });
            fs.unlinkSync(tempFilePath);

            const resizedFile = resizedImage[0];
            const resizedProfile = await strapi.entityService.create('api::image-profile.image-profile', {
                data: {
                    profileName: photoName,
                    src: resizedFile.url,
                    width: photoBreakpoint.width,
                    height: photoBreakpoint.height,
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
        } else if (photoName === 'postPhoto') {
            photoBreakpoint = breakpoints.post;

            const promises = uploadedFiles.map(async originalImage => {
                // upload original image. create an image post entry named "original"
                const originalPost = await strapi.entityService.create('api::image-post.image-post', {
                    data: {
                        postName: 'original',
                        src: originalImage.url,
                        width: originalImage.width,
                        height: originalImage.height,
                        publishedAt: new Date(),
                    },
                });

                // image size change
                const originalFileResponse = await strapi.entityService.findOne(
                    'plugin::upload.file',
                    originalImage.id,
                );
                const originalFilePath = path.join(strapi.dirs.static.public, originalFileResponse.url);
                const originalFileBuffer = fs.readFileSync(originalFilePath);

                const resizedBuffer = await sharp(originalFileBuffer)
                    .resize({ width: photoBreakpoint.width, height: photoBreakpoint.height, fit: 'inside' })
                    .toBuffer();

                const extension = path.extname(originalImage.name);
                const baseName = path.basename(originalImage.name, extension);
                const resizedImageName = `${baseName}_resized${extension}`;

                const tempFilePath = path.join('/tmp', resizedImageName);

                fs.writeFileSync(tempFilePath, resizedBuffer);
                const resizedImage = await strapi.plugins.upload.services.upload.upload({
                    data: {},
                    files: {
                        path: tempFilePath,
                        name: resizedImageName,
                        type: originalImage.mime,
                    },
                });
                fs.unlinkSync(tempFilePath);

                const resizedFile = resizedImage[0];
                const resizedPost = await strapi.entityService.create('api::image-post.image-post', {
                    data: {
                        postName: photoName,
                        src: resizedFile.url,
                        width: photoBreakpoint.width,
                        height: photoBreakpoint.height,
                        image: imageCollection.id,
                        publishedAt: new Date(),
                    },
                });
                return [originalPost.id, resizedPost.id];
            });

            const posts = await Promise.all(promises);
            const flattenedPosts = posts.flat();

            // update the image collection entry with the created posts
            await strapi.entityService.update('api::image.image', imageCollection.id, {
                data: {
                    image_posts: flattenedPosts,
                },
            });
        }

        // return image id
        return imageCollection.id;
    },

    // eslint-disable-next-line consistent-return
    async retrieveImage(imageId: string, photoName: string) {
        if (photoName === 'profilePhoto') {
            // retrieve and return the matching image profile
            const imageProfile = await strapi.entityService.findMany('api::image-profile.image-profile', {
                field: ['image', 'profileName'],
                filters: {
                    image: {
                        id: imageId,
                    },
                    profileName: photoName,
                },
                populate: {
                    image: true,
                },
            });
            if (!imageProfile) {
                throw new Error('Image profile not found');
            }
            return imageProfile[0];
        }
        // eslint-disable-next-line no-else-return
        else if (photoName === 'postPhoto') {
            const imagePosts = await strapi.entityService.findMany('api::image-post.image-post', {
                field: ['image', 'postName'],
                filters: {
                    image: {
                        id: imageId,
                    },
                    postName: photoName,
                },
                populate: {
                    image: true,
                },
            });
            if (!imagePosts) {
                throw new Error('Image posts not found');
            }
            return imagePosts;
        } else {
            throw new Error('Invalid photoName');
        }
    },
}));
