var Promise = require("bluebird");
var bodyParser = require('body-parser');
var globals = require('../globals');
var Group1Workouts = require('../WorkoutGroup1');
var G1KeyCodes = Group1Workouts.G1KeyCodes;
// var globalFunctions = require('../globalFunctions')

var getMax = globals.getMax;
var getWeight = globals.getWeight;

var express = require('express');
var router = express.Router();
var models = require('../models');
var Exercise = models.Exercise

var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

var Group1WDtoID = models.Group1WDtoID;

var Workout = models.Workout;
var User = models.User;

var ETypes = globals.Exercise_Types;
var ENames = globals.Exercise_Names;

var UserLevel = 1

var Alloy = globals.Alloy;
// var Alloy = {
// 	None: {value: 0, name: "None", code: "N", string: "None"},
// 	Testing: {value: 2, name: "Test", code: "T", string: "Testing"},
// 	Passed: {value: 1, name: "Passed", code: "P", string: "Passed"},
// 	Failed: {value: -1, name: "Failed", code: "F", string: "Failed"},
// }
// await 
// var thisUser;

// thisUser = user;
// G_thisStats = thisUser.stats;
// thisPatterns = thisUser.workouts.thisPatterns;
// userFound = true;
// Ref Dict
function userRefDict(user) {
	var output = {};
	output["User"] = user;
	output["Level"] = user.level;
	output["Stats"] = user.stats;
	output["Workouts"] = user.workouts;
	
	output["thisWorkoutID"] = user.currentWorkout.ID;
	output["thisWorkout"] = user.currentWorkout;

	output["thisWorkoutDate"] = user.workoutDates[user.currentWorkout.ID - 1];
	// output["thisWorkoutDate"] = user.workouts[user.currentWorkout.ID].Date;
	output["thisPatterns"] = user.workouts.thisPatterns;
	output["levelGroup"] = 1; //Manual for now
	return output
}
// Referenced (global) information:
	// thisUser.level
	// thisUser's current workout
	// thisUser's current workout ID
	// thisUser's stats
	// currentWorkoutID
// Dictionary Refs:
	// G_UserInfo["Level"];
	// G_UserInfo["Stats"];
	// G_UserInfo["thisPatterns"];

	// G_UserInfo["thisWorkoutID"];
	// G_UserInfo["thisWorkout"];

	// G_UserInfo["Workouts"];

function dateString(date) {
	var MonthDict = {
		1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
		7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December",
	}
	var output = "";
	var year = date.getFullYear();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	// var suffix = ""
	output = MonthDict[month] + " " + day + ", " + year;
	return output
}

var userFound = false; 
var thisUser; 
var thisPatterns;
var G_thisStats;
var G_UserInfo;

User.findById(1).then(user => {
	G_UserInfo = userRefDict(user);
	thisUser = G_UserInfo["User"];
	G_thisStats = G_UserInfo["Stats"];
	thisPatterns = G_UserInfo["thisPatterns"];
	console.log("Creating User Ref Dict: ");
	userFound = true;
});

	// How to store old workouts:
		// Add patterns list to PastWorkouts dict, indexed by week/day
			// {Week: , Day: , Completed : , Patterns : }
		// Fill up PastWorkouts dict on workout generation
			// 

var selectedWeek = 1;
var selectedDay = 1;
var WeekList = [1, 2, 3, 4];
var DayList = [1, 2, 3];

