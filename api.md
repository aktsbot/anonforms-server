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

Returns a session token for the user along with user's uuid, if the provided email 
and authentication code from the above api are valid. The session token is 
valid for 3 hrs. If the session token is not used for more than 3 hrs, it'll be removed.

**Request body**

```json
{
  "email": "hello@myemail.com",
  "auth_code": "AC-56adh4"
}
```

### GET /api/v1/user [auth]

Returns the user info for a session token. It also returns a list of sessions
that are active for the user.

### POST /api/v1/user/logout [auth]

Clears the session for the user. The session token is removed from the system.

### POST /api/v1/form [auth]

Creates a form based on the payload provided and returns its reference.

- `uri` needs to be unique. It's used to fetch back the form for usage later.
- `question_type` can be one of simple_text, large_text, checkbox, radio, dropdown.
- If `question_type` is one of `checkbox`, `radio` or `dropdown`, `question_options`
is required.

** Request body **

```json
{
	"title": "SIMPLECON 2021",
	"uri": "simple-2021",
	"description": "Registration form for SIMPLECON 2021 happenning on Oct 16, 2021",
	"questions": [{
		"title": "What is your name?",
		"question_type": "simple_text",
		"is_required": true
	}, {
		"title": "From which institution are you from?",
		"question_type": "large_text",
		"is_required": false
	}, {
		"title": "Your gender",
		"question_type": "radio",
		"question_options": [{
			"title": "Male"
		}, {
			"title": "Female"
		}, {
			"title": "Transgender"
		}, {
			"title": "Other"
		}]
	}, {
		"title": "Choose if you have visited the following places",
		"question_type": "checkbox",
		"question_options": [{
			"title": "Pondicherry"
		}, {
			"title": "Chennai"
		}, {
			"title": "Dindivanam"
		}, {
			"title": "Madurai"
		}]
	}, {
		"title": "What is your nationality",
		"question_type": "dropdown",
		"question_options": [{
			"title": "India"
		}, {
			"title": "USA"
		}, {
			"title": "Europe"
		}, {
			"title": "Japan"
		}]
	}]
}
```

### GET /api/v1/form/:form_uri

Pass either a form's `uuid` or `uri` in `:form_uri` to get data about that 
particular form.

### GET /api/v1/form [auth]

Returns the list of forms the user has ownership to. If no `page` number is
sent, the first page of results is returned. Results are **30** per page.

** Query string **

```
page=1
```
### POST /api/v1/response/:form_uuid

Adds a response to a form mentioned by the `form_uuid`.

- `response_from` needs to be unique per response for a form.
- `question` refers to the id of a question.
- `answer_single_option` and `answer_multiple_option` also refers to ids of the options
that are referred in a form's question.
- To get the ids mentioned above, make a call to the **/api/v1/form/:form_uri** endpoint.

** Request payload **

```json
{
	"response_from": "shelly@onelly.com",
	"answers": [{
		"question": "60a0b578a4d96c25c69d9fcc",
		"answer_text": "Shelly O Nelly"
	}, {
		"question": "60a0b578a4d96c25c69d9fcd",
		"answer_text": "Okhlahoma ... and a way we go"
	}, {
		"question": "60a0b578a4d96c25c69d9fce",
		"answer_single_option": "60a0b578a4d96c25c69d9fcf"
	}, {
		"question": "60a0b578a4d96c25c69d9fd3",
		"answer_multiple_option": ["60a0b578a4d96c25c69d9fd4", "60a0b578a4d96c25c69d9fd5"]
	}, {
		"question": "60a0b578a4d96c25c69d9fd8",
		"answer_single_option": "60a0b578a4d96c25c69d9fd9"
	}]
}
```

### GET /api/v1/response/:form_uri

Returns all responses for a form mentioned by the `form_uri`.
If no `page` number is sent, the first page of results is returned. 
Results are **30** per page.

** Query string **

```
page=1
```

### GET /api/v1/response/:form_uri/csv

Builds and returns a csv of all the responses received for `form_uri`.


