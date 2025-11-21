/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* verify-email.js | {√}/controllers/auth                                     *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Verify a user's email address.                                             *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Application modules                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import asyncHandler from '../../middleware/async-handler.js';
import {
    findOrFail
} from '../../services/user-service.js';
import {
    verifyToken,
    markEmailVerified
} from '../../services/auth-service.js';
import ApiError from '../../errors/Api-Error.js';
import AuthError from '../../errors/Auth-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Verify email                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @route           POST    /api/v1/auth/verify-email
 * @description     Verify a user's email address.
 * @access          Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, verificationCode } = req.body;

    const user = await findOrFail(email);

    const isMatch = await verifyToken(email, verificationCode, req.ip);

    if (!isMatch) {
        throw new AuthError('Invalid identifier or credentials.', 401);
    }

    const success = await markEmailVerified(user);

    if (!success) {
        throw new ApiError(
            'Failed to update user profile. Please try again later.',
            500
        );
    }

    return res.render('login');
});

export default verifyEmail;
