
	// for (var i = 1; i <= 25; i++) {
	// 	// console.log("I: " + i);
	// 	ETypes.forEach(function(elem) {
	// 		// console.log(elem);
	// 		var ExerciseData = [];
	// 		var ExerciseDict = {};
	// 		Exercise.findOrCreate({
	// 			where: {
	// 				name: elem,
	// 				level: i,
	// 			}
	// 		})
	// 		.then(result => {
	// 			ExerciseData = result;
	// 			// console.log("Result: " + ExerciseData[0].name + " " + !ExerciseData);
	// 			if (!ExerciseData[0]) {
	// 				// console.log("Exercise " + elem + ", " + i + " doesn't exist!");
	// 				const newExercise = Exercise.build({
	// 				  name: elem,
	// 				  level: i
	// 				})
	// 				newExercise.save().then(() => {
	// 					// console.log("Exercise Saved: " + elem + ", " + i);
	// 				}).catch(error => {
	// 				 	// console.log("Error saving: " + elem + ", " + i);
	// 				})
	// 			}	
	// 			else if (ExerciseData[0]) {
	// 				// console.log("Exercise Exists: " + ExerciseData[0].name + ", " + ExerciseData[0].level);
	// 			}
	// 		})
	// 		// console.log("test");
	// 		// console.log("ExerciseData: " + !ExerciseData[0]);
	// 		// console.log("Exercise Data: " + ExerciseData + " " + ExerciseData[0]);
	// 	});
	// }	
