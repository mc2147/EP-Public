"use strict";

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

var Sequelize = require("sequelize");
var data = require("../data");
var models = require("./index");
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

var AllWorkouts = data.AllWorkouts;

var Workouts1 = data.Workouts1;
var Workouts2 = data.Workouts2;
var Workouts3a = data.Workouts3a;
var Workouts3b = data.Workouts3b;
var Workouts4a = data.Workouts4a;
var Workouts4b = data.Workouts4b;
var AllTemplates = {
  1: Workouts1,
  2: Workouts2,
  3: {
    1: Workouts3a,
    2: Workouts3b
  },
  4: {
    1: Workouts4a,
    2: Workouts4b
  }
};
function DestroyAll() {
  WorkoutTemplate.destroy({
    where: {}
  }).then(() => {
    return SubWorkoutTemplate.destroy({
      where: {}
    });
  });
}
function DestroyTemplates(LGroup, BlockNum) {
  return WorkoutTemplate.destroy({
    where: {
      levelGroup: LGroup,
      block: BlockNum
    }
  });
}

export async function MakeTemplates(LGroup, BlockNum) {
  var TemplateJSON = AllTemplates[LGroup];
  if (BlockNum != 0) {
    TemplateJSON = TemplateJSON[BlockNum];
  }
  if (LGroup == 3 && BlockNum == 2) {
  }
  for (var W in TemplateJSON.Templates) {
    for (var D in TemplateJSON.Templates[W]) {
      await CreateWorkoutTemplate(LGroup, W, D, BlockNum, TemplateJSON);
    }
  }
}
export async function CreateWorkoutTemplate(
  levelGroup,
  week,
  day,
  blockNum,
  JSONTemplates
) {
  var WorkoutBlock = JSONTemplates;
  var thisTemplate = WorkoutBlock.Templates[week][day];
  var thisPatterns = thisTemplate.Patterns;
  var thisID = thisTemplate.ID;
  let [template, created] = await WorkoutTemplate.findOrCreate({
    where: {
      levelGroup: levelGroup,
      week: week,
      day: day,
      block: blockNum
    }
  });
  await template.save();
  template.number = thisID;
  template.NSubworkouts = 0;

  for (var K in thisPatterns) {
    var ID = K;
    let [sub, subCreated] = await SubWorkoutTemplate.findOrCreate({
      where: {
        number: ID,
        fk_workout: template.id
      }
    });

    template.NSubworkouts++;
    var Key = sub.number;
    var thisSub = thisPatterns[Key];

    await setPatternInfo(thisSub, sub);

    await template.save();
  }
  await template.save();
}

async function setPatternInfo(PatternJSON, SubTemplate) {
  SubTemplate.exerciseType = PatternJSON.ExerciseType.trim();
  SubTemplate.sets = PatternJSON.Sets;
  // Split Set Handling
  // REP
  if (Array.isArray(PatternJSON.Reps)) {
    SubTemplate.repsList = PatternJSON.Reps;
    SubTemplate.RPEList = PatternJSON.RPE;
  } else {
    //Not Split Set
    SubTemplate.reps = PatternJSON.Reps;
    SubTemplate.type = "normal";

    if (_typeof(PatternJSON.Reps) == _typeof("string")) {
      if (PatternJSON.Reps.includes("Seconds")) {
        SubTemplate.reps = parseInt(PatternJSON.Reps.split(" ")[0]);
      } else if (PatternJSON.Reps == "Bodyweight" || PatternJSON.Reps == "#") {
        SubTemplate.reps = null;
        SubTemplate.type = "bodyweight";
      }
    }
    // Range RPE Handling
    if (_typeof(PatternJSON.RPE) == _typeof("string")) {
      var Split = PatternJSON.RPE.split("-");
      var RPE1 = parseFloat(Split[0]);
      var RPE2 = parseFloat(Split[1]);
      SubTemplate.RPERange = [RPE1, RPE2];
    } else {
      SubTemplate.RPE = PatternJSON.RPE;
    }
  }
  // Special Set Handling
  if (PatternJSON.Type) {
    SubTemplate.type = PatternJSON.Type.toLowerCase();
  }
  if (PatternJSON.Alloy) {
    SubTemplate.alloy = PatternJSON.Alloy;
    SubTemplate.alloyreps = PatternJSON.AlloyReps;
    SubTemplate.type = "alloy";
  } else if (PatternJSON.Deload && PatternJSON.Deload != 0) {
    SubTemplate.type = "deload";
    SubTemplate.deload = PatternJSON.Deload;
  }
  // Stop & Drop Sets
  if (SubTemplate.type == "stop") {
    SubTemplate.specialValue = PatternJSON.StopRPE;
  } else if (SubTemplate.type == "drop") {
    SubTemplate.specialValue = PatternJSON.DropValue;
  }
  //Carry
  if (
    PatternJSON.Seconds ||
    PatternJSON.ExerciseType == "Carry" ||
    SubTemplate.exerciseType == "Carry"
  ) {
    SubTemplate.type = "carry";
    if (!PatternJSON.Reps) {
      SubTemplate.reps = PatternJSON.Seconds;
    } else {
      SubTemplate.reps = PatternJSON.Reps;
    }
  }
  // Setting Description
  SubTemplate.description =
    SubTemplate.exerciseType +
    " " +
    SubTemplate.sets +
    " x " +
    SubTemplate.reps +
    " RPE: " +
    SubTemplate.RPE +
    " Alloy: " +
    SubTemplate.alloy +
    " Deload: " +
    SubTemplate.deload +
    " Type: " +
    SubTemplate.type;
  await SubTemplate.save();
}
