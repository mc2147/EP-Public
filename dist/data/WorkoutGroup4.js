"use strict";

// // Day 4		S x R	RPE	Strength Drop
// // UB Vert Push		3	9	10%
// // UB Hor Pull		6	9	10%
// // UB Hor Push	-1	4 x 6	8-9	
// // UB Vert Pull	-1	4 x 8	8-9	
// // Iso 2		2x 12	8	
// // Iso 4		2 x 12	8	

// SampleWorkout_Group4 = {
// 	Block: 2, Week: 2, Day: 4, LevelGroup: 4, NumSubWorkouts: 6,
// 	SubWorkouts: {
// 		1: {ExerciseType: "UB Vert Push", Sets: 3, Reps: null, RPE: 9, Type: "drop", DropValue: 10,},
// 		2: {ExerciseType: "UB Hor Pull", Sets: 6, Reps: null, RPE: 9, Type: "drop", DropValue: 10,},
// 		3: {ExerciseType: "UB Hor Push",  Sets: 4, Reps: 9, RPE: "8-9", Deload: -1},
// 		4: {ExerciseType: "UB Vert Pull", Sets: 4, Reps: 8, RPE: "8-9", Deload: -1}, 
// 		5: {ExerciseType: "Iso 2", Sets: 2, Reps: 12, RPE: 8}},
// 		6: {ExerciseType: "Iso 4", Sets: 2, Reps: 12, RPE: 8}},
// 	}
// }

SampleStopDrop = {
	Block: 2, Week: 1, Day: 2, LevelGroup: 4, NumSubWorkouts: 5,
	SubWorkouts: {
		1: { ExerciseType: "UB Hor Push", Reps: 8, RPE: 7, Type: "drop", DropValue: 7 },
		2: { ExerciseType: "UB Vert Pull", RPE: 7, Type: "stop", StopRPE: 8.5 },
		3: { ExerciseType: "UB Hor Pull", Sets: 4, Reps: 10, RPE: 7, Deload: -1 },
		4: { ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7 },
		5: { ExerciseType: "Iso 3", Sets: 3, Reps: 12, RPE: 7 }
	}
};

console.log("SampleStopDrop");
console.log(SampleStopDrop);

// // UB Hor Push		8	7	7%
// // UB Vert Pull		#	7	Stop: 8.5
// // UB Hor Pull	-1	4 x 10	7	
// // Iso 1		3 x 12	7	
// // Iso 3		3 x 12	7	


// // Day 3		R	RPE	Strength Stop
// // Hinge	-2	15	5	6
// // LB Uni Push	-2	15	5	6
// // Squat	-2	2 x 15	4-5	
// // Carry	-1	2 x :45		
// // Post Chain		2 x #	4-5	

// // WorkoutGroup1 = {
// // 	Week: {
// // 		1: {
// // 			Day: {
// // 				1: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
// // 						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
// // 						3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// // 						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
// // 					}
// // 				},
// // 				2: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7,},
// // 						2: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7,},
// // 						3: {ExerciseType: "Vert Pull", Sets: 3, Reps: 10, RPE: 7,},		
// // 						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7}
// // 					}
// // 				},
// // 				3: {
// // 					Patterns: {
// // 						1: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7,},
// // 						2: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7,},
// // 						3: {ExerciseType: "Squat", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// // 						4: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Post Chain", Sets: 3, Reps: null, RPE: 7}
// // 					}
// // 				}
// // 			},
// // 		},
// // 		2: {
// // 			Day: {
// // 				1: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Squat", Sets: 4, Reps: 8, RPE: 7.5,},
// // 						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 7.5,},
// // 						3: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
// // 						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
// // 					}
// // 				},
// // 				2: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7,},
// // 						2: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7,},
// // 						3: {ExerciseType: "Vert Pull", Sets: 3, Reps: 10, RPE: 7,},		
// // 						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7}
// // 					}
// // 				},
// // 				3: {
// // 					Patterns: {
// // 						1: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7,},
// // 						2: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7,},
// // 						3: {ExerciseType: "Squat", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// // 						4: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Post Chain", Sets: 3, Reps: null, RPE: 7}
// // 					}
// // 				}
// // 			}
// // 		},
// // 		3: {
// // 			Day: {
// // 				1: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Squat", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
// // 						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 8,	Alloy: true, AlloyReps: 8},
// // 						3: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
// // 						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: 10, RPE: 7}
// // 					},
// // 					Alloy: true
// // 				},
// // 				2: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Hinge", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
// // 						2: {ExerciseType: "UB Hor Push", Sets: 4, Reps: 6, RPE: 7, Alloy: true, AlloyReps: 8},
// // 						3: {ExerciseType: "Vert Pull", Sets: 4, Reps: 8, RPE: 7, Alloy: true, AlloyReps: 10},		
// // 						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 10, RPE: 7}
// // 					},
// // 					Alloy: true
// // 				},
// // 				3: {
// // 					Patterns: {
// // 						1: {ExerciseType: "LB Uni Push", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
// // 						2: {ExerciseType: "UB Hor Pull", Sets: 4, Reps: 8, RPE: 8, Alloy: true, AlloyReps: 10},
// // 						3: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
// // 						4: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
// // 						5: {ExerciseType: "Post Chain", Sets: 3, Reps: 10, RPE: 7}
// // 					},
// // 					Alloy: true
// // 				}
// // 			},
// // 		},		
// // 		4: {
// // 			Day: {
// // 				1: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Squat", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
// // 						2: {ExerciseType: "UB Vert Push", Sets: 2, Reps: 12, RPE: 5, Deload: -1},
// // 						3: {ExerciseType: "Ant Chain", Sets: 2, Reps: null, RPE: 5,},		
// // 						4: {ExerciseType: "Iso 3", Sets: 2, Reps: 15, RPE: 5,}, 
// // 						5: {ExerciseType: "Carry", Sets: 2, Seconds:60}
// // 					}
// // 				},
// // 				2: {
// // 					Patterns: {
// // 						1: {ExerciseType: "Hinge", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
// // 						2: {ExerciseType: "UB Hor Push", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
// // 						3: {ExerciseType: "Vert Pull", Sets: 2, Reps: 15, RPE: 5, Deload: -2},		
// // 						4: {ExerciseType: "Iso 1", Sets: 2, Reps: 15, RPE: 5,}, 
// // 						5: {ExerciseType: "Post Chain", Sets: 2, Reps: null, RPE: 5}
// // 					}
// // 				},
// // 				3: {
// // 					Patterns: {
// // 						1: {ExerciseType: "LB Uni Push", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
// // 						2: {ExerciseType: "UB Hor Pull", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
// // 						3: {ExerciseType: "UB Hor Push", Sets: 2, Reps: 15, RPE: 5, Deload: -2},		
// // 						4: {ExerciseType: "Iso 4", Sets: 2, Reps: 15, RPE: 5,}, 
// // 						5: {ExerciseType: "Carry", Sets: 2, Seconds:60, Deload:-1}
// // 					}
// // 				}
// // 			},
// // 		},		
// // 	},
// // }

// // WorkoutSample = {
// // 	Week: 1, Day: 1, LevelGroup:1, NumSubWorkouts: 5,
// // 	SubWorkouts: {
// // 		1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
// // 		2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
// // 		3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// // 		4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// // 		5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}}
// // }

module.exports = {
	SampleStopDrop: SampleStopDrop
};