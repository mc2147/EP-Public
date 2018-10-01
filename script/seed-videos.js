let { VideosJSON, DescriptionsJSON, LevelVideos } = require("../data");
import { Video } from "../models";

async function createVideos() {
  await Video.destroy({
    where: {}
  });
  for (var Key in VideosJSON) {
    var VideosCategory = VideosJSON[Key];
    for (var K in VideosCategory) {
      var videoObj = VideosCategory[K];
      if (!VideosCategory[K].URL) {
        VideosCategory[K].URL =
          "https://drive.google.com/file/d/" +
          VideosCategory[K].DriveID +
          "/preview";
      }
      if (Key in DescriptionsJSON) {
        VideosCategory[K].Description =
          DescriptionsJSON[Key][VideosCategory[K].LevelAccess];
      }
      let [video, created] = await Video.findOrCreate({
        where: {
          title: K,
          url: videoObj.URL,
          levelAccess: videoObj.LevelAccess,
          exerciseNames: [K]
        }
      });
      if ("Description" in videoObj) {
        video.description = videoObj.Description;
      }
      video.description = videoObj.Description;
      await video.save();
    }
  }

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
          exerciseNames: [name]
        }
      });

      video.tags = video.title;

      video.exerciseType = JSON.Type;

      if (JSON.Type in DescriptionsJSON) {
        video.description = DescriptionsJSON[JSON.Type][Level];
      }
      await video.save();

      if (JSON.Type in VideosJSON) {
        VideosJSON[JSON.Type][name] = JSON;
        VideosJSON[JSON.Type][name].LevelAccess = Level;
      } else {
        VideosJSON[JSON.Type] = {};
        VideosJSON[JSON.Type][name] = JSON;
        VideosJSON[JSON.Type][name].LevelAccess = Level;
      }
    }
  }
  console.log("line 44");
}

createVideos()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log("videos seeded");
  });
