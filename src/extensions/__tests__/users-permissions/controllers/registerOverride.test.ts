it('should return user, jwt, and refresh token', () => {});

describe('Auth/Register Controller', () => {
    beforeEach(() => {});
    describe('invalid email', () => {
        it('should error if email already exists', () => {});
        it('should error if email is not a valid format', () => {});
        it('should error if email is not a registered school email', () => {});
    });

    describe('invalid username', () => {
        it('should error if username already exists', () => {});
        it('should error if username is not valid', () => {});
    });

    describe('invalid password', () => {
        it('should error if password is not valid', () => {});
    });
});

/*
{
    "data": null,
    "error": {
        "status": 400,
        "name": "BadRequestError",
        "message": "Bad email format.",
        "details": {}
    }
}

{
    "data": null,
    "error": {
        "status": 400,
        "name": "BadRequestError",
        "message": "Not a registered school domain",
        "details": {}
    }
}

{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTcxMTM0NTM3OCwiZXhwIjoxNzEzOTM3Mzc4fQ.lNv66HnpaWRHX6RDZ_grzlEiLDQfIPii1lVK1ySwvmI",
    "user": {
        "id": 13,
        "username": "test",
        "email": "test@sfu.ca",
        "provider": "local",
        "confirmed": false,
        "blocked": false,
        "createdAt": "2024-03-25T05:42:58.732Z",
        "updatedAt": "2024-03-25T05:42:58.732Z"
    },
    "emailVerification": {
        "message": "verification code is sent to test@sfu.ca",
    },
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTcxMTM0NTM3OSwiZXhwIjoxNzEzOTM3Mzc5fQ._ujESyJSV9lKE-QG4qRdXB8_tG1R10UFIxsacSeIkeo"
}

*/
