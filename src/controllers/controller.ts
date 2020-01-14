const bleTag = require('../classes/bleTag.ts');
const listWithBleTagInstances = new Map();
const bleTagSonePositionList = new Map();
const rpi = ['192.168.1.230','192.168.1.231','192.168.1.232'];

const getBleTag = (macAdress) => {
    if(listWithBleTagInstances.has(macAdress)){
        return listWithBleTagInstances.get(macAdress);
    }
    else{
        let createInstancesOfBleTagClass = new bleTag(macAdress);
        listWithBleTagInstances.set(macAdress, createInstancesOfBleTagClass);
        return createInstancesOfBleTagClass;

    }
}

const recieveBeaconSignalsFromRpiAndAddToBeaconClass = (request) => {
    var beaconSignals = JSON.parse(request.body['json_payload']);
    var ipAdressOfRpi = beaconSignals['ipAdressRpi'];
    delete beaconSignals['ipAdressRpi'];
    var keys = Object.keys(beaconSignals);
    for (var i=0; i < keys.length; i++){
        let macAdress = keys[i];
        let bleTagObject = getBleTag(macAdress);
        let data = beaconSignals[keys[i]];
        bleTagObject.addPostRequest(ipAdressOfRpi,data);
    }
}

const calculateBleTagPosition = function BleTagPosition() { 
    for (const [macAdress, bleTag] of listWithBleTagInstances.entries()) {
        let postRequests = bleTag.postRequestWithBeacon;
        let maxSignal = -200;
        let position = "";
        for(const [ipAdressRpi, beaconData] of postRequests.entries()){
            if(beaconData.rssi > maxSignal){
                maxSignal = beaconData.rssi;
                position = ipAdressRpi;
            }
        }
        bleTag.lastSeenPosition = position;
        console.log(bleTag)
    }
}

const updateBleTagSonePositionList = () => {
    for(var i=0; i < rpi.length;i++){
        bleTagSonePositionList.set(rpi[i],{val:0})
    }
    for (const [macAdress, bleTag] of listWithBleTagInstances.entries()) {
        try{
            let position = bleTag.lastSeenPosition;
            bleTagSonePositionList.get(position).val++;
        }catch(err){
            console.log('Error in retrieveing last seen position of BLE Tag')
        }
    }
}

const clearBleTagPostRequests  = () => {
    for(const [macAdress,bleTag] of listWithBleTagInstances){
        bleTag.postRequestWithBeacon.clear();
    }
}

setInterval(function(){
    bleTagSonePositionList.clear();
    calculateBleTagPosition();
    updateBleTagSonePositionList();
    clearBleTagPostRequests();
},25000);


module.exports = {
    recieveBeaconSignalsFromRpiAndAddToBeaconClass,
    bleTagSonePosition
}