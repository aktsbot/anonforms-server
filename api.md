# API documentation 

The api is versioned. A current version is `v1`. This is specified in the
`.env` file. All api endpoints that require an authentication header are
marked with a **[auth]** in the title.

## Authorization

** Authorization header **

```
'x-af-auth':'7fa9e86c-4213-4643-9a6e-ad536f358ee6'
```

The `session` api below returns a token valid for 3 hrs. Send the token in the 
above mentioned format in the header while sending the request. 

## Endpoints

### POST /api/v1/user/auth

Creates or updated an account with the email provided and sends an authentication 
code to it. The code is valid for 1 hour from the time of its generation.

**Request body**

```json
{
  "email": "hello@myemail.com"
}
```

### POST /api/v1/user/session

Returns a session token for the user, if the provided email and authentication code
from the above api are valid. The session token is valid for 3 hrs. If the session
token is not used for more than 3 hrs, it'll be removed.

**Request body**

```json
{
  "email": "hello@myemail.com",
  "auth_code": "AC-56adh4"
}
```

### GET /api/v1/user [auth]

This endpoint returns the user info for a session token.



