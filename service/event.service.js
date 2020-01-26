const {Model, Schema, Optional} = require('./model');

module.exports = new Model('event', new Schema({
    event_author: String,
    title: String,
    description: String,
    image_url: Optional(String),
    timeHeld: String,
    date_created: Date,
    participantId: Optional([String]),
    peopleId: Optional([String])
}));