/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* dispatch-request.js | {√}/routes                                           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Primary router for API requests. Dispatches requests for both static and   *|
|* API routes based on the specified URI.                                     *|
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
import staticRoutes from './static-routes.js';
import v1Routes from './v1-routes.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Initialize router                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
const router = express.Router();


/* —————————————————————————————————————————————————————————————————————————— *\
| Define API routes                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
router.use('/', staticRoutes);
router.use(`/api/v1`, v1Routes);


/* —————————————————————————————————————————————————————————————————————————— *\
| Export router                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default router;
