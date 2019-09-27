## Platform

```js
const sdk = new DashJS.SDK(opts);
let platform = sdk.platform;
```

### fetchDocuments 

Allow to fetch documents of a certains type specified by the schema contract provided. 

`await platform.fetchDocuments(type,queryOpts)`

{string} - type : the type of document (example on dashPay : 'profile')
{Object} - queryOpts: 
    - {Object} where - Mongo-like query
    - {Object} orderBy - Mongo-like sort field
    - {number} limit - how many objects to fetch
    - {number} startAt - number of objects to skip
    - {number} startAfter - exclusive skip
