import session from 'express-session';
// const session = require('express-session');
var Promise = require("bluebird");
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const axios = require('axios');
// import axios from 'axios';

var models = require('../models');
	var Exercise = models.Exercise;
	var WorkoutTemplate = models.WorkoutTemplate;
	var SubWorkoutTemplate = models.SubWorkoutTemplate;
	var Workout = models.Workout;
	var User = models.User;
// import * from '../models';

var userFuncs = require('../models/createUser');
	var setUser = userFuncs.SetUser;

var data = require('../data');
	var G1KeyCodes = data.Workouts1.getWeekDay;
	var Group1WDtoID = data.Workouts1.getID;
	var ExerciseDict = data.ExerciseDict.Exercises;
	var RPE_Dict = data.RPETable;
	var allWorkoutJSONs = data.AllWorkouts;
	// var Group1Workouts = require('../WorkoutGroup1');

var globalEnums = require('../globals/enums');
	var Alloy = globalEnums.Alloy;
	
var globalFuncs = require('../globals/functions');
	var getMax = globalFuncs.getMax;
	var getWeight = globalFuncs.getWeight;
	var getWorkoutDates = globalFuncs.getWorkoutDays;
	var G_getPattern = globalFuncs.getPattern;

var vueAPI = require('./vueAPI');
	var getVueInfo = vueAPI.getVueInfo;
	var vueConvert = vueAPI.vueConvert;

var workoutHandlers = require('./workoutHandlers');
	var saveWorkout = workoutHandlers.saveWorkout;

var Videos = require('../data/JSON/Videos');
	var getVideos = Videos.getVideos;
	var videosJSON = Videos.VideosJSON;
	
var UserLevel = 1

var postURL = "postWorkout";
var getURL = "getWorkout";

var herokuURL = "https://immense-mesa-37246.herokuapp.com/";
var localURL = "http://localhost:3000/"
var baseURL = process.env.PORT ? herokuURL : localURL;

console.log("what is baseURL: ", baseURL);
console.log("what is process.env.BASE_URL: ", process.env.BASE_URL)


var levelGroupsDict = {
	// Add Week and Day list here too
	1: [1, 2, 3, 4, 5],
	2: [6, 7, 8, 9, 10],
	3: [11, 12, 13, 14, 15],
	4: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
}

// -Put everything together for entire flow
// 	user initial creation + workout generation 
// 		-> going through workouts + updating stats 
// 			-> level-check 
// 				-> stashing old workouts/stats + generate next set of workouts -> repeat

// var Alloy = {
// 	None: {value: 0, name: "None", code: "N", string: "None"},
// 	Testing: {value: 2, name: "Test", code: "T", string: "Testing"},
// 	Passed: {value: 1, name: "Passed", code: "P", string: "Passed"},
// 	Failed: {value: -1, name: "Failed", code: "F", string: "Failed"},
// }

// Ref Dict
// Default Ref Dict
var selectedWeek = 1;
var selectedDay = 1;
var WeekList = [1, 2, 3, 4];
var DayList = [1, 2, 3];

console.log("TEST: "); 

// var viewingWorkoutID = 1;

function displayDict(user, viewingWID) {
	
}

function userRefDict(user, viewingWID) {
	var output = {};
	output["User"] = user;
	output["Stats"] = user.stats;
	
	output["Workouts"] = user.workouts;

	var thisWorkoutID = viewingWID;

	output["thisWorkoutID"] = viewingWID;
	output["Level"] = user.level;

	selectedWeek = user.workouts[viewingWID].Week;
	selectedDay = user.workouts[viewingWID].Day;	

	output["thisWorkoutDate"] = user.workoutDates[user.viewingWID - 1];
	output["thisPatterns"] = user.workouts[thisWorkoutID].Patterns;

	output["levelGroup"] = user.levelGroup;
	output["blockNum"] = user.blockNum;
	output["thisLevels"] = levelGroupsDict[user.levelGroup];

	return output
}

