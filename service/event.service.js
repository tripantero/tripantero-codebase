const {Model, Schema, Optional} = require('./model');

module.exports = new Model('session-database', new Schema({
    title: String,
    description: String,
    image_url: Optional(String),
    timeHeld: Date,
    date_created: Date,
    participantId: Optional([String]),
    peopleId: Optional([String])
}));