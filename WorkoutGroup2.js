// Day 3		S x R	RPE	A
// Hinge		10, 8, 6, #	7,7.5,8,10	8+
// UB Hor Push		10, 8, 6, #	7,7.5,8,10	8+
// Vert Pull		12, 10, 8, #	7,7.5,8,10	10+
// LB Uni Push	-1	3 x 8	7	
// Iso 1		3 x 12	7	
// Iso 2		3 x 12	7	

SampleWorkout_Group2 = {
	Week: 3, Day: 3, LevelGroup: 2, NumSubWorkouts: 6,
	SubWorkouts: {
		1: {ExerciseType: "Hinge", Sets: 4, StaggeredReps: [10, 8, 6], StaggeredRPE: [7, 7.5, 8], Alloy: true, AlloyReps: 8},
		2: {ExerciseType: "UB Hor Push", Sets: 4, StaggeredReps: [10, 8, 6], StaggeredRPE: [7, 7.5, 8], Alloy: true, AlloyReps: 8},
		2: {ExerciseType: "Vert Pull", Sets: 4, StaggeredReps: [12, 10, 8], StaggeredRPE: [7, 7.5, 8], Alloy: true, AlloyReps: 10},
		4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 8, RPE: 7, Deload: -1}, 
		5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7},
		6: {ExerciseType: "Iso 2", Sets: 3, Reps: 12, RPE: 7}
	},
}

Group2Workouts = {
	Week: {
		1: {
			Day: {
				1: {
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
						3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
					}
				},
				2: {
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7,},
						3: {ExerciseType: "Vert Pull", Sets: 3, Reps: 10, RPE: 7,},		
						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7}
					}
				},
				3: {
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
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 4, Reps: 8, RPE: 7.5,},
						2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 7.5,},
						3: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1},		
						4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
					}
				},
				2: {
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7,},
						2: {ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7,},
						3: {ExerciseType: "Vert Pull", Sets: 3, Reps: 10, RPE: 7,},		
						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7}
					}
				},
				3: {
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
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8},
						2: {ExerciseType: "UB Hor Push", Sets: 4, Reps: 6, RPE: 7, Alloy: true, AlloyReps: 8},
						3: {ExerciseType: "Vert Pull", Sets: 4, Reps: 8, RPE: 7, Alloy: true, AlloyReps: 10},		
						4: {ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1}, 
						5: {ExerciseType: "Iso 1", Sets: 3, Reps: 10, RPE: 7}
					},
					Alloy: true
				},
				3: {
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
					Patterns: {
						1: {ExerciseType: "Squat", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						2: {ExerciseType: "UB Vert Push", Sets: 2, Reps: 12, RPE: 5, Deload: -1},
						3: {ExerciseType: "Ant Chain", Sets: 2, Reps: null, RPE: 5,},		
						4: {ExerciseType: "Iso 3", Sets: 2, Reps: 15, RPE: 5,}, 
						5: {ExerciseType: "Carry", Sets: 2, Seconds:60}
					}
				},
				2: {
					Patterns: {
						1: {ExerciseType: "Hinge", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						2: {ExerciseType: "UB Hor Push", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						3: {ExerciseType: "Vert Pull", Sets: 2, Reps: 15, RPE: 5, Deload: -2},		
						4: {ExerciseType: "Iso 1", Sets: 2, Reps: 15, RPE: 5,}, 
						5: {ExerciseType: "Post Chain", Sets: 2, Reps: null, RPE: 5}
					}
				},
				3: {
					Patterns: {
						1: {ExerciseType: "LB Uni Push", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						2: {ExerciseType: "UB Hor Pull", Sets: 2, Reps: 12, RPE: 5, Deload: -2},
						3: {ExerciseType: "UB Hor Push", Sets: 2, Reps: 15, RPE: 5, Deload: -2},		
						4: {ExerciseType: "Iso 4", Sets: 2, Reps: 15, RPE: 5,}, 
						5: {ExerciseType: "Carry", Sets: 2, Seconds:60, Deload:-1}
					}
				}
			},
		},		
	},
}

WorkoutSample = {
	Week: 1, Day: 1, LevelGroup:1, NumSubWorkouts: 5,
	SubWorkouts: {
		1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
		2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
		3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
		4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
		5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}}
}

module.exports = {
	Group2Workouts,	
}