'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define('Attendee', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    rsvp: DataTypes.BOOLEAN
  }, {});
  Attendee.associate = function(models) {
    Attendee.belongsTo(models.Event, { foreignKey: 'eventId' });
  };
  return Attendee;
};
