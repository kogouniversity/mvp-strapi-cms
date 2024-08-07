import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
    collectionName: 'admin_permissions';
    info: {
        name: 'Permission';
        description: '';
        singularName: 'permission';
        pluralName: 'permissions';
        displayName: 'Permission';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        action: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
        subject: Attribute.String &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        properties: Attribute.JSON & Attribute.DefaultTo<{}>;
        conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
        role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface AdminUser extends Schema.CollectionType {
    collectionName: 'admin_users';
    info: {
        name: 'User';
        description: '';
        singularName: 'user';
        pluralName: 'users';
        displayName: 'User';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        firstname: Attribute.String &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        lastname: Attribute.String &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        username: Attribute.String;
        email: Attribute.Email &
            Attribute.Required &
            Attribute.Private &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 6;
            }>;
        password: Attribute.Password &
            Attribute.Private &
            Attribute.SetMinMaxLength<{
                minLength: 6;
            }>;
        resetPasswordToken: Attribute.String & Attribute.Private;
        registrationToken: Attribute.String & Attribute.Private;
        isActive: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
        roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> & Attribute.Private;
        blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
        preferedLanguage: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface AdminRole extends Schema.CollectionType {
    collectionName: 'admin_roles';
    info: {
        name: 'Role';
        description: '';
        singularName: 'role';
        pluralName: 'roles';
        displayName: 'Role';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        code: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        description: Attribute.String;
        users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
        permissions: Attribute.Relation<'admin::role', 'oneToMany', 'admin::permission'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface AdminApiToken extends Schema.CollectionType {
    collectionName: 'strapi_api_tokens';
    info: {
        name: 'Api Token';
        singularName: 'api-token';
        pluralName: 'api-tokens';
        displayName: 'Api Token';
        description: '';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        description: Attribute.String &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }> &
            Attribute.DefaultTo<''>;
        type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
            Attribute.Required &
            Attribute.DefaultTo<'read-only'>;
        accessKey: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        lastUsedAt: Attribute.DateTime;
        permissions: Attribute.Relation<'admin::api-token', 'oneToMany', 'admin::api-token-permission'>;
        expiresAt: Attribute.DateTime;
        lifespan: Attribute.BigInteger;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
    collectionName: 'strapi_api_token_permissions';
    info: {
        name: 'API Token Permission';
        description: '';
        singularName: 'api-token-permission';
        pluralName: 'api-token-permissions';
        displayName: 'API Token Permission';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        action: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        token: Attribute.Relation<'admin::api-token-permission', 'manyToOne', 'admin::api-token'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface AdminTransferToken extends Schema.CollectionType {
    collectionName: 'strapi_transfer_tokens';
    info: {
        name: 'Transfer Token';
        singularName: 'transfer-token';
        pluralName: 'transfer-tokens';
        displayName: 'Transfer Token';
        description: '';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        description: Attribute.String &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }> &
            Attribute.DefaultTo<''>;
        accessKey: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        lastUsedAt: Attribute.DateTime;
        permissions: Attribute.Relation<'admin::transfer-token', 'oneToMany', 'admin::transfer-token-permission'>;
        expiresAt: Attribute.DateTime;
        lifespan: Attribute.BigInteger;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
    collectionName: 'strapi_transfer_token_permissions';
    info: {
        name: 'Transfer Token Permission';
        description: '';
        singularName: 'transfer-token-permission';
        pluralName: 'transfer-token-permissions';
        displayName: 'Transfer Token Permission';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        action: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        token: Attribute.Relation<'admin::transfer-token-permission', 'manyToOne', 'admin::transfer-token'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface PluginUploadFile extends Schema.CollectionType {
    collectionName: 'files';
    info: {
        singularName: 'file';
        pluralName: 'files';
        displayName: 'File';
        description: '';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        alternativeText: Attribute.String;
        caption: Attribute.String;
        width: Attribute.Integer;
        height: Attribute.Integer;
        formats: Attribute.JSON;
        hash: Attribute.String & Attribute.Required;
        ext: Attribute.String;
        mime: Attribute.String & Attribute.Required;
        size: Attribute.Decimal & Attribute.Required;
        url: Attribute.String & Attribute.Required;
        previewUrl: Attribute.String;
        provider: Attribute.String & Attribute.Required;
        provider_metadata: Attribute.JSON;
        related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
        folder: Attribute.Relation<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> & Attribute.Private;
        folderPath: Attribute.String &
            Attribute.Required &
            Attribute.Private &
            Attribute.SetMinMax<{
                min: 1;
            }>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface PluginUploadFolder extends Schema.CollectionType {
    collectionName: 'upload_folders';
    info: {
        singularName: 'folder';
        pluralName: 'folders';
        displayName: 'Folder';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMax<{
                min: 1;
            }>;
        pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
        parent: Attribute.Relation<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
        children: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
        files: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
        path: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMax<{
                min: 1;
            }>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
    collectionName: 'strapi_releases';
    info: {
        singularName: 'release';
        pluralName: 'releases';
        displayName: 'Release';
    };
    options: {
        draftAndPublish: false;
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        releasedAt: Attribute.DateTime;
        actions: Attribute.Relation<
            'plugin::content-releases.release',
            'oneToMany',
            'plugin::content-releases.release-action'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::content-releases.release', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::content-releases.release', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface PluginContentReleasesReleaseAction extends Schema.CollectionType {
    collectionName: 'strapi_release_actions';
    info: {
        singularName: 'release-action';
        pluralName: 'release-actions';
        displayName: 'Release Action';
    };
    options: {
        draftAndPublish: false;
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
        entry: Attribute.Relation<'plugin::content-releases.release-action', 'morphToOne'>;
        contentType: Attribute.String & Attribute.Required;
        release: Attribute.Relation<
            'plugin::content-releases.release-action',
            'manyToOne',
            'plugin::content-releases.release'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::content-releases.release-action', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::content-releases.release-action', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface PluginI18NLocale extends Schema.CollectionType {
    collectionName: 'i18n_locale';
    info: {
        singularName: 'locale';
        pluralName: 'locales';
        collectionName: 'locales';
        displayName: 'Locale';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String &
            Attribute.SetMinMax<{
                min: 1;
                max: 50;
            }>;
        code: Attribute.String & Attribute.Unique;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface PluginUsersPermissionsPermission extends Schema.CollectionType {
    collectionName: 'up_permissions';
    info: {
        name: 'permission';
        description: '';
        singularName: 'permission';
        pluralName: 'permissions';
        displayName: 'Permission';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        action: Attribute.String & Attribute.Required;
        role: Attribute.Relation<'plugin::users-permissions.permission', 'manyToOne', 'plugin::users-permissions.role'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
    collectionName: 'up_roles';
    info: {
        name: 'role';
        description: '';
        singularName: 'role';
        pluralName: 'roles';
        displayName: 'Role';
    };
    pluginOptions: {
        'content-manager': {
            visible: false;
        };
        'content-type-builder': {
            visible: false;
        };
    };
    attributes: {
        name: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 3;
            }>;
        description: Attribute.String;
        type: Attribute.String & Attribute.Unique;
        permissions: Attribute.Relation<
            'plugin::users-permissions.role',
            'oneToMany',
            'plugin::users-permissions.permission'
        >;
        users: Attribute.Relation<'plugin::users-permissions.role', 'oneToMany', 'plugin::users-permissions.user'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
    collectionName: 'up_users';
    info: {
        name: 'user';
        description: '';
        singularName: 'user';
        pluralName: 'users';
        displayName: 'User';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        username: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 3;
            }>;
        email: Attribute.Email &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 6;
            }>;
        provider: Attribute.String;
        password: Attribute.Password &
            Attribute.Private &
            Attribute.SetMinMaxLength<{
                minLength: 6;
            }>;
        resetPasswordToken: Attribute.String & Attribute.Private;
        confirmationToken: Attribute.String & Attribute.Private;
        confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
        blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
        role: Attribute.Relation<'plugin::users-permissions.user', 'manyToOne', 'plugin::users-permissions.role'>;
        groups: Attribute.Relation<'plugin::users-permissions.user', 'manyToMany', 'api::group.group'>;
        address: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'api::address.address'>;
        UUID: Attribute.UID<
            undefined,
            undefined,
            {
                'uuid-format': '^[A-Za-z0-9]{32}$';
            }
        > &
            Attribute.CustomField<
                'plugin::strapi-advanced-uuid.uuid',
                {
                    'uuid-format': '^[A-Za-z0-9]{32}$';
                }
            >;
        imageProfile: Attribute.Relation<
            'plugin::users-permissions.user',
            'oneToOne',
            'api::image-profile.image-profile'
        >;
        ownedGroups: Attribute.Relation<'plugin::users-permissions.user', 'oneToMany', 'api::group.group'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiAddressAddress extends Schema.CollectionType {
    collectionName: 'addresses';
    info: {
        singularName: 'address';
        pluralName: 'addresses';
        displayName: 'Address';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        postal_code: Attribute.String & Attribute.Required;
        country: Attribute.String & Attribute.Required;
        city: Attribute.String & Attribute.Required;
        street_name: Attribute.String & Attribute.Required;
        alias: Attribute.String;
        type: Attribute.String & Attribute.Required;
        longitude: Attribute.Float;
        latitude: Attribute.Float;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::address.address', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::address.address', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiCommentComment extends Schema.CollectionType {
    collectionName: 'comments';
    info: {
        singularName: 'comment';
        pluralName: 'comments';
        displayName: 'Comment';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        author: Attribute.Relation<'api::comment.comment', 'oneToOne', 'plugin::users-permissions.user'>;
        content: Attribute.Text &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        post: Attribute.Relation<'api::comment.comment', 'manyToOne', 'api::post.post'>;
        parentComment: Attribute.Relation<'api::comment.comment', 'manyToOne', 'api::comment.comment'>;
        replyComment: Attribute.Relation<'api::comment.comment', 'oneToMany', 'api::comment.comment'>;
        likes: Attribute.Integer & Attribute.DefaultTo<0>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::comment.comment', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::comment.comment', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiGroupGroup extends Schema.CollectionType {
    collectionName: 'groups';
    info: {
        singularName: 'group';
        pluralName: 'groups';
        displayName: 'Group';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        name: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 3;
            }>;
        posts: Attribute.Relation<'api::group.group', 'oneToMany', 'api::post.post'>;
        users: Attribute.Relation<'api::group.group', 'manyToMany', 'plugin::users-permissions.user'>;
        address: Attribute.Relation<'api::group.group', 'oneToOne', 'api::address.address'>;
        hasAddress: Attribute.Boolean & Attribute.DefaultTo<false>;
        regionRestricted: Attribute.Boolean & Attribute.DefaultTo<false>;
        enabled: Attribute.Boolean & Attribute.DefaultTo<true>;
        description: Attribute.Text &
            Attribute.SetMinMaxLength<{
                maxLength: 100;
            }>;
        userCount: Attribute.Integer & Attribute.DefaultTo<0>;
        imageProfile: Attribute.Relation<'api::group.group', 'oneToOne', 'api::image-profile.image-profile'>;
        isSchool: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
        tags: Attribute.Relation<'api::group.group', 'oneToMany', 'api::tag.tag'>;
        owner: Attribute.Relation<'api::group.group', 'manyToOne', 'plugin::users-permissions.user'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::group.group', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::group.group', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiImageImage extends Schema.CollectionType {
    collectionName: 'images';
    info: {
        singularName: 'image';
        pluralName: 'images';
        displayName: 'Image';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        profiles: Attribute.Relation<'api::image.image', 'oneToMany', 'api::image-profile.image-profile'>;
        image_posts: Attribute.Relation<'api::image.image', 'oneToMany', 'api::image-post.image-post'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::image.image', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::image.image', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiImagePostImagePost extends Schema.CollectionType {
    collectionName: 'image_posts';
    info: {
        singularName: 'image-post';
        pluralName: 'image-posts';
        displayName: 'ImagePost';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        width: Attribute.Integer &
            Attribute.Required &
            Attribute.SetMinMax<{
                min: 128;
            }>;
        height: Attribute.Integer &
            Attribute.Required &
            Attribute.SetMinMax<{
                min: 128;
            }>;
        postName: Attribute.String;
        src: Attribute.String;
        image: Attribute.Relation<'api::image-post.image-post', 'manyToOne', 'api::image.image'>;
        post: Attribute.Relation<'api::image-post.image-post', 'manyToOne', 'api::post.post'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::image-post.image-post', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::image-post.image-post', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiImageProfileImageProfile extends Schema.CollectionType {
    collectionName: 'image_profiles';
    info: {
        singularName: 'image-profile';
        pluralName: 'image-profiles';
        displayName: 'ImageProfile';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        profileName: Attribute.String;
        src: Attribute.String;
        image: Attribute.Relation<'api::image-profile.image-profile', 'manyToOne', 'api::image.image'>;
        user: Attribute.Relation<'api::image-profile.image-profile', 'oneToOne', 'plugin::users-permissions.user'>;
        width: Attribute.Integer &
            Attribute.Required &
            Attribute.SetMinMax<{
                min: 64;
            }>;
        height: Attribute.Integer &
            Attribute.Required &
            Attribute.SetMinMax<{
                min: 64;
            }>;
        group: Attribute.Relation<'api::image-profile.image-profile', 'oneToOne', 'api::group.group'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::image-profile.image-profile', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::image-profile.image-profile', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiPostPost extends Schema.CollectionType {
    collectionName: 'posts';
    info: {
        singularName: 'post';
        pluralName: 'posts';
        displayName: 'Post';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        title: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 3;
            }>;
        author: Attribute.Relation<'api::post.post', 'oneToOne', 'plugin::users-permissions.user'>;
        content: Attribute.Text &
            Attribute.Required &
            Attribute.SetMinMaxLength<{
                minLength: 1;
            }>;
        comments: Attribute.Relation<'api::post.post', 'oneToMany', 'api::comment.comment'>;
        group: Attribute.Relation<'api::post.post', 'manyToOne', 'api::group.group'>;
        image_posts: Attribute.Relation<'api::post.post', 'oneToMany', 'api::image-post.image-post'>;
        likes: Attribute.Integer & Attribute.DefaultTo<0>;
        commentCount: Attribute.Integer & Attribute.DefaultTo<0>;
        views: Attribute.Integer & Attribute.DefaultTo<0>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiSchoolSchool extends Schema.CollectionType {
    collectionName: 'schools';
    info: {
        singularName: 'school';
        pluralName: 'schools';
        displayName: 'School';
        description: '';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        schoolName: Attribute.String;
        schoolEmailDomain: Attribute.String;
        group: Attribute.Relation<'api::school.school', 'oneToOne', 'api::group.group'>;
        school_address: Attribute.Relation<'api::school.school', 'oneToOne', 'api::address.address'>;
        abbreviation: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::school.school', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::school.school', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiTagTag extends Schema.CollectionType {
    collectionName: 'tags';
    info: {
        singularName: 'tag';
        pluralName: 'tags';
        displayName: 'Tag';
    };
    options: {
        draftAndPublish: true;
    };
    attributes: {
        value: Attribute.String &
            Attribute.Required &
            Attribute.Unique &
            Attribute.SetMinMaxLength<{
                minLength: 3;
            }>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        publishedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

declare module '@strapi/types' {
    export module Shared {
        export interface ContentTypes {
            'admin::permission': AdminPermission;
            'admin::user': AdminUser;
            'admin::role': AdminRole;
            'admin::api-token': AdminApiToken;
            'admin::api-token-permission': AdminApiTokenPermission;
            'admin::transfer-token': AdminTransferToken;
            'admin::transfer-token-permission': AdminTransferTokenPermission;
            'plugin::upload.file': PluginUploadFile;
            'plugin::upload.folder': PluginUploadFolder;
            'plugin::content-releases.release': PluginContentReleasesRelease;
            'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
            'plugin::i18n.locale': PluginI18NLocale;
            'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
            'plugin::users-permissions.role': PluginUsersPermissionsRole;
            'plugin::users-permissions.user': PluginUsersPermissionsUser;
            'api::address.address': ApiAddressAddress;
            'api::comment.comment': ApiCommentComment;
            'api::group.group': ApiGroupGroup;
            'api::image.image': ApiImageImage;
            'api::image-post.image-post': ApiImagePostImagePost;
            'api::image-profile.image-profile': ApiImageProfileImageProfile;
            'api::post.post': ApiPostPost;
            'api::school.school': ApiSchoolSchool;
            'api::tag.tag': ApiTagTag;
        }
    }
}
