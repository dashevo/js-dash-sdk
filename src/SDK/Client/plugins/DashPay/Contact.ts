export class Contact {
    public username?: null|string;
    public identityId: any;
    public sentRequest: any;
    public receivedRequest: any;

    constructor(identityId, sentRequest, receivedRequest) {
        this.username = null;
        this.identityId = identityId;
        this.sentRequest = sentRequest;
        this.receivedRequest = receivedRequest;
    }
    setUsername(username){
        this.username = username;
    }
}

