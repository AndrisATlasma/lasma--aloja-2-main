//Add in your page into this list
var menu = {
    "Overview": "overview.svg",
    "Areas": { "One": "area01.svg", "Two": "area02.svg", "Three": "area03.svg" },
    "Trend": "plot.htm",
    "Alarm": "alarm.htm",
    "Audit": "audit.htm",
    "Reports": { "Snapshot": "report-snap.htm", "Statement": "report-stmt.htm" },

    //the last page/item must not be terminated by comma.
    "About": "about.svg"
};

//Name your project title here.
var title = "Check";

//Put your project logo, e.g. "images/mylogo.gif"
var logo = "system/images/v3-logo.gif";

//Add more debugging pages below
if (getTag("app.debug")) {
    menu["Sample"] = "sample.svg";
    menu["User"] = "user.htm";
}