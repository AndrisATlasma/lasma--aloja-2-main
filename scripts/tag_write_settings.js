// ============================ functions
function create_int32(byte3, byte2, byte1, byte0) {
    return ((parseInt(byte3) << 24) | (parseInt(byte2) << 16) | (parseInt(byte1) << 8) | parseInt(byte0)) >>> 0
}

function writeData(readTagPrefix, writeTagPostfix) {
    for (var i = 0; i < 15; i++) {
        var byte0 = getTag(readTagPrefix + (((i * 4) + 0)));
        var byte1 = getTag(readTagPrefix + (((i * 4) + 1)));
        var byte2 = getTag(readTagPrefix + (((i * 4) + 2)));
        var byte3 = getTag(readTagPrefix + (((i * 4) + 3)));
        //debugString('b3=' + byte3 + ' b2=' + byte2 + ' b1=' + byte1 + ' b0=' + byte0);
        var setTagVal = create_int32(byte0, byte1, byte2, byte3);
        setTag('ElemG_' + (i + 1) + writeTagPostfix, setTagVal);
    }
}

// ============================ action!
writeData('startDelay_ID', '_StartDelay');
writeData('stopDelay_ID', '_StopDelay');
// writeData('ovfDelay_ID', '_ovfDelay');