var Promise = require("bluebird");
var bodyParser = require('body-parser');
var globals = require('../globals');
var Group1Workouts = require('../WorkoutGroup1');
// var globalFunctions = require('../globalFunctions')

var getMax = globals.getMax;
var getWeight = globals.getWeight;

var express = require('express');
var router = express.Router();
var models = require('../models');
var Exercise = models.Exercise

var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

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
var userFound = false;
var thisUser; 
var thisPatterns;
var G_thisStats;

User.findById(1).then(user => {
	// console.log("USER FOUND!!! USER ID: " + user.id);
	// console.log("User's stats: ");
	// console.log(user.stats);
	thisUser = user;
	G_thisStats = thisUser.stats;
	thisPatterns = thisUser.workouts.thisPatterns;
	userFound = true;
});

// How to store old workouts:
	// Add patterns list to PastWorkouts dict, indexed by week/day
		// {Week: , Day: , Completed : , Patterns : }
	// Fill up PastWorkouts dict on workout generation
		// 


var UserStats = {
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
		// Dictionary of lists of dictionaries
	},
	CurrentWorkout: {
		Week: 1,
		Day: 1,
		LGroup: 1,
		TemplateID: 1,
	},
	TemplateID: 1,
}



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
	console.log("ROUTE.GET STARTS ");
	console.log("GLOBALS: ");
	console.log("G_thisStats: ");
	console.log(G_thisStats);
	console.log("thisUser.stats: ")
	console.log(thisUser.stats);
	console.log("thisPatterns: " + thisPatterns.length);
	// console.log(thisPatterns);
	// console.log("User Stats from Router: ");
	// console.log(thisUser.stats);
	// console.log("User thisPatterns: ");
	// console.log(thisUser.workouts.thisPatterns);
	// console.log("User Patterns from Router: " + thisUser.workouts.Current.Patterns.length);
	// console.log(thisUser.workouts.Current.Patterns);
	// console.log(getWeight.toString());

	var TemplateID = UserStats.CurrentWorkout.TemplateID;
	// models.SubWorkoutTemplate.destroy({
	// 	where: {
	// 		fk_workout: 1,
	// 	}
	// });
	var obj1 = {a: 1, b: 2, c: 3};

	var obj2 = Object.assign({}, obj1);
	obj2.d = 4;
	console.log(obj1);
	console.log(obj2);
	console.log("User Level: " + UserLevel);
	var Patterns = [];
	var _Level = UserStats.Level;

	WorkoutTemplate.findOne({
		where: {
	        levelGroup: 1,
	        week: selectedWeek,
	        day: selectedDay			
		}
	}).then(template => {
		// console.log("\n");
		// console.log("Workout Template Selected #: " + template.id + " levelGroup: " + template.levelGroup + " week: " + template.week + " day: " + template.day);
		for (var K in template) {
			// console.log("template Key: " + K);
		}
		// template.removeSubWorkouts();			
		var SubWorkouts = template.getSubWorkouts().then(subs => {
			// console.log("Subworkouts: ");
			// console.log(subs);
			subs.sort(function(a, b) {
				return a.number - b.number
			});
			subs.forEach(elem => {
				// Elem information
				var SubWorkoutInstance = {};
				SubWorkoutInstance = Object.assign({}, elem);
				var N = elem.number;
				var EType = elem.exerciseType;
				console.log("Loading Sub for EType: " + EType);

				SubWorkoutInstance.number = N;
				SubWorkoutInstance.type = elem.exerciseType;
				SubWorkoutInstance.reps = elem.reps;
				SubWorkoutInstance.RPE = elem.RPE;
				SubWorkoutInstance.alloy = elem.alloy;
				var Sets = elem.sets;
				// console.log("Sets: " + Sets);
				if (SubWorkoutInstance.alloy) {
					SubWorkoutInstance.alloyreps = elem.alloyreps;
					Sets -= 1;
				}
				SubWorkoutInstance.name = ENames[_Level][elem.exerciseType];	

				// UserStat information
				SubWorkoutInstance.alloystatus = UserStats.ExerciseStats[EType].Status;

				SubWorkoutInstance.showalloy = (UserStats.ExerciseStats[EType].Status == Alloy.Testing); 
				// ^^ This has to be updated live
				SubWorkoutInstance.alloyperformed = UserStats.AlloyPerformed[EType];
				// ^^ This has to be updated live too 

				// console.log("Show Alloy: " + UserStats.ExerciseStats[EType].Status == Alloy.Testing);
				var UserMax = UserStats.ExerciseStats[EType].Max;
				SubWorkoutInstance.UserMax = UserMax;
				SubWorkoutInstance.alloyweight = getWeight(UserMax, elem.alloyreps, 10);

				SubWorkoutInstance.setList = [];

				if (!thisUser.workouts.patternsLoaded) {
					for (var i = 0; i < Sets; i ++) {
						SubWorkoutInstance.setList.push({
							SetNum: i + 1,
							Weight: null,
							RPE: null,
							Tempo: [null, null, null],
							Filled: false,
						});
					}
					thisPatterns.push(SubWorkoutInstance);
					thisUser.save();
				}

				// CurrentSets information
				// Updating global current sets
				if (!(EType in UserStats.CurrentSets)) { 
				// UserStats.CurrentSets[EType] = ["test"];
					UserStats.CurrentSets[EType] = [];
					for (var i = 0; i < Sets; i ++) {
						// console.log("pushing to set:  " + UserStats.CurrentSets[EType]);
						UserStats.CurrentSets[EType].push({
							SetNum: i + 1,
							Weight: null,
							RPE: null,
							Tempo: [null, null, null],
							Filled: false,
						});
						// console.log("pushing to set:  " + UserStats.CurrentSets[EType]);
					}
				}
				// CurrentSets Information				
				// console.log("Set List: " + UserStats.CurrentSets[EType]);
				for (var K = 0; K < UserStats.CurrentSets[EType].length; K++) {
					// console.log("Set Dictionary: " + UserStats.CurrentSets[EType][K].toString());
				}

				SubWorkoutInstance.sets = Sets;

				SubWorkoutInstance.LastSet = UserStats.ExerciseStats[EType].LastSet;
				// Referencing/pulling from global currentSets
				SubWorkoutInstance.CurrentSets = UserStats.CurrentSets[EType];
				// console.log("instance keys: " + Object.keys(SubWorkoutInstance));
				// console.log(SubWorkoutInstance.exerciseType);
				// console.log("	" + elem.description + " " + elem.number + " name: " + elem.name);
				Patterns.push(SubWorkoutInstance);
				// Patterns.N = SubWorkoutInstance;
				// thisUser.workouts[]
			});

			// console.log("Patterns: " + Patterns);

			UserStats.CurrentWorkout.Patterns = Patterns;
			// thisUser.workouts.Current.Patterns = Patterns;
			thisUser.workouts.patternsLoaded = true;
			thisUser.save();
			console.log("\nWATCH THIS!!! \n");
			console.log("thisUser.workouts.thisPatterns:");
			// console.log(thisUser.workouts.thisPatterns);
			for (var P = 0; P < thisPatterns.length; P ++) {
				var _Pattern = thisPatterns[P];
				console.log("	" + thisPatterns[P].type + ", " + _Pattern.name + ", " 
				+ _Pattern.sets + " x " + _Pattern.reps + ", " + _Pattern.RPE + " RPE, " + (_Pattern.alloy ? "Alloy, " : "Regular, ")
				+ "Set List Count: " + _Pattern.setList.length);
			}
			console.log("\n");
			// thisUser.save();
			thisUser.save();
			render();
		});
	});

	for (var i = 1; i <= 25; i++) {
		// console.log("I: " + i);
		ETypes.forEach(function(elem) {
			// console.log(elem);
			var ExerciseData = [];
			var ExerciseDict = {};
			Exercise.findOrCreate({
				where: {
					name: elem,
					level: i,
				}
			})
			.then(result => {
				ExerciseData = result;
				// console.log("Result: " + ExerciseData[0].name + " " + !ExerciseData);
				if (!ExerciseData[0]) {
					// console.log("Exercise " + elem + ", " + i + " doesn't exist!");
					const newExercise = Exercise.build({
					  name: elem,
					  level: i
					})
					newExercise.save().then(() => {
						// console.log("Exercise Saved: " + elem + ", " + i);
					}).catch(error => {
					 	// console.log("Error saving: " + elem + ", " + i);
					})
				}	
				else if (ExerciseData[0]) {
					// console.log("Exercise Exists: " + ExerciseData[0].name + ", " + ExerciseData[0].level);
				}
			})
			// console.log("test");
			// console.log("ExerciseData: " + !ExerciseData[0]);
			// console.log("Exercise Data: " + ExerciseData + " " + ExerciseData[0]);
		});
	}	

	function render() {
		thisUser.save();
		console.log("RENDER FUNCTION");
		console.log("thisPatterns: " + thisPatterns.length);
		res.render('main', 
		{
			ETypes: globals.Exercise_Types,
			// Patterns: UserStats.CurrentWorkout.Patterns,
			// ExerciseStats: UserStats.ExerciseStats,			
			Patterns: thisPatterns,
			UserStats: G_thisStats,			
			Test: 'Testing',
			TestDict: {Test1: "Test1", Test2: "Test2"},
			selectedWeek,
			selectedDay,
			WeekList,
			DayList
		});
	}

});