router.get('/', function(req, res
	// , next
	) {	
	// res.redirect('/');
	if (!thisUser) {
		// Loading
		render();
	}
	// G_UserInfo = userRefDict(thisUser);

	console.log("ROUTE.GET STARTS ");
	console.log("GLOBALS: ");
	console.log("G_UserInfo: ");

	// G_UserInfo["thisWorkoutID"]
	// selectedweek
	// selectedDay

	var TemplateID = G_UserInfo["thisWorkoutID"];
	var _Level = G_UserInfo["Level"];
	var wDateIndex = G_UserInfo["thisWorkoutID"] - 1;

	G_UserInfo["thisWorkoutDate"] = G_UserInfo["User"].workoutDates[wDateIndex];
	// Make a refresh dictionary function later
	var thisworkoutDate = G_UserInfo["Workouts"][TemplateID].Date;
	console.log(G_UserInfo["thisWorkoutDate"]);
	// console.log(G_UserInfo["User"].workoutDates);
	// console.log(G_UserInfo["thisWorkoutID"]);
	// console.log(G_UserInfo["User"].workoutDates[G_UserInfo["thisWorkoutID"]]);

	// console.log(G_UserInfo["thisPatterns"]);
	console.log(G_UserInfo["User"].workouts);
	// console.log("User.workouts[TemplateID].Patterns:");
	// console.log(G_UserInfo["User"].workouts[TemplateID].Patterns);
	if (G_UserInfo["User"].workouts[TemplateID].Patterns.length != 0) {
		G_UserInfo["thisPatterns"] = G_UserInfo["User"].workouts[TemplateID].Patterns;
		G_UserInfo["thisWorkout"] = G_UserInfo["User"].workouts[TemplateID];
		render();
		return
	}

	// G_UserInfo["User"].workouts[TemplateID].Patterns = 
	var Patterns = [];

	// if (!WorkouthasData) {};

	WorkoutTemplate.findOne({
		where: {
	        levelGroup: G_UserInfo["levelGroup"],
	        week: selectedWeek,
	        day: selectedDay			
		}
	}).then(template => {
		var SubWorkouts = template.getSubWorkouts().then(subs => {
			subs.sort(function(a, b) {
				return a.number - b.number
			});
			subs.forEach(elem => {
				// Elem information
				var patternInstance = {};
				var N = elem.number;
				var EType = elem.exerciseType;
				var Sets = elem.sets;
				// Adding info to patterInstance
				patternInstance.number = N;
				patternInstance.type = elem.exerciseType;
				patternInstance.reps = elem.reps;
				patternInstance.RPE = elem.RPE;
				patternInstance.alloy = elem.alloy;
				if (patternInstance.alloy) {
					patternInstance.alloyreps = elem.alloyreps;
					Sets -= 1;
				}
				patternInstance.name = ENames[_Level][elem.exerciseType];	
				patternInstance.setList = [];
				patternInstance.sets = Sets;
				// Adding setDicts to patterInstance.setList -> []
				if (!thisUser.workouts.patternsLoaded) {
					for (var i = 0; i < Sets; i ++) {
						patternInstance.setList.push({
							SetNum: i + 1,
							Weight: null,
							RPE: null,
							Tempo: [null, null, null],
							Filled: false,
						});
					}
					G_UserInfo["thisPatterns"].push(patternInstance);
					G_UserInfo["User"].workouts[TemplateID].Patterns.push(patternInstance);
					G_UserInfo["User"].save();
				}
				// Some backwards referencing was going on here
			});

			// console.log("\nWATCH THIS!!! \n");
			// console.log("thisUser.workouts.thisPatterns:");
			// for (var P = 0; P < thisPatterns.length; P ++) {
			// 	var _Pattern = thisPatterns[P];
			// 	console.log("	" + thisPatterns[P].type + ", " + _Pattern.name + ", " 
			// 	+ _Pattern.sets + " x " + _Pattern.reps + ", " + _Pattern.RPE + " RPE, " + (_Pattern.alloy ? "Alloy, " : "Regular, ")
			// 	+ "Set List Count: " + _Pattern.setList.length);
			// }
			// console.log("\n");

			G_UserInfo["User"].workouts.patternsLoaded = true;
			G_UserInfo["User"].save();
			render();
		});
	});
	
	function render() {
		console.log("RENDER FUNCTION");
		// console.log("thisPatterns: " + thisPatterns.length);

		// console.log(G_UserInfo["thisWorkoutDate"]);
		// console.log(typeof G_UserInfo["thisWorkoutDate"]);
		var changeWorkoutList = [];
		
		for (var W = 0; W < WeekList.length; W++) {
			for (var D = 0; D < DayList.length; D++) {
				var _W = WeekList[W];
				var _D = DayList[D];
				var wID = Group1WDtoID[_W][_D];
				var date = dateString(G_UserInfo["User"].workoutDates[wID - 1]);
				changeWorkoutList.push({Week: _W, Day: _D, Date: date});
			}
		}

		res.render('main', 
		{
			ETypes: globals.Exercise_Types,
			// Patterns: UserStats.CurrentWorkout.Patterns,
			// ExerciseStats: UserStats.ExerciseStats,			
			
			thisDate: dateString(G_UserInfo["thisWorkoutDate"]),

			Patterns: G_UserInfo["thisPatterns"],
			UserStats: G_UserInfo["Stats"],			
			levelUp: G_UserInfo["Stats"]["Level Up"],
			UBpressStat: G_UserInfo["Stats"]["Squat"],
			squatStat: G_UserInfo["Stats"]["UB Hor Pull"],
			hingeStat: G_UserInfo["Stats"]["Hinge"],

			TestDict: {Test1: "Test1", Test2: "Test2"},
			selectedWeek,
			selectedDay,
			allWorkouts: G_UserInfo["Workouts"],
			WeekList,
			DayList,
			selectWorkoutList: changeWorkoutList,
		});
	}

});


