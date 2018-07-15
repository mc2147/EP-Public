let {VideosJSON, DescriptionsJSON, LevelVideos} = require('../data');
import {Video} from '../models';

async function createVideos() {
    await Video.destroy({
        where:{}
    });
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
            let [video, created] = await Video.findOrCreate({
                where: {
                    title: K,
                    url: videoObj.URL,
                    levelAccess: videoObj.LevelAccess,
                    exerciseNames: [K],
                    // exerciseType: Key
                }
            });
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
        let Level = L;
        let Vids = LevelVideos[L];
        for (var name in Vids) {
            let JSON = Vids[name];
            let URL = "https://drive.google.com/file/d/" + JSON.DriveID + "/preview";
            let [video, created] = await Video.findOrCreate({
                where: {
                    title: name,
                    url: URL,
                    levelAccess: Level,
                    exerciseNames: [name],
                }
            });
            
            video.tags = video.title;
            // video.exerciseType = "test";
            video.exerciseType = JSON.Type;
            // console.log("video created: ", Level, JSON.Type, video.title)
            console.log("video created 66: ", video.title, created, video.levelAccess);
            if (JSON.Type in DescriptionsJSON) {
                video.description = DescriptionsJSON[JSON.Type][Level];
            }
            await video.save();

            if (JSON.Type in VideosJSON) {
                VideosJSON[JSON.Type][name] = JSON;
                VideosJSON[JSON.Type][name].LevelAccess = Level;
            }
            else {
                VideosJSON[JSON.Type] =  {};
                VideosJSON[JSON.Type][name] = JSON;
                VideosJSON[JSON.Type][name].LevelAccess = Level;
            }
        }
    }
    console.log("line 44");
}

createVideos().catch(err => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('videos seeded')
});
