import {getWorkoutDays} from '../globals/functions';
import {AllWorkouts, ExerciseDict} from '../data';
import {DaysofWeekDict} from '../globals/enums';
import {User, Video} from '../models';
import axios from 'axios';
import bcrypt from 'bcryptjs';
const saltRounds = 10;

function generateSalt(){
    return bcrypt.genSaltSync(saltRounds);
}

export async function signupUser(input) {
    var P1 = input.P1;
    var P2 = input.P2;
    var username = input.username;
    var salt = generateSalt();
    if (P1 == P2) {
        var hashedPassword = generateHash(P1, salt);
        User.create({
            id: 29,
            username: username,
            salt: salt,
            password: hashedPassword,
        }).then((user) => {
            return({
                user,
                session: {
                    userId: user.id,
                    username: username,
                    User: user,        
                }
            });
        }).catch((err) => {
            return({
                error: true,
                status: "error"
            })
        })
    }
    else {
        return false
    }
}

//Assigns a set of workouts to the user depending on level, start date, and workout days (list) 
export async function assignWorkouts(_User, input, newUser=false) {
    // console.log("creating workouts from: ", input);
    var dateSplit = input.startDate.split("-");
    var dateNow = Date.now();
    input.dateObj2 = new Date(
        parseInt(dateSplit[0]), 
        parseInt(dateSplit[1] - 1), 
        parseInt(dateSplit[2] - 1)); 
    var daysList = [
        parseInt(input["Day-1"]),
        parseInt(input["Day-2"]),
        parseInt(input["Day-3"]),
    ];
    var Level = parseInt(input.workoutLevel); //Determine N Workouts based on that
    var Group = 0;
    var Block = parseInt(input.workoutBlock);
    var TemplatesJSON = {};
    input.level = Level;
    if (Level <= 5) {
        Group = 1;
        TemplatesJSON = AllWorkouts[Group];
    }
    else if (Level <= 10) {
        Group = 2;
        TemplatesJSON = AllWorkouts[Group];
        daysList.push(parseInt(input["Day-4"]));
    }
    else if (Level <= 16) {
        Group = 3;
        // Block = "a";
        TemplatesJSON = AllWorkouts[Group][Block];
        daysList.push(parseInt(input["Day-4"]));
    }
    else {
        Group = 4;
        // Block = "a";
        TemplatesJSON = AllWorkouts[Group][Block];
        daysList.push(parseInt(input["Day-4"]));
    }
    var nWorkouts = Object.keys(TemplatesJSON.getWeekDay).length;
    input.nWorkouts = nWorkouts;
    input.daysList = daysList;
    
    var workoutDates = getWorkoutDays(input.dateObj2, daysList, Level, "", nWorkouts);
    input.workoutDates = workoutDates;
    input.detailedworkoutDates = [];
    workoutDates.forEach((elem) => {
        var item = [elem];
        item.push(DaysofWeekDict[elem.getDay()]);
        input.detailedworkoutDates.push(item);
    });
    var Templates = TemplatesJSON.Templates;
    input.workouts = {};
    for (var W in Templates) {
        var thisWeek = Templates[W];
        for (var D in thisWeek) {
                var ID = thisWeek[D].ID;
                input.workouts[ID] = {
                    ID: null,
                    Week: null,
                    Day: null,
                    Date: null,
                    Completed: false,
                    Patterns: [],
                };                 
                input.workouts[ID].Week = W;
                input.workouts[ID].Day = D;
                input.workouts[ID].ID = ID;
                var thisworkoutDate = workoutDates[ID - 1];
                input.workouts[ID].Date = thisworkoutDate;

                var subsURL = `/api/workout-templates/${_User.levelGroup}/block/${_User.blockNum}/week/${W}/day/${D}/subworkouts`;    
                var subsResponse = await axios.get(subsURL ,{ proxy: { host: 'localhost', port: 3000 }});
                var subsList = subsResponse.data;
                console.log("subList for: ", W, D, subsList.length);
                // input.workouts[ID].Patterns = subsList;
                // console.log("line 80 subsList",subsList);
                subsList.sort(function(a, b) {
                    return a.number - b.number
                });
                for (var i = 0; i < subsList.length; i++) {
                    var sub = subsList[i];
                    var patternInstance = sub.patternFormat;
                    var EType = sub.exerciseType;
                    if (EType == "Med Ball") {EType = "Medicine Ball";}
                    else if (EType == "Vert Pull") {EType = "UB Vert Pull";} 	
                    patternInstance.type = EType;
                    var EName = ExerciseDict.Exercises[patternInstance.type][Level].name;
                    patternInstance.name = EName;
                    console.log("97");
                    var findVideo = await Video.search(EName, false); 
                    console.log("99");
                    if (findVideo) {
                        patternInstance.hasVideo = true;
                        patternInstance.videoURL = findVideo.url;
                    }
                    input.workouts[ID].Patterns.push(patternInstance);
                    console.log("Pushing sub for Pattern: ", ID);                   
                }
                console.log(ID, "Patterns: ", input.workouts[ID].Patterns.length);
            }
    }
    _User.workouts = input.workouts;
    _User.currentWorkoutID = 1;
    _User.workoutDates = workoutDates;
    _User.resetStats = true;
}

