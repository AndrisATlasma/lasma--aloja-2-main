/*
// parse rout state [1,2,3,4,5,6,7,8] from rout uint32 tag (route 9 is being read directly). 
for (var i = 0; i <= 1; i++) {
    var routGrup = getTag('RoutStateGrop' + (i + 1)); // 1, 2
    setTag('State_R' + ((i * 4) + 1), getByte(routGrup, 3, 1)); // 1, 5
    setTag('State_R' + ((i * 4) + 2), getByte(routGrup, 2, 1)); // 2, 6
    setTag('State_R' + ((i * 4) + 3), getByte(routGrup, 1, 1)); // 3, 7
    setTag('State_R' + ((i * 4) + 4), getByte(routGrup, 0, 1)); // 4, 8
}
*/
//parse element state
for (var i = 0; i < 13; i++) {
    var routGrup = getTag('ElemG_' + (i + 1) + '_Status');
    setTag('state_ID' + (((i * 4) + 0)), getByte(routGrup, 3, 1));
    setTag('state_ID' + (((i * 4) + 1)), getByte(routGrup, 2, 1));
    setTag('state_ID' + (((i * 4) + 2)), getByte(routGrup, 1, 1));
    setTag('state_ID' + (((i * 4) + 3)), getByte(routGrup, 0, 1));
}
/*
//parse element rout
for (var i = 0; i < 11; i++) {
    var routGrup = getTag('ElemG_' + (i + 1) + '_rout');
    setTag('rout_ID' + (((i * 4) + 0)), getByte(routGrup, 3, 1));
    setTag('rout_ID' + (((i * 4) + 1)), getByte(routGrup, 2, 1));
    setTag('rout_ID' + (((i * 4) + 2)), getByte(routGrup, 1, 1));
    setTag('rout_ID' + (((i * 4) + 3)), getByte(routGrup, 0, 1));
}
*/

updateBitValues('ovfErr', 'ovfErr_ID');
updateBitValues('contactorErr', 'contErr_ID');
updateBitValues('mErr', 'mErr_ID');
updateBitValues('rotErr', 'rotErr_ID');

function updateBitValues(getPostfixString, setPrefixString) {
    var ovfbitTag1 = getTag('Elements0_31_' + getPostfixString);
    var ovfByte1 = getByte(ovfbitTag1, 3, 1);
    var ovfByte2 = getByte(ovfbitTag1, 2, 1);
    var ovfByte3 = getByte(ovfbitTag1, 1, 1);
    var ovfByte4 = getByte(ovfbitTag1, 0, 1);

    var ovfbitTag2 = getTag('Elements32_39_' + getPostfixString);
    var ovfByte5 = getByte(ovfbitTag2, 0, 1);

    for (var i = 0; i < 8; i++) {
        // parsing 32 bit (uint32)
        setTag(setPrefixString + i, checkBitState(ovfByte1, i));
        setTag(setPrefixString + (i + 8), checkBitState(ovfByte2, i));
        setTag(setPrefixString + (i + 16), checkBitState(ovfByte3, i));
        setTag(setPrefixString + (i + 24), checkBitState(ovfByte4, i));
        // parsing 8 bit (uint8)
        setTag(setPrefixString + (i + 32), checkBitState(ovfByte5, i));
    }
}



function getByte(register, byteShift, byteCount) {
    var andElement = Math.pow(2, byteCount * 8) - 1;
    return ((parseInt(register) >> (8 * byteShift)) & andElement);
}

function checkBitState(reg, bit) {
    return ((reg >> bit) & 1);
}


