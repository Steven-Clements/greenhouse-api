/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* verify-redirect.js | {√}/controllers/auth                                  *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Transforms GET requests triggered from email verification links into POST  *|
|* requests by redirecting them through an auto-submitting view.              *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Application modules                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import asyncHandler from '../../middleware/async-handler.js';
import { findOrFail } from '../../services/user-service.js';
import BadRequestError from '../../errors/Bad-Request-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Verify Redirect                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @route           GET     /api/v1/auth/verify-email
 * @description     Converts GET requests to POST requests.
 * @access          Public
 */
const verifyRedirect = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.query;

  const user = await findOrFail(email);

  if (user.emailVerifiedAt !== undefined && user.emailVerifiedAt !== null) {
    throw new BadRequestError('Email address has already been verified.', 400);
  }

  res.render('redirect', { email, verificationCode });
});

export default verifyRedirect;
