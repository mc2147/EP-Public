var data = require('../data');
var RPE_Dict = data.RPETable;

// Date Examples
var newDate = new Date(2018, 3, 10, 00, 0, 0, 0);
var oneDay = new Date(0, 0, 0, 1, 0, 0, 0);
var thirdDate = new Date(2018, 0, 25, 00, 0, 0, 0);
var now = new Date(Date.now());
var DayValue = 24*3600*1000;
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
	6: "Saturday",
}
Enum_Days = [0, 1, 2, 3, 4, 5, 6]

function getWorkoutDays (startDate, daysList, level, member, nWorkouts) {
	var checkDays = 28;
	var output = [];
	var count = 0;
	// console.log(daysList);
	var test = [];
	// console.log(test.indexOf(3));
	for (var i = 1; i <= 31, count < 12; i ++) {
		var _DayTime = startDate.getTime() + DayValue*i;
		var _Day = new Date(_DayTime);
		var _weekDay = _Day.getDay(); //Sunday is 0, Saturday is 6
		if (daysList.indexOf(_weekDay) >= 0) {
			// console.log("Day #" + i + " " + _Day + " " + _weekDay + " " + DaysofWeek[_weekDay]);
			output.push(_Day);
			count ++;
		}
	}
	// console.log("Count: " + count);
	return output;
}

function missedWorkouts (user, missedDate, newStartDate) {
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
    
    for (var WD = 0; WD < workoutDates.length; WD ++) {
        var workoutID = WD + 1;
        var _Date = workoutDates[WD];
        // console.log("Date 300: " + _Date);
        // console.log(missedDate);
        if (dateOnly(_Date) >= dateOnly(missedDate)
        && dateOnly(_Date) < dateOnly(thisDate)) {
            missedDates.push(_Date);
        }
        else if (dateOnly(_Date) >= dateOnly(thisDate)) {
            shiftedDates.push(_Date);
            // newStartDate = _Date;
            // break;
        }
        else if (dateOnly(_Date) < dateOnly(missedDate)) {
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
    var shiftedDays = Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime())/DayValue);
    var shiftedTimeVal = shiftedDays*DayValue;

    for (var WD = 0; WD < allRemainingWorkoutDates.length; WD ++) {
        var _Date = allRemainingWorkoutDates[WD];
        var newDate = new Date(_Date.getTime() + shiftedTimeVal);
        newWorkoutDates.push(newDate);       
    }
    newWorkoutDates = completedDates.concat(newWorkoutDates);
    // console.log(workoutDates);
    // console.log("shiftedTimeVal: " + shiftedTimeVal);
    // console.log(newWorkoutDates);
    
    // console.log("old workout dates: " + workoutDates.length);
    for (var x = 0; x < workoutDates.length; x ++) {
        // console.log(x);
        // console.log(workoutDates[x], "Workout #: " + (x + 1));
        // console.log("Workout #: " + (x + 1));
    }
    // console.log("\nmissedDate: " + missedDate);
    // console.log("new start date: " + thisDate);
    // console.log("\nNew Workout Dates:"); 
    for (var x = 0; x < newWorkoutDates.length; x ++) {
        // console.log(newWorkoutDates[x], "Workout #: " + (x + 1));
        // console.log("Workout #: " + (x + 1));
        if (x == completedDates.length - 1) {
            // console.log("   Shift Starts");
        }
        else if (x == missedPoint - 1) {
            // console.log("   Missed Starts");
        }
    }

    // console.log("\n");    
    return newWorkoutDates;
}

function dateOnly (dateInput) {
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
	Estimate = weight*100/Percentage;
	return Estimate - (Estimate % 5);
}

function getWeight(max, reps, RPE) {
	var Estimate = 0;
	var Percentage = RPE_Dict[RPE][reps - 1];
	Estimate = max*Percentage/100;
	return Estimate - (Estimate % 5);
}

module.exports = {
    getMax,
    getWeight,
    getWorkoutDays,
    missedWorkouts,
    dateOnly,
}  