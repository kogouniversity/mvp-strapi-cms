'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('maildev')
      .service('myService')
      .getWelcomeMessage();
  },
});