function dateString(date) {
	var MonthDict = {
		1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
		7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December",
	}
	var output = "";
	var year = date.getFullYear();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	// var suffix = ""
	output = MonthDict[month] + " " + day + ", " + year;
	return output
}

var userFound = false; 
var thisUser; 
var thisPatterns;
var G_thisStats;
var G_UserInfo;

//Use this to assign to req.session later
function loadUserInfo(id) {
	return User.findById(id).then(user => {
		// if (user.workouts.loaded) {		
			G_UserInfo = userRefDict(user, user.currentWorkoutID);
			thisUser = G_UserInfo["User"];
			G_thisStats = G_UserInfo["Stats"];
			thisPatterns = G_UserInfo["thisPatterns"];
			// console.log("Creating User Ref Dict: ");
			userFound = true;
		// }
	});
}

// loadUserInfo(1);

router.get('/show-videos', function (req, res) {
	res.json(getVideos(VideosJSON, thisUser.level));
});

router.get('/' + getURL, function(req, res) {

	console.log("G_vueOutput", G_vueOutput);
	res.json(G_vueOutput);
})

var thisUserID = 5;

var thisUserName = "UserName5";
// var thisUserName = "UserName4";

var allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
var daysOfWeek = [
	[1, "Monday"], 
	[2, "Tuesday"], 
	[3, "Wednesday"], 
	[4, "Thursday"], 
	[5, "Friday"], 
	[6, "Saturday"],
	[0, "Sunday"], 
];

var DaysofWeekDict = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday",
}

router.get('/signup',
	async function(req, res, next) {
		res.render("signup");
	}
)

router.get('/login',
	async function(req, res, next) {
		res.render("login");
	}
)

router.post('/signup',
	async function(req, res, next) {
		res.render(req.body);
	}
)
router.post('/login',
	async function(req, res, next) {
		res.json(req.body);
	// 	res.render("createWorkouts", {allLevels, daysOfWeek});
	}
)

// function getWorkoutDays (startDate, daysList, level, member, nWorkouts) {
// 	var checkDays = 28;
// 	var output = [];
//     var count = 0;
// 	var test = [];
//     var i = 1;
//     while (count < nWorkouts) {
// 		var _DayTime = startDate.getTime() + DayValue*i;
// 		var _Day = new Date(_DayTime);
// 		var _weekDay = _Day.getDay(); //Sunday is 0, Saturday is 6
// 		if (daysList.indexOf(_weekDay) >= 0) {
// 			output.push(_Day);
// 			count ++;
//         }
//         i ++;
//     }
// 	return output;
// }


function rescheduleWorkouts(user, newStart, daysOfWeek, n=0) {
	let Now = new Date(Date.now());
	let nIncomplete = 0;
	let nComplete = 0;
	let defaultShift = 0;
	console.log("user: ", user);
	let completedDates = [];
	for (var K in user.workouts) {
		let W = user.workouts[K];
		let wDate = new Date(W.Date);
		if (parseInt(K) <= 3) {
			// console.log("K <= 3: ", K);
			W.Completed = true;		
		}
		
		if (W.Completed) {
			nComplete ++;
			completedDates.push(wDate);
		}
		else {
			nIncomplete ++;
			if (wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth()) {
				defaultShift ++;
			}
		}
	}	
	// let pastW
	console.log("completedDates: ", completedDates);
	let newIncompleteDates = getWorkoutDates(newStart, daysOfWeek, 0, "", nIncomplete);
	console.log("newIncompleteDates: ", newIncompleteDates, "nIncomplete: ", nIncomplete);
	let newDates = completedDates.concat(newIncompleteDates);
	console.log("newDates: ", newDates, newDates.length);
	let dateIndex = 0;
	let newDateObj = {};
	// console.log("user: ", user);
	for (var K in user.workouts) {
		let W = user.workouts[K];
		if (!W.Completed) {
			W.Date = newDates[dateIndex];
		}
		dateIndex ++;
	}
	return newDates;
}

