# Developer log

This log describes changes across the Greenhouse API project during the development phase of the project.

## [0.0.1] — 17 September 2025

This commit was dedicated to setting up the project and writing boilerplate code (`index.js`) for the Express application. Added new version control (`.gitignore`), environment (`.env`), and documentation files (`developer-log.md` and `README.md`).

Initialized a new Node.js project and installed the NPM dependencies planned for use in the project. This generated standard `package.json`, `package-lock.json` files and a `node_modules` directory. Added `start` and `server` script to the `package.json` file.

Created a logging utility (`logger.js`) using the `winston` package and enabled daily rotation of log and error files. Created initial routing files to handle general routing (`dispatch-request.js`) to static routes (`static-routes.js`) and API endpoints (`v1-routes.js`).

- **Commit message**: `Initial commit | Project setup | Express boilerplate | Logging | Routing`

### Added

Added the following files as part of this commit:

- Created a `[logs]` directory to store rotating log files.
- Created a new `v1-routes.js` to route API requests to an appropriate endpoint.
- Created a new `static-routes.js` to create static resources route requests to handlebars views.
- Created a new `dispatch-request.js` to route requests to static resources and API endpoints.
- Created a new `index.js` to serve as the entry point for the Greenhouse API.
- Created a new `logger.js` to log requests to the console and to rotating files.
- Created a new `README.md` for project overview and getting started documentation.
- Automatically generated a new `package-lock.json` file and `[node_modules]` directory by installing dependencies.
- Automatically generated a new `package.json` file with the `npm init` command.
- Created a new `.gitignore` file to prevent sensitive files from pushing to the git repository.
- Created a new `.env` file to store credentials, environment-specific configuration, and service details.
- Created a new `developer-log.md` to track development progress across commits.

#### Runtime dependencies

These runtime dependencies were installed as part of initial setup, though not all are yet integrated:

- [argon2](https://www.npmjs.com/package/argon2)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [handlebars](https://www.npmjs.com/package/handlebars)
- [helmet](https://www.npmjs.com/package/helmet)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [multer](https://www.npmjs.com/package/multer)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [qrcode](https://www.npmjs.com/package/qrcode)
- [speakeasy](https://www.npmjs.com/package/speakeasy)
- [uuid](https://www.npmjs.com/package/uuid)
- [winston](https://www.npmjs.com/package/winston)

#### Developer dependencies

These developer dependencies were installed as part of initial setup, though not all are yet integrated:

- [concurrently](https://www.npmjs.com/package/concurrently)
- [jest](https://www.npmjs.com/package/jest)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [supertest](https://www.npmjs.com/package/supertest)

### Directory structure

```txt
[greenhouse-api]
    |-- [logs]
    |-- [node_modules]
    |-- [routes]
    |       |-- dispatch-request.js
    |       |-- static-routes.js
    |       |-- v1-routes.js
    |
    |-- [utilities]
    |       |-- logger.js
    |
    |-- .env
    |-- .gitignore
    |-- developer-log.md
    |-- index.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
```
