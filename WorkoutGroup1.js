// WorkoutSample = {
// 	Week: 1, Day: 1, LevelGroup:1, NumSubWorkouts: 5,
// 	SubWorkouts: {
// 		1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
// 		2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
// 		3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
// 		4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
// 		5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}}
// }
WorkoutGroup1 = {
	Week: {
		1: {
			Day: {
				1: {
					ID: 1,
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
						3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
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
	},
}

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
}  