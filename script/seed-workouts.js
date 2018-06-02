// const models = require('../models');
console.log("seeding workouts");
const testJS = require('./test');
let {MakeTemplates, CreateWorkoutTemplate} = require('../models/generateTemplates');
// const generateTemplates = require('../models/generateTemplates');
const data = require('../data');

async function generateTemplates() {
    await MakeTemplates(1, 0);
    await MakeTemplates(2, 0);
    await MakeTemplates(3, 1);
    await MakeTemplates(3, 2);
    await MakeTemplates(4, 1);
    await MakeTemplates(4, 2);
}

generateTemplates()
  .catch(err => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('finished seeding workouts')
  })

