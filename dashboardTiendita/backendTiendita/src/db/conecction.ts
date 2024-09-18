const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u700514341_tienditaDB', 'u700514341_tiendita', 'QXHwGzM5d2pc#TV', {
  host: 'srv1294.hstgr.io',
  dialect: 'mysql'
});
sequelize.authenticate();

export default sequelize;


