const {Model, Schema, Optional} = require('./model');

module.exports = new Model('sessioncl', new Schema({
    username: String,
    role: String,
    email: String,
    password: String,
    date: {
        registered: Date,
        lastLogin: Optional(Date),
        lastLogout: Optional(Date)
    },
    listEventsCreatedId: Optional([String]),
    listJoinedEventId: Optional([String]),
    sessionID: Optional(String)
}));