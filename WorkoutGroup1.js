// WorkoutSample = {
// 	Week: 1, Day: 1, LevelGroup:1, NumSubWorkouts: 5,
// 	SubWorkouts: {
// 		1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
// 		2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
// 		3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// 		4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// 		5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}}
// }
WorkoutsKeyCode = {
	1: {Week: 1, Day: 1,},
	2: {Week: 1, Day: 2,},
	3: {Week: 1, Day: 3,},
	4: {Week: 2, Day: 1,},
	5: {Week: 2, Day: 2,},
	6: {Week: 2, Day: 3,},
	7: {Week: 3, Day: 1,},
	8: {Week: 3, Day: 2,},
	9: {Week: 3, Day: 3,},
	10: {Week: 4, Day: 1,},
	11: {Week: 4, Day: 2,},
	12: {Week: 4, Day: 3,},
	13: {Week: 5, Day: 1,},
}

WorkoutGroup1 = {
	Week: {
		1: {
			Day: {
				1: {
					ID: 1,
					// Patterns: {
					// 	1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
					// 	2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
					// 	3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
					// 	4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
					// 	5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
					// }
					Patterns: {
						1: {ExerciseType: "UB Hor Push", Reps: 8, RPE: 7, Type: "drop", DropValue: 7,},
						2: {ExerciseType: "UB Vert Pull", Reps: 7, RPE: 7, Type: "stop", StopRPE: 8.5,},
						3: {ExerciseType: "UB Hor Pull",  Sets: 4, Reps: 10, RPE: 7, Deload: -1},
						4: {ExerciseType: "Iso 1",  Sets: 3, Type: "bodyweight", Reps: 12, RPE: 7},
						5: {ExerciseType: "Iso 3",  Sets: 3, Type: "carry", Reps: 12, RPE: 7},
					}
				},
				2: {
					ID: 2,
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7,},
						3: {ExerciseType: "UB Vert Pull", Sets: 3, Reps: 10, RPE: 7,},		
						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7}
					}
				},
				3: {
					ID: 3,
					Patterns: {
						1: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7,},
						3: {ExerciseType: "Squat", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Post Chain", Sets: 3, Reps: null, RPE: 7}
					}
				}
			},
		},
		2: {
			Day: {
				1: {
					ID: 4,
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 4, Reps: 8, RPE: 7.5,},
						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 7.5,},
						3: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
					}
				},
				2: {
					ID: 5,
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7,},
						3: {ExerciseType: "UB Vert Pull", Sets: 3, Reps: 10, RPE: 7,},		
						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7}
					}
				},
				3: {
					ID: 6,
					Patterns: {
						1: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7,},
						3: {ExerciseType: "Squat", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Post Chain", Sets: 3, Reps: null, RPE: 7}
					}
				}
			}
		},
		3: {
			Day: {
				1: {
					ID: 7,
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 8,	Alloy: true, AlloyReps: 8},
						3: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: 10, RPE: 7}
					},
					Alloy: true
				},
				2: {
					ID: 8,
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
						2: {ExerciseType: "UB Hor Push", Sets: 4, Reps: 6, RPE: 7, Alloy: true, AlloyReps: 8},
						3: {ExerciseType: "UB Vert Pull", Sets: 4, Reps: 8, RPE: 7, Alloy: true, AlloyReps: 10},		
						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 10, RPE: 7}
					},
					Alloy: true
				},
				3: {
					ID: 9,
					Patterns: {
						1: {ExerciseType: "LB Uni Push", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
						2: {ExerciseType: "UB Hor Pull", Sets: 4, Reps: 8, RPE: 8, Alloy: true, AlloyReps: 10},
						3: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Post Chain", Sets: 3, Reps: 10, RPE: 7}
					},
					Alloy: true
				}
			},
		},		
		4: {
			Day: {
				1: {
					ID: 10,
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						2: {ExerciseType: "UB Vert Push", Sets: 2, Reps: 12, RPE: 5, Deload: -1},
						3: {ExerciseType: "Ant Chain", Sets: 2, Reps: null, RPE: 5,},		
						4: {ExerciseType: "Iso 3", Sets: 2, Reps: 15, RPE: 5,}, 
						5: {ExerciseType: "Carry", Sets: 2, Seconds:60}
					}
				},
				2: {
					ID: 11,
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						2: {ExerciseType: "UB Hor Push", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						3: {ExerciseType: "UB Vert Pull", Sets: 2, Reps: 15, RPE: 5, Deload: -2},		
						4: {ExerciseType: "Iso 1", Sets: 2, Reps: 15, RPE: 5,}, 
						5: {ExerciseType: "Post Chain", Sets: 2, Reps: null, RPE: 5}
					}
				},
				3: {
					ID: 12,
					Patterns: {
						1: {ExerciseType: "LB Uni Push", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						2: {ExerciseType: "UB Hor Pull", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						3: {ExerciseType: "UB Hor Push", Sets: 2, Reps: 15, RPE: 5, Deload: -2},		
						4: {ExerciseType: "Iso 4", Sets: 2, Reps: 15, RPE: 5,}, 
						5: {ExerciseType: "Carry", Sets: 2, Seconds: 60, Deload:-1}
					}
				}
			},
		},
		5: {
			Day: {
				1: {
					ID: 13,
					Patterns: {
						1: {ExerciseType: "UB Hor Push", Reps: 8, RPE: 7, Type: "drop", DropValue: 7,},
						2: {ExerciseType: "UB Vert Pull", RPE: 7, Type: "stop", StopRPE: 8.5,},
						3: {ExerciseType: "UB Hor Pull",  Sets: 4, Reps: 10, RPE: 7, Deload: -1},
						4: {ExerciseType: "Iso 1",  Sets: 3, Type: "bodyweight", Reps: 12, RPE: 7},
						5: {ExerciseType: "Iso 3",  Sets: 3, Reps: 12, RPE: 7},
					}
				}
			}
		}		
	},
}

// SampleStopDrop = {
// 	Block: 2, Week: 1, Day: 2, LevelGroup: 4, NumSubWorkouts: 5,
// 	SubWorkouts: {
// 		1: {ExerciseType: "UB Hor Push", Reps: 8, RPE: 7, Type: "drop", DropValue: 7,},
// 		2: {ExerciseType: "UB Vert Pull", RPE: 7, Type: "stop", StopRPE: 8.5,},
// 		3: {ExerciseType: "UB Hor Pull",  Sets: 4, Reps: 10, RPE: 7, Deload: -1},
// 		4: {ExerciseType: "Iso 1",  Sets: 3, Reps: 12, RPE: 7},
// 		5: {ExerciseType: "Iso 3",  Sets: 3, Reps: 12, RPE: 7},
// 	}
// }

// WorkoutSample = {
// 	Week: 1, Day: 1, LevelGroup:1, NumSubWorkouts: 5,
// 	SubWorkouts: {
// 		1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
// 		2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
// 		3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// 		4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// 		5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}}
// }
module.exports = {
	Group1Workouts: WorkoutGroup1,
	G1KeyCodes: WorkoutsKeyCode,
}  