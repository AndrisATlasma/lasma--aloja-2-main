var vTagValue = 0;

['enableRoute_ielade_BU1', 'enableRoute_ielade_BU2'].forEach(function (enableRouteTagName) {
    var enableRouteTagValue = getTag(enableRouteTagName);
    // → Ir palaists kāds no pienemšanas maršrutiem? ←
    if (enableRouteTagValue) vTagValue = enableRouteTagValue;
});

setTag("vPienemsanasRouteState", vTagValue);



vTagValue = 0;
["enableRoute_darbs_no_BU1", "enableRoute_darbs_no_BU2"].forEach(function (svEnableTagName) {
    var enableSvariTagValue = getTag(svEnableTagName);
    if (enableSvariTagValue) vTagValue = enableSvariTagValue;
});

setTag("vLobisanasRouteState", vTagValue);