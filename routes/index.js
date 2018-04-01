var Promise = require("bluebird");
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var models = require('../models');
	var Exercise = models.Exercise;
	var WorkoutTemplate = models.WorkoutTemplate;
	var SubWorkoutTemplate = models.SubWorkoutTemplate;
	var Workout = models.Workout;
	var User = models.User;

var data = require('../data');
	var G1KeyCodes = data.Workouts1.getWeekDay;
	var Group1WDtoID = data.Workouts1.getID;
	var ExerciseDict = data.ExerciseDict.Exercises;
	var RPE_Dict = data.RPETable;
	// var Group1Workouts = require('../WorkoutGroup1');

var globalEnums = require('../globals/enums');
	var Alloy = globalEnums.Alloy;
	
var globalFuncs = require('../globals/functions');
	var getMax = globalFuncs.getMax;
	var getWeight = globalFuncs.getWeight;

var vueAPI = require('./vueAPI');
	var getVueInfo = vueAPI.getVueInfo;
	var vueConvert = vueAPI.vueConvert;

var workoutHandlers = require('./workoutHandlers');
	var saveWorkout = workoutHandlers.saveWorkout;
	
var UserLevel = 1

var postURL = "postWorkout";
var getURL = "getWorkout";

var levelGroupsDict = {
	// Add Week and Day list here too
	1: [1, 2, 3, 4, 5],
	2: [6, 7, 8, 9, 10],
	3: [11, 12, 13, 14, 15],
	4: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
}

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
// Default Ref Dict
var selectedWeek = 1;
var selectedDay = 1;
var WeekList = [1, 2, 3, 4];
var DayList = [1, 2, 3];

console.log("TEST: "); 

// var viewingWorkoutID = 1;

var SessionDict = {
	viewingWID: 1,
	patternList: [],
}
// thisDate: dateString(G_UserInfo["thisWorkoutDate"]),
// UserDict: G_UserInfo,
// Patterns: G_UserInfo["thisPatterns"],
// UserStats: G_UserInfo["Stats"],			
// levelUp: G_UserInfo["Stats"]["Level Up"],
// UBpressStat: G_UserInfo["Stats"]["Squat"],
// squatStat: G_UserInfo["Stats"]["UB Hor Pull"],
// hingeStat: G_UserInfo["Stats"]["Hinge"],
// RPEOptions: RPE_Dict["Options"],
// TestDict: {Test1: "Test1", Test2: "Test2"},
// selectedWeek,
// selectedDay,
// allWorkouts: G_UserInfo["Workouts"],
// WeekList,
// DayList,
// selectWorkoutList: changeWorkoutList,
// thisLevels: G_UserInfo["thisLevels"],


