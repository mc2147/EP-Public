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
				status: 'Empty',
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
		if (Pattern.alloy) {
			subDict.alloyStage = Pattern.alloystatus.value;
		}	
		vueSubworkouts.push(subDict);			
	}

	return  {
		date: vueConvert.Date(refDict["thisWorkoutDate"]),
		subworkouts: vueSubworkouts,
	};
}

module.exports = {
    vueConvert,
    getVueInfo,
}