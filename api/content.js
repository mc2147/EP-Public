import session from "express-session";
import Promise from "bluebird";
import bodyParser from "body-parser";
import express from "express";

import { LevelUpMesssages } from "../content/levelupMessages";
import { tutorialContentList } from "../content/tutorialContent";

let router = express.Router();

router.get("/level-up-messages", function(req, res) {
  res.json(LevelUpMesssages);
});

router.get("/tutorial", function(req, res) {
  res.json(tutorialContentList);
});

module.exports = router;
