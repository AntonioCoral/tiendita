"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('u350903543_superdb', 'u350903543_userdb', '0:#Fd7]Ru', {
    host: 'srv1780.hstgr.io',
    dialect: 'mysql'
});
sequelize.authenticate();
exports.default = sequelize;
