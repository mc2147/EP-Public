"use strict";

var enums = require('./enums');
var Alloy = enums.Alloy;

var userStatTemplate = {
    "UB Hor Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "UB Vert Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "UB Hor Pull": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "UB Vert Pull": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Hinge": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Squat": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "LB Uni Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Ant Chain": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Post Chain": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Carry": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 1": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 2": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 3": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 4": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "RFD Load": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "RFD Unload 1": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "RFD Unload 2": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Medicine Ball": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Level Up": {
        Status: Alloy.None,
        Squat: Alloy.None,
        UBHorPush: Alloy.None,
        Hinge: Alloy.None
    }
};

module.exports = {
    userStatTemplate: userStatTemplate
};