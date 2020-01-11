module.exports = class bleTag {
    macAdress;
    postRequestWithBeacon = new Map();
    lastSeenPosition;
    constructor(macA){
        this.macAdress = macA;
    }
    addPostRequest = (ipAdress, data) => {
        this.postRequestWithBeacon.set(ipAdress,data);
    }
}