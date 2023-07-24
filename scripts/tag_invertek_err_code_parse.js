var driveTagNameArr = [
    {
        "Modbus": 'CC6002_Err',
        "Virtual": 'CC6002_FpErrCode'
    }];

driveTagNameArr.forEach(function (driveTag) {
    var regVal = getTag(driveTag.Modbus);
    var StatusVord = getByte(regVal, 1, 1);
    setTag(driveTag.Virtual, StatusVord);
});


function getByte(register, byteShift, byteCount) {
    var andElement = Math.pow(2, byteCount * 8) - 1;
    return ((parseInt(register) >> (8 * byteShift)) & andElement);
}

/*
00 No Fault
01 Brake channel over current
02 Brake resistor overload
03 Output Over Current
04 Motor Thermal Overload (I2t)
05 Power stage trip
06 Over voltage on DC bus
07 Under voltage on DC bus
08 Heatsink over temperature
09 Under temperature
10 Factory Default parameters loaded
11 External trip
12 Optibus comms loss
13 DC bus ripple too high
14 Input phase loss trip
15 Output Over Current
16 Faulty thermistor on heatsink
17 Internal memory fault (IO)
18 4-20mA Signal Lost
19 Internal memory fault (DSP)
21 Motor PTC thermistor trip
22 Cooling Fan Fault (IP66 only)
23 Drive internal temperature too high
26 Output Fault
40 Autotune Fault
41 Autotune Fault
42 Autotune Fault
43 Autotune Fault
44 Autotune Fault
*/