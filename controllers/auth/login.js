/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* login.js | {√}/controllers/auth                                            *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Authenticate a user.                                                       *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Application modules                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import asyncHandler from '../../middleware/async-handler.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Login                                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @route           POST    /api/v1/auth/login
 * @description     Authenticate a user.
 * @access          Public
 */
const login = asyncHandler(async (req, res) => {

});

export default login;
