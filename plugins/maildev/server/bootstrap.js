'use strict';

const MailDev = require('maildev');

let localMailDev;

module.exports = ({ strapi }) => {
  if (!localMailDev) {
    localMailDev = new MailDev({
      web: 1300,
      smtp: 10250
    });
    localMailDev.listen();
  }
};