router.post('/', function(req, res) {
	var inputCodes = req.body["inputCodes"];
	console.log("selectForm: " + req.body.selectForm);

	var outputs = {}	

	// if (req.body.NextBtn) {
	// 	var nextWorkoutID = G_UserInfo["thisWorkoutID"] + 1;
	// 	console.log("NEXT WORKOUT ID: " + nextWorkoutID); 
	// 	console.log("NEXT WORKOUT Week/Day: " + G1KeyCodes[nextWorkoutID].Week + ", " + G1KeyCodes[nextWorkoutID].Day); 
	// }

	if (req.body.changeWorkoutBtn || req.body.NextBtn) {
		G_UserInfo["User"].workouts.patternsLoaded = false;
		G_UserInfo["thisPatterns"] = [];
		if (req.body.changeWorkoutBtn) {
			var selectedWD = req.body.changeWorkoutSelect.split("|");
			console.log(selectedWD);
			var _W = parseInt(selectedWD[0]);
			var _D = parseInt(selectedWD[1]);
			selectedWeek = _W;
			selectedDay = _D;
			G_UserInfo["thisWorkoutID"] = Group1WDtoID[_W][_D];
		}
		else if (req.body.NextBtn) {
			var nextWorkoutID = G_UserInfo["thisWorkoutID"] + 1;
			if (nextWorkoutID > 12) {
				res.redirect('/');
				// Test user here
			}
			G_UserInfo["thisWorkoutID"] = nextWorkoutID;
			G_UserInfo["User"].save();
			console.log("NEXT WORKOUT ID: " + nextWorkoutID); 
			console.log("NEXT WORKOUT Week/Day: " + G1KeyCodes[nextWorkoutID].Week + ", " + G1KeyCodes[nextWorkoutID].Day); 
			selectedWeek = G1KeyCodes[nextWorkoutID].Week;
			selectedDay = G1KeyCodes[nextWorkoutID].Day;
		}
		res.redirect('/');
	}

	if(req.body.ResetBtn) {
		// reset();
		res.redirect('/');
	}

	if (req.body.SubmitBtn) {
		console.log("completing workout...");
		var usr = G_UserInfo["User"];
		// console.log(usr.workouts);
		var wID = G_UserInfo["thisWorkoutID"];
		// usr.currentworkoutID;
		console.log(wID);
		usr.workouts[wID].Completed = true;
		usr.save();
		// G_UserInfo["thisWorkout"].Completed = true;
		// G_UserInfo["User"].workouts[]
		// G_UserInfo["User"].save();
	}

	for (var K in req.body) {
		var inputCode = K.split("|");
		if (!K.includes("|") || !inputCode) {
			continue;
		}
		var inputType = inputCode[1];
		var patternID = parseInt(inputCode[0]); //Number (index + 1)
		var patternIndex = patternID - 1;
		var setNum = parseInt(inputCode[2]);
		var setIndex = setNum - 1;

		var thisPattern = G_UserInfo["thisPatterns"][patternIndex];
		var _EType = thisPattern.type;
		var _nSets = thisPattern.sets;
		var setDict = thisPattern.setList[setIndex];

		var input = parseInt(req.body[K]);
		var G_Stats = G_UserInfo["Stats"];
		var thisStats = G_Stats[_EType];


		if (inputType == "W" 
			&& input && setNum <= _nSets) {
			setDict.Weight = parseInt(req.body[K]);
			if (setDict.RPE) {
				setDict.Filled = true;
			} 
		}
		else if (inputType == "RPE" 
			&& input && setNum <= _nSets) {
			setDict.RPE = parseInt(req.body[K]);
			if (setDict.Weight) {
				setDict.Filled = true;
			}
		}
		else if (inputType.includes("T") 
			&& input && setNum <= _nSets) {
			setDict.Tempo.push(parseInt(req.body[K]));
		}

		if (setNum == _nSets) {
			if (!(_EType in outputs)) {
				outputs[_EType] = {
					Tempo: [],
					Name: thisPattern.name, 
					Reps: thisPattern.reps,
					Alloy: thisPattern.alloy,
					AlloyReps: thisPattern.alloyreps,
					ID: patternID,
				};
			}
			if (inputType == "W") {
				outputs[_EType].Weight = parseInt(req.body[K]);
			}
			else if (inputType == "RPE") {
				outputs[_EType].RPE = parseInt(req.body[K]);
			}
			else if (inputType.includes("T")) {
				outputs[_EType].Tempo.push(parseInt(req.body[K]));
			}
		}
		else if (inputCode[2] == "Alloy") {
			var RepPerformance = parseInt(req.body[K]);
			thisPattern.alloyperformed = RepPerformance;
			if (RepPerformance >= thisPattern.alloyreps) {
				
				thisStats.Status = Alloy.Passed;
				thisPattern.alloystatus = Alloy.Passed;
				
				console.log("ALLOY PASSED");				
			}
			else {
				
				thisStats.Status = Alloy.Failed;
				thisPattern.alloystatus = Alloy.Failed;

				console.log("ALLOY FAILED");				
			}
			
			var setDescription = RepPerformance + " Reps x " + thisPattern.alloyweight 
			+ " lbs @ " + 10 + " RPE (Alloy) " + G_Stats[_EType].Status.string;
			
			thisStats.LastSet = setDescription;
			thisPattern.LastSet = setDescription;

			thisStats.Name = thisPattern.name;
			G_UserInfo["User"].save();
		}
	}

	for (var EType in outputs) {
		var Val = outputs[EType];
		if (Val.Weight && Val.RPE && Val.Reps) {
			var setDescription = Val.Reps + " Reps x " + Val.Weight + " lbs @ " + Val.RPE + " RPE";
			var thisPattern = G_UserInfo["thisPatterns"][Val.ID - 1];

			var statDict = G_UserInfo["Stats"];
			var thisStat = statDict[EType];

			thisStat.LastSet = setDescription; 
			thisStat.Name = thisPattern.name;
			thisPattern.LastSet = setDescription;

			console.log("	Calculating new max with inputs: " + Val.Weight + ", " + Val.Reps + ", " + Val.RPE);
			var newMax = getMax(Val.Weight, Val.Reps, Val.RPE);
			console.log("	New MAX: " + getMax(Val.Weight, Val.Reps, Val.RPE));

			// UserStats.ExerciseStats[EType].Max = newMax;
			G_Stats[EType].Max = newMax;
			thisPattern.Max = newMax;			

			// console.log("	oldMax: " + UserStats.ExerciseStats[EType].Max
			// + " newMax: " + getMax(Val.Weight, Val.Reps, Val.RPE));			
			if (Val.Alloy) {
				var AlloyReps = Val.AlloyReps; 
				// var AlloyWeight = getMax(newMax, AlloyReps, 10);
				var AlloyWeight = getWeight(newMax, AlloyReps, 10);
				console.log("ALLOY SET: " + AlloyReps + " " + AlloyWeight);

				// Use These (BELOW)
				thisPattern.alloyweight = AlloyWeight;
				thisPattern.alloystatus = Alloy.Testing;

				thisStat.Status = Alloy.Testing;

				// console.log("Alloy Show: " + UserStats.CurrentWorkout.Patterns[Val.ID - 1].alloyshow);
				console.log("Alloy Show: " + thisPattern.alloyshow);
			}
		}
	}
	// Check AlloyStatus Here	
	console.log("Alloy Check: ");
	console.log(G_UserInfo["Stats"]["Squat"]);
	console.log(G_UserInfo["Stats"]["UB Hor Push"]);
	console.log(G_UserInfo["Stats"]["Hinge"]);
	
	var squatStatus = G_UserInfo["Stats"]["Squat"].Status;
	var benchStatus = G_UserInfo["Stats"]["UB Hor Push"].Status;
	var hingeStatus = G_UserInfo["Stats"]["Hinge"].Status;

	G_UserInfo["Stats"]["Level Up"].Squat = squatStatus;
	G_UserInfo["Stats"]["Level Up"].UBHorPush = benchStatus;
	G_UserInfo["Stats"]["Level Up"].Hinge = hingeStatus;

	if (squatStatus == Alloy.Passed
		&& benchStatus == Alloy.Passed
		&& hingeStatus == Alloy.Passed) {
		G_UserInfo["Stats"]["Level Up"].Status = Alloy.Passed;
	}
	else if (squatStatus == Alloy.Failed
		|| benchStatus == Alloy.Failed
		|| hingeStatus == Alloy.Failed) {
		G_UserInfo["Stats"]["Level Up"].Status = Alloy.Failed;
	}
	else if (
		(squatStatus == Alloy.None || squatStatus == Alloy.Testing)
		|| (benchStatus == Alloy.None || benchStatus == Alloy.Testing)
		|| (hingeStatus == Alloy.None || hingeStatus == Alloy.Testing)
		) {
		G_UserInfo["Stats"]["Level Up"].Status = Alloy.Testing;
	}

	G_UserInfo["User"].save();

	console.log("Level Up?");
	console.log(G_UserInfo["Stats"]["Level Up"]);

	res.redirect('/');
});





