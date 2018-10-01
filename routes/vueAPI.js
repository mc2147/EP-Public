var vueConvert = {
  Date: function(date) {
    var output = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    output = year + "-" + month + "-" + day;
    return output;
  }
};

function getVueInfo(refDict) {
  console.log("getVueInfo getting called (line 21)");
  var _Completed = false;
  if (refDict.Completed) {
    _Completed = true;
  }
  var vueColumns = [
    ["Reps/Time(s)", 1],
    ["Weights", 2],
    ["RPE", 3],
    ["Tempo", 4]
  ];
  var vueSubworkouts = [];
  console.log("PATTERNS:");
  for (var N = 0; N < refDict.Patterns.length; N++) {
    var Pattern = refDict.Patterns[N];
  }
  for (var N = 0; N < refDict.Patterns.length; N++) {
    var Pattern = refDict.Patterns[N];

    var fixedList = [];
    var filledList = [];
    var inputList = [];
    var tempoList = [];

    var repLists = {
      inputs: []
    };
    var weightLists = {
      inputs: []
    };
    var RPELists = {
      inputs: []
    };
    var tempoLists = {
      inputs: []
    };

    for (var L = 0; L < Pattern.sets; L++) {
      var set = Pattern.setList[L];

      // 4 Input Statuses: Empty, Placeholder, Filled, Fixed
      var setNum = L + 1;
      var repDict = {
        value: set.Reps,
        status: "Fixed",
        code: Pattern.number + "|Reps|" + (L + 1)
      };
      var weightDict = {
        value: set.Weight,
        status: "Empty",
        code: Pattern.number + "|W|" + (L + 1)
      };
      if (
        set.suggestedWeight &&
        Pattern.workoutType != "bodyweight" &&
        Pattern.workoutType != "deload"
      ) {
        weightDict.suggestedWeight = set.suggestedWeight;
      } else {
        weightDict.suggestedWeight = "--";
      }

      var RPEDict = {
        value: set.RPE,
        status: "Empty",
        suggested: Pattern.RPE,
        code: Pattern.number + "|RPE|" + (L + 1)
        // test: "test",
      };
      if (set.SuggestedRPE && set.SuggestedRPE != "---") {
        RPEDict.suggested = set.SuggestedRPE;
      }
      let tempoStringVal = "";
      let tempoVal = ["", "", ""];
      if (Pattern.hasTempo) {
        tempoStringVal = "3|2|X";
        tempoVal = ["3", "2", "X"];
      }
      var tempoDict = {
        stringValue: tempoStringVal,
        value: tempoVal,
        status: "Fixed",
        code: Pattern.number + "|T|" + (L + 1)
      };
      if (set.Filled) {
        weightDict.status = "Filled";
        RPEDict.status = "Filled";
      }
      //Alloy Patterns
      if (Pattern.alloy) {
        repDict.status = "Fixed";
        if (set.Filled) {
          if (Pattern.alloystatus.value != 0) {
            weightDict.status = "Fixed";
            RPEDict.status = "Fixed";
          } else {
            weightDict.status = "Filled";
            RPEDict.status = "Filled";
          }
        } else {
          weightDict.status = "Empty";
          RPEDict.status = "Empty";
        }
      }
      //Stop & Drop Patterns
      else if (Pattern.stop || Pattern.drop) {
        if (set.Filled) {
          weightDict.status = "Fixed";
          RPEDict.status = "Fixed";
        } else if (Pattern.drop && setNum == 1) {
          RPEDict.status = "Empty";
        }
        if (Pattern.stop && setNum == 1) {
          RPEDict.value = Pattern.RPE; //Needs to be between start RPE and stop RPE
          RPEDict.status = "Fixed";
        } else if (Pattern.stop && setNum > 1) {
          weightDict.status = "Fixed";
          console.log("weightDict.value pre: ", weightDict.value);
          weightDict.value = Pattern.stopWeight;
          console.log("weightDict.value post: ", weightDict.value);
        }
        if (Pattern.drop && Pattern.specialStage >= 1) {
          weightDict.status = "Fixed";
        }
      }
      //Bodyweight Workouts
      else if (Pattern.workoutType == "bodyweight") {
        weightDict.status = "Fixed";
        weightDict.value = "Bodyweight";
        if (set.Filled) {
          repDict.value = set.Reps;
          repDict.status = "Filled";
        } else {
          repDict.value = "";
          repDict.status = "Empty";
        }
      }
      // Carry
      if (Pattern.workoutType == "carry") {
        repDict.value = repDict.value + " (s)";
        RPEDict.value = "---";
        RPEDict.status = "Fixed";
      }
      if (Pattern.noRPE) {
        RPEDict.value = "---";
        RPEDict.status = "Fixed";
      }

      if (_Completed || refDict.noedits) {
        repDict.status = "Fixed";
        weightDict.status = "Fixed";
        RPEDict.status = "Fixed";
        tempoDict.status = "Fixed";
      }
      repLists.inputs.push(repDict);
      weightLists.inputs.push(weightDict);
      RPELists.inputs.push(RPEDict);
      tempoList.push(tempoDict);

      //Edge cases here (fixed)
    }

    // Final Alloy Set
    if (Pattern.alloy) {
      var repDict = {
        value: Pattern.alloyreps + "+",
        status: "Fixed",

        code: Pattern.number + "|X|" + "Alloy",
        alloy: true
      };
      var weightDict = {
        value: "Alloy Weight",
        status: "Fixed",
        code: Pattern.number + "|W|" + "Alloy",
        alloy: true
      };
      var RPEDict = {
        value: 10,
        status: "Fixed",
        code: Pattern.number + "|RPE|" + "Alloy",
        alloy: true
      };
      var alloyTempo = {
        value: ["3", "2", "X"],
        stringValue: "3|2|X",
        status: "Fixed",
        code: Pattern.number + "|T|" + "Alloy",
        alloy: true
        // RPELists.fixed.push(10);
      };

      let alloyPerformed = "";
      if (Pattern.alloyperformed) {
        alloyPerformed = Pattern.alloyperformed + " ";
      }
      if (Pattern.alloystatus.value == 0) {
      } else if (Pattern.alloystatus.value == 2) {
        repDict.status = "Empty";
        repDict.value = null;
        console.log("Pattern.alloyperformed: ", Pattern.alloyperformed);
        if (Pattern.alloyperformed || Pattern.alloyperformed == 0) {
          repDict.status = "Filled";
          repDict.value = Pattern.alloyperformed;
        }
        weightDict.value = Pattern.alloyweight;
        weightDict.status = "Fixed";
      } else if (Pattern.alloystatus.value == 1) {
        repDict.value = alloyPerformed + "PASSED";
        repDict.status = "Fixed";
        weightDict.value = Pattern.alloyweight;
        weightDict.status = "Fixed";
      } else if (Pattern.alloystatus.value == -1) {
        repDict.value = alloyPerformed + "FAILED";
        repDict.status = "Fixed";
        weightDict.value = Pattern.alloyweight;
        weightDict.status = "Fixed";
      } else if (Pattern.alloystatus.value == 3) {
        repDict.value = "UNFINISHED";
        repDict.status = "Fixed";
        weightDict.value = Pattern.alloyweight;
        weightDict.status = "Fixed";
      }
      if (_Completed || refDict.noedits) {
        repDict.status = "Fixed";
        weightDict.status = "Fixed";
        RPEDict.status = "Fixed";
        alloyTempo.status = "Fixed";
      }
      repLists.inputs.push(repDict);
      weightLists.inputs.push(weightDict);
      RPELists.inputs.push(RPEDict);
      tempoList.push(alloyTempo);
    }

    var dataTableItems = [];
    //One per row
    for (var I = 0; I < vueColumns.length; I++) {
      //Vue Syntax
      var item = vueColumns[I];
      var rowDict = {
        id: item[1],
        name: item[0],
        value: false
      };
      //Which row case
      if (item[1] == 4) {
        //Tempo
        rowDict.inputs = tempoList;
      } else if (item[1] == 3) {
        //RPE
        rowDict.inputs = RPELists.inputs;
      } else if (item[1] == 2) {
        //Weights
        rowDict.inputs = weightLists.inputs;
      } else if (item[1] == 1) {
        //Reps
        rowDict.inputs = repLists.inputs;
      }
      dataTableItems.push(rowDict); //One per ROW
    }
    //One per PATTERN
    var subDict = {
      noRPE: Pattern.noRPE,
      name: Pattern.name,
      type: Pattern.type,
      class: Pattern.workoutType,
      // RPEOptions: ["1", "2", "3", "4", "5-6", "7", "8", "9-10"],
      RPEOptions: [1, 2, 3, 4, 5, 6, 7, 7.5, 8, 8.5, 9, 9.5, 10],
      dataTableItems: dataTableItems, //Rows -> 1 row per SET
      sets: Pattern.sets //N Sets
    };
    // var repString =
    // if ()
    subDict.describer =
      Pattern.sets + " x " + Pattern.reps + " @ " + Pattern.RPE + " RPE";
    if (!Pattern.RPE) {
      subDict.describer = Pattern.sets + " x " + Pattern.reps;
    }
    subDict.number = Pattern.number;
    subDict.submitWarning = false;
    if (!_Completed && !refDict.noedits) {
      if (Pattern.workoutType == "stop" && Pattern.specialStage < 1) {
        subDict.hasButton = true;
        subDict.submitWarning = true;
        subDict.submitWarningMessage =
          "You have unfinished Strength Stop sets " +
          '(click the "Get Next Set" button to receive your next Strength Stop set). Are you sure you want to submit?';
        subDict.buttonDisplay = "Get Next Set";
        subDict.buttonName = "getNextSet|Stop|" + Pattern.number;
      } else if (Pattern.workoutType == "drop" && Pattern.specialStage < 2) {
        subDict.hasButton = true;
        subDict.buttonDisplay = "Get Next Set";
        subDict.submitWarning = true;
        subDict.submitWarningMessage =
          "You have unfinished Strength Stop sets " +
          '(click the "Get Next Set" button to receive your next Strength Drop set). Are you sure you want to submit?';
        subDict.buttonName = "getNextSet|Drop|" + Pattern.number;
      } else if (Pattern.alloy && Pattern.alloystatus.value == 0) {
        subDict.hasButton = true;
        subDict.buttonDisplay = "Get Alloy Set";
        subDict.submitWarning = true;
        subDict.submitWarningMessage =
          "You have unfinished Alloy workouts " +
          '(click the "Get Alloy Set" button to receive your Alloy set). Are you sure you want to submit?';
        subDict.buttonName = "getNextSet|Alloy|" + Pattern.number;
      }
    }
    //
    if (Pattern.alloy) {
      subDict.alloyReps = Pattern.alloyreps;
    }
    if (
      Pattern.suggestedWeightString &&
      Pattern.workoutType != "bodyweight" &&
      Pattern.workoutType != "deload"
    ) {
      subDict.suggestedWeightString = Pattern.suggestedWeightString;
      subDict.simpleWeightString = Pattern.simpleWeightString;
    }

    if (Pattern.hasVideo) {
      subDict.hasVideo = true;
      subDict.videoURL = Pattern.videoURL;
      subDict.selectedVideo = Pattern.selectedVideo;
    }
    if (Pattern.workoutType == "bodyweight") {
      subDict.describer =
        Pattern.sets + " sets @ " + Pattern.RPE + " RPE (bodyweight)";
      if (Pattern.noRPE) {
        subDict.describer =
          Pattern.sets + " x " + Pattern.reps + " (bodyweight)";
      }
    }
    if (Pattern.workoutType == "stop" || Pattern.workoutType == "drop") {
      var _Type = "Stop";
      var _TargetRPE = Pattern.specialValue;
      if (Pattern.workoutType == "stop") {
        subDict.minRPE = parseFloat(Pattern.RPE); //Starting RPE
        subDict.maxRPE = Pattern.specialValue;
        subDict.describer += " (Strength Stop)";
        subDict.longDescriber =
          "Strength Stop @ " +
          Pattern.specialValue +
          " RPE from 1 x " +
          Pattern.reps +
          " @ " +
          Pattern.RPE +
          " RPE";
        subDict.describer = "Strength Stop @ " + Pattern.specialValue + " RPE";
        if (Pattern.specialStage == 0 && Pattern.sets == 1) {
          var newRPEOptions = [];
          subDict.RPEOptions.forEach(function(elem) {
            if (elem >= subDict.minRPE && elem < subDict.maxRPE) {
              newRPEOptions.push(elem);
            }
          });
          subDict.RPEOptions = newRPEOptions;
        } else {
          var newRPEOptions = [];
          subDict.RPEOptions.forEach(function(elem) {
            if (elem >= subDict.minRPE && elem <= subDict.maxRPE) {
              newRPEOptions.push(elem);
            }
          });
          subDict.RPEOptions = newRPEOptions;
        }
      } else if (Pattern.workoutType == "drop") {
        _Type = "Drop";
        _TargetRPE = Pattern.RPE;
        subDict.minRPE = parseFloat(Pattern.dropRPE);
        subDict.describer += " (Strength Drop)";
        subDict.longDescriber =
          "Strength Drop (" +
          Pattern.specialValue +
          " %) @ " +
          Pattern.RPE +
          " RPE from 1 x " +
          Pattern.reps;
        subDict.describer =
          "Strength Drop (" +
          Pattern.specialValue +
          " %) @ " +
          Pattern.RPE +
          " RPE";
        if (Pattern.specialStage == 0) {
          var newRPEOptions = [];
          subDict.RPEOptions.forEach(function(elem) {
            if (elem >= subDict.minRPE) {
              newRPEOptions.push(elem);
            }
          });
          subDict.RPEOptions = newRPEOptions;
        } else {
        }
      }
      if (Pattern.sets == 3) {
        console.log("Set warning!! Strength stop/drop sets at 5");
        subDict.warnNextSet = true;
        subDict.warningText =
          "You're close to the maximum number of sets for this workout! " +
          ("Strength " +
            _Type +
            " workouts are designed to be completed within a maximum of 5 sets. ") +
          ("If you haven't hit the target RPE of " +
            _TargetRPE +
            " yet, consider reducing the amount of rest ") +
          "in between sets or checking that your RPE entries are accurate!";
      }
    }
    if (!subDict.warnNextSet) {
      subDict.warnNextSet = false;
      subDict.warningText = "";
    }

    if (Pattern.alloy) {
      subDict.describer = "ALLOY SET";
      subDict.alloyStage = Pattern.alloystatus.value;
    }
    if (Pattern.workoutType == "carry") {
      subDict.describer += " second carry";
    }
    subDict.specialDescriber = Pattern.specialDescriber;

    console.log("pushign subDict: ");
    subDict.testing = true;
    vueSubworkouts.push(subDict);
  }

  return {
    test: true,
    date: vueConvert.Date(refDict["thisWorkoutDate"]),

    describer: refDict.Describer,
    subworkouts: vueSubworkouts,
    completed: _Completed
  };
}

module.exports = {
  vueConvert,
  getVueInfo
};
