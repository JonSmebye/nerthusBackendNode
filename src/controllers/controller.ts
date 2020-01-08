const bleTag = require('../classes/bleTag.ts');
const bleTagList = new Map();

const getBleTag = (macAdress) => {
    if(bleTagList.has(macAdress)){
        return bleTagList.get(macAdress)
    }
    else{
        var bleTagCreate = new bleTag(macAdress);
        bleTagList.set(macAdress, bleTagCreate);
        return bleTagCreate

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
        console.log(bleTagObject)
    }    
}

module.exports = {
    recieveBeaconSignalsFromRpiAndAddToBeaconClass
}