function reset() {
UserStats = {
	Level: 1,
	AlloyPerformed: {
		"UB Hor Push": 0, 
		"UB Vert Push": 0, 
		"UB Hor Pull": 0, 
		"UB Vert Pull": 0, 
		"Hinge": 0,
		"Squat": 0, 
		"LB Uni Push": 0, 
		"Ant Chain": 0, 
		"Post Chain": 0, 
		"Carry": 0, 
		"Iso 1": 0, 
		"Iso 2": 0, 
		"Iso 3": 0, 
		"Iso 4": 0, 		
	},
	ExerciseStats: {
		"UB Hor Push": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"UB Vert Push": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"UB Hor Pull": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"UB Vert Pull": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Hinge": {Status: Alloy.None, Max: 100, LastSet: ""},
		"Squat": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"LB Uni Push": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Ant Chain": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Post Chain": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Carry": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Iso 1": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Iso 2": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Iso 3": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		"Iso 4": {Status: Alloy.None, Max: 100, LastSet: ""}, 
	},
	CurrentSets: {

	},
	CurrentWorkout: {
		Week: 1,
		Day: 1,
		LGroup: 1,
		TemplateID: 1,
	},
	TemplateID: 1,
 }
 return;
}

router.get('/workouts', function(req, res) {

	// WorkoutTemplate.destroy({where: {}});
	// SubWorkoutTemplate.destroy({where: {}});
	// res.render('templates', {});

	var subWorkoutPromises = [];
	var workoutDict = {1: [], 2: [], 3: [], 4: []};
	var subsDict = {1: [], 2: [], 3: [], 4: []};

	WorkoutTemplate.findAll({
		where: {},
		order: [['week', 'ASC'], ['day', 'ASC']],
	}).then(results => {
		results.forEach(elem => {
			if (elem.day == 4) {
				elem.destroy();
			}
			else {
				subWorkoutPromises.push(elem.getSubWorkouts());
			}
		})
		Promise.all(subWorkoutPromises).then(subworkouts => {
			subworkouts.forEach(subList => {
				subList.sort(function(a, b) {
					return a.number - b.number
				});
			});
			// console.log(subworkouts);

			for (var i = 0; i < results.length; i ++) {
				var W = results[i];
				var S = subworkouts[i];
				console.log("Day: " + W.day);
				// console.log(workoutDict[W.day]);
				console.log(S);
				workoutDict[W.day].push(W);
				subsDict[W.day].push(S);
			}

			// var rowNum = results.length/4;
			thisUser.save();
			res.render('templates', {
				// Subworkouts: subworkouts,
				// Workouts: results,
				Subworkouts: subsDict,
				Workouts: workoutDict,
				// rowNum,
			});
		});
	});
});

// 				//.then(subsList => {
// 				//elem.Patterns = subsList;
// 				//console.log(subsList.length);
// 				// WorkoutsList.push(elem);
// 				//console.log("620");
// 		});
// 		console.log("SubWorkouts: ");
// 		WorkoutsList.push(elem);
// 		})
// 		var Patterns = [];
// 	});		
// 	// res.render('templates', 
// 	// {			
// 	// 	Workouts: WorkoutsList,
// 	// });

// })

// NEXT: write user model, handle submitting exercises, changing weights, level up, etc.
// add default handlers
function workoutUpdate(RPE, Weight, Reps, subWorkout, alloy) {
	var EType = subWorkout.exerciseType;
	var oldMax = UserStats.ExerciseStats[EType].Max;
	var newMax = globals.getMax(Weight, Reps, RPE);
	UserStats.ExerciseStats[EType].Max = newMax;
	if (alloy == Alloy.None) {
		//Update Alloy Set
	}
	// UserStats
	//Get next set ready
	//Update user stats (max weight)
	//Update user level	
}

module.exports = router;