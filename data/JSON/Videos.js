DescriptionsJSON = require("./Descriptions");

VideosJSON = {
    "Posterior Chain": {
        "Single Leg Hip Thrust": {
            URL: "https://drive.google.com/file/d/1SU8J73QiKGrcU58sNOxq6cf3m3xu3rhz/preview",
            LevelAccess: 9,
        },
        "DB Hip Thrust": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUdWUtM3c0SGY1d28/preview",
            LevelAccess: 1,
        }
    },
    "Anterior Chain": {
        "Dead Bug": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUNjNlcEdQNmI5Q2c/preview",
            LevelAccess: 1,
        }
    },
    "Carry": {
        "Suitcase Carry": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUeXVlNGdPYWFKQVE/preview",
            LevelAccess: 2,
        },
        "Farmer Carry": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUdjVKcHVfaTJDcVU/preview",
            LevelAccess: 1,
        }
    },
    "LB Uni Push": {
        "Single Leg Press": {
            URL: "https://drive.google.com/file/d/0BysnsnxGpKeUNk9MWXI3ZVJQZUU/preview",
            LevelAccess: 1,
        }
    },
    "Isolation": {
        "Band Pull Aparts": {
            DriveID: "0BysnsnxGpKeUUTFsWlpkb2RCS1E",
            LevelAccess: 2,
        },
        "CC Face Pulls": {
            DriveID: "0BysnsnxGpKeUalBQWWNvekRiSFk",
            LevelAccess: 1,
        },
        "DB Lateral Raise": {
            DriveID: "0BysnsnxGpKeUV0llVHM4ZFBKUHM",
            LevelAccess: 1,
        },
        "DB Biceps Curl": {
            DriveID: "0BysnsnxGpKeUVUVtdlZaYlFxVHc",
            LevelAccess: 1,
        }
    },
    "Hinge": {
        "BB RDL": {
            DriveID: "0BysnsnxGpKeUUkRkbzFVWEVhRFE",
            LevelAccess: 3,
        },
        "DB RDL": {
            DriveID: "0BysnsnxGpKeUdjEtOHJaSXVaa00",
            LevelAccess: 1,
        },
        "Conventional Deadlift": {
            DriveID: "0BysnsnxGpKeUMEM4SVV6bDRCRzAz",
            LevelAccess: 16,
        }
    },
    "Push": {
        "DB Bench Press": {
            DriveID: "0BysnsnxGpKeUelZjczQxQmxXYXM",
            LevelAccess: 1,
        },
        "KB Half Kneeling Overhead Press": {
            DriveID: "0BysnsnxGpKeUdEdiZFA4WkxWRWM",
            LevelAccess: 5,
        },
        "BB Half Kneeling Press": {
            DriveID: "0BysnsnxGpKeUcF9BUmZUTlQ5WWc",
            LevelAccess: 10,
        },
        "BB Bench Press": {
            DriveID: "0BysnsnxGpKeURUxEUmJIZFVrMUU",
            LevelAccess: 6,
        },
        "DB Standing Overhead Press": {
            DriveID: "0BysnsnxGpKeUR2VhRE1qbG5sUGM",
            LevelAccess: 3,
        },
        "DB Floor Press": {
            DriveID: "0BysnsnxGpKeUUlk1d1VkQ3VNTTg",
            LevelAccess: 2,
        }
    },
    "Pull": {
        "Pull Up Negatives": {
            DriveID: "1hGRC5tJbosjQTegF2xUrJ3oivxFDuDpx",
            LevelAccess: 7,
        },
        "Bilateral Lat Pulldown": {
            DriveID: "0BysnsnxGpKeUOFB1V2FKQy1MZ1k",
            LevelAccess: 6,
        },
        "DB Row": {
            DriveID: "0BysnsnxGpKeUN1dtcTAzWjJ2SEU",
            LevelAccess: 1,
        },
        "CC Seated Row": {
            DriveID: "0BysnsnxGpKeUWjFmWm4tR0x1Mzg",
            LevelAccess: 2,
        },
        "CC Half Kneeling Single Arm Pulldown": {
            DriveID: "0BysnsnxGpKeUTWNEdEFDMk9EY0k",
            LevelAccess: 2,
        },
        "TRX Row": {
            DriveID: "0BysnsnxGpKeUTlpHNGcxMXJLR00",
            LevelAccess: 3,
        },
        "Pendlay Row": {
            DriveID: "0BysnsnxGpKeUTDVsdktpc1pqcUE",
            LevelAccess: 5,
        },
        "Inverted Row": {
            DriveID: "0BysnsnxGpKeUTl9qRERzMWVDalU",
            LevelAccess: 6,
        }
    },
    "Squat": {
        "DB Goblet Squat": {
            DriveID: "0BysnsnxGpKeUSzNINDdfV0hSdjg",
            LevelAccess: 7,
        },
        "Goblet Box Squat Variations": {
            DriveID: "0BysnsnxGpKeUSzNINDdfV0hSdjg",
            LevelAccess: 8,
        },
        "BB Front Squat": {
            DriveID: "0BysnsnxGpKeUajhOT19fRkpBUFk",
            LevelAccess: 10,            
        }
    }
}

VideosList = [];

for (var Key in VideosJSON) {
    // console.log(Key);
    var VideosCategory = VideosJSON[Key];
    for (var K in VideosCategory) {
        if (!VideosCategory[K].URL) {
            VideosCategory[K].URL = "https://drive.google.com/file/d/" + VideosCategory[K].DriveID + "/preview";
        }
        if (Key in DescriptionsJSON) {
            VideosCategory[K].Description = DescriptionsJSON[Key][VideosCategory[K].LevelAccess];
        }
        VideosList.push(VideosCategory[K]);
    }
}

var LevelList = [];

for (var i = 1; i <= 25; i++) {
    LevelList.push(i);
}
// console.log("LevelList", LevelList);

function vueConvert (JSON, levelFilter) {
    var output = {
        videoList:[],
        selectedVideo:{}
    };
    for (var Key in JSON) {
        // console.log(Key);
        var VideosCategory = JSON[Key];
        for (var K in VideosCategory) {
            if (VideosCategory[K].LevelAccess <= levelFilter) {
                var elem = Object.assign({}, VideosCategory[K]); 
                elem.label = K;
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
    output.sort(function(a, b) {
        return (a.LevelAccess - b.LevelAccess);
    });
    output.sort(function(a, b) {
        var x = a.label;
        var y = b.label;
        if (x < y) {return -1};
        if (x > y) {return 1};
        return 0;
    })
    return output;
}

// console.log(getVideos(VideosJSON, 5));

vueConvert(VideosJSON, 1);
// module.exports = VideosJSON;
module.exports = {VideosJSON, vueConvert, getVideos};