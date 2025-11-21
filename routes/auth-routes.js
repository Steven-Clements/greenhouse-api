/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* auth-routes.js | {√}/routes                                                *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Routes requests targeting authentication and verification operations.      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import express from 'express';


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import verifyRedirect from '../controllers/auth/verify-redirect.js';
import verifyEmail from '../controllers/auth/verify-email.js';
import login from '../controllers/auth/login.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Initialize router                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
const router = express.Router();


/* —————————————————————————————————————————————————————————————————————————— *\
| Define API endpoints                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
router.post('/login', login);
router.get('/verify-email', verifyRedirect);
router.post('/verify-email', verifyEmail);


/* —————————————————————————————————————————————————————————————————————————— *\
| Export router                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default router;
