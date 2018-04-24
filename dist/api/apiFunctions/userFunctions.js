'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.signupUser = signupUser;
exports.assignLevel = assignLevel;

var _functions = require('../../globals/functions');

var _data = require('../../data');

var _enums = require('../../globals/enums');

var _models = require('../../models');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

function generateSalt() {
    return _bcryptjs2.default.genSaltSync(saltRounds);
}
function generateHash(password, salt) {
    return _bcryptjs2.default.hashSync(password, salt, null);
}

async function signupUser(input) {
    var P1 = input.P1;
    var P2 = input.P2;
    var username = input.username;
    var salt = generateSalt();
    if (P1 == P2) {
        var hashedPassword = generateHash(P1, salt);
        var newUser = await _models.User.create({
            // id: 29,
            username: username,
            salt: salt,
            password: hashedPassword
        });
        if (newUser) {
            return {
                newUser: newUser,
                session: {
                    userId: newUser.id,
                    username: username,
                    User: newUser
                }
            };
        } else {
            return {
                error: true,
                status: "error"
            };
        }
    } else {
        return false;
    }
}

async function assignLevel(_User, input) {
    var squatWeight = input.squatWeight,
        benchWeight = input.benchWeight,
        RPEExp = input.RPEExp,
        bodyWeight = input.bodyWeight;

    if (squatWeight < benchWeight) {
        _User.level = 1;
    } else if (squatWeight > bodyWeight * 1.5 && benchWeight > bodyWeight && RPEExp) {
        _User.level = 11;
    } else {
        _User.level = 6;
    }
    await _User.save();
}