router.post('/reschedule', async function(req, res, next) {
	console.log("posting to reschedule...");
	console.log("req.body: ", req.body);
	console.log("new start date: ", new Date(req.body.restartDate));
	let newStartDate = new Date(req.body.restartDate);
	let userId = 5;
	if (req.session.User) {
		userId = req.session.User.id;
	}
	var thisUserURL = process.env.BASE_URL + "/api/users/" + userId;
	let userResponse = await axios.get(thisUserURL);
	let user = userResponse.data;
	if ('DoW' in req.body) {
		let DoWArray = [];
		req.body.DoW.forEach(day => {
			DoWArray.push(parseInt(day));
		})
		console.log('old workout dates: ', user.workoutDates);
		// let rescheduled = rescheduleWorkouts(user, newStartDate, [0, 1, 2]);
		await axios.post(`${thisUserURL}/reschedule-workouts`, {
			restartDate:newStartDate,
			DoW:DoWArray,
		})
	}
	res.redirect('/reschedule');
})

router.get('/reschedule', async function(req, res, next) {
	// You have N incomplete workouts, select a new start date and 3/4 days of the week to reschedule your remaining workouts.
	let userId = 5;
	if (req.session.User) {
		userId = req.session.User.id;
	}
	var thisUserURL = process.env.BASE_URL + "/api/users/" + userId;
	let userResponse = await axios.get(thisUserURL);
	let userData = userResponse.data;
	let workoutList = [];
	let nIncomplete = 0;
	let nComplete = 0;
	// let Now = new Date(Date.now());
	let Now = new Date(Date.now());
	// console.log("Now: ", Now, Now.getDate());
	for (var K in userData.workouts) {
		let W = userData.workouts[K];
		let wDate = new Date(W.Date);

		// console.log("K: ", K);
		// TESTING ONLY -> MAKING FIRST 3 COMPLETE
		// if (parseInt(K) <= 3) {
		// 	// console.log("K <= 3: ", K);
		// 	W.Completed = true;		
		// }
		// console.log("W.Completed: ", W.Completed);
		// workoutList.push(W);
		if (W.Completed) {
			// console.log("W.Completed 2: ", W.Completed);
			nComplete ++;
		}
		else {
			if (wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth()) {
				// console.log(wDate.getDate(), " less than...");
				nIncomplete ++;
			}
		}
		let listObj = Object.assign({}, W);
		listObj.dateString = W.Date.toString();
		workoutList.push(listObj);		
	}
	workoutList.sort(function(a, b) {
		return a.ID - b.ID; 
	})
	// console.log("workoutList: ", workoutList);
	let DayValue = 24*3600*1000;	
	let newStartDate = new Date(Date.now() - DayValue*5);
	// console.log("rescheduledWorkouts: ", rescheduleWorkouts(userData, newStartDate, [0, 1, 2], nIncomplete));
	
	res.render('reschedule', {
		Now:Now,
		workouts:userData.workouts,
		workoutList,
		username:userData.username,
		user:userData,
		nComplete,
		nIncomplete,
	})
})

router.get('/change-subscription', async function(req, res, next) {
	res.render('changesubscription', {})
})



router.get('/get-next-workouts',
	async function(req, res, next) {
		var _User = await User.findById(req.session.userId);	
		// res.json(_User);
		var dateNow = new Date(Date.now());
		var month = dateNow.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		var date = dateNow.getDate();
		if (date < 10) {
			date = "0" + date;
		}
		var currDate = dateNow.getFullYear() + "-" + month + "-" + date;
		// console.log("currDate: ", currDate);
		// console.log("req.session", req.session);
		res.render("createWorkouts", {allLevels, daysOfWeek, User: _User, currDate});
	}
)

