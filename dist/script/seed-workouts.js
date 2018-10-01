"use strict";

var testJS = require("./test");

var _require = require("../models/generateTemplates"),
    MakeTemplates = _require.MakeTemplates,
    CreateWorkoutTemplate = _require.CreateWorkoutTemplate;

var data = require("../data");

async function generateTemplates() {
  await MakeTemplates(1, 0);
  await MakeTemplates(2, 0);
  await MakeTemplates(3, 1);
  await MakeTemplates(3, 2);
  await MakeTemplates(4, 1);
  await MakeTemplates(4, 2);
}

generateTemplates().catch(function (err) {
  console.error(err.message);
  console.error(err.stack);
  process.exitCode = 1;
}).then(function () {
  console.log("finished seeding workouts");
});