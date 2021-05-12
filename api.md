# API documentation 

The api is versioned. A current version is `v1`. This is specified in the
`.env` file.

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

