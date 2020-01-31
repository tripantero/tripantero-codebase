const {Model, Schema, Optional} = require('./model');

module.exports = new Model('event', new Schema({
    title: String,
    timeHeld: String,
    image_url: Optional(String),
    place: Optional(String),
    event_author: String,
    description: String,
    date_created: Date,
    participantId: Optional([String]),
    peopleId: Optional([String])
}));