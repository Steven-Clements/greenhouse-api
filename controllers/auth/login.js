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
import {
    verifyPassword,
    generateMfaSession,
    generateUserSession
} from '../../services/auth-service.js';
import {
    findOrFail,
    updateUserData
} from '../../services/user-service.js';
import AuthError from '../../errors/Auth-Error.js';
import BadRequestError from '../../errors/Bad-Request-Error.js';
import ApiError from '../../errors/Api-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Login                                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @route           POST    /api/v1/auth/login
 * @description     Authenticate a user.
 * @access          Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await findOrFail(email);

    if (!user) {
        throw new AuthError(
            'Invalid identifier or credentials.',
            401
        );
    }

    if (user.emailVerifiedAt === null || user.emailVerifiedAt === undefined) {
        throw new BadRequestError(
            'Please verify your email address before logging in.',
            400
        );
    }

    if (user.status !== 'active') {
        throw new AuthError(
            'Your account has been suspended. Contact an administrator for further assistance.',
            403
        );
    }

    const isMatch = await verifyPassword(user.password, password);

    if (!isMatch) {
        throw new AuthError(
            'Invalid identifier or credentials.',
            401
        );
    }

    if (user.isMultiFactorEnabled === true) {
        const mfaToken = await generateMfaSession(user._id);

        if (!mfaToken) {
            throw new ApiError(
                'Failed to generate a new session token.',
                500
            );
        }

        res.cookie('gh-mfa-token', mfaToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        return res.render('multi-factor');
    }

    const updatedUser = await updateUserData(user, req.ip);

    if (!updatedUser) {
        throw new ApiError(
            'Failed to update user login data.',
            500
        );
    }

    const sessionToken = await generateUserSession(user._id);

    if (!sessionToken) {
        throw new ApiError(
            'Failed to generate a new session token.',
            500
        );
    }

    res.cookie('gh-session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: 'Authentication successful. Redirecting...',
        token: sessionToken
    });
});

export default login;
