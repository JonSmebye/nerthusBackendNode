module.exports = class bleTag {
    macAddress;
    postRequestWithBeacon = new Map();
    lastSeenPosition;
    constructor(macA){
        this.macAddress = macA;
    }
    addPostRequest = (ipAddress, data) => {
        this.postRequestWithBeacon.set(ipAddress,data);
    }
}