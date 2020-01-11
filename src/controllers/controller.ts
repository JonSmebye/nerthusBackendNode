const bleTag = require('../classes/bleTag.ts');
const listWithBleTagInstances = new Map();

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

const recieveBeaconSignalsFromRpiAndAddToBeaconClass = (request, response) => {
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
    calculateBleTagPosition()    
}

const calculateBleTagPosition = function BleTagPosition() { 
    for (const [macAdress, bleTag] of listWithBleTagInstances.entries()) {
        let postRequests = bleTag.postRequestWithBeacon;
        let maxSignal = -200;
        let position = "";
        for(const [ipAdressRpi, beaconData] of postRequests.entries()){
            if(beaconData.rssi > maxSignal){
                maxSignal = beaconData.rssi
                position = ipAdressRpi
            }
        }
        bleTag.lastSeenPosition = position
    }
}

module.exports = {
    recieveBeaconSignalsFromRpiAndAddToBeaconClass
}