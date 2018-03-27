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
	// var Group1Workouts = require('../WorkoutGroup1');

var globalEnums = require('../globals/enums');
	var Alloy = globalEnums.Alloy;
	
var globalFuncs = require('../globals/functions');
	var getMax = globalFuncs.getMax;
	var getWeight = globalFuncs.getWeight;
	
var UserLevel = 1

var postURL = "postWorkout";
var getURL = "getWorkout";

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
	var thisWorkoutID = user.currentWorkout.ID;
	output["thisWorkoutID"] = user.currentWorkout.ID;
	output["thisWorkout"] = user.workouts[thisWorkoutID];
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
	// console.log("Creating User Ref Dict: ");
	userFound = true;
});

var vueConvert = {
	Date: function(date) {
		var output = "";
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		output = year + "-" + month + "-" + day;
		return output;
	}
}

function getVueInfo(refDict) {
	var changeWorkoutList = [];
	for (var W = 0; W < WeekList.length; W++) {
		for (var D = 0; D < DayList.length; D++) {
			var _W = WeekList[W];
			var _D = DayList[D];
			var wID = Group1WDtoID[_W][_D];
			var date = dateString(refDict["User"].workoutDates[wID - 1]);
			changeWorkoutList.push({Week: _W, Day: _D, Date: date});
		}
	}
	
	var vueColumns = [
		["Reps/Time(s)", 1],
		["Weights", 2],
		["RPE", 3],
		["Tempo", 4],
	]
	var vueSubworkouts = [];
	console.log("PATTERNS:");
	for (var N = 0; N < refDict["thisPatterns"].length; N ++) {
		var Pattern = refDict["thisPatterns"][N];
		console.log(Pattern);
	}
	// return {}
	for (var N = 0; N < refDict["thisPatterns"].length; N ++) {
		var Pattern = refDict["thisPatterns"][N];

		var fixedList = [];
		var filledList = [];
		var inputList = [];
		var tempoList = [];

		var repLists = {
			// fixed: [],
			// filled: [],
			inputs: []
		};
		var weightLists = {
			// fixed: [],
			// filled: [],
			inputs: []
		};
		var RPELists = {
			// fixed: [],
			// filled: [],
			inputs: []
		};
		var tempoLists = {
			// fixed: [],
			// filled: [],
			inputs: []
		};

		for (var L = 0; L < Pattern.sets; L++) {
			var set = Pattern.setList[L];			
			// inputList.push("");
			tempoList.push(["3", "2", "X"]);
			
			// 4 Input Statuses: Empty, Placeholder, Filled, Fixed
			var repDict = {
				value: Pattern.reps,
				status: 'Fixed'
			}
			var weightDict = {
				value: set.Weight,
				status: 'Empty'
			}
			var RPEDict = {
				value: set.RPE,
				suggested: Pattern.RPE,
			}
			if (set.Filled) {
				weightDict.status = 'Filled';
				RPEDict.status = 'Filled';
			}
			//Alloy Patterns
			if (Pattern.alloy) {
				repDict.status = 'Fixed';
				if (set.Filled) {
					if (Pattern.alloystatus.value != 0) {
						weightDict.status = 'Fixed';
						RPEDict.status = 'Fixed';
					}
					else {
						weightDict.status = 'Filled';
						RPEDict.status = 'Filled';						
					}
				}
				else {
					weightDict.status = 'Empty';
					RPEDict.status = 'Empty';						
				}
			}
			//Stop & Drop Patterns
			else if (Pattern.stop || Pattern.drop) {
				if (set.Filled) {
					weightDict.status = 'Fixed';
					RPEDict.status = 'Fixed';
				}
			}
			//Bodyweight Workouts
			else if (Pattern.workoutType == 'bodyweight') {
				// weightLists.fixed.push("bodyweight");
				weightDict.status = 'Fixed';
				weightDict.value = 'Bodyweight';
				if (set.Filled) {
					repDict.value = set.Reps;
					repDict.status = 'Filled';						
				}
				else {
					repDict.value = "";
					repDict.status = 'Empty';
				}
			}
			// Carry
			else if (Pattern.workoutType == 'carry') {
				repDict.value = repDict.value + " (s)";
				RPEDict.value = '---';
				RPEDict.status = 'Fixed';
			}
			
			repLists.inputs.push(repDict);
			weightLists.inputs.push(weightDict);
			RPELists.inputs.push(RPEDict);
			
			//Edge cases here (fixed)
		}

		// Final Alloy Set
		if (Pattern.alloy) {
			var repDict = {
				value: Pattern.alloyreps,
				status: 'Fixed',
				alloy: true
			}
			var weightDict = {
				value: "Alloy Weight",
				status: 'Fixed',
				alloy: true
			}
			var RPEDict = {
				value: 10,
				status: 'Fixed',
				alloy: true
			}
			// RPELists.fixed.push(10);					
			if (Pattern.alloystatus.value == 0) {
				// repLists.fixed.push(Pattern.alloyreps);
				// weightLists.fixed.push("Alloy Weight");
			}
			else if (Pattern.alloystatus.value == 2) {
				repDict.status = 'Empty';
				weightDict.value = Pattern.alloyweight;
				weightDict.status = 'Fixed';
				// repLists.inputs.push(Pattern.alloyreps);
				// weightLists.fixed.push(Pattern.alloyweight);
			}
			else if (Pattern.alloystatus.value == 1) {
				repDict.value = Pattern.alloyperformed + " PASSED";
				repDict.status = 'Fixed';
				weightDict.value = Pattern.alloyweight;
				weightDict.status = 'Fixed';
				// repLists.fixed.push(Pattern.alloyperformed + " PASSED");
				// weightLists.fixed.push(Pattern.alloyweight);
			}
			else if (Pattern.alloystatus.value == -1) {
				repDict.value = Pattern.alloyperformed + " FAILED";
				repDict.status = 'Fixed';
				weightDict.value = Pattern.alloyweight;
				weightDict.status = 'Fixed';				
				// repLists.fixed.push(Pattern.alloyperformed + " FAILED");
				// weightLists.fixed.push(Pattern.alloyweight);
			}
			repLists.inputs.push(repDict);
			weightLists.inputs.push(weightDict);
			RPELists.inputs.push(RPEDict);
		}
		
		var dataTableItems = []
		//One per row
		for (var I = 0; I < vueColumns.length; I++) {
			//Vue Syntax
			var item = vueColumns[I];
			var rowDict = {
				id: item[1],
				name: item[0],
				value: false,
			};
			//Which row case
			if (item[1] == 4) { //Tempo
				rowDict.inputs = tempoList;
			}
			else if (item[1] == 3) { //RPE
				rowDict.inputs = RPELists.inputs;
			}
			else if (item[1] == 2) { //Weights
				rowDict.inputs = weightLists.inputs;
			}
			else if (item[1] == 1) { //Reps
				rowDict.inputs = repLists.inputs;
			}
			dataTableItems.push(rowDict); //One per ROW
		}
		//One per PATTERN
		var subDict = {
			name: Pattern.name,
			// RPEOptions: ["1", "2", "3", "4", "5-6", "7", "8", "9-10"],
			RPEOptions: [1, 2, 3, 4, 5, 6, 7, 7.5, 8, 8.5, 9, 9.5, 10],
			dataTableItems: dataTableItems, //Rows -> 1 row per SET
			sets: Pattern.sets, //N Sets
		}		
		vueSubworkouts.push(subDict);			
	}

	return  {
		date: vueConvert.Date(refDict["thisWorkoutDate"]),
		subworkouts: vueSubworkouts,
	};
}
	// How to store old workouts:
		// Add patterns list to PastWorkouts dict, indexed by week/day
			// {Week: , Day: , Completed : , Patterns : }
		// Fill up PastWorkouts dict on workout generation
			// 

