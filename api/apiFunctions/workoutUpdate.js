import {getWorkoutDays, getMax, getWeight, getPattern, dateString} from '../../globals/functions';
// var globalFuncs = require('../globals/functions');
// 	var getMax = globalFuncs.getMax;
// 	var getWeight = globalFuncs.getWeight;
// 	var getWorkoutDates = globalFuncs.getWorkoutDays;
//     var G_getPattern = globalFuncs.getPattern;
//     var dateString = globalFuncs.dateString;
import {AllWorkouts, ExerciseDict} from '../../data';
import {Alloy, DaysofWeekDict} from '../../globals/enums';
import {User, Video, WorkoutTemplate} from '../../models';
import axios from 'axios';

export async function updateSpecial(body, userInstance, vWID, PNum, type) {
    console.log("updateSpecial body: ", body);
    // 3 cases: alloy, stop, drop
    let maxStopSets = 3;
    let maxDropSets = 3;
    var allWorkouts = userInstance.workouts;
    var thisWorkout = allWorkouts[vWID];
    var thisPattern = thisWorkout.Patterns[PNum - 1]; //Patterns are sorted
    var lastSets = {};
    var allStats = userInstance.stats;
    for (var K in body) {
        var inputCode = K.split("|");
        console.log("K updateSpecial: ", K, "sets: " + thisPattern.sets);
        if (!K.includes("|") || !inputCode) {
            continue;
        }
        // console.log("inputCode: ", inputCode, "body[K]:", body[K]);
        var patternID = parseInt(inputCode[0]); //Number (index + 1)
        var patternIndex = patternID - 1;
        
        
        var _EType = thisPattern.type; //Getting undefined error
        var _nSets = thisPattern.sets;

        var inputType = inputCode[1];
        var setNum = parseInt(inputCode[2]);
        var setIndex = setNum - 1;


        var setDict = thisPattern.setList[setIndex];

        var input = parseInt(body[K]);
        
        var thisStats = allStats[_EType];

        // Getting Input types: Weight, RPE, Tempo, Reps 
        if (inputType == "W" 
            && input && setNum <= _nSets) {
            setDict.Weight = parseInt(body[K]);
            if (setDict.RPE || thisPattern.workoutType == 'carry') {
                setDict.Filled = true;
            } 
        }
        else if (inputType == "RPE" 
            && input && setNum <= _nSets
            && body[K] != "0" && parseInt(body[K]) != 0) {
            // Stop & drop first-set case: prevent first set from being the stop, first set from NOT being drop
            // STOP: FIRST SET MUST NOT BE STOP RPE
            // DROP: FIRST SET MUST BE DROP RPE
            if (setNum == 1) { //First set case
                if (thisPattern.workoutType == 'stop' 
                && (parseFloat(body[K]) >= parseFloat(thisPattern.specialValue)
                || parseFloat(body[K]) < parseFloat(thisPattern.RPE))) {
                    if (setDict.Weight) {
                        // thisPattern.stopWeight = setDict.Weight;
                    }
                    continue;
                }
                else if (thisPattern.workoutType == 'drop' 
                && parseFloat(body[K]) < parseFloat(thisPattern.dropRPE)) {
                    continue;
                }    
            }
            setDict.RPE = body[K];
            if (setDict.Weight) {
                setDict.Filled = true;
            }
            if (thisPattern.workoutType == "bodyweight" && setDict.Reps) {
                setDict.Filled = true;
            }
        }
        else if (inputType == "Reps") {
            setDict.Reps = parseInt(body[K]);
            if (thisPattern.workoutType == 'bodyweight' && setDict.RPE) {
                setDict.Filled = true;
            }
        }
        console.log('setDict: ', setDict);
        console.log('setNum: ', setNum);
        // Check if last set
        if (setNum == _nSets) {
            if (!(_EType in lastSets)) {
                lastSets[_EType] = {
                    Tempo: [],
                    Name: thisPattern.name, 
                    Reps: setDict.Reps,
                    Alloy: thisPattern.alloy,
                    AlloyReps: thisPattern.alloyreps,
                    ID: patternID,
                };
            }
            if (inputType == "W") {
                lastSets[_EType].Weight = parseInt(body[K]);
                if (setNum == 1 && thisPattern.workoutType == 'stop') {
                    lastSets[_EType].RPE = thisPattern.RPE; //if we want 1st set to be fixed
                    setDict.Filled = true;
                }
            }
            else if (inputType == "RPE") {
                lastSets[_EType].RPE = body[K];
                if(thisPattern.drop && thisPattern.specialStage) {
                    lastSets[_EType].Weight = thisPattern.dropWeight;
                }
            }
            else if (inputType.includes("T")) {
                lastSets[_EType].Tempo.push(parseInt(body[K]));
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
            + " lbs @ " + 10 + " RPE (Alloy) " + allStats[_EType].Status.string;
            console.log("_EType Error: " + _EType);
            thisStats.LastSet = setDescription;
            thisPattern.LastSet = setDescription;

            thisStats.Name = thisPattern.name;
        }
    }

    // userInstance.workouts = allWorkouts;    
    // userInstance.stats = allStats;

    // await userInstance.save();
    
    for (var EType in lastSets) {
        var Val = lastSets[EType];
        console.log('lastSet Val: ', Val);
        console.log('lastSet thisPattern: ', thisPattern);
        var lastSetStat = allStats[EType];
        // If last set was filled completely
        if (Val.Weight && Val.RPE && Val.Reps) {
            var setDescription = Val.Reps + " Reps x " + Val.Weight + " lbs @ " + Val.RPE + " RPE";
            var lastSetPattern = thisPattern;
            // Stop & Drop Sets
            //STOP SETS - starting RPE is pattern.RPE, stop RPE is pattern.specialValue
            if (thisPattern.stop) {
                let startingRPE = parseFloat(thisPattern.RPE);
                let stopRPE = parseFloat(thisPattern.specialValue);
                console.log("stop set submitted ", thisPattern.specialValue);
                console.log('lastsetPattern.sets: ', thisPattern.sets);
                let stopWeight = null;
                if (thisPattern.stopWeight) {
                    stopWeight = thisPattern.stopWeight;
                }
                else {
                    thisPattern.stopWeight = Val.Weight;
                    stopWeight = Val.Weight;
                }
                console.log("STOP WEIGHT: ", thisPattern.stopWeight, thisPattern.sets);
                // thisPattern.stopWeight = setDict.Weight;
                
                if (thisPattern.specialStage == 0) { //Stop RPE has not been hit 
                     // Non-stop-RPE case
                     console.log("SPECIALSTAGE == 0 ", Val.RPE, ' vs. ', stopRPE);
                    if (thisPattern.sets <= (maxStopSets)
                        && parseFloat(Val.RPE) < stopRPE) {
                        // if (thisPattern.sets != 0) {
                            thisPattern.sets += 1;
                            thisPattern.setList.push({
                                SetNum: thisPattern.sets,
                                Weight: stopWeight,
                                RPE: null,
                                Reps: thisPattern.reps,
                                gwParams: {
                                    Reps: thisPattern.reps,
                                    RPE: null
                                },                                            
                                // Tempo: [null, null, null],
                                Filled: false,
                            });				 
                            console.log("pushing to stop sets: ", stopWeight);
                        // }
                    }
                    // Stop-RPE case
                    else if (thisPattern.sets > 1) {
                        console.log("line 169");
                        thisPattern.specialStage += 1;
                    }
                    else {
                        console.log("continuing...");
                        continue;
                    }
                }
            }
            //DROP SETS
            else if (thisPattern.drop) {
                console.log("drop set submitted. Drop Stage: " + thisPattern.specialStage, thisPattern.SuggestedRPE, parseFloat(Val.RPE));
                if (thisPattern.specialStage == 0) {
                    // Add another set case (max of 3)
                    // if (thisPattern.sets <= (maxDropSets)
                    //     && parseFloat(Val.RPE) < thisPattern.dropRPE) {
                    //     thisPattern.sets += 1;
                    //     thisPattern.setList.push({
                    //         SetNum: thisPattern.sets,
                    //         Weight: null,
                    //         RPE: null,
                    //         SuggestedRPE: thisPattern.dropRPE,
                    //         Reps: thisPattern.reps,
                    //         Filled: false,
                    //     });				 
                    // }
                    // else {
                        thisPattern.specialStage += 1;
                        thisPattern.dropWeight =  Math.round(((100 - thisPattern.specialValue)/100)*Val.Weight);
                        thisPattern.sets += 1;
                        thisPattern.setList.push({
                            SetNum: thisPattern.sets,
                            Weight: thisPattern.dropWeight,
                            RPE: null,
                            SuggestedRPE: thisPattern.dropRPE,
                            gwParams: {
                                Reps: thisPattern.reps,
                                RPE: null
                            },                                                                    
                            Reps: thisPattern.reps,
                            Filled: false,
                        });				  					
                    // }
                }
                else if (thisPattern.specialStage == 1) {
                    if (thisPattern.sets <= (maxDropSets)
                        && parseFloat(Val.RPE) < thisPattern.dropRPE) {
                        thisPattern.sets += 1;
                        thisPattern.setList.push({
                            SetNum: thisPattern.sets,
                            Weight: thisPattern.dropWeight,
                            RPE: null,
                            SuggestedRPE: thisPattern.dropRPE,
                            gwParams: {
                                Reps: thisPattern.reps,
                                RPE: null
                            },                                                                    
                            Reps: thisPattern.reps,
                            Filled: false,
                        })
                    }
                    else {
                        thisPattern.specialStage += 1;
                    }
                }
            }
            
            lastSetStat.LastSet = setDescription; 
            lastSetStat.Name = thisPattern.name;
            thisPattern.LastSet = setDescription;

            console.log("	Calculating new max with inputs: " + Val.Weight + ", " + Val.Reps + ", " + Val.RPE);
            var newMax = getMax(Val.Weight, Val.Reps, Val.RPE);
            console.log("	New MAX: " + getMax(Val.Weight, Val.Reps, Val.RPE));

            lastSetStat.Max = newMax;
            thisPattern.Max = newMax;			

            // Alloy Set Case
            if (Val.Alloy) {
                var AlloyReps = Val.AlloyReps; 
                var AlloyWeight = getWeight(newMax, AlloyReps, 10);

                thisPattern.alloyweight = AlloyWeight;
                thisPattern.alloystatus = Alloy.Testing;
                lastSetStat.Status = Alloy.Testing;

                console.log("Alloy Show: ", thisPattern.alloystatus, " last set: ", EType, Val.ID);
            }
        }
    }    
    console.log("LINE 294 UPDATE SPECIAL");
    userInstance.stats = allStats;
    userInstance.workouts = allWorkouts;    

    // await userInstance.save();

    var squatStatus = userInstance.stats["Squat"].Status;
    var benchStatus = userInstance.stats["UB Hor Push"].Status;
    var hingeStatus = userInstance.stats["Hinge"].Status;

    var copiedStats = userInstance.stats;

    copiedStats["Level Up"].Squat = squatStatus;
    copiedStats["Level Up"].UBHorPush = benchStatus;
    copiedStats["Level Up"].Hinge = hingeStatus;

    // console.log("copied Level Up: \n\n", copiedStats["Level Up"]);
    // console.log("Level UP?", squatStatus.value == 1, benchStatus.value == 1, hingeStatus.value == 1)

    if (squatStatus.value == 1
        && benchStatus.value == 1
        && hingeStatus.value == 1) {
            copiedStats["Level Up"].Status = Alloy.Passed;
    }
    else if (squatStatus == Alloy.Failed
        || benchStatus == Alloy.Failed
        || hingeStatus == Alloy.Failed) {
            copiedStats["Level Up"].Status = Alloy.Failed;
    }
    else if (
        (squatStatus == Alloy.None || squatStatus == Alloy.Testing)
        || (benchStatus == Alloy.None || benchStatus == Alloy.Testing)
        || (hingeStatus == Alloy.None || hingeStatus == Alloy.Testing)
        ) {
            copiedStats["Level Up"].Status = Alloy.Testing;
    }
    // console.log("\n\n copied Level Up 2: \n\n", copiedStats["Level Up"]);
    
    userInstance.stats = copiedStats;
    userInstance.workouts = allWorkouts;
    await userInstance.save();

    // await axios.put(process.env.BASE_URL + `/api/users/${userInstance.id}/stats`, copiedStats);
    // await axios.put(process.env.BASE_URL + `/api/users/${userInstance.id}/workouts`, allWorkouts);
    // await userInstance.save();
    // console.log("WH 312 Patterns \n");
    // userInstance.workouts[vWID].Patterns.forEach((elem) => {
    //     console.log("alloy Status: ", elem.alloystatus);
    // })

    //Find the special set, update it appropriately, and save the user
}