router.post('/get-next-workouts',
	async function(req, res, next) {
		if (!req.session.userId) {
			req.session.userId = 8;
		}
		console.log("posting to api with user id: ", req.session.userId);
		// 
		// console.log("req.session", req.session);
		var axiosPost = await axios.post(process.env.BASE_URL + `/api/users/${req.session.userId}/get-next-workouts`, req.body);
		res.json(axiosPost.data);
		// res.send("test from routes");
		return		
	}
)

router.post('/subscribe',
	async function (req, res, next) {
		if (!req.session.userId) {
			req.session.userId = 5;
		}
		console.log("posting to api/users/:id/subscribe with user id: ", req.session.userId);
		// console.log("req.session", req.session);
		var axiosPost = await axios.post(process.env.BASE_URL + `/api/users/${req.session.userId}/subscribe`, req.body);
		res.json(axiosPost.data);
		// res.send("test from routes");
		return		
	}
)

var G_vueOutput = {};

router.get('/', 
	async(req, res, next) => {	
	if (!req.session.username) {
		req.session.username = thisUserName;
		console.log("line 284 getting hit: ", thisUserName);
		User.findAll({
			where:{}
		}).then(users => {
			// console.log("ALL USERS: ", users);
		})
	}
	console.log("req.session.username: ", req.session.username);
	req.session.User = await User.findOne({where: {username: req.session.username}});
	if (!req.session.User) {
		res.send("no user")
		return
	}
	req.session.userId = req.session.User.id;
	var thisUserURL = process.env.BASE_URL + "/api/users/" + req.session.userId;
	axios.get(thisUserURL)
	.then(res => res.data)
	.then(user => {// console.log("FINDING CURRENT USER: ", user);
		} 
	);
	var loginTestURL = process.env.BASE_URL + "/api/users/" + req.session.username + "/login";
	// axios.post(loginTestURL, {
	// 	username: req.session.username,
	// 	password: "Password5",
	// }).then(res => res.data)
	// .then(status => {
	// 	// console.log("LOGIN POST WORKS!!!", status);
	// })
	

	if (!req.session.viewingWID) {
		req.session.viewingWID = req.session.User.currentWorkoutID;
	}

	req.session.viewingWorkout = req.session.User.workouts[req.session.viewingWID];	
	if (!req.session.User) {
		render();
		return
	}
	if (!req.session.viewingWID) {
		req.session.viewingWID = 1;
	}

	console.log("req.session.viewingWID: ", req.session.viewingWID);
	var TemplateID = req.session.viewingWID;
	var wDateIndex = req.session.viewingWID - 1;
	req.session.viewingWorkoutDate = req.session.User.workoutDates[wDateIndex];
	var _Level = req.session.User.level;
	var thisworkoutDate = req.session.User.workouts[TemplateID].Date;
	// console.log("432 test");

	//Change to req.session later
	if (
		// req.session.User.workouts[TemplateID].Patterns.length != 0
		req.session.User.workouts[req.session.viewingWID].Patterns.length != 0
		// ||  G_UserInfo["thisPatterns"].length != 0
	) {
		console.log("LINE 219");
		// G_UserInfo["thisPatterns"] = req.session.User.workouts[TemplateID].Patterns;
		// G_UserInfo["thisWorkout"] = req.session.User.workouts[TemplateID];
		render();
		return
	}

	render();
	
	async function render() {
		console.log("RENDER FUNCTION");
		// VUE STUFF		
		req.session.viewingWorkout = req.session.User.workouts[req.session.viewingWID];
		let vueJSON = req.session.viewingWorkout;
		vueJSON.thisWorkoutDate = new Date(req.session.User.workoutDates[req.session.viewingWID - 1]);
		let vueInfo = getVueInfo(vueJSON);
		G_vueOutput = vueInfo;
		G_vueOutput.workoutDates = req.session.User.workoutDates;
		// res.json(thisWorkout);
		
		var changeWorkoutList = [];
		var  WorkoutDict = req.session.User.workouts;
		for (var K in WorkoutDict) {
			var Workout = WorkoutDict[K];
			if (!Workout.ID) {
				continue;
			}
			var _W = Workout.Week;
			var _D = Workout.Day;
			var wID = Workout.ID;
			// var date = G_UserInfo["User"].workoutDates[wID - 1];
			var date = dateString(req.session.User.workoutDates[wID - 1]);
			// console.log("date", date, _W, _D, K);
			changeWorkoutList.push({Week: _W, Day: _D, Date: date, ID: wID});		
		}

		// console.log("379 user workouts", req.session.User.workouts);

		// thisUser.stats = G_UserInfo["User"].stats;
		// var workoutsClone = thisUser.workouts;
		var workoutsClone = req.session.User.workouts;		
		// console.log("379 viewingWID", req.session.viewingWID);
		// workoutsClone[req.session.viewingWID].Patterns = G_UserInfo["thisPatterns"];
		// req.session.User.workouts = workoutsClone;


		await req.session.User.save();
		// G_UserInfo["User"].save()
		// req.session.User.save().then(() => {
		var realUser = await User.findById(req.session.userId);
		realUser.workouts = req.session.User.workouts;
		await realUser.save();
		// req.session.User = await User.findById(req.session.userId);
		var thisWorkout = req.session.User.workouts[req.session.viewingWID];
		// console.log("thisWorkout 378", thisWorkout);
		var vWID = req.session.viewingWID;
		var WDateList = req.session.User.workoutDates;
		// console.log("RPEOptions", RPE_Dict["Options"]);
		// console.log("RPEDIct", RPE_Dict);
		sessionSave = req.session;
			res.render('main', 
			{
				User: req.session.User,
				ETypes: ExerciseDict["Types"],
				CurrentDate: dateString(WDateList[req.session.User.currentWorkoutID - 1]),
				ViewingDate: dateString(WDateList[req.session.viewingWID - 1]),
				ViewingWorkout: thisWorkout,
				thisWorkoutID: req.session.viewingWID,
				Patterns: thisWorkout.Patterns,				
				UserStats: req.session.User.stats,			

				levelUp: req.session.User["Level Up"],
				UBpressStat: req.session.User["UB Hor Push"],
				squatStat: req.session.User["Squat"],
				hingeStat: req.session.User["Hinge"],
				RPEOptions: RPE_Dict["Options"],
				selectedWeek,
				selectedDay,				
				selectWorkoutList: changeWorkoutList,
				allWorkouts: req.session.User.workouts,
				thisLevels: levelGroupsDict[req.session.User.levelGroup],
			});
	}
});

