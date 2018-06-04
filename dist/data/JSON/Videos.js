"use strict";

var _models = require("../../models");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DescriptionsJSON = require("./Descriptions");

var VideosJSON = {
    "Posterior Chain": {
        "Single Leg Hip Thrust": {
            URL: "https://drive.google.com/file/d/1SU8J73QiKGrcU58sNOxq6cf3m3xu3rhz/preview",
            LevelAccess: 9,
            LinkedLevels: [9, 11, 13],
            Tags: "SL Hip Thrust"
        },
        "DB Hip Thrust": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUdWUtM3c0SGY1d28/preview",
            LevelAccess: 1,
            LinkedLevels: [3, 5],
            Tags: "DB Hip Thrust"
        }
    },
    "Anterior Chain": {
        "Dead Bug": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUNjNlcEdQNmI5Q2c/preview",
            LevelAccess: 1
        }
    },
    "Carry": {
        "Suitcase Carry": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUeXVlNGdPYWFKQVE/preview",
            LevelAccess: 2
        },
        "Farmer Carry": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUdjVKcHVfaTJDcVU/preview",
            LevelAccess: 1
        }
    },
    "LB Uni Push": {
        "Single Leg Press": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUNk9MWXI3ZVJQZUU/preview",
            LevelAccess: 1
        }
    },
    "Isolation": {
        "Band Pull Aparts": {
            DriveID: "0BysnsnxGpKeUUTFsWlpkb2RCS1E",
            LevelAccess: 2
        },
        "CC Face Pulls": {
            DriveID: "0BysnsnxGpKeUalBQWWNvekRiSFk",
            LevelAccess: 1
        },
        "DB Lateral Raise": {
            DriveID: "0BysnsnxGpKeUV0llVHM4ZFBKUHM",
            LevelAccess: 1
        },
        "DB Biceps Curl": {
            DriveID: "0BysnsnxGpKeUVUVtdlZaYlFxVHc",
            LevelAccess: 1
        }
    },
    "Hinge": {
        "BB RDL": {
            DriveID: "0BysnsnxGpKeUUkRkbzFVWEVhRFE",
            LevelAccess: 3
        },
        "DB RDL": {
            DriveID: "0BysnsnxGpKeUdjEtOHJaSXVaa00",
            LevelAccess: 1
        },
        "Conventional Deadlift": {
            DriveID: "0BysnsnxGpKeUMEM4SVV6bDRCRzAz",
            LevelAccess: 16
        }
    },
    "Push": {
        "DB Bench Press": {
            DriveID: "0BysnsnxGpKeUelZjczQxQmxXYXM",
            LevelAccess: 1
        },
        "KB Half Kneeling Overhead Press": {
            DriveID: "0BysnsnxGpKeUdEdiZFA4WkxWRWM",
            LevelAccess: 5
        },
        "BB Half Kneeling Press": {
            DriveID: "0BysnsnxGpKeUcF9BUmZUTlQ5WWc",
            LevelAccess: 10
        },
        "BB Bench Press": {
            DriveID: "0BysnsnxGpKeURUxEUmJIZFVrMUU",
            LevelAccess: 6
        },
        "DB Standing Overhead Press": {
            DriveID: "0BysnsnxGpKeUR2VhRE1qbG5sUGM",
            LevelAccess: 3
        },
        "DB Floor Press": {
            DriveID: "0BysnsnxGpKeUUlk1d1VkQ3VNTTg",
            LevelAccess: 2
        }
    },
    "Pull": {
        "Pull Up Negatives": {
            DriveID: "1hGRC5tJbosjQTegF2xUrJ3oivxFDuDpx",
            LevelAccess: 7
        },
        "Bilateral Lat Pulldown": {
            DriveID: "0BysnsnxGpKeUOFB1V2FKQy1MZ1k",
            LevelAccess: 6
        },
        "DB Row": {
            DriveID: "0BysnsnxGpKeUN1dtcTAzWjJ2SEU",
            LevelAccess: 1
        },
        "CC Seated Row": {
            DriveID: "0BysnsnxGpKeUWjFmWm4tR0x1Mzg",
            LevelAccess: 2
        },
        "CC Half Kneeling Single Arm Pulldown": {
            DriveID: "0BysnsnxGpKeUTWNEdEFDMk9EY0k",
            LevelAccess: 2
        },
        "TRX Row": {
            DriveID: "0BysnsnxGpKeUTlpHNGcxMXJLR00",
            LevelAccess: 3
        },
        "Pendlay Row": {
            DriveID: "0BysnsnxGpKeUTDVsdktpc1pqcUE",
            LevelAccess: 5
        },
        "Inverted Row": {
            DriveID: "0BysnsnxGpKeUTl9qRERzMWVDalU",
            LevelAccess: 6
        }
    },
    "Squat": {
        "DB Goblet Squat": {
            DriveID: "0BysnsnxGpKeUSzNINDdfV0hSdjg",
            LevelAccess: 7
        },
        "Goblet Box Squat Variations": {
            DriveID: "0BysnsnxGpKeUSzNINDdfV0hSdjg",
            LevelAccess: 8
        },
        "BB Front Squat": {
            DriveID: "0BysnsnxGpKeUajhOT19fRkpBUFk",
            LevelAccess: 10
        }
    }
};

