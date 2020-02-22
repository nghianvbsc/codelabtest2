"use strict";

module.exports = {
    twitter: {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },

    facebook: {
        clientID: '', // your App ID
        clientSecret: '', // your App Secret
        callbackURL: '',
        scope: ['id', 'displayName', 'link', 'photos', 'emails'],
        processHandle: function (token, refreshToken, profile, done) {
            /**
             * Kiểm tra id , insert tạo usẻ hoặc cập nhật dữ liệu cho user
             */
            // facebookId: profile.id
            // email: email = profile.emails ? profile.emails[0].value : '';
            // displayName: profile.displayName
            // picture: profile.photos[0].value
            // done(null, user)
        },
        doneHandle: function (error, user, req, res, next) {
            /**
             * Kiểm tra lỗi hoặc thành công, chuyển đến trang sau khi thành công hoặc lỗi
             */
            if (error) {

            } else {

            }
        }
    },

    google: {
        clientID: '',
        clientSecret: '',
        loginUrl: '',
        callbackURL: '',
        scope: ['profile', 'email'],
        processHandle: function (token, refreshToken, profile, done) {
            /**
             * Kiểm tra id , insert tạo usẻ hoặc cập nhật dữ liệu cho user
             */
            // googleId: profile.id
            // email: profile.emails[0].value
            // email: profile.emails[0].value
            // firstName: profile.name.givenName
            // lastName: profile.name.familyName
            /**
             *  let imageUrl = '';
             *  if (profile.photos && profile.photos.length) {
             *        imageUrl = profile.photos[0].value;
             *  }
             */
            // done(null, user)
        },
        doneHandle: function (error, user, req, res, next) {
            /**
             * Kiểm tra lỗi hoặc thành công, chuyển đến trang sau khi thành công hoặc lỗi
             */
            if (error) {

            } else {

            }
        }
    }
};