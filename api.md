# API documentation 

The api is versioned. A current version is `v1`. This is specified in the
`.env` file.

## Endpoints

### POST /api/v1/user/auth

Creates an account with the email provided and sends an authentication code
to it. The code is valid for 1 hour from the time of its generation.

**Request body**

```json
{
  "email": "hello@myemail.com"
}
```
