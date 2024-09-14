'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    location: DataTypes.STRING
  }, {});
  Event.associate = function(models) {
    Event.hasMany(models.Attendee, { foreignKey: 'eventId' });
  };
  return Event;
};
