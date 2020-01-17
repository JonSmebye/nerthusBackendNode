const bleTag = require('../classes/bleTag.ts');
const listWithBleTagInstances = new Map();
const bleTagSonePositionList = {'192.168.1.230':0,'192.168.1.231':0,'192.168.1.232':0};
const rpi = ['192.168.1.230','192.168.1.231','192.168.1.232'];
const fs = require('fs');

const getBleTag = (macAddress) => {
    if(listWithBleTagInstances.has(macAddress)){
        return listWithBleTagInstances.get(macAddress);
    }
    else{
        let createInstancesOfBleTagClass = new bleTag(macAddress);
        listWithBleTagInstances.set(macAddress, createInstancesOfBleTagClass);
        return createInstancesOfBleTagClass;

    }
}

const recieveBeaconSignalsFromRpiAndAddToBeaconClass = (request) => {
    var beaconSignals = JSON.parse(request.body['json_payload']);
    var ipAddressOfRpi = beaconSignals['ipAdressRpi'];
    delete beaconSignals['ipAdressRpi'];
    var keys = Object.keys(beaconSignals);
    for (var i=0; i < keys.length; i++){
        let macAddress = keys[i];
        let bleTagObject = getBleTag(macAddress);
        let data = beaconSignals[keys[i]];
        bleTagObject.addPostRequest(ipAddressOfRpi,data);
    }
}

const calculateBleTagPosition = function BleTagPosition() { 
    for (const [macAddress, bleTag] of listWithBleTagInstances.entries()) {
        let postRequests = bleTag.postRequestWithBeacon;
        let maxSignal = -200;
        let position = "";
        for(const [ipAddressRpi, beaconData] of postRequests.entries()){
            if(beaconData.rssi > maxSignal){
                maxSignal = beaconData.rssi;
                position = ipAddressRpi;
            }
        }
        bleTag.lastSeenPosition = position;
        //console.log(bleTag)
    }
}

const updateBleTagSonePositionList = () => {
    for(var i=0; i < rpi.length;i++){
        bleTagSonePositionList[rpi[i]] = 0;
    }
    for (const [macAddress, bleTag] of listWithBleTagInstances.entries()) {
        try{
            if(bleTag.lastSeenPosition == ''){
                console.log('BleTag with macAddress' + macAddress + ' not seen')
            }
            else{
                let position = bleTag.lastSeenPosition;
                bleTagSonePositionList[position] += 1;
            }
        }catch(err){
            console.log('Error in retrieveing last seen position of BLE Tag')
        }
    }
}

const clearBleTagPostRequests  = () => {
    for(const [macAddress,bleTag] of listWithBleTagInstances){
        bleTag.postRequestWithBeacon.clear();
    }
}

const writeToFile = () => {
    for(const [macAddress, bleTag] of listWithBleTagInstances.entries()){
        var bleTagStr = JSON.stringify(bleTag);
        fs.appendFile("/var/log/bleTagObject", bleTagStr + JSON.stringify([...bleTag.postRequestWithBeacon]) +'\n', function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
}

setInterval(function(){
    calculateBleTagPosition();
    updateBleTagSonePositionList();
    writeToFile();
    clearBleTagPostRequests();
},65000);


module.exports = {
    recieveBeaconSignalsFromRpiAndAddToBeaconClass,
    bleTagSonePositionList
};