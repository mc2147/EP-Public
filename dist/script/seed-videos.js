'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _models = require('../models');

var _require = require('../data'),
    VideosJSON = _require.VideosJSON,
    DescriptionsJSON = _require.DescriptionsJSON,
    LevelVideos = _require.LevelVideos;

async function createVideos() {
    for (var Key in VideosJSON) {
        // console.log(Key);
        var VideosCategory = VideosJSON[Key];
        for (var K in VideosCategory) {
            // console.log("VideosCategory: ", "K: " + K, VideosCategory[K]);
            var videoObj = VideosCategory[K];
            if (!VideosCategory[K].URL) {
                VideosCategory[K].URL = "https://drive.google.com/file/d/" + VideosCategory[K].DriveID + "/preview";
            }
            if (Key in DescriptionsJSON) {
                VideosCategory[K].Description = DescriptionsJSON[Key][VideosCategory[K].LevelAccess];
            }
            // VideosList.push(VideosCategory[K]);

            var _ref = await _models.Video.findOrCreate({
                where: {
                    title: K,
                    url: videoObj.URL,
                    levelAccess: videoObj.LevelAccess,
                    exerciseNames: [K]
                    // exerciseType: Key
                }
            }),
                _ref2 = _slicedToArray(_ref, 2),
                video = _ref2[0],
                created = _ref2[1];

            if ('Description' in videoObj) {
                video.description = videoObj.Description;
            }
            video.description = videoObj.Description;
            await video.save();
            console.log("video created 31: ", video.title, created, video.levelAccess);
            // console.log("video.title: ", video.title);
            // console.log("video, created: ", video.title, video.description, created);
            // .spread((video, created) => {
            //     video.tags = video.title;
            //     video.exerciseType = Key;            
            //     if ('Description' in videoObj) {
            //         video.description = videoObj.Description;
            //     }
            //     console.log("video found/created: ", video.title);
            //     // video.save();
            // })
        }
    }
    // console.log("LevelVideos: ", LevelVideos);
    for (var L in LevelVideos) {
        var Level = L;
        var Vids = LevelVideos[L];
        for (var name in Vids) {
            var _JSON = Vids[name];
            var URL = "https://drive.google.com/file/d/" + _JSON.DriveID + "/preview";

            var _ref3 = await _models.Video.findOrCreate({
                where: {
                    title: name,
                    url: URL,
                    levelAccess: Level,
                    exerciseNames: [name]
                }
            }),
                _ref4 = _slicedToArray(_ref3, 2),
                video = _ref4[0],
                created = _ref4[1];

            video.tags = video.title;
            // video.exerciseType = "test";
            video.exerciseType = _JSON.Type;
            // console.log("video created: ", Level, JSON.Type, video.title)
            console.log("video created 66: ", video.title, created, video.levelAccess);
            if (_JSON.Type in DescriptionsJSON) {
                video.description = DescriptionsJSON[_JSON.Type][Level];
            }
            await video.save();

            if (_JSON.Type in VideosJSON) {
                VideosJSON[_JSON.Type][name] = _JSON;
                VideosJSON[_JSON.Type][name].LevelAccess = Level;
            } else {
                VideosJSON[_JSON.Type] = {};
                VideosJSON[_JSON.Type][name] = _JSON;
                VideosJSON[_JSON.Type][name].LevelAccess = Level;
            }
        }
    }
    console.log("line 44");
}

createVideos().catch(function (err) {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
}).then(function () {
    console.log('videos seeded');
});