var LevelVideos = {};
LevelVideos[6] = {
    // Level 6:
    // CC Wide Grip Pulldown - 1ahHjB1lk8joet6kuwUQ9dcGNyW4tSpXZ - Pull
    // Trap Bar Deadlift - 1kFCvTciJOb-iHNUhBIh13AbMw6YBV5dr - Hinge
    // KB/DB Pause Front Squat - 1nPPoPfZtbaWAYOpUyq7e4_pjAWfZj0A3 - Squat
    // Leg Raise - 1NmjW4BWpLV-rklS18S-WePfw3HMuN0zc - Ant Chain
    // DB Bulgarian Split Squat - 15BK2BWGPGkRT36aXifE2qggnSg0KHEN0 - LB Uni Push
    // CC Triceps Pushdown - 1-m03DrhF3h2KF287BXeg-1SOHfxGu-h4 - Isolation
    // BB Power Position Jump Shrug - 1WYldUcFlIIpYrryiPrcYnP366odgQFcF - RFD Load
    // Pause Box Jump - 1-DebcG0H-VOUfi8VjsdqKAff1ofPyX7g - RFD Unload 1
    // Pause Bound - 1Gqjd0SfJP78XGoRlmW37IIWYI_vSRuZ_ - RFD Unload 2 
    // CM Tall Kneeling OH Slam - 1T8-Mmozd-bY5IaCeJuU3LnsFJjCeeCxn - Medicine Ball    
    "CC Wide Grip Pulldown": {
        Type: "Pull",
        DriveID: "1ahHjB1lk8joet6kuwUQ9dcGNyW4tSpXZ"
    },
    "Trap Bar Deadlift": {
        Type: "Pull",
        DriveID: "1ahHjB1lk8joet6kuwUQ9dcGNyW4tSpXZ"
    },
    "KB/DB Pause Front Squat": {
        Type: "Squat",
        DriveID: "1nPPoPfZtbaWAYOpUyq7e4_pjAWfZj0A3"
    },
    "Leg Raise": {
        Type: "Ant Chain",
        DriveID: "1NmjW4BWpLV-rklS18S-WePfw3HMuN0zc"
    },
    "DB Bulgarian Split Squat": {
        Type: "LB Uni Push",
        DriveID: "15BK2BWGPGkRT36aXifE2qggnSg0KHEN0"
    },
    "CC Triceps Pushdown": {
        Type: "Isolation",
        DriveID: "1-m03DrhF3h2KF287BXeg-1SOHfxGu-h4"
    },
    "BB Power Position Jump Shrug": {
        Type: "RFD Load",
        DriveID: "1WYldUcFlIIpYrryiPrcYnP366odgQFcF"
    },
    "Pause Box Jump": {
        Type: "RFD Unload 1",
        DriveID: "1-DebcG0H-VOUfi8VjsdqKAff1ofPyX7g"
    },
    "Pause Bound": {
        Type: "RFD Unload 2",
        DriveID: "1Gqjd0SfJP78XGoRlmW37IIWYI_vSRuZ_"
    },
    "CM Tall Kneeling OH Slam": {
        Type: "Medicine Ball",
        DriveID: "1T8-Mmozd-bY5IaCeJuU3LnsFJjCeeCxn"
    }
};