var selectedWeek = 1;
var selectedDay = 1;
var WeekList = [1, 2, 3, 4];
var DayList = [1, 2, 3];

router.get('/' + getURL, function(req, res) {
	let userInfoToSend = getVueInfo(G_UserInfo);
	console.log("RES.JSON");
	res.json(userInfoToSend);
})

router.get('/', function(req, res
	// , next
	) {	
	// res.redirect('/');
	if (!thisUser) {
		// Loading
		render();
	}
	// G_UserInfo = userRefDict(thisUser);
	// G_UserInfo["thisWorkoutID"] = 13;
	console.log("ROUTE.GET STARTS ");
	console.log("GLOBALS: ");
	console.log("G_UserInfo: ");

	// G_UserInfo["thisWorkoutID"]
	// selectedweek
	// selectedDay
	// G_UserInfo = userRefDict(thisUser);
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
					patternInstance.alloystatus = Alloy.None;					
					Sets -= 1;
				}
				patternInstance.name = ExerciseDict[elem.exerciseType][_Level].name;	
				patternInstance.setList = [];
				patternInstance.sets = Sets;
				patternInstance.workoutType = elem.type;
				console.log("elem.type: " + elem.type);
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
				// Adding setDicts to patterInstance.setList -> []
				if (!thisUser.workouts.patternsLoaded) {
					for (var i = 0; i < Sets; i ++) {
						patternInstance.setList.push({
							SetNum: i + 1,
							Weight: null,
							RPE: null,
							// Tempo: [null, null, null],
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
			ETypes: ExerciseDict["Types"],
			// Patterns: UserStats.CurrentWorkout.Patterns,
			// ExerciseStats: UserStats.ExerciseStats,			
			
			thisDate: dateString(G_UserInfo["thisWorkoutDate"]),
			UserDict: G_UserInfo,
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


// router.post('/', function(req, res) {
router.post('/' + postURL, function(req, res) {	
	// var inputCodes = req.body["inputCodes"];
	console.log("selectForm: " + req.body.selectForm);
	console.log("req.body: ", req.body);
	var outputs = {}	

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
			var nWorkouts = G_UserInfo["User"].workoutDates.length;
			console.log("nWorkouts: " + nWorkouts);
			var nextWorkoutID = G_UserInfo["thisWorkoutID"] + 1;
			if (nextWorkoutID > nWorkouts) {
				console.log("redirecting to workout: " + nextWorkoutID);
				res.redirect('/level-up');
				return
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
			if (setDict.RPE || thisPattern.workoutType == 'carry') {
				setDict.Filled = true;
			} 
		}
		else if (inputType == "RPE" 
			&& input && setNum <= _nSets) {
			setDict.RPE = parseFloat(req.body[K]);
			if (setDict.Weight) {
				setDict.Filled = true;
			}
			if (thisPattern.workoutType == "bodyweight" && setDict.Reps) {
				setDict.Filled = true;
			}
		}
		else if (inputType.includes("T") 
			&& input && setNum <= _nSets) {
			setDict.Tempo.push(parseInt(req.body[K]));
		}

		if (inputType == "Reps") {
			setDict.Reps = parseInt(req.body[K]);
			if (thisPattern.workoutType == 'bodyweight' && setDict.RPE) {
				console.log("395");
				setDict.Filled = true;
			}
		}
		console.log("thisPattern.type: " + thisPattern.type);
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
				outputs[_EType].RPE = parseFloat(req.body[K]);
				if(thisPattern.drop && thisPattern.specialStage) {
					outputs[_EType].Weight = thisPattern.dropWeight;
				}
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
	
			if (thisPattern.stop) {
				console.log("stop set submitted");
				if (thisPattern.specialStage == 0) {
					if (Val.RPE < thisPattern.specialValue) {
						thisPattern.sets += 1;
						thisPattern.setList.push({
							SetNum: thisPattern.sets,
							Weight: null,
							RPE: null,
							// Tempo: [null, null, null],
							Filled: false,
						});				 
					}
					else {
						thisPattern.specialStage += 1;
					}
				}
			}
			else if (thisPattern.drop) {
				console.log("drop set submitted. Drop Stage: " + thisPattern.dropStage);
				if (thisPattern.specialStage == 0) {
					if (Val.RPE < thisPattern.RPE) {
						thisPattern.sets += 1;
						thisPattern.setList.push({
							SetNum: thisPattern.sets,
							Weight: null,
							RPE: null,
							// Tempo: [null, null, null],
							Filled: false,
						});				 
					}
					else {
						thisPattern.specialStage += 1;
						thisPattern.dropWeight =  Math.round(((100 - thisPattern.specialValue)/100)*Val.Weight);
						// thisPattern.dropWeight = Val.Weight;
						// thisPattern.dropWeight = (100 - thisPattern.specialValue);

						thisPattern.sets += 1;
						thisPattern.setList.push({
							SetNum: thisPattern.sets,
							Weight: thisPattern.dropWeight,
							RPE: null,
							// Tempo: [null, null, null],
							Filled: false,
						});				  					
					}
				}
				else if (thisPattern.specialStage == 1) {
					if (Val.RPE < thisPattern.RPE) {
						thisPattern.sets += 1;
						thisPattern.setList.push({
							SetNum: thisPattern.sets,
							Weight: thisPattern.dropWeight,
							RPE: null,
							// Tempo: [null, null, null],
							Filled: false,
						});				 
					}
					else {
						thisPattern.specialStage += 1;
					}
				}
			}

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
	var newMax = getMax(Weight, Reps, RPE);
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