router.post('/', function(req, res) {
	var inputCodes = req.body["inputCodes"];
	console.log("selectForm: " + req.body.selectForm);
	// console.log("inputCodes: " + inputCodes);
	// console.log(UserStats.CurrentWorkout.Patterns);

	var outputs = {}	

	// console.log("req.body.ResetBtn: " + req.body.ResetBtn);
	// console.log("req.body.SubmitBtn: " + req.body.SubmitBtn);
	
	if (req.body.changeWorkoutBtn) {
		var selectedWD = req.body.changeWorkoutSelect.split("|");
		console.log(selectedWD);
		var _W = parseInt(selectedWD[0]);
		var _D = parseInt(selectedWD[1]);
		selectedWeek = _W;
		selectedDay = _D;
		thisUser.workouts.patternsLoaded = false;
		thisPatterns = [];
		// var thisWeek = req.body.
	}

	if(req.body.ResetBtn) {
		reset();
		res.redirect('/');
		// console.log("req.body.ResetBtn: " + req.body.ResetBtn);
		// console.log("req.body.SubmitBtn: " + req.body.SubmitBtn);
	}
	// else if (req.body.SubmitBtn) {

	// }

	for (var K in req.body) {
		// continue;
		// console.log(req.body[K]);
		var inputCode = K.split("|");
		if (!K.includes("|") || !inputCode) {
			continue;
		}
		var inputType = inputCode[1];
		var patternID = parseInt(inputCode[0]); //Number (index + 1)
		var patternIndex = patternID - 1;
		var setNum = parseInt(inputCode[2]);
		var setIndex = setNum - 1;
		// console.log(inputCode + " patternID: " + patternID);
		// console.log(!UserStats.CurrentWorkout.Patterns[patternID - 1]);
		// console.log(Patterns[patternID - 1].type);

		var thisPattern = thisPatterns[patternIndex];
		console.log("thisPatterns 361: " + thisPatterns.length + " " + patternIndex);	
		// console.log(thisPatterns[patternIndex]);	
		console.log("Pattern ID: " + patternID + " Pattern: " + thisPattern.sets + " " + thisPattern.name 
		+ ", " + thisPattern.type + " setIndex: " + setIndex);

		for (var i = 0; i < thisPattern.setList.length; i++) {
			console.log(thisPattern.setList[i]);
		}

		var _EType = thisPattern.type;
		var _nSets = thisPattern.sets;

		// var setDict = UserStats.CurrentSets[_EType][setIndex];
		var setDict = thisPattern.setList[setIndex];

		// console.log(thisPattern);
		// thisPattern = UserStats.CurrentWorkout.Patterns[patternID - 1];
		//thisPattern
			//.type
			//.sets
			//.name
 			//.reps
			//.alloyreps

			//.alloyperformed
			//.alloyweight			
		// console.log(thisPattern);

		// thisStat = UserStats.ExerciseStats[_EType];
		// var thisStats = UserStats.ExerciseStats[_EType];
		var input = parseInt(req.body[K]);

		var G_Stats = G_thisStats;
		var thisStats = G_thisStats[_EType];
		
		// console.log("251: " + UserStats.CurrentSets[_EType] + " set Index: " + setIndex);


		if (inputType == "W" 
			&& input && setNum <= _nSets) {
			setDict.Weight = parseInt(req.body[K]);
			// console.log("261");
			if (setDict.RPE) {
				setDict.Filled = true;
			} 
		}
		else if (inputType == "RPE" 
			&& input && setNum <= _nSets) {
			// console.log("268");
			setDict.RPE = parseInt(req.body[K]);
			if (setDict.Weight) {
				setDict.Filled = true;
			}
		}
		else if (inputType.includes("T") 
			&& input && setNum <= _nSets) {
			// console.log("276");
			setDict.Tempo.push(parseInt(req.body[K]));
		}

		// console.log(UserStats.CurrentSets[_EType]);
		// if (UserStats.CurrentWorkout.Patterns[patternID - 1].alloy) {
		// 	_nSets -= 1;
		// }

		if (setNum == _nSets) {
			// console.log("286 setNum");
			if (!(_EType in outputs)) {
				outputs[_EType] = {
					Tempo: [],
					// Use G_Stats
					Name: thisPattern.name, 
					Reps: thisPattern.reps,
					Alloy: thisPattern.alloy,
					AlloyReps: thisPattern.alloyreps,
					// Reps: thisPattern.reps,
					// Reps: G_Stats[patternIndex].reps, 
					// Alloy: G_Stats[patternIndex].alloy, 
					// AlloyReps: G_Stats[patternIndex].alloyreps, 
					// Name: UserStats.CurrentWorkout.Patterns[patternID - 1].name,
					// Reps: UserStats.CurrentWorkout.Patterns[patternID - 1].reps,
					// Alloy: UserStats.CurrentWorkout.Patterns[patternID - 1].alloy,
					// AlloyReps: UserStats.CurrentWorkout.Patterns[patternID - 1].alloyreps,
					ID: patternID,
				};
			}
			// console.log("FINAL SET: " + _EType + " # " + _nSets);
			if (inputType == "W") {
				outputs[_EType].Weight = parseInt(req.body[K]);
				// console.log("	Weight Input: " + req.body[K]);
				// console.log("	oldMax: " + UserStats.ExerciseStats[_EType].Max + " newMax: " + req.body[K]);
			}
			else if (inputType == "RPE") {
				outputs[_EType].RPE = parseInt(req.body[K]);
				// console.log("	RPE: " + req.body[K]);
			}
			else if (inputType.includes("T")) {
				outputs[_EType].Tempo.push(parseInt(req.body[K]));
				// console.log("	Tempo " + inputType[1] + ": " + req.body[K]);
			}
			// console.log("311 outputDict: " + outputs[_EType]);
		}
		else if (inputCode[2] == "Alloy") {
			var RepPerformance = parseInt(req.body[K]);
			// G_Stats[_EType] = RepPerformance
			// UserStats.AlloyPerformed[_EType] = RepPerformance;			
			thisPattern.alloyperformed = RepPerformance;
			if (RepPerformance >= thisPattern.alloyreps) {
				G_Stats[_EType].Status = Alloy.Passed;
				thisPattern.alloystatus = Alloy.Passed;
				// UserStats.ExerciseStats[_EType].Status = Alloy.Passed;
				// G_Stats.Alloy = Alloy.Passed;
				console.log("ALLOY PASSED");				
			}
			else {
				// UserStats.ExerciseStats[_EType].Status = Alloy.Failed;
				G_Stats[_EType].Status = Alloy.Failed;
				thisPattern.alloystatus = Alloy.Failed;
				console.log("ALLOY FAILED");				
			}
			// var setDescription = RepPerformance + " Reps x " + thisPattern.alloyweight + " lbs @ " + 10 + " RPE (Alloy) "
			// + thisStat.Status.string;
			// UserStats.ExerciseStats[_EType].LastSet = setDescription;			
			
			var setDescription = RepPerformance + " Reps x " + thisPattern.alloyweight 
			+ " lbs @ " + 10 + " RPE (Alloy) " + G_Stats[_EType].Status.string;
			G_Stats[_EType].LastSet = setDescription;
			G_Stats[_EType].Name = thisPattern.name;

			// outputs[_EType].AlloyReps
			// console.log("ALLOY SET");
		}
	}
	// console.log("\n");
	// console.log(outputs);
	// console.log("\n");
	for (var EType in outputs) {
		var Val = outputs[EType];
		// console.log("FINAL SET: " + EType + ", " + Val.Name);
		// console.log("	INPUTS: " + "Weight: " + Val.Weight + " Reps: " + Val.Reps + " RPE: " + Val.RPE);
		// console.log("	Old MAX: " + UserStats.ExerciseStats[EType].Max);
		if (Val.Weight && Val.RPE && Val.Reps) {
			var setDescription = Val.Reps + " Reps x " + Val.Weight + " lbs @ " + Val.RPE + " RPE";

			// UserStats.ExerciseStats[EType].LastSet = setDescription;
			G_Stats[EType].LastSet = setDescription; 
			G_Stats[EType].Name = thisPatterns[Val.ID - 1].name;
			thisPatterns[Val.ID - 1].LastSet = setDescription;

			console.log("	Calculating new max with inputs: " + Val.Weight + ", " + Val.Reps + ", " + Val.RPE);
			var newMax = getMax(Val.Weight, Val.Reps, Val.RPE);
			console.log("	New MAX: " + getMax(Val.Weight, Val.Reps, Val.RPE));

			// UserStats.ExerciseStats[EType].Max = newMax;
			G_Stats[EType].Max = newMax;
			thisPatterns[Val.ID - 1].Max = newMax;			

			// console.log("	oldMax: " + UserStats.ExerciseStats[EType].Max
			// + " newMax: " + getMax(Val.Weight, Val.Reps, Val.RPE));			
			if (Val.Alloy) {
				var AlloyReps = Val.AlloyReps; 
				// var AlloyWeight = getMax(newMax, AlloyReps, 10);
				var AlloyWeight = getWeight(newMax, AlloyReps, 10);
				console.log("ALLOY SET: " + AlloyReps + " " + AlloyWeight);
				// UserStats.ExerciseStats[EType].Max = newMax;

				// Deprecated Soon
				// UserStats.CurrentWorkout.Patterns[Val.ID - 1].alloyweight = AlloyWeight;
				// UserStats.ExerciseStats[EType].Status = Alloy.Testing;

				// Use These (BELOW)
				thisPatterns[Val.ID - 1].alloyweight = AlloyWeight;
				thisPatterns[Val.ID - 1].alloystatus = Alloy.Testing;
				G_Stats[EType].Status = Alloy.Testing;


				// console.log("Alloy Show: " + UserStats.CurrentWorkout.Patterns[Val.ID - 1].alloyshow);
				console.log("Alloy Show: " + thisPatterns[Val.ID - 1].alloyshow);
			}
		}
		// console.log("\n")
		// console.log("	Weight Input: " + Val.Weight + " RPE Input: " + Val.RPE + " Tempo: " + Val.Tempo);
		// console.log("	oldMax: " + UserStats.ExerciseStats[EType].Max + " reps: " + Val.Reps
		// + " newMax: " + getMax(Val.Weight, Val.Reps, Val.RPE)
		// );
	}

	var name = req.body["name"];
	var text = req.body.text;
	// console.log("name: " + name);
	// console.log(text);
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

module.exports = router;