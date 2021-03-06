"use strict";

var _enums = require("../globals/enums");

var axios = require("axios");

var globalFuncs = require("../globals/functions");
var getMax = globalFuncs.getMax;
var getWeight = globalFuncs.getWeight;

var maxStopSets = 3;
var maxDropSets = 3;

async function saveWorkout(body, userInstance, vWID) {
  var submit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var lastSets = {};
  var allWorkouts = userInstance.workouts;
  var thisWorkout = allWorkouts[vWID];
  if (submit) {
    thisWorkout.Completed = true;
  }
  var selectedPatterns = allWorkouts[vWID].Patterns;
  var allStats = userInstance.stats;
  for (var K in body) {
    var inputCode = K.split("|");

    if (!K.includes("|") || !inputCode || inputCode[0].startsWith("g")) {
      continue;
    }

    var patternID = parseInt(inputCode[0]); //Number (index + 1)
    var patternIndex = patternID - 1;

    var thisPattern = selectedPatterns[patternIndex];

    var _EType = thisPattern.type; //Getting undefined error
    var _nSets = thisPattern.sets;

    var inputType = inputCode[1];
    var setNum = parseInt(inputCode[2]);
    var setIndex = setNum - 1;

    var setDict = thisPattern.setList[setIndex];

    var input = parseInt(body[K]);

    var thisStats = allStats[_EType];

    // Getting Input types: Weight, RPE, Tempo, Reps
    if (inputType == "W" && input && setNum <= _nSets) {
      setDict.Weight = parseInt(body[K]);
      if (setDict.RPE || thisPattern.workoutType == "carry" || thisPattern.noRPE) {
        setDict.Filled = true;
      }
    } else if (inputType == "RPE" && input && setNum <= _nSets && body[K] != "0" && parseInt(body[K]) != 0) {
      // Stop & drop first-set case: prevent first set from being the stop, first set from NOT being drop
      // STOP: FIRST SET MUST NOT BE STOP RPE
      // DROP: FIRST SET MUST BE DROP RPE
      if (setNum == 1) {
        //SpecialStage == 0
        if (thisPattern.workoutType == "stop" && (parseFloat(body[K]) >= parseFloat(thisPattern.specialValue) || parseFloat(body[K]) < parseFloat(thisPattern.RPE))) {
          continue;
        } else if (thisPattern.workoutType == "drop" && parseFloat(body[K]) < parseFloat(thisPattern.dropRPE)) {
          continue;
        }
      }

      setDict.RPE = body[K];
      if (setDict.Weight) {
        setDict.Filled = true;
      }
      if (thisPattern.workoutType == "bodyweight" && setDict.Reps) {
        setDict.Filled = true;
      }
    } else if (inputType.includes("T") && input && setNum <= _nSets) {
      setDict.Tempo.push(parseInt(body[K]));
    } else if (inputType == "Reps") {
      setDict.Reps = parseInt(body[K]);
      if (thisPattern.workoutType == "bodyweight" && setDict.RPE) {
        console.log("395");
        setDict.Filled = true;
      }
    }

    // Check if last set
    if (setNum == _nSets) {
      if (!(_EType in lastSets)) {
        lastSets[_EType] = {
          Tempo: [],
          Name: thisPattern.name,
          Reps: setDict.Reps,
          Alloy: thisPattern.alloy,
          AlloyReps: thisPattern.alloyreps,
          ID: patternID
        };
      }
      if (inputType == "W") {
        lastSets[_EType].Weight = parseInt(body[K]);
      } else if (inputType == "RPE") {
        lastSets[_EType].RPE = body[K];
        if (thisPattern.drop && thisPattern.specialStage) {
          lastSets[_EType].Weight = thisPattern.dropWeight;
        }
      } else if (inputType.includes("T")) {
        lastSets[_EType].Tempo.push(parseInt(body[K]));
      }
    }
    // Check if alloy
    else if (inputCode[2] == "Alloy") {
        var RepPerformance = parseInt(body[K]);
        thisPattern.alloyperformed = RepPerformance;

        if (submit) {
          if (RepPerformance >= thisPattern.alloyreps) {
            thisStats.Status = _enums.Alloy.Passed;
            thisPattern.alloystatus = _enums.Alloy.Passed;
          } else {
            thisStats.Status = _enums.Alloy.Failed;
            thisPattern.alloystatus = _enums.Alloy.Failed;
          }

          var setDescription = RepPerformance + " Reps x " + thisPattern.alloyweight + " lbs @ " + 10 + " RPE (Alloy) " + allStats[_EType].Status.string;

          thisStats.LastSet = setDescription;
          thisPattern.LastSet = setDescription;
          thisStats.Name = thisPattern.name;
        }
      }
  }

  for (var EType in lastSets) {
    var Val = lastSets[EType];
    var lastSetStat = allStats[EType];
    // If last set was filled completely
    if (Val.Weight && Val.RPE && Val.Reps) {
      var setDescription = Val.Reps + " Reps x " + Val.Weight + " lbs @ " + Val.RPE + " RPE";
      var lastSetPattern = selectedPatterns[Val.ID - 1];
      // Stop & Drop Sets
      //STOP SETS - starting RPE is pattern.RPE, stop RPE is pattern.specialValue
      if (lastSetPattern.stop) {
        var startingRPE = parseFloat(lastSetPattern.RPE);
        var stopRPE = parseFloat(lastSetPattern.specialValue);

        if (lastSetPattern.specialStage == 0) {
          //Stop RPE has not been hit
          // Non-stop-RPE case
          if (lastSetPattern.sets <= maxStopSets + 1 && parseFloat(Val.RPE) < stopRPE) {
            lastSetPattern.sets += 1;
            lastSetPattern.setList.push({
              SetNum: lastSetPattern.sets,
              Weight: null,
              RPE: null,
              Reps: lastSetPattern.reps,

              Filled: false
            });
          }
          // Stop-RPE case
          else if (lastSetPattern.sets > 1) {
              lastSetPattern.specialStage += 1;
            } else {
              continue;
            }
        }
      }
      //DROP SETS
      else if (lastSetPattern.drop) {
          if (lastSetPattern.specialStage == 0) {
            lastSetPattern.specialStage += 1;
            lastSetPattern.dropWeight = Math.round((100 - lastSetPattern.specialValue) / 100 * Val.Weight);
            lastSetPattern.sets += 1;
            lastSetPattern.setList.push({
              SetNum: lastSetPattern.sets,
              Weight: lastSetPattern.dropWeight,
              RPE: null,
              SuggestedRPE: lastSetPattern.dropRPE,
              Reps: lastSetPattern.reps,
              Filled: false
            });
            // }
          } else if (lastSetPattern.specialStage == 1) {
            if (lastSetPattern.sets <= maxDropSets && parseFloat(Val.RPE) < lastSetPattern.dropRPE) {
              lastSetPattern.sets += 1;
              lastSetPattern.setList.push({
                SetNum: lastSetPattern.sets,
                Weight: lastSetPattern.dropWeight,
                RPE: null,
                SuggestedRPE: lastSetPattern.dropRPE,
                Reps: lastSetPattern.reps,
                Filled: false
              });
            } else {
              lastSetPattern.specialStage += 1;
            }
          }
        }

      lastSetStat.LastSet = setDescription;
      lastSetStat.Name = thisPattern.name;
      lastSetPattern.LastSet = setDescription;

      console.log("	Calculating new max with inputs: " + Val.Weight + ", " + Val.Reps + ", " + Val.RPE);
      var newMax = getMax(Val.Weight, Val.Reps, Val.RPE);
      console.log("	New MAX: " + getMax(Val.Weight, Val.Reps, Val.RPE));

      lastSetStat.Max = newMax;
      lastSetPattern.Max = newMax;

      // Alloy Set Case
      if (Val.Alloy) {
        var AlloyReps = Val.AlloyReps;
        var AlloyWeight = getWeight(newMax, AlloyReps, 10);

        lastSetPattern.alloyweight = AlloyWeight;
        lastSetPattern.alloystatus = _enums.Alloy.Testing;
        lastSetStat.Status = _enums.Alloy.Testing;
        if (submit) {
          lastSetPattern.alloystatus = _enums.Alloy.Unfinished;
          lastSetStat.Status = _enums.Alloy.Unfinished;
        }
      }
    }
  }

  userInstance.workouts = allWorkouts;

  if (submit) {
    userInstance.stats = allStats;
  }
  var squatStatus = userInstance.stats["Squat"].Status;
  var benchStatus = userInstance.stats["UB Hor Push"].Status;
  var hingeStatus = userInstance.stats["Hinge"].Status;

  var copiedStats = userInstance.stats;

  copiedStats["Level Up"].Squat = squatStatus;
  copiedStats["Level Up"].UBHorPush = benchStatus;
  copiedStats["Level Up"].Hinge = hingeStatus;

  if (squatStatus.value == 1 && benchStatus.value == 1 && hingeStatus.value == 1) {
    copiedStats["Level Up"].Status = _enums.Alloy.Passed;
  } else if (squatStatus == _enums.Alloy.Failed || benchStatus == _enums.Alloy.Failed || hingeStatus == _enums.Alloy.Failed) {
    copiedStats["Level Up"].Status = _enums.Alloy.Failed;
  } else if (squatStatus == _enums.Alloy.None || squatStatus == _enums.Alloy.Testing || benchStatus == _enums.Alloy.None || benchStatus == _enums.Alloy.Testing || hingeStatus == _enums.Alloy.None || hingeStatus == _enums.Alloy.Testing) {
    copiedStats["Level Up"].Status = _enums.Alloy.Testing;
  }

  if (submit) {
    userInstance.stats = copiedStats;
  }

  userInstance.workouts = allWorkouts;
  await userInstance.save();
}

module.exports = {
  saveWorkout: saveWorkout
};