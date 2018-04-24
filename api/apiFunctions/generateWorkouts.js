import {getWorkoutDays} from '../../globals/functions';
import {AllWorkouts, ExerciseDict} from '../../data';
import {DaysofWeekDict} from '../../globals/enums';
import {User, Video, WorkoutTemplate} from '../../models';
import axios from 'axios';

export async function generateWorkouts(user, startDate, dayList, stringDate = false) {
    var output = {
        workoutDates:[],
        detailedworkoutDates:[],
        workouts:{},
    };
    var dateObj = startDate;
    if (stringDate) {
        var dateSplit = startDate.split("-");
        dateObj = new Date(
            parseInt(dateSplit[0]),
            parseInt(dateSplit[1]) - 1,
            parseInt(dateSplit[2]) - 1,
        );
    }
    var workoutDays = [
        parseInt(dayList[0]),
        parseInt(dayList[1]),
        parseInt(dayList[2]),        
    ]
    
    var Level = user.level; //Determine N Workouts based on this
    var Group = user.levelGroup;
    var Block = user.blockNum;

    var TemplatesJSON = {};
    
    if (Level <= 5) {
        Group = 1;
        TemplatesJSON = AllWorkouts[Group];
    }
    else if (Level <= 10) {
        Group = 2;
        TemplatesJSON = AllWorkouts[Group];
        workoutDays.push(parseInt(dayList[3]));
    }
    else if (Level <= 16) {
        Group = 3;
        TemplatesJSON = AllWorkouts[Group][Block];
        workoutDays.push(parseInt(dayList[3]));
    }
    else {
        Group = 4;
        TemplatesJSON = AllWorkouts[Group][Block];
        workoutDays.push(parseInt(dayList[3]));
    }

    var nWorkouts = Object.keys(TemplatesJSON.getWeekDay).length;

    var workoutDates = getWorkoutDays(dateObj, workoutDays, Level, "", nWorkouts);
    workoutDates.forEach((elem) => {
        var describer = [elem];
        describer.push(DaysofWeekDict[elem.getDay()]);
        output.detailedworkoutDates.push(describer);
    });

    user.workoutDates = workoutDates;
    output.workoutDates = workoutDates;

    var Templates = TemplatesJSON.Templates;
    for (var W in Templates) {
        var thisWeek = Templates[W];
        for (var D in thisWeek) {
                var ID = thisWeek[D].ID;
                console.log("generateWorkouts assigning workout #: ", ID, " to user: ", user.username);
                output.workouts[ID] = {
                    ID: null,
                    Week: null,
                    Day: null,
                    Date: null,
                    Completed: false,
                    Patterns: [],
                };                 
                output.workouts[ID].Week = W;
                output.workouts[ID].Day = D;
                output.workouts[ID].ID = ID;
                var thisworkoutDate = workoutDates[ID - 1];
                output.workouts[ID].Date = thisworkoutDate;
                var describerPrefix = "Level " + Level;
                var blockString = "";
                if (user.blockNum != 0) {
                    if (user.blockNum == 1) {
                        blockString = ", Block 1: Volume";
                    }
                    else if (user.blockNum == 2) {
                        blockString = ", Block 2: Strength/Power";
                    }
                } 
                var Describer = describerPrefix + blockString + " - " + " Week " + W + ", Day " + D;
                output.workouts[ID].Describer = Describer;

                var relatedTemplate = await WorkoutTemplate.findOne({
                    where: {
                        levelGroup: Group,
                        block: Block,
                        week: W,
                        day: D,
                    }
                });
                var subsList = await relatedTemplate.getSubWorkouts();

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
                    var findVideo = await Video.search(EName, false); 
                    if (findVideo) {
                        patternInstance.hasVideo = true;
                        patternInstance.videoURL = findVideo.url;                        
                        patternInstance.selectedVideo = {
                            URL: findVideo.url,
                            label: findVideo.title,
                            image: "../../static/video_placeholder.png",                        
                            description: findVideo.description,
                            LevelAccess: findVideo.levelAccess,
                        };                            

                        var LevelList = [];
                        for (var i = 1; i <= 25; i++) {
                            LevelList.push(i);
                        }
                        patternInstance.selectedVideo.levels = LevelList.slice(findVideo.LevelAccess - 1);
                    }
                    output.workouts[ID].Patterns.push(patternInstance);
                }
            }
    }
    user.workouts = output.workouts;
    user.currentWorkoutID = 1;
    user.resetStats = true;
    user.save();
    return output;
}