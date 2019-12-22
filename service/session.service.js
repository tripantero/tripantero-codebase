const {Model, Schema, Optional} = require('./model');

module.exports = new Model('session-database', new Schema({
    username: Optional(String),
    role: String,
    email: String,
    password: String,
    date: {
        lastLogin: Optional(Date),
        lastVisit: Optional(Date)
    },
    listEventsCreatedId: Optional([String]),
    listJoinedEventId: Optional(String),
    loginToken: Optional(String)
}));