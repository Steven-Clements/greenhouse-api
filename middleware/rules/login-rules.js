/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* login-rules.js | {√}/middleware/rules                                      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Defines validation rules for the `login` endpoint.                         *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import { body } from 'express-validator';


/* —————————————————————————————————————————————————————————————————————————— *\
| Login rules                                                                  |
\* —————————————————————————————————————————————————————————————————————————— */
const loginRules = [
  body('email')
    .exists()
    .withMessage(`The 'email' parameter is required.`)
    .notEmpty()
    .withMessage(`The 'email' parameter is required.`)
    .isEmail()
    .withMessage(`The 'email' parameter must be a valid email address.`)
    .isLength({ min: 8, max: 254 })
    .withMessage(`The 'email' parameter must be between 8 and 254 characters.`),
  body('password')
    .exists()
    .withMessage(`The 'password' parameter is required.`)
    .notEmpty()
    .withMessage(`The 'password' parameter is required.`)
];


/* —————————————————————————————————————————————————————————————————————————— *\
|  Export rules                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default loginRules;