LevelVideos[11] = {
    // BB Pause Bench Press - 1dfZIsEvbiire0tw1-0HwVKPfcKl0CBhT - UB Hor Push
    // DB 1A Standing OH Press - 1Hdbmb5VeEapF0Bs1XPNp1CI109GeKM3y - Push
    // BB Bent Over Row - 1FsH3tO_uZicewoxzpmPCyS2kPa-H9W9Y - Pull
    // Neutral Pull-ups - 16QfuDKnxyNIhzT0PCRROiYzPquj_7gLG - Pull
    // BB Snatch Grip Pause RDL - 1XuOCQdFnW7OeLK8tnPrJO8IeZMr3OZG0 - Hinge
    // BB Box Front Squat - 1B2ngIHUIZ2Sgu1riJU5nPka5nvaiBk7S - Squat
    // Band Dead Bug - 1Sqyv-VDqswXsHWtHvd8uOfqzGYeUf_zG - Ant Chain
    // BB Zercher Split Squat - 1VEbgjlUXmPDUP3UwdeV-iWPysstYnPJA - LB Uni Push
    // BW Single Leg RDL - 1VsN1Hqzfrrcy6rhX6PFT1x8RRKmmyzJH - Posterior Chain
    // KB Biceps Curl - 1N3f_-tyxmGpYdfC2vB9iHGxHxjoUFJAM - Iso 1
    // CC High Face Pull - 1kKqiDRO3qonf06ZeODWY_6sBq1jlypPP - Iso 3
    // DB Lat to Front Raise - 1pxbBTdyY92VfZuNtQmV3kQ8EJAM_MSNt - Isolation
    // DB Snatch - 12eysfbhIBGIFcjGDDiopc_aXTkU8S63g - RFD Loaded
    // Continuous Hurdle Jump - 1hVTZTGej3-vLx1FId4_mkQRPZL2c9Q0M - RFD Unload 1
    // Pause Hop - 1l6UKI-61-RMXxn4nL0id2P2DCx_C96by - RFD Unload 2
    // CM Standing OH Slam - 1kqPFpSwYrnc6XICQrsFEJlyApW9NGqC8 - Medicine Ball    
    "BB Pause Bench Press": {
        Type: "UB Hor Push",
        DriveID: "1dfZIsEvbiire0tw1-0HwVKPfcKl0CBhT"
    },
    "DB 1A Standing OH Press": {
        Type: "UB Vert Push",
        DriveID: "1Hdbmb5VeEapF0Bs1XPNp1CI109GeKM3y"
    },
    "BB Bent Over Row": {
        Type: "UB Hor Pull",
        DriveID: "1FsH3tO_uZicewoxzpmPCyS2kPa-H9W9Y"
    },
    "Neutral Pull-ups": {
        Type: "UB Hor Pull",
        DriveID: "16QfuDKnxyNIhzT0PCRROiYzPquj_7gLG"
    },
    "BB Snatch Grip Pause RDL": {
        Type: "Hinge",
        DriveID: "1XuOCQdFnW7OeLK8tnPrJO8IeZMr3OZG0"
    },
    "BB Box Front Squat": {
        Type: "Squat",
        DriveID: "1B2ngIHUIZ2Sgu1riJU5nPka5nvaiBk7S"
    },
    "Band Dead Bug": {
        Type: "Ant Chain",
        DriveID: "1Sqyv-VDqswXsHWtHvd8uOfqzGYeUf_zG"
    },
    "BB Zercher Split Squat": {
        Type: "LB Uni Push",
        DriveID: "1VEbgjlUXmPDUP3UwdeV-iWPysstYnPJA"
    },
    "BW Single Leg RDL": {
        Type: "Posterior Chain",
        DriveID: "1VsN1Hqzfrrcy6rhX6PFT1x8RRKmmyzJH"
    },
    "KB Biceps Curl": {
        Type: "Iso 1",
        DriveID: "1N3f_-tyxmGpYdfC2vB9iHGxHxjoUFJAM"
    },
    "CC High Face Pull": {
        Type: "Iso 3",
        DriveID: "1kKqiDRO3qonf06ZeODWY_6sBq1jlypPP"
    },
    "DB Lat to Front Raise": {
        Type: "Isolation",
        DriveID: "1pxbBTdyY92VfZuNtQmV3kQ8EJAM_MSNt"
    },
    "DB Snatch": {
        Type: "RFD Loaded",
        DriveID: "12eysfbhIBGIFcjGDDiopc_aXTkU8S63g"
    },
    "Continuous Hurdle Jump": {
        Type: "RFD Unload 1",
        DriveID: "1hVTZTGej3-vLx1FId4_mkQRPZL2c9Q0M"
    },
    "Pause Hop": {
        Type: "RFD Unload 2",
        DriveID: "1l6UKI-61-RMXxn4nL0id2P2DCx_C96by"
    },
    "CM Standing OH Slam": {
        Type: "Medicine Ball",
        DriveID: "1kqPFpSwYrnc6XICQrsFEJlyApW9NGqC8"
    }
};

var VideosList = [];

function createVideo(JSON, levelAccess) {
    _models.Video.findOrCreate({});
}
//Level 6 and 11

