"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.vueStats = vueStats;
exports.getVueStat = getVueStat;
exports.vueProgress = vueProgress;
function vueStats(JSON) {
    var output = [];
    console.log("vueStats from other page");
    for (var EType in JSON) {
        if (EType != "Level Up" && (EType == "Hinge" || EType == "Squat" || EType == "UB Hor Push")) {
            output.push(getVueStat(EType, JSON[EType]));
        }
    }
    return output;
}

function getVueStat(EType, JSONStat) {
    var vueStat = {
        value: false
    };
    console.log("getVueStat from other page test");
    vueStat.exerciseType = EType;
    vueStat.exerciseName = JSONStat.Name;
    vueStat.lastSet = JSONStat.LastSet;
    vueStat.max = JSONStat.Max;
    // vueStat.exerc
    vueStat.alloyVal = JSONStat.Status.value;
    if (JSONStat.Status.value == 1) {
        vueStat.alloyResult = "PASSED";
    } else if (JSONStat.Status.value == -1) {
        vueStat.alloyResult = "FAILED";
    } else {
        vueStat.alloyResult = "---";
    }
    return vueStat;
}

function vueProgress(JSONStats) {
    console.log("vueProgress from other page");
    var output = {
        coreExerciseTableItems: [],
        secondaryExerciseTableItems: []
    };
    output.coreExerciseTableItems.push(getVueStat("UB Hor Push", JSONStats["UB Hor Push"]));
    output.coreExerciseTableItems.push(getVueStat("Squat", JSONStats["Squat"]));
    output.coreExerciseTableItems.push(getVueStat("Hinge", JSONStats["Hinge"]));
    output.levelUpTotal = JSONStats["Level Up"];
    output.levelUpVal = output.levelUpTotal.Status.value;
    for (var EType in JSONStats) {
        if (EType != "UB Hor Push" && EType != "Squat" && EType != "Hinge" && EType != "Level Up") output.secondaryExerciseTableItems.push(getVueStat(EType, JSONStats[EType]));
    }
    return output;
}