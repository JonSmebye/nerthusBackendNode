module.exports = class bleTag {
    macAdress;
    postRequestWithBeacon = new Map();
    constructor(macA){
        this.macAdress = macA;
    }
    addPostRequest = (ipAdress, data) => {
        this.postRequestWithBeacon.set(ipAdress,data);
    }
}


