# node challenge

Acceptance criteria:
1. As an api consumer, given username and header “Accept: application/json”, I would like
to list all his github repositories, which are not forks. Information, which I require in the
response, is:
1.1. Repository Name
1.2. Owner Login
1.3. For each branch it’s name and last commit sha

## How to run

- node version: >=20.0.0
- npm version: >=10.0.0

```
# install dependencies
npm install

# to build and start the api on default port 8080
npm start

# to run tests
npm test

# to start the server on dev mode (hot reload)
npm run dev
```

When running the application, requests will be accepted on the following endpoint:
```
http://localhost:8080/get-repos
```

The `8080` port can be changed by creating a `.env` file at the project's root and setting the correct variable (there's an .env.example) for reference.

The requests can be made with and without authtentication, but it is advised to add a access token in the header of the requests as Github's rate limit will block requests after a few tries.

You can create a [personal token](https://github.com/settings/tokens) with the following scopes:
```
repo > public_repo
user > read:user
```

### Request

#### Query strings

The endpoint identifies only one parameter in the query: `username`. It must be set or else an error message will be returned.

#### Headers

The endpoint requires `accept: application/json` header to properly function. Not providing it will cause the endpoint to return an error message.

Also, to *authenticate your requests* you must add the following header: `Authorization: Bearer <YOUR_PERSONAL_TOKEN>`. It will be used to make the requests to Github's API.
