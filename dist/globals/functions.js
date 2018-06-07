'use strict';

var data = require('../data');
var RPE_Dict = data.RPETable;

var globalEnums = require('../globals/enums');
var Alloy = globalEnums.Alloy;

// Date Examples
var newDate = new Date(2018, 3, 10, 0, 0, 0, 0);
var oneDay = new Date(0, 0, 0, 1, 0, 0, 0);
var thirdDate = new Date(2018, 0, 25, 0, 0, 0, 0);
var now = new Date(Date.now());
var DayValue = 24 * 3600 * 1000;
// Logging Date Examples
// console.log(thirdDate);
// console.log(now);
// console.log(new Date(Date.now() + DayValue));
// console.log(new Date(Date.now()).getDay() + 10);
// Days of Week Enum
var DaysofWeek = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
};
var Enum_Days = [0, 1, 2, 3, 4, 5, 6];

function dateString(date) {
    var MonthDict = {
        1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
        7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"
    };
    var output = "";
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    // var suffix = ""
    output = MonthDict[month] + " " + day + ", " + year;
    return output;
}

function getWorkoutDays(startDate, daysList, level, member, nWorkouts) {
    console.log("   getWorkoutDays start date: ", new Date(startDate));
    console.log("daysList: ", daysList);
    var checkDays = 28;
    var output = [];
    var count = 0;
    var test = [];
    var i = 0;
    while (count < nWorkouts) {
        var _DayTime = startDate.getTime() + DayValue * i;
        var _Day = new Date(_DayTime);
        console.log("_Day: ", _Day);
        var _weekDay = _Day.getDay(); //Sunday is 0, Saturday is 6
        // console.log("   _weekDay: ", _weekDay);
        var _now = new Date(Date.now());
        // console.log("   now: ", now);
        // console.log("   now day: ", now.getDay());
        if (daysList.indexOf(_weekDay) >= 0) {
            output.push(_Day);
            count++;
        }
        i++;
    }
    return output;
}

function missedWorkouts(user, missedDate, newStartDate) {
    // missedWorkouts(user, new Date(2018, 02, 09, 00, 0, 0, 0), new Date(2018, 02, 15, 00, 0, 0, 0));
    var thisDate = newStartDate;
    var workoutDates = user.workoutDates;
    // workoutDates.sort();
    // console.log("\nMISSED WORKOUTS: ");
    // console.log("   missedDate: " + missedDate);
    // console.log("   thisDate: " + thisDate);
    // console.log("\n");
    var missedDates = [];
    var shiftedDates = [];
    var completedDates = [];
    var allRemainingWorkoutDates = [];

    var newStartDate;
    // console.log(workoutDates);
    var shiftPoint = 0;
    var missedPoint = 0;

    for (var WD = 0; WD < workoutDates.length; WD++) {
        var workoutID = WD + 1;
        var _Date = workoutDates[WD];
        // console.log("Date 300: " + _Date);
        // console.log(missedDate);
        if (dateOnly(_Date) >= dateOnly(missedDate) && dateOnly(_Date) < dateOnly(thisDate)) {
            missedDates.push(_Date);
        } else if (dateOnly(_Date) >= dateOnly(thisDate)) {
            shiftedDates.push(_Date);
            // newStartDate = _Date;
            // break;
        } else if (dateOnly(_Date) < dateOnly(missedDate)) {
            completedDates.push(_Date);
        }
    }

    shiftPoint = completedDates.length;
    missedPoint = shiftPoint + missedDates.length;

    // Shallow copy only for first level with Object.assign
    allRemainingWorkoutDates = missedDates.concat(shiftedDates);
    var nextWorkoutDate = shiftedDates[0];
    // console.log("\ndifference: " + Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime())/DayValue) + "\n");

    var newWorkoutDates = [];
    var shiftedDays = Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime()) / DayValue);
    var shiftedTimeVal = shiftedDays * DayValue;

    for (var WD = 0; WD < allRemainingWorkoutDates.length; WD++) {
        var _Date = allRemainingWorkoutDates[WD];
        var newDate = new Date(_Date.getTime() + shiftedTimeVal);
        newWorkoutDates.push(newDate);
    }
    newWorkoutDates = completedDates.concat(newWorkoutDates);
    return newWorkoutDates;
}

