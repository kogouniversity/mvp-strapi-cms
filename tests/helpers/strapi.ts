/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Strapi from '@strapi/strapi';
import fs from 'fs';

let instance;

export async function strapiSetUp() {
    if (!instance) {
        await Strapi({ distDir: './dist' }).load();
        instance = strapi;

        await instance.server.mount();
    }
    return instance;
}

export async function strapiCleanUp() {
    const dbSettings = strapi.config.get('database.connection');

    //close server to release the db-file
    await strapi.server.httpServer.close();

    // close the connection to the database before deletion
    await strapi.db.connection.destroy();

    //delete test database after all tests have completed
    if (
        dbSettings &&
        (dbSettings as any).connection &&
        (dbSettings as any).connection.filename
    ) {
        const tmpDbFile = (dbSettings as any).connection.filename;
        if (fs.existsSync(tmpDbFile)) {
            fs.unlinkSync(tmpDbFile);
        }
    }
}
