var globalFuncs = require('../globals/functions');
	var getMax = globalFuncs.getMax;
	var getWeight = globalFuncs.getWeight;

function saveWorkout(body, refDict) {
	// console.log("saveWorkout (Line 2) \n");
	// console.log(body);
    // console.log(refDict);
    refDict["User"].save();
    var outputs = {};
    // Filling out "outputs" dict
    console.log("saveWorkout Line 12");
    console.log("thisPatterns 13", refDict["thisPatterns"]);
    for (var K in body) {
        var inputCode = K.split("|");
        if (!K.includes("|") || !inputCode) {
            continue;
        }        
        var patternID = parseInt(inputCode[0]); //Number (index + 1)
        var patternIndex = patternID - 1;
        var thisPattern = refDict["thisPatterns"][patternIndex];
        console.log("patternIndex 22", patternIndex);
        var _EType = thisPattern.type; //Getting undefined error
        var _nSets = thisPattern.sets;

        var inputType = inputCode[1];
        var setNum = parseInt(inputCode[2]);
        var setIndex = setNum - 1;


        var setDict = thisPattern.setList[setIndex];

        var input = parseInt(body[K]);
        var G_Stats = refDict["Stats"];
        var thisStats = G_Stats[_EType];

        // Input types: Weight, RPE, Tempo, Reps 
        if (inputType == "W" 
            && input && setNum <= _nSets) {
            setDict.Weight = parseInt(body[K]);
            if (setDict.RPE || thisPattern.workoutType == 'carry') {
                setDict.Filled = true;
            } 
        }
        else if (inputType == "RPE" 
            && input && setNum <= _nSets) {
            // setDict.RPE = parseFloat(body[K]);
            setDict.RPE = body[K];
            if (setDict.Weight) {
                setDict.Filled = true;
            }
            if (thisPattern.workoutType == "bodyweight" && setDict.Reps) {
                setDict.Filled = true;
            }
        }
        else if (inputType.includes("T") 
            && input && setNum <= _nSets) {
            setDict.Tempo.push(parseInt(body[K]));
        }
        else if (inputType == "Reps") {
            setDict.Reps = parseInt(body[K]);
            if (thisPattern.workoutType == 'bodyweight' && setDict.RPE) {
                console.log("395");
                setDict.Filled = true;
            }
        }
        // console.log("thisPattern.type: " + thisPattern.type);
        // Check if last set
        if (setNum == _nSets) {
            if (!(_EType in outputs)) {
                outputs[_EType] = {
                    Tempo: [],
                    Name: thisPattern.name, 
                    Reps: setDict.Reps,
                    Alloy: thisPattern.alloy,
                    AlloyReps: thisPattern.alloyreps,
                    ID: patternID,
                };
            }
            if (inputType == "W") {
                outputs[_EType].Weight = parseInt(body[K]);
            }
            else if (inputType == "RPE") {
                // outputs[_EType].RPE = parseFloat(body[K]);
                outputs[_EType].RPE = body[K];
                if(thisPattern.drop && thisPattern.specialStage) {
                    outputs[_EType].Weight = thisPattern.dropWeight;
                }
            }
            else if (inputType.includes("T")) {
                outputs[_EType].Tempo.push(parseInt(body[K]));
            }
        }
        // Check if alloy
        else if (inputCode[2] == "Alloy") {
            var RepPerformance = parseInt(body[K]);
            thisPattern.alloyperformed = RepPerformance;
            if (RepPerformance >= thisPattern.alloyreps) {
                
                thisStats.Status = Alloy.Passed;
                thisPattern.alloystatus = Alloy.Passed;
                
                console.log("ALLOY PASSED");				
            }
            else {
                
                thisStats.Status = Alloy.Failed;
                thisPattern.alloystatus = Alloy.Failed;

                console.log("ALLOY FAILED");				
            }
            
            var setDescription = RepPerformance + " Reps x " + thisPattern.alloyweight 
            + " lbs @ " + 10 + " RPE (Alloy) " + G_Stats[_EType].Status.string;
            console.log("_EType Error: " + _EType);
            thisStats.LastSet = setDescription;
            thisPattern.LastSet = setDescription;

            thisStats.Name = thisPattern.name;
            refDict["User"].save();
        }
    }
    // Updating stats from outputdict
    for (var EType in outputs) {
        var Val = outputs[EType];
        // If last set was filled completely
        if (Val.Weight && Val.RPE && Val.Reps) {
            var setDescription = Val.Reps + " Reps x " + Val.Weight + " lbs @ " + Val.RPE + " RPE";
            var thisPattern = refDict["thisPatterns"][Val.ID - 1];
            // Stop & Drop Sets
            if (thisPattern.stop) {
                console.log("stop set submitted");
                if (thisPattern.specialStage == 0) {
                    if (Val.RPE < thisPattern.specialValue) {
                        thisPattern.sets += 1;
                        thisPattern.setList.push({
                            SetNum: thisPattern.sets,
                            Weight: null,
                            RPE: null,
                            // Tempo: [null, null, null],
                            Filled: false,
                        });				 
                    }
                    else {
                        thisPattern.specialStage += 1;
                    }
                }
            }
            else if (thisPattern.drop) {
                console.log("drop set submitted. Drop Stage: " + thisPattern.dropStage);
                if (thisPattern.specialStage == 0) {
                    if (Val.RPE < thisPattern.RPE) {
                        thisPattern.sets += 1;
                        thisPattern.setList.push({
                            SetNum: thisPattern.sets,
                            Weight: null,
                            RPE: null,
                            // Tempo: [null, null, null],
                            Filled: false,
                        });				 
                    }
                    else {
                        thisPattern.specialStage += 1;
                        thisPattern.dropWeight =  Math.round(((100 - thisPattern.specialValue)/100)*Val.Weight);
                        // thisPattern.dropWeight = Val.Weight;
                        // thisPattern.dropWeight = (100 - thisPattern.specialValue);

                        thisPattern.sets += 1;
                        thisPattern.setList.push({
                            SetNum: thisPattern.sets,
                            Weight: thisPattern.dropWeight,
                            RPE: null,
                            // Tempo: [null, null, null],
                            Filled: false,
                        });				  					
                    }
                }
                else if (thisPattern.specialStage == 1) {
                    if (Val.RPE < thisPattern.RPE) {
                        thisPattern.sets += 1;
                        thisPattern.setList.push({
                            SetNum: thisPattern.sets,
                            Weight: thisPattern.dropWeight,
                            RPE: null,
                            // Tempo: [null, null, null],
                            Filled: false,
                        });				 
                    }
                    else {
                        thisPattern.specialStage += 1;
                    }
                }
            }

            var statDict = refDict["Stats"];
            var thisStat = statDict[EType];
            // console.log(thisStat, EType);
            console.log("_EType Error: " + EType);
            console.log("statDict", statDict);
            // console.log("thisStat: " + statDict)
            console.log(thisStat);
            thisStat.LastSet = setDescription; 
            thisStat.Name = thisPattern.name;
            thisPattern.LastSet = setDescription;

            console.log("	Calculating new max with inputs: " + Val.Weight + ", " + Val.Reps + ", " + Val.RPE);
            var newMax = getMax(Val.Weight, Val.Reps, Val.RPE);
            console.log("	New MAX: " + getMax(Val.Weight, Val.Reps, Val.RPE));

            // UserStats.ExerciseStats[EType].Max = newMax;
            G_Stats[EType].Max = newMax;
            thisPattern.Max = newMax;			

            // console.log("	oldMax: " + UserStats.ExerciseStats[EType].Max
            // + " newMax: " + getMax(Val.Weight, Val.Reps, Val.RPE));			
            // Alloy Set Case
            if (Val.Alloy) {
                var AlloyReps = Val.AlloyReps; 
                // var AlloyWeight = getMax(newMax, AlloyReps, 10);
                var AlloyWeight = getWeight(newMax, AlloyReps, 10);
                console.log("ALLOY SET: " + AlloyReps + " " + AlloyWeight);

                // Use These (BELOW)
                thisPattern.alloyweight = AlloyWeight;
                thisPattern.alloystatus = Alloy.Testing;

                thisStat.Status = Alloy.Testing;

                // console.log("Alloy Show: " + UserStats.CurrentWorkout.Patterns[Val.ID - 1].alloyshow);
                console.log("Alloy Show: " + thisPattern.alloyshow);
            }
        }
    }

    // Check General AlloyStatus Here	
    // console.log("Alloy Check: ");
    // console.log(refDict["Stats"]["Squat"]);
    // console.log(refDict["Stats"]["UB Hor Push"]);
    // console.log(refDict["Stats"]["Hinge"]);

    var squatStatus = refDict["Stats"]["Squat"].Status;
    var benchStatus = refDict["Stats"]["UB Hor Push"].Status;
    var hingeStatus = refDict["Stats"]["Hinge"].Status;

    refDict["Stats"]["Level Up"].Squat = squatStatus;
    refDict["Stats"]["Level Up"].UBHorPush = benchStatus;
    refDict["Stats"]["Level Up"].Hinge = hingeStatus;

    if (squatStatus == Alloy.Passed
        && benchStatus == Alloy.Passed
        && hingeStatus == Alloy.Passed) {
        refDict["Stats"]["Level Up"].Status = Alloy.Passed;
    }
    else if (squatStatus == Alloy.Failed
        || benchStatus == Alloy.Failed
        || hingeStatus == Alloy.Failed) {
        refDict["Stats"]["Level Up"].Status = Alloy.Failed;
    }
    else if (
        (squatStatus == Alloy.None || squatStatus == Alloy.Testing)
        || (benchStatus == Alloy.None || benchStatus == Alloy.Testing)
        || (hingeStatus == Alloy.None || hingeStatus == Alloy.Testing)
        ) {
        refDict["Stats"]["Level Up"].Status = Alloy.Testing;
    }

    refDict["User"].save();
}

module.exports = {
    saveWorkout,
}