var sessionSave = {};

router.get('/tutorial', function (req, res) {
	res.render('tutorial');
});

router.post('/' + postURL, async (req, res) => {	
	
	
	var outputs = {};	
	var _User = sessionSave.User; //req.session could be empty because of CORS
	var _WID = sessionSave.viewingWID;
	var putBody = {};
	putBody = req.body;
	// putBody.viewingWID = _WID;
	// console.log("567", axiosPutResponse.data);
	var WorkoutURL = process.env.BASE_URL + `/api/users/${_User.id}/workouts/${_WID}`;
	for (var K in req.body) {
		if (K.startsWith("g")) {
			console.log("found K: ", K);
			console.log("getNextSet Code: ", K.split("|"));
			let codeList = K.split("|");
			let patternNum = parseInt(codeList[2]);
			let specialType = parseInt(codeList[1]);
			putBody.patternNum = patternNum;
			putBody.specialType = specialType;
			// putBody.saveAlso = true;
			var axiosPutResponse = await axios.put(`${WorkoutURL}/pattern/${patternNum}/update`, putBody);
			res.redirect('/');
			return;
		}
	}
	
	if (req.body.SaveBtn) {
		var axiosPutResponse = await axios.put(WorkoutURL + "/save", putBody);
		res.redirect('/');
		return;
	}
	
	if (req.body.SubmitBtn) {
		console.log("submitURL: ", WorkoutURL);
		var axiosPutResponse = await axios.put(WorkoutURL + "/submit", putBody);
		if (axiosPutResponse.data.lastWorkout) {
			res.redirect('/level-up');
			return		
		}
		else {
			res.redirect('/');
			return			
		}
		// console.log("completing workout...");
		// var usr = G_UserInfo["User"];
		// // console.log(usr.workouts);
		// var wID = G_UserInfo["thisWorkoutID"];
		// // usr.currentworkoutID;
		// console.log(wID);
		// usr.workouts[wID].Completed = true;
		// usr.save();
		// thisUser.workouts = usr.workouts;
		// thisUser.save();
		// G_UserInfo["thisWorkout"].Completed = true;
		// G_UserInfo["User"].workouts[]
		// G_UserInfo["User"].save();
		res.redirect('/');
	}
	
	if (req.body.changeLevel || req.body.changeLGroup) {
		res.redirect('/');
		return;
	}

	// console.log("333");
	if (req.body.changeWorkoutBtn || req.body.NextBtn || req.body.PrevBtn) {
		if (req.body.changeWorkoutBtn) {
			var selectedWD = req.body.changeWorkoutSelect.split("|");
			var _W = parseInt(selectedWD[0]);
			var _D = parseInt(selectedWD[1]);
			var newWID = parseInt(req.body.changeWorkoutSelect);
			
			var newWorkout = req.session.User.workouts[req.body.changeWorkoutSelect];

			selectedWeek = parseInt(newWorkout.Week);
			selectedDay = parseInt(newWorkout.Day);
			// console.log("NEW WORKOUT ID: " + req.body.changeWorkoutSelect);
			// console.log("NEW WORKOUT: ", newWorkout, "Week: " + selectedWeek, "Day: " + selectedDay);
			// Using req.session
			req.session.viewingWID = newWID;
			// console.log("new WID: " + req.session.viewingWID
			// + " week: " + selectedWeek + " day: " + selectedDay);
			res.redirect('/');
			return;
		}
		else if (req.body.NextBtn || req.body.PrevBtn) {
			var nWorkouts = req.session.User.workoutDates.length;
			// console.log("nWorkouts: " + nWorkouts);
			var nextWorkoutID = req.session.viewingWID + 1;
			if (req.body.PrevBtn) {
				nextWorkoutID = req.session.viewingWID - 1;
				if (req.session.viewingWID == 1) {
					nextWorkoutID = nWorkouts;	
				}			
			} 
			if (nextWorkoutID > nWorkouts) {
				// console.log("redirecting to workout: " + nextWorkoutID);
				//"Submit" last workout here
				var levelUpStats = req.session.User.stats["Level Up"];
				if (!_User.stats["Level Up"].Status.Checked && _User.stats["Level Up"].Status.value == 1) {
					_User.level ++;
				}
				_User.stats["Level Up"].Status.Checked = true;
				// console.log("Going to level-up: ", _User.stats["Level Up"].Status);
				_User.changed( 'stats', true);
				await _User.save();
				// res.json(_User);
				res.redirect('/level-up');
				return
				// Test user here
			}
			// console.log("next Workout ID: " + nextWorkoutID);
			// G_UserInfo["thisWorkoutID"] = nextWorkoutID;
			// NOOOO
			//USE "VIEWING WORKOUT ID"
			// G_UserInfo["User"].currentWorkoutID = nextWorkoutID; 

			// Using req.session
			// console.log("nextWorkoutID 512", nextWorkoutID);
			selectedWeek = req.session.User.workouts[nextWorkoutID].Week;
			selectedDay = req.session.User.workouts[nextWorkoutID].Day;
			req.session.viewingWID = nextWorkoutID;
			res.redirect('/');
			return;
		}
	}

	if(req.body.ResetBtn) {
		// reset();
		var axiosPutResponse = await axios.put(WorkoutURL + "/clear", putBody);
		res.redirect('/');
		return
	}
});

