/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 # Deprecated!
 */

import Strapi from '@strapi/strapi';
import fs from 'fs';

const TEST_DATABASE_NAME = 'strapi_test';
let instance;

async function setupDatabase() {
    const knex = strapi.db.connection as any;
    const mysql = knex({
        client: 'mysql',
        connection: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
        },
    });
    try {
        await mysql.raw(`DROP DATABASE ${TEST_DATABASE_NAME};`);
    } catch (err) {
        console.log(err);
    }
    await mysql.raw(`CREATE DATABASE ${TEST_DATABASE_NAME};`);
    process.env.database = TEST_DATABASE_NAME;
}

export async function strapiSetUp() {
    if (!instance) {
        await Strapi({ distDir: './dist' }).load();
        instance = strapi;
        await instance.server.mount();
        await setupDatabase();
    }
    return instance;
}

export async function strapiCleanUp() {
    const dbSettings = strapi.config.get('database.connection');

    // close server to release the db-file
    await strapi.server.httpServer.close();

    // close the connection to the database before deletion
    await strapi.db.connection.destroy();

    // delete test database after all tests have completed
    if (dbSettings && (dbSettings as any).connection && (dbSettings as any).connection.filename) {
        const tmpDbFile = (dbSettings as any).connection.filename;
        if (fs.existsSync(tmpDbFile)) {
            fs.unlinkSync(tmpDbFile);
        }
    }
}