var _loop = function _loop() {
    var Level = L;
    var Vids = LevelVideos[L];

    var _loop2 = function _loop2() {
        var JSON = Vids[name];
        if (!JSON.URL) {
            JSON.URL = "https://drive.google.com/file/d/" + JSON.DriveID + "/preview";
        }
        // if (Key in DescriptionsJSON) {
        //     VideosCategory[K].Description = DescriptionsJSON[Key][VideosCategory[K].LevelAccess];
        // }
        var URL = "https://drive.google.com/file/d/" + JSON.DriveID + "/preview";
        _models.Video.findOrCreate({
            where: {
                title: name,
                url: URL,
                levelAccess: Level,
                exerciseNames: [name]
            }
        }).spread(function (video, created) {
            video.tags = video.title;
            // video.exerciseType = "test";
            video.exerciseType = JSON.Type;
            // console.log("video created: ", Level, JSON.Type, video.title)
            if (JSON.Type in DescriptionsJSON) {
                video.description = DescriptionsJSON[JSON.Type][Level];
            }
            video.save();
            console.log("video created: ", video.url);
        });
        if (JSON.Type in VideosJSON) {
            VideosJSON[JSON.Type][name] = JSON;
            VideosJSON[JSON.Type][name].LevelAccess = Level;
        } else {
            VideosJSON[JSON.Type] = {};
            VideosJSON[JSON.Type][name] = JSON;
            VideosJSON[JSON.Type][name].LevelAccess = Level;
        }
    };

    for (name in Vids) {
        _loop2();
    }
};

for (var L in LevelVideos) {
    var name;

    _loop();
}

// for (var Key in VideosJSON) {
//     // console.log(Key);
//     var VideosCategory = VideosJSON[Key];
//     for (var K in VideosCategory) {
//         if (!VideosCategory[K].URL) {
//             VideosCategory[K].URL = "https://drive.google.com/file/d/" + VideosCategory[K].DriveID + "/preview";
//         }
//         if (Key in DescriptionsJSON) {
//             VideosCategory[K].Description = DescriptionsJSON[Key][VideosCategory[K].LevelAccess];
//         }
//         var videoObj = VideosCategory[K];
//         VideosList.push(VideosCategory[K]);
//         Video.findOrCreate({
//             where: {
//                 title: K,
//                 url: videoObj.URL,
//                 levelAccess: videoObj.LevelAccess,
//                 exerciseNames: [K],
//                 // exerciseType: Key
//             }
//         }).spread((video, created) => {
//             video.tags = video.title;
//             video.exerciseType = Key;            
//             if ('Description' in videoObj) {
//                 video.description = videoObj.Description;
//             }
//             console.log("video found/created: ", video.title);
//             // video.save();
//         })
//     }
// }

var LevelList = [];

for (var i = 1; i <= 25; i++) {
    LevelList.push(i);
}
// console.log("LevelList", LevelList);

function vueConvert(JSON, levelFilter) {
    var output = {
        videoList: [],
        selectedVideo: {}
    };
    for (var Key in JSON) {
        // console.log(Key);
        var VideosCategory = JSON[Key];
        for (var K in VideosCategory) {
            if (VideosCategory[K].LevelAccess <= levelFilter) {
                //If user's level is > minimum access level for video
                var elem = Object.assign({}, VideosCategory[K]);
                if (!VideosCategory[K].URL) {
                    elem.URL = "https://drive.google.com/file/d/" + VideosCategory[K].DriveID + "/preview";
                }
                elem.label = K;
                console.log('pushing video: ', elem.label);
                elem.image = '../../static/video_placeholder.png';
                elem.levels = LevelList.slice(elem.LevelAccess - 1);
                if (Object.keys(output.selectedVideo).length === 0) {
                    output.selectedVideo = elem;
                }
                output.videoList.push(elem);
                // console.log(elem);
            }
        }
    }
    // console.log(output);    
    return output;
}

function getVideos(JSON, Level) {
    var output = [];
    for (var Key in JSON) {
        var VideosCategory = JSON[Key];
        for (var K in VideosCategory) {
            if (VideosCategory[K].LevelAccess <= Level) {
                var elem = Object.assign({}, VideosCategory[K]);
                elem.label = K;
                elem.image = '../../static/video_placeholder.png';
                elem.levels = LevelList.slice(elem.LevelAccess - 1);
                output.push(elem);
            }
        }
    };
    output.sort(function (a, b) {
        return a.LevelAccess - b.LevelAccess;
    });
    output.sort(function (a, b) {
        var x = a.label;
        var y = b.label;
        if (x < y) {
            return -1;
        };
        if (x > y) {
            return 1;
        };
        return 0;
    });
    return output;
}

// console.log(getVideos(VideosJSON, 5));

vueConvert(VideosJSON, 1);
// module.exports = VideosJSON;
module.exports = _defineProperty({ VideosJSON: VideosJSON, vueConvert: vueConvert, getVideos: getVideos, LevelVideos: LevelVideos }, "VideosJSON", VideosJSON);