router.get('/level-up', async function(req, res) {
	var _UserData = await axios.get(process.env.BASE_URL + `/api/users/${req.session.User.id}`);	
	var _User = _UserData.data;
	var newLevel = _User.level;
	var oldLevel = (_User.stats["Level Up"].Status.value == 1) ? newLevel - 1 : newLevel;

	res.render('levelcheck', {
		User: _User,
		oldLevel,
		newLevel,
		UserStats: _User.stats,			
		levelUp: _User.stats["Level Up"],
		benchStat: _User.stats["UB Hor Push"],
		squatStat: _User.stats["Squat"],
		hingeStat: _User.stats["Hinge"],		
	});
})

router.post('/', function(req, res) {
	res.redirect("/");
});

router.post('/workouts', function(req, res) {
	res.redirect("/workouts");
});

router.get('/workouts', function(req, res) {
	// WorkoutTemplate.destroy({where: {}});
	// SubWorkoutTemplate.destroy({where: {}});
	// res.render('templates', {});
	var subWorkoutPromises = [];
	var workoutDict = {1: [], 2: [], 3: [], 4: []};
	var subsDict = {1: [], 2: [], 3: [], 4: []};

	WorkoutTemplate.findAll({
		where: {},
		order: [['levelGroup', 'ASC'], ['block', 'ASC'], ['week', 'ASC'], ['day', 'ASC']],
	}).then(results => {
		results.forEach(elem => {
			if (elem.day == 4) {
				elem.destroy();
			}
			else {
				subWorkoutPromises.push(elem.getSubWorkouts());
			}
		})
		Promise.all(subWorkoutPromises).then(subworkouts => {
			subworkouts.forEach(subList => {
				subList.sort(function(a, b) {
					return a.number - b.number
				});
			});
			// console.log(subworkouts);
			for (var i = 0; i < results.length; i ++) {
				var W = results[i];
				var S = subworkouts[i];
				console.log("Day: " + W.day);
				// console.log(workoutDict[W.day]);
				console.log(S);
				workoutDict[W.day].push(W);
				subsDict[W.day].push(S);
			}

			// var rowNum = results.length/4;
			// thisUser.save();
			res.render('templates', {
				// Subworkouts: subworkouts,
				WorkoutObjects: results,
				Subworkouts: subsDict,
				Workouts: workoutDict,
				// rowNum,
			});
		});
	});
});



