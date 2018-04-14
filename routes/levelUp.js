var models = require('../models');
	var Exercise = models.Exercise;
	var WorkoutTemplate = models.WorkoutTemplate;
	var SubWorkoutTemplate = models.SubWorkoutTemplate;
	var Workout = models.Workout;
    var User = models.User;

// On Level-Up
// Re-create user workouts
// Reset .workouts
// Reset .workouts.patterns[];
// Stash User Stats
    // Record workouts
	// Stash as list of JSONs?

function CheckLevelUp(user) {
	var Stats = user.stats;
	if (Stats["Hinge"].Status.value == 1
	&& Stats["Squat"].Status.value == 1
	&& Stats["UB Hor Push"].Status.value == 1) {
		user.level += 1;
		user.save();
	}

}