function userRefDict(user) {
	var output = {};
	output["User"] = user;
	output["Stats"] = user.stats;
	
	output["Workouts"] = user.workouts;
	// var thisWorkoutID = SessionDict.viewingWID; // user.currentWorkoutID;
	var thisWorkoutID = user.currentWorkoutID;
	output["thisWorkoutID"] = user.currentWorkoutID;

	output["Level"] = user.level;
	output["thisWorkout"] = user.workouts[thisWorkoutID];
	selectedWeek = user.workouts[thisWorkoutID].Week;
	selectedDay = user.workouts[thisWorkoutID].Day;
	output["thisWorkoutDate"] = user.workoutDates[user.currentWorkoutID - 1];
	// output["thisWorkoutDate"] = user.workouts[user.currentWorkout.ID].Date;
	output["thisPatterns"] = user.workouts[thisWorkoutID].Patterns;
	// G_UserInfo["User"].workouts[TemplateID].Patterns
	// output["levelGroup"] = 1; //Manual for now
	// console.log("user.levelGroup: ", user.levelGroup);
	output["levelGroup"] = user.levelGroup;
	output["blockNum"] = user.blockNum;
	output["thisLevels"] = levelGroupsDict[user.levelGroup];
	// user.levelGroup; //Manual for now
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

function loadUserInfo(id) {
	return User.findById(id).then(user => {
		// if (user.workouts.loaded) {		
			G_UserInfo = userRefDict(user);
			thisUser = G_UserInfo["User"];
			G_thisStats = G_UserInfo["Stats"];
			thisPatterns = G_UserInfo["thisPatterns"];
			// console.log("Creating User Ref Dict: ");
			userFound = true;
		// }
	});
}

loadUserInfo(1);

router.get('/' + getURL, function(req, res) {
	var workoutDates = [];
	for (var W = 0; W < WeekList.length; W++) {
		for (var D = 0; D < DayList.length; D++) {
			var _W = WeekList[W];
			var _D = DayList[D];
			var wID = Group1WDtoID[_W][_D];
			var date = dateString(G_UserInfo["User"].workoutDates[wID - 1]);
			workoutDates.push({Week: _W, Day: _D, Date: date});
		}
	}

	let vueInfo = getVueInfo(G_UserInfo, workoutDates);
	vueInfo.workoutDates = workoutDates;
	console.log("RES.JSON");
	res.json(vueInfo);
})

router.get('/', function(req, res
	// , next
	) {	
	if (!thisUser) {
		render();
	}

	loadUserInfo(1);

	var TemplateID = G_UserInfo["thisWorkoutID"];

	var _Level = G_UserInfo["Level"];
	var wDateIndex = G_UserInfo["thisWorkoutID"] - 1;
	G_UserInfo["thisWorkoutDate"] = G_UserInfo["User"].workoutDates[wDateIndex];
	// // Make a refresh dictionary function later
	console.log("Loading Patterns: ", G_UserInfo["User"].workouts[TemplateID].Patterns);
	
	var thisworkoutDate = G_UserInfo["Workouts"][TemplateID].Date;
	if (G_UserInfo["User"].workouts[TemplateID].Patterns.length != 0
		// || G_UserInfo["thisPatterns"].length != 0
	) {
		G_UserInfo["thisPatterns"] = G_UserInfo["User"].workouts[TemplateID].Patterns;
		G_UserInfo["thisWorkout"] = G_UserInfo["User"].workouts[TemplateID];
		// let userInfoToSend = getVueInfo(G_UserInfo); 
		// console.log("RES.JSON");
		// res.json(userInfoToSend);
		// G_UserInfo
		render();
		return
	}

	// G_UserInfo["User"].workouts[TemplateID].Patterns = 
	var Patterns = [];

	// if (!WorkouthasData) {};

	WorkoutTemplate.findOne({
		where: {
			levelGroup: G_UserInfo["levelGroup"],
			block: G_UserInfo["User"].blockNum,
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
				var Sets = elem.sets;
				// Adding info to patterInstance
				patternInstance.number = N;
				patternInstance.type = elem.exerciseType;
				patternInstance.reps = elem.reps;
				// patternInstance.RPE = elem.RPE;
				// patternInstance.RPE = "elem.RPE";
				patternInstance.alloy = elem.alloy;

				if (patternInstance.alloy) {
					patternInstance.alloyreps = elem.alloyreps;
					patternInstance.alloystatus = Alloy.None;					
					Sets -= 1;
				}
				
				var EType = elem.exerciseType;
				if (elem.exerciseType == "Med Ball") {
					EType = "Medicine Ball";
				}
				else if (elem.exerciseType == "Vert Pull") {
					EType = "UB Vert Pull";
				} 
				// console.log(EType);

				patternInstance.name = ExerciseDict[EType][_Level].name;	
				patternInstance.setList = [];
				patternInstance.sets = Sets;
				patternInstance.workoutType = elem.type;
				// console.log("elem.type: " + elem.type, elem.exerciseType);
				if (patternInstance.workoutType == "stop") {
					patternInstance.stop = true;
					patternInstance.specialValue = elem.specialValue;
					patternInstance.specialString = elem.specialValue + " RPE";
					Sets = 1;
					patternInstance.sets = 1;
					patternInstance.specialStage = 0;
				}
				else if (patternInstance.workoutType == "drop") {
					patternInstance.drop = true;
					patternInstance.specialValue = elem.specialValue;
					patternInstance.specialString = elem.specialValue + " %";
					Sets = 1;
					patternInstance.sets = 1;
					patternInstance.specialStage = 0;
				}
				// Adding setDicts to patterInstancesetList -> []
				// if (!thisUser.workouts.patternsLoaded) {
				// console.log("repsList: ", elem.repsList);
				for (var i = 0; i < Sets; i ++) {
					var Reps = elem.reps;
					var RPE = elem.RPE;
					// Check for RPE Ranges
					if (elem.RPE == null) {
						// console.log("null RPE");
						if (elem.RPERange.length > 0) {
							// console.log(elem.RPERange);
							RPE = elem.RPERange[0] + "-" + elem.RPERange[1];
						}
						else if (elem.repsList.length > 0) {
							// console.log(elem.repsList[i]);
							Reps = parseInt(elem.repsList[i]);
							RPE = elem.RPEList[i];
						}
						else {
							RPE = "---";							
						}
					}
					patternInstance.setList.push({
						SetNum: i + 1,
						Weight: null,
						RPE: null,
						SuggestedRPE:RPE,
						Reps: Reps,
						// Tempo: [null, null, null],
						Filled: false,
					});
				}
					// G_UserInfo["thisPatterns"].push(patternInstance);
					G_UserInfo["User"].workouts[TemplateID].Patterns.push(patternInstance);
					G_UserInfo["thisPatterns"] = G_UserInfo["User"].workouts[TemplateID].Patterns;
					G_UserInfo["thisWorkout"] = G_UserInfo["User"].workouts[TemplateID];
					G_UserInfo["User"].save();
				// }
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
		var  WorkoutDict = G_UserInfo["User"].workouts;
		// console.log("WorkoutDict", WorkoutDict);
		for (var K in WorkoutDict) {
			var Workout = WorkoutDict[K];
			if (!Workout.ID) {
				continue;
			}
			var _W = Workout.Week;
			var _D = Workout.Day;
			var wID = Workout.ID;
			// var date = G_UserInfo["User"].workoutDates[wID - 1];
			var date = dateString(G_UserInfo["User"].workoutDates[wID - 1]);
			// console.log("date", date, _W, _D, K);
			changeWorkoutList.push({Week: _W, Day: _D, Date: date, ID: wID});		
		}

		// for (var W = 0; W < WeekList.length; W++) {
		// 	for (var D = 0; D < DayList.length; D++) {
		// 		var _W = WeekList[W];
		// 		var _D = DayList[D];
		// 		var wID = Group1WDtoID[_W][_D];
		// 		var date = dateString(G_UserInfo["User"].workoutDates[wID - 1]);
		// 		changeWorkoutList.push({Week: _W, Day: _D, Date: date});
		// 	}
		// }
		
		// for (var W = 0; W < WeekList.length; W++) {
		// 	for (var D = 0; D < DayList.length; D++) {
		// 		var _W = WeekList[W];
		// 		var _D = DayList[D];
		// 		var wID = Group1WDtoID[_W][_D];
		// 		var date = dateString(G_UserInfo["User"].workoutDates[wID - 1]);
		// 		changeWorkoutList.push({Week: _W, Day: _D, Date: date});
		// 	}
		// }

		res.render('main', 
		{
			ETypes: ExerciseDict["Types"],
			// Patterns: UserStats.CurrentWorkout.Patterns,
			// ExerciseStats: UserStats.ExerciseStats,			
			thisWorkoutID: G_UserInfo["thisWorkoutID"],
			thisDate: dateString(G_UserInfo["thisWorkoutDate"]),
			UserDict: G_UserInfo,
			Patterns: G_UserInfo["thisPatterns"],
			UserStats: G_UserInfo["Stats"],			
			levelUp: G_UserInfo["Stats"]["Level Up"],
			UBpressStat: G_UserInfo["Stats"]["Squat"],
			squatStat: G_UserInfo["Stats"]["UB Hor Pull"],
			hingeStat: G_UserInfo["Stats"]["Hinge"],
			RPEOptions: RPE_Dict["Options"],
			TestDict: {Test1: "Test1", Test2: "Test2"},
			selectedWeek,
			selectedDay,
			allWorkouts: G_UserInfo["Workouts"],
			WeekList,
			DayList,
			selectWorkoutList: changeWorkoutList,
			thisLevels: G_UserInfo["thisLevels"],
		});
	}
});


router.post('/' + postURL, function(req, res) {	
	// var inputCodes = req.body["inputCodes"];
	// console.log("selectForm: " + req.body.selectForm);
	// console.log("req.body: ", req.body);
	var outputs = {}	
	if (req.body.SaveBtn) {
		console.log("Save PRESSED");
		saveWorkout(req.body, G_UserInfo);
		G_UserInfo["User"].save().then(() => {
			res.redirect('/');		
			return
		});
	}
	
	if (req.body.changeLevel || req.body.changeLGroup) {
		// if (req.body.changeLGroup) {}
		// console.log("selectLevelGroup", req.body.selectLevelGroup);
		// console.log("selectLevel", req.body.selectLevel);
	}

	console.log("333");
	if (req.body.changeWorkoutBtn || req.body.NextBtn || req.body.PrevBtn) {
		// G_UserInfo["User"].workouts.patternsLoaded = false;
		G_UserInfo["thisPatterns"] = [];
		if (req.body.changeWorkoutBtn) {
			var selectedWD = req.body.changeWorkoutSelect.split("|");
			console.log(selectedWD);
			var _W = parseInt(selectedWD[0]);
			var _D = parseInt(selectedWD[1]);
			// G_UserInfo["thisWorkoutID"] = Group1WDtoID[_W][_D];
			var newWID = parseInt(req.body.changeWorkoutSelect);
			var newWorkout = G_UserInfo["User"].workouts[req.body.changeWorkoutSelect];
			
			
			selectedWeek = parseInt(newWorkout.Week);
			selectedDay = parseInt(newWorkout.Day);
			console.log("NEW WORKOUT ID: " + req.body.changeWorkoutSelect);
			console.log("NEW WORKOUT: ", newWorkout, "Week: " + selectedWeek, "Day: " + selectedDay);
			G_UserInfo["User"].currentWorkoutID = parseInt(newWID);
			G_UserInfo["User"].save().then(() => {
				res.redirect('/');
				return				
			});
		// G_UserInfo["thisWorkoutID"] = nextWorkoutID;
		}
		else if (req.body.NextBtn || req.body.PrevBtn) {
			var nWorkouts = G_UserInfo["User"].workoutDates.length;
			console.log("nWorkouts: " + nWorkouts);
			var nextWorkoutID = G_UserInfo["thisWorkoutID"] + 1;
			if (req.body.PrevBtn) {
				nextWorkoutID = G_UserInfo["thisWorkoutID"] - 1;
				if (G_UserInfo["thisWorkoutID"] == 1) {
					nextWorkoutID = nWorkouts;	
				}			
			} 
			if (nextWorkoutID > nWorkouts) {
				console.log("redirecting to workout: " + nextWorkoutID);
				res.redirect('/level-up');
				return
				// Test user here
			}
			console.log("next Workout ID: " + nextWorkoutID);
			// G_UserInfo["thisWorkoutID"] = nextWorkoutID;
			// NOOOO
			//USE "VIEWING WORKOUT ID"
			G_UserInfo["User"].currentWorkoutID = nextWorkoutID; 
			G_UserInfo["User"].save().then(() => {
				res.redirect('/');
				return				
			}
			);			
			console.log("NEXT WORKOUT ID: " + nextWorkoutID); 
			// console.log("NEXT WORKOUT Week/Day: " + G1KeyCodes[nextWorkoutID].Week + ", " + G1KeyCodes[nextWorkoutID].Day); 
			selectedWeek = G_UserInfo["User"].workouts[nextWorkoutID].Week;
			selectedDay = G_UserInfo["User"].workouts[nextWorkoutID].Day;
			// selectedWeek = G1KeyCodes[nextWorkoutID].Week;
			// selectedDay = G1KeyCodes[nextWorkoutID].Day;
		}
	}

	if(req.body.ResetBtn) {
		// reset();
		res.redirect('/');
		return
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
		res.redirect('/');
	}

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

router.get('/level-up', function(req, res) {
	console.log("555");
	res.render('levelcheck', {
		User: G_UserInfo["User"],
		UserStats: G_UserInfo["Stats"],			
		levelUp: G_UserInfo["Stats"]["Level Up"],
		benchStat: G_UserInfo["Stats"]["Squat"],
		squatStat: G_UserInfo["Stats"]["UB Hor Pull"],
		hingeStat: G_UserInfo["Stats"]["Hinge"],		
	});
})

router.post('/', function(req, res) {
	res.redirect("/");
});

router.post('/workouts', function(req, res) {
	res.redirect("/workouts");
});

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

module.exports = router;