function reset() {
	UserStats = {
		Level: 1,
		AlloyPerformed: {
			"UB Hor Push": 0, 
			"UB Vert Push": 0, 
			"UB Hor Pull": 0, 
			"UB Vert Pull": 0, 
			"Hinge": 0,
			"Squat": 0, 
			"LB Uni Push": 0, 
			"Ant Chain": 0, 
			"Post Chain": 0, 
			"Carry": 0, 
			"Iso 1": 0, 
			"Iso 2": 0, 
			"Iso 3": 0, 
			"Iso 4": 0, 		
		},
		ExerciseStats: {
			"UB Hor Push": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"UB Vert Push": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"UB Hor Pull": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"UB Vert Pull": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Hinge": {Status: Alloy.None, Max: 100, LastSet: ""},
			"Squat": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"LB Uni Push": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Ant Chain": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Post Chain": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Carry": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Iso 1": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Iso 2": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Iso 3": {Status: Alloy.None, Max: 100, LastSet: ""}, 
			"Iso 4": {Status: Alloy.None, Max: 100, LastSet: ""}, 
		},
		CurrentSets: {
	
		},
		CurrentWorkout: {
			Week: 1,
			Day: 1,
			LGroup: 1,
			TemplateID: 1,
		},
		TemplateID: 1,
	 }
	 return;
	}
	
module.exports = router;