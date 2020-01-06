**Usage**: `sdk.platform.names.get(name)`    
**Description**: This method will allow you to fetch back an DPNS records from it's humanized name. 

Parameters: 

| parameters                | type      | required       | Description                                                                   |  
|---------------------------|-----------|----------------| ----------------------------------------------------------------------------- |
| **name**                  | String    | yes            | An alphanumeric (2-64) value used for human-identification (can contains `-`) |

**Example**: `await sdk.platform.names.get('alice')`

Returns : Identity (or `null` if do not exist).