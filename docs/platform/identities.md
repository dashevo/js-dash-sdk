## About Identities

DPNS is a special Dash Platform Application that is intended to provide a naming service for the Application Chain.  

Decoupling from the Blockchain identity allow to provide a unique user experience coupled with the highest security while remaining compatible with Identity Standard.


## Registering a new identity (User, Application ID)

Identity can be of multiple type, supported by this SDK, you will find these two types : 
   
- User Identity as type `USER`
- Application Identity as type `APPLICATION`


```js
// Assuming third account used (index:2), DIP9 path used on livenet would be be : "m/9'/5'/0'/2
const alice = sdk.platform.identities.register('user');
// Assuming third account used (index:2), DIP9 path used on livenet would be be : "m/9'/5'/1'/2
const appId = sdk.platform.identities.register('application');
```   

## Get an identity

```js
const bob = sdk.platform.identities.get('3GegupTgRfdN9JMS8R6QXF3B2VbZtiw63eyudh1oMJAk');
```  
