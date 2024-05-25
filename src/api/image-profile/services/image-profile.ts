/**
 * image-profile service
 */

import { factories } from '@strapi/strapi';

// type Options = {
//     width: number;
//     height: number;
//     maxWidth: number;
//     maxHeight: number;
// }

export default factories.createCoreService('api::image-profile.image-profile');
