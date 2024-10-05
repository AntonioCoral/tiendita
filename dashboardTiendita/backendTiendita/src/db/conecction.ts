const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('', '', '', {
  host: '',
  dialect: 'mysql'
});
sequelize.authenticate();

export default sequelize;


