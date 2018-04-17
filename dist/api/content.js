'use strict';

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _apiFunctions = require('./apiFunctions');

var _levelupMessages = require('../content/levelupMessages');

var _tutorialContent = require('../content/tutorialContent');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get("/level-up-messages", function (req, res) {
    res.json(_levelupMessages.LevelUpMesssages);
});

router.get("/tutorial", function (req, res) {
    res.json(_tutorialContent.tutorialContentList);
    // res.send(tutorialContentList[0].content);
});

module.exports = router;