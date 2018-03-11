var bodyParser = require('body-parser');
var globals = require('../globals');
var getMax = globals.getMax;
var express = require('express');
var router = express.Router();
var models = require('../models');
var Exercise = models.Exercise
var WorkoutTemplate = models.WorkoutTemplate;
var Workout = models.Workout;
var User = models.User;

var ETypes = globals.Exercise_Types;
var ENames = globals.Exercise_Names;

var UserLevel = 1

var Alloy = {
	None: {value: 0, name: "None", code: "N"},
	Passed: {value: 1, name: "Passed", code: "P"},
	Failed: {value: -1, name: "Failed", code: "F"},
}

var UserStats = {
	Level: 1,
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
	CurrentWorkout: {

	},
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

router.get('/', function(req, res
	// , next
	) {	

	// console.log("models.WorkoutTemplate: " + WorkoutTemplate);
	// console.log("models.Exercise: " + Exercise);

	var TemplateID = 1;
	// models.SubWorkoutTemplate.destroy({
	// 	where: {
	// 		fk_workout: 1,
	// 	}
	// });
	console.log("\n");
	console.log("User Level: " + UserLevel);
	var Patterns = [];
	var _Level = UserStats.Level;
	WorkoutTemplate.findById(TemplateID).then(template => {
		console.log("\n");
		console.log("Workout Template Selected #: " + template.id + " levelGroup: " + template.levelGroup + " week: " + template.week + " day: " + template.day);
		for (var K in template) {
			// console.log("template Key: " + K);
		}
		// template.removeSubWorkouts();			
		var SubWorkouts = template.getSubWorkouts().then(subs => {
			console.log("Subworkouts: ");
			// console.log(subs);
			subs.sort(function(a, b) {
				return a.number - b.number
			});
			subs.forEach(elem => {
				var SubWorkoutInstance = {};
				SubWorkoutInstance = Object.assign({}, elem);
				var N = elem.number;
				var EType = elem.exerciseType;
				SubWorkoutInstance.number = N;
				SubWorkoutInstance.type = elem.exerciseType;
				SubWorkoutInstance.name = ENames[_Level][elem.exerciseType];

				SubWorkoutInstance.reps = elem.reps;
				SubWorkoutInstance.RPE = elem.RPE;

				SubWorkoutInstance.alloy = elem.alloy;

				var Sets = elem.sets;
				if (SubWorkoutInstance.alloy) {
					SubWorkoutInstance.alloyreps = elem.alloyreps;
					Sets -= 1;
				}

				SubWorkoutInstance.sets = Sets;

				SubWorkoutInstance.UserMax = UserStats.ExerciseStats[EType].Max;
				SubWorkoutInstance.LastSet = UserStats.ExerciseStats[EType].LastSet;
				// console.log("instance keys: " + Object.keys(SubWorkoutInstance));
				// console.log(SubWorkoutInstance.exerciseType);
				console.log("	" + elem.description + " " + elem.number + " name: " + elem.name);
				Patterns.push(SubWorkoutInstance);
				// Patterns.N = SubWorkoutInstance;
			});
			console.log("Patterns: " + Patterns);

			UserStats.CurrentWorkout.Patterns = Patterns;

			render();

		});
	});

	Exercise.findById(1).then(exercise => {

	});



	// console.log(globals.WorkoutSample);

	// if (err) return next(err);
	// console.log
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
		res.render('main', 
		{
			ETypes: globals.Exercise_Types,
			Patterns: Patterns,
			Test: 'Testing'
		});
	}

});


router.post('/', function(req, res) {
	var inputCodes = req.body["inputCodes"];
	console.log("inputCodes: " + inputCodes);
	console.log(UserStats.CurrentWorkout.Patterns);

	var outputs = {}	

	for (var K in req.body) {
		// continue;
		// console.log(req.body[K]);
		var inputCode = K.split("|");
		if (!K.includes("|") || !inputCode) {
			continue;
		}
		var inputType = inputCode[1];
		var patternID = parseInt(inputCode[0]); //Number (index + 1)
		var setNum = parseInt(inputCode[2]);
		// console.log(inputCode + " patternID: " + patternID);
		// console.log(!UserStats.CurrentWorkout.Patterns[patternID - 1]);
		// console.log(Patterns[patternID - 1].type);
		var _EType = UserStats.CurrentWorkout.Patterns[patternID - 1].type;
		var _nSets = UserStats.CurrentWorkout.Patterns[patternID - 1].sets;
		if (setNum == _nSets) {
			if (!(_EType in outputs)) {
				outputs[_EType] = {
					Tempo: [],
					Name: UserStats.CurrentWorkout.Patterns[patternID - 1].name,
					Reps: UserStats.CurrentWorkout.Patterns[patternID - 1].reps,
				};
			}
			// console.log("FINAL SET: " + _EType);
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
		}
	}
	console.log("\n");
	console.log(outputs);
	console.log("\n");
	for (var EType in outputs) {
		var Val = outputs[EType];

		console.log("FINAL SET: " + EType + ", " + Val.Name);
		console.log("	INPUTS: " + "Weight: " + Val.Weight + " Reps: " + Val.Reps + " RPE: " + Val.RPE);
		console.log("	Old MAX: " + UserStats.ExerciseStats[EType].Max);
		var setDescription = Val.Reps + " Reps x " + Val.Weight + " lbs @ " + Val.RPE + " RPE";
		UserStats.ExerciseStats[EType].LastSet = setDescription;
		if (Val.Weight && Val.RPE && Val.Reps) {
			console.log("	Calculating new max with inputs: " + Val.Weight + ", " + Val.Reps + ", " + Val.RPE);
			var newMax = getMax(Val.Weight, Val.Reps, Val.RPE);
			console.log("	New MAX: " + getMax(Val.Weight, Val.Reps, Val.RPE));
			UserStats.ExerciseStats[EType].Max = newMax;
			// console.log("	oldMax: " + UserStats.ExerciseStats[EType].Max
			// + " newMax: " + getMax(Val.Weight, Val.Reps, Val.RPE));			
		}
		console.log("\n")
		// console.log("	Weight Input: " + Val.Weight + " RPE Input: " + Val.RPE + " Tempo: " + Val.Tempo);
		// console.log("	oldMax: " + UserStats.ExerciseStats[EType].Max + " reps: " + Val.Reps
		// + " newMax: " + getMax(Val.Weight, Val.Reps, Val.RPE)
		// );
	}

	var name = req.body["name"];
	var text = req.body.text;
	console.log("name: " + name);
	console.log(text);
	res.redirect('/');
});

// router.post('/tweets', function(req, res) {
// 		var name = req.body.name;
// 		var text = req.body.text;
// 		tweetBank.add(name, text);
// 		res.redirect('/');
// 		io.sockets.emit('newTweet', { 			
// 			name: name, 
// 			text: text
// 		});
		
// 	})
module.exports = router;