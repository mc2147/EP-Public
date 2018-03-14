// var models = require('../models');
// var Exercise = models.Exercise
// var WorkoutTemplate = models.WorkoutTemplate;
// var Workout = models.Workout;
// var User = models.User;

// var moment = require('moment');

console.log("test");

var newDate = new Date(2018, 3, 10, 00, 0, 0, 0);

var oneDay = new Date(0, 0, 0, 1, 0, 0, 0);

console.log(newDate);
console.log(oneDay);

// var thirdDate = moment().add(1, 'days').calendar();     

var thirdDate = new Date(2018, 0, 25, 00, 0, 0, 0);
var now = new Date(Date.now());

var DayValue = 24*3600*1000;

console.log(thirdDate);
console.log(now);
console.log(new Date(Date.now() + DayValue));
console.log(new Date(Date.now()).getDay() + 10);

var DaysofWeek = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday",
}

function Generate_Workouts(startDate, daysList, level, member, nWorkouts) {
	var checkDays = 28;
	var output = [];
	var count = 0;
	console.log(daysList);
	var test = [];
	console.log(test.indexOf(3));
	for (var i = 1; i <= 31, count < 12; i ++) {
		var _DayTime = startDate.getTime() + DayValue*i;
		var _Day = new Date(_DayTime);
		var _weekDay = _Day.getDay(); //Sunday is 0, Saturday is 6
		if (daysList.indexOf(_weekDay) >= 0) {
			console.log("Day #" + i + " " + _Day + " " + _weekDay + " " + DaysofWeek[_weekDay]);
			output.push(_Day);
			count ++;
		}
	}
	console.log("Count: " + count);
	return output;
}

// WorkoutTemplate.findOrCreate(
//    {
//     where: {
//         levelGroup: 1,
//         week: 1,
//         day: 1
//     }
// }).spread((template, created) => {


var Test = Generate_Workouts(new Date(Date.now()), [1, 2, 3, 4, 5, 6, 7], 1, "", 12);
console.log(Test);

console.log(Date.now());

Enum_Days = [0, 1, 2, 3, 4, 5, 6]

module.exports = {
	Generate_Workouts,
}  