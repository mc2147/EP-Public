"use strict";

// No split reps or RPEs, simple stuff
module.exports = {
	nWorkouts: 12, //13 to test
	Templates: {
		1: {
			1: {
				ID: 1,
				Week: 1,
				Day: 1,
				// Patterns: {
				// 	1: {ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7,},
				// 	2: {ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 7,	Alloy: true, AlloyReps: 8},
				// 	3: {ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1},		
				// 	4: {ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1}, 
				// 	5: {ExerciseType: "Ant Chain", Sets: 3, Reps: null, RPE: 7}
				// }
				// Squat		3 x 10	7
				// UB Vert Push		3 x 10	7
				// Hinge	-1	3 x 12	7
				// UB Hor Pull	-1	3 x 12	7
				// Ant Chain		3 x #	7				
				Patterns: {
					1: { ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7 },
					2: { ExerciseType: "UB Vert Push", Sets: 3, Reps: 10, RPE: 7 },
					3: { ExerciseType: "Hinge", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
					4: { ExerciseType: "UB Hor Pull", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Ant Chain", Sets: 3, Type: "bodyweight", Reps: 12, RPE: 7 } //Not all...
				}
			},
			2: {
				ID: 2,
				Week: 1,
				Day: 2,
				Patterns: {
					1: { ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7 },
					2: { ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7 },
					3: { ExerciseType: "UB Vert Pull", Sets: 3, Reps: 10, RPE: 7 },
					4: { ExerciseType: "LB Uni Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Iso 1", Sets: 3, Reps: 12, RPE: 7 }
				}
			},
			3: {
				ID: 3,
				Week: 1,
				Day: 3,
				Patterns: {
					1: { ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7 },
					2: { ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7 },
					3: { ExerciseType: "Squat", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
					4: { ExerciseType: "UB Hor Push", Sets: 3, Reps: 12, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Post Chain", Sets: 3, Reps: 12, RPE: 7 }
				}
			}
		},
		2: {
			1: {
				ID: 4,
				Week: 2,
				Day: 1,
				Patterns: {
					1: { ExerciseType: "Squat", Sets: 4, Reps: 8, RPE: 7.5 },
					2: { ExerciseType: "UB Vert Push", Sets: 4, Reps: 7.5 },
					3: { ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					4: { ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Ant Chain", Sets: 3, Reps: 12, RPE: 7 }
				}
			},
			2: {
				ID: 5,
				Week: 2,
				Day: 2,
				Patterns: {
					1: { ExerciseType: "Hinge", Sets: 4, Reps: 8, RPE: 7.5 },
					2: { ExerciseType: "UB Hor Push", Sets: 4, Reps: 8, RPE: 7.5 },
					3: { ExerciseType: "UB Vert Pull", Sets: 4, Reps: 8, RPE: 7.5 },
					4: { ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Iso 1", Sets: 3, Reps: 10, RPE: 7 }
				}
			},
			3: {
				ID: 6,
				Week: 2,
				Day: 3,
				Patterns: {
					1: { ExerciseType: "LB Uni Push", Sets: 4, Reps: 8, RPE: 7.5 },
					2: { ExerciseType: "UB Hor Pull", Sets: 4, Reps: 8, RPE: 7.5 },
					3: { ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					4: { ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Post Chain", Sets: 3, Reps: 12, RPE: 7 }
				}
			}
		},
		3: {
			1: {
				ID: 7,
				Week: 3,
				Day: 1,
				Patterns: {
					1: { ExerciseType: "Squat", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8 },
					2: { ExerciseType: "UB Vert Push", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8 },
					3: { ExerciseType: "Hinge", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					4: { ExerciseType: "UB Hor Pull", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Ant Chain", Sets: 3, Reps: 10, RPE: 7 }
				},
				Alloy: true
			},
			2: {
				ID: 8,
				Week: 3,
				Day: 2,
				Patterns: {
					1: { ExerciseType: "Hinge", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8 },
					2: { ExerciseType: "UB Hor Push", Sets: 4, Reps: 6, RPE: 7, Alloy: true, AlloyReps: 8 },
					3: { ExerciseType: "UB Vert Pull", Sets: 4, Reps: 8, RPE: 7, Alloy: true, AlloyReps: 10 },
					4: { ExerciseType: "LB Uni Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Iso 1", Sets: 3, Reps: 10, RPE: 7 }
				},
				Alloy: true
			},
			3: {
				ID: 9,
				Week: 3,
				Day: 3,
				Patterns: {
					1: { ExerciseType: "LB Uni Push", Sets: 4, Reps: 6, RPE: 8, Alloy: true, AlloyReps: 8 },
					2: { ExerciseType: "UB Hor Pull", Sets: 4, Reps: 8, RPE: 8, Alloy: true, AlloyReps: 10 },
					3: { ExerciseType: "Squat", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					4: { ExerciseType: "UB Hor Push", Sets: 3, Reps: 10, RPE: 7, Deload: -1 },
					5: { ExerciseType: "Post Chain", Sets: 3, Reps: 10, RPE: 7 }
				},
				Alloy: true
			}
		},
		4: {
			1: {
				ID: 10,
				Week: 4,
				Day: 1,
				Patterns: {
					1: { ExerciseType: "Squat", Sets: 2, Reps: 12, RPE: "5-6", Deload: -2 },
					2: { ExerciseType: "UB Vert Push", Sets: 2, Reps: 12, RPE: "5-6", Deload: -1 },
					3: { ExerciseType: "Ant Chain", Sets: 2, Reps: 12, RPE: "5-6" },
					4: { ExerciseType: "Iso 3", Sets: 2, Reps: 15, RPE: "5-6" },
					5: { ExerciseType: "Carry", Sets: 2, Seconds: 60, Reps: 60 }
				}
			},
			2: {
				ID: 11,
				Week: 4,
				Day: 2,
				Patterns: {
					1: { ExerciseType: "Hinge", Sets: 2, Reps: 12, RPE: "5-6", Deload: -2 },
					2: { ExerciseType: "UB Hor Push", Sets: 2, Reps: 12, RPE: "5-6", Deload: -2 },
					3: { ExerciseType: "UB Vert Pull", Sets: 2, Reps: 15, RPE: "5-6", Deload: -2 },
					4: { ExerciseType: "Iso 1", Sets: 2, Reps: 15, RPE: "5-6" },
					5: { ExerciseType: "Post Chain", Sets: 2, Reps: 12, RPE: "5-6" }
				}
			},
			3: {
				ID: 12,
				Week: 4,
				Day: 3,
				Patterns: {
					1: { ExerciseType: "LB Uni Push", Sets: 2, Reps: 12, RPE: "5-6", Deload: -2 },
					2: { ExerciseType: "UB Hor Pull", Sets: 2, Reps: 12, RPE: "5-6", Deload: -2 },
					3: { ExerciseType: "UB Hor Push", Sets: 2, Reps: 15, RPE: "5-6", Deload: -2 },
					4: { ExerciseType: "Iso 4", Sets: 2, Reps: 15, RPE: "5-6" },
					5: { ExerciseType: "Carry", Sets: 2, Reps: 60, Seconds: 60, Deload: -1 }
				}
			}
		}

	},
	getID: {
		1: {
			1: 1,
			2: 2,
			3: 3
		},
		2: {
			1: 4,
			2: 5,
			3: 6
		},
		3: {
			1: 7,
			2: 8,
			3: 9
		},
		4: {
			1: 10,
			2: 11,
			3: 12
		}
		// 5: {
		// 	1: 13,
		// }
	},
	getWeekDay: {
		1: { Week: 1, Day: 1 },
		2: { Week: 1, Day: 2 },
		3: { Week: 1, Day: 3 },
		4: { Week: 2, Day: 1 },
		5: { Week: 2, Day: 2 },
		6: { Week: 2, Day: 3 },
		7: { Week: 3, Day: 1 },
		8: { Week: 3, Day: 2 },
		9: { Week: 3, Day: 3 },
		10: { Week: 4, Day: 1 },
		11: { Week: 4, Day: 2 },
		12: { Week: 4, Day: 3 }
		// 13: {Week: 5, Day: 1,},
	}
};