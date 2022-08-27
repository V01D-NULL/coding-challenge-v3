# API

Relevant source code: [API](../../routes.py), [Clientside Javascript](../../webapp/js/api.js)

Communicates with: https://api.github.com

## Endpoints

The API exposes a set of endpoints, all of which are listed below:

> `/api/repositories`

```
Purpose: Retrieve all public repositories belonging to a user.
Supported methods: GET
GET: /api/repositories?username=...
```
<br>

> `/api/comment`
```
Purpose: Retrieve, edit, post and delete comments
Supported methods: POST, DELETE, GET

POST: /api/comment?name=...&id=... (optional: &edit=1)
GET: /api/comment?name=...
DELETE: /api/comment?name=...&id=...
```
<br>

> `/api/rate`
```
Purpose: Retrieve and update ratings (They are similar to reviews)
Supported methods: POST, GET
POST: /api/rate?name=...&score=...
GET: /api/rate?name=...
```
<br>

> `/api/login`
```
Purpose: Login a user.
Supported methods: POST
POST: /api/login?username=...&password=...

Note: /api/signup has the exact same arguments. For this reason it will not be listed in the documentation.
```
<br>

> `/api/logout`
```
Purpose: Logout a user
Supported methods: POST
POST: /api/logout
```

## Errors:
Errors or irregularities are reported using a single line of JSON:
```json
{
	"error": "error description"
}
```