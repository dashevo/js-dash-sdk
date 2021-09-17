export class Contact {
    public username?: null|string;
    public identityId: any;
    public sentRequest: any;
    public receivedRequest: any;
    public identity?: any;
    public profile?: any;
    public addresses?: any;

    constructor(identityId, sentRequest, receivedRequest) {
        this.username = null;
        this.identity = null;
        this.identityId = identityId;
        this.sentRequest = sentRequest;
        this.receivedRequest = receivedRequest;
    }
    setUsername(username){
        this.username = username;
    }
    setIdentity(identity){
        this.identity = identity;
    }
    setProfile(profile){
        this.profile = profile
    }
    setAddresses(addressesSet){
        const { receiving, sending } = addressesSet;
        this.addresses = {
            receiving,
            sending
        };
    }
}

