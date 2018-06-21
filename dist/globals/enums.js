"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var RPE_Dict = {
	10: [100, 94, 91, 89, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57],
	9.5: [97, 94, 91, 89, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56],
	9: [97, 94, 91, 89, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56],
	8.5: [94, 91, 89, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55],
	8: [91, 89, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54],
	7.5: [88, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53],
	7: [86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52],
	6: [84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51.5],
	5: [84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51.5],
	4: [82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51.5, 51],
	3: [80, 78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51.5, 51, 50],
	2: [78, 76, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51.5, 51, 50],
	1: [77, 75, 73, 71, 70, 68, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51.5, 51, 50]
};

function getMax(weight, reps, RPE) {
	var Estimate = 0;
	var Percentage = RPE_Dict[RPE][reps - 1];
	Estimate = weight * 100 / Percentage;
	return Estimate - Estimate % 5;
}

function getWeight(max, reps, RPE) {
	var Estimate = 0;
	var Percentage = RPE_Dict[RPE][reps - 1];
	Estimate = max * Percentage / 100;
	return Estimate - Estimate % 5;
}

var Exercise_Types = ["UB Hor Push", "UB Vert Push", "UB Hor Pull", "UB Vert Pull", "Hinge", "Squat", "LB Uni Push", "Ant Chain", "Post Chain", "Carry", "Iso 1", "Iso 2", "Iso 3", "Iso 4"];

var Level_Groups = {
	1: "1-5",
	2: "6-10",
	3: "11-15",
	4: "16-25"
};

var WorkoutSample = {
	Week: 1, Day: 1, LevelGroup: 1, NumSubWorkouts: 5,
	SubWorkouts: {
		1: { ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7 },
		2: { ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7, Alloy: true, AlloyReps: 8 },
		3: { ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
		4: { ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
		5: { ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7 } }
};

var Exercise_Names = {
	1: {
		"UB Hor Push": "DB Bench Press",
		"UB Vert Push": "KB/DB neutral 1/2 Kn OHP",
		"UB Hor Pull": "DB Row",
		"UB Vert Pull": "CC Neutral Pulldown",
		"Hinge": "DB RDL",
		"Squat": "Goblet Squat to Box",
		"LB Uni Push": "1L Leg Press",
		"Ant Chain": "Deadbug",
		"Post Chain": "DB Hip Thrust",
		"Carry": "DB Farmer Carry",
		"Iso 1": "DB Biceps Curl",
		"Iso 2": null,
		"Iso 3": "CC Face Pull",
		"Iso 4": "DB Lateral Raise"
	}
};

var Alloy = exports.Alloy = {
	None: { value: 0, name: "None", code: "N", string: "None" },
	Testing: { value: 2, name: "Test", code: "T", string: "Testing" },
	Unfinished: { value: 3, name: "Unfinished", code: "U", string: "Unfinished" },
	Passed: { value: 1, name: "Passed", code: "P", string: "Passed" },
	Failed: { value: -1, name: "Failed", code: "F", string: "Failed" }
};

var DaysofWeekDict = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday"

	// export * from …;
	// module.exports = 
};exports.Level_Groups = Level_Groups;
exports.WorkoutSample = WorkoutSample;
exports.Exercise_Names = Exercise_Names;
exports.Exercise_Types = Exercise_Types;
exports.getMax = getMax;
exports.getWeight = getWeight;
exports.DaysofWeekDict = DaysofWeekDict;