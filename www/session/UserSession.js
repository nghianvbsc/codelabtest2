"use strict";

const langSession = new (require('./intalize/Session'))('user-session');

module.exports = {
    saveUser(session, user) {
        langSession.saveSession(session, user);
    },

    getUser(session) {
        return langSession.getSession(session);
    }
};