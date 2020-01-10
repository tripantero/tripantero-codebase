const {Model, Schema, Optional} = require('./model');

module.exports = new Model('sessioncl', new Schema({
    username: String,
    role: String,
    email: String,
    password: String,
    date: {
        registered: Date,
        lastLogin: Optional(Date),
        lastVisit: Optional(Date)
    },
    listEventsCreatedId: Optional([String]),
    listJoinedEventId: Optional([String])
}));