function dateOnly(dateInput) {
    var returnDate = dateInput;
    returnDate.setHours(0);
    returnDate.setMinutes(0);
    returnDate.setSeconds(0);
    returnDate.setMilliseconds(0);
    return returnDate;
}
// var Test = getWorkoutDays(new Date(Date.now()), [1, 2, 3, 4, 5, 6, 7], 1, "", 12);
// console.log(Test);
// console.log(Date.now());
function getMax(weight, reps, RPE) {
    var Estimate = 0;
    var Percentage = RPE_Dict[RPE][reps - 1];
    Estimate = weight * 100 / Percentage;
    // return Estimate - (Estimate % 5);
    return Math.round(Estimate);
}

function getWeight(max, reps, RPE) {
    var Estimate = 0;
    if (!(RPE in RPE_Dict) || !Number.isInteger(reps) || Number.isNaN(max)) {
        return 0;
    }
    var Percentage = RPE_Dict[RPE][reps - 1];
    Estimate = max * Percentage / 100;
    return Estimate - Estimate % 5;
}

function getPattern(sub, exerciseName) {
    var pattern = {};
    var Sets = sub.sets;
    var EType = sub.exerciseType;
    pattern.number = sub.number;
    pattern.type = EType;
    pattern.reps = sub.reps;
    pattern.alloy = sub.alloy;

    pattern.name = exerciseName;
    pattern.setList = [];
    pattern.sets = Sets;
    pattern.workoutType = sub.type;
    // Alloy Condition
    if (pattern.alloy) {
        pattern.alloyreps = sub.alloyreps;
        pattern.alloystatus = Alloy.None;
        pattern.sets -= 1;
    }
    // Name Exceptions Condition        
    if (pattern.type == "Med Ball") {
        pattern.type = "Medicine Ball";
    } else if (pattern.type == "Vert Pull") {
        pattern.type = "UB Vert Pull";
    }

    if (pattern.workoutType == "stop") {
        pattern.stop = true;
        pattern.specialValue = sub.specialValue;
        pattern.specialString = sub.specialValue + " RPE";
        Sets = 1;
        pattern.sets = 1;
        pattern.specialStage = 0;
    } else if (pattern.workoutType == "drop") {
        pattern.drop = true;
        pattern.specialValue = sub.specialValue;
        pattern.specialString = sub.specialValue + " %";
        pattern.dropRPE = sub.RPE;
        pattern.sets = 1;
        pattern.specialStage = 0;
    }

    if (sub.RPE) {
        pattern.RPE = sub.RPE;
    }

    for (var i = 0; i < Sets; i++) {
        // console.log(pattern.name, sub.reps);
        var Reps = sub.reps;
        var RPE = sub.RPE;
        // Check for RPE Ranges
        if (sub.RPE == null) {
            // console.log("null RPE");
            if (sub.RPERange.length > 0) {
                // console.log(sub.RPERange);
                RPE = sub.RPERange[0] + "-" + sub.RPERange[1];
                pattern.RPE = RPE;
            } else if (sub.repsList.length > 0) {
                // console.log(sub.repsList[i]);
                Reps = parseInt(sub.repsList[i]);
                RPE = sub.RPEList[i];
            } else {
                RPE = "---";
            }
        }
        pattern.setList.push({
            SetNum: i + 1,
            Weight: null,
            RPE: null,
            SuggestedRPE: RPE,
            Reps: Reps,
            // Tempo: [null, null, null],
            Filled: false
        });
    }
    return pattern;
}

module.exports = {
    getPattern: getPattern,
    getMax: getMax,
    getWeight: getWeight,
    getWorkoutDays: getWorkoutDays,
    missedWorkouts: missedWorkouts,
    dateOnly: dateOnly,
    dateString: dateString
};