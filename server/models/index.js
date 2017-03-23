'use strict';

const fs    = require('fs'),
	path      = require('path'),
	Sequelize = require('sequelize'),
	basename  = path.basename(module.filename),
	env       = process.env.NODE_ENV || 'development',
	config    = require(__dirname + '/../config/config.json')[env],
	db        = {};

let sequelize;
if (config.use_env_constiable) {
	sequelize = new Sequelize(process.env[config.use_env_constiable]);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
