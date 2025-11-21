/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* create-user.js | {√}/controllers/users                                     *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Create a new user through registration.                                    *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Runtime Dependencies                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
import asyncHandler from '../../middleware/async-handler.js';
import {
    sendVerificationCode
} from '../../services/auth-service.js';
import {
    isUsernameTaken,
    findOrFail,
    registerUser
} from '../../services/user-service.js';
import ApiError from '../../errors/Api-Error.js';
import BadRequestError from '../../errors/Bad-Request-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Create User                                                                 |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @route           POST    /api/v1/users
 * @description     Create a new user.
 * @access          Public
 */
const createUser = asyncHandler(async (req, res) => {
    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Handle profile picture                                                      |
    \* —————————————————————————————————————————————————————————————————————————— */
    let profilePicture = req.file ? req.file.filename : 'default-profile-picture.png';


    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Destructure request body                                                    |
    \* —————————————————————————————————————————————————————————————————————————— */
    const { name, username, email, password } = req.body;

    
    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Check if username is taken                                                  |
    \* —————————————————————————————————————————————————————————————————————————— */
    const usernameTaken = await isUsernameTaken(username);

    if (usernameTaken) {
        throw new BadRequestError(
            'Username is already in use. Please select a different username.',
            409,
            true
        );
    }


    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Search database for user                                                    |
    \* —————————————————————————————————————————————————————————————————————————— */
    const userExists = await findOrFail(email);


    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Check if user exists                                                        |
    \* —————————————————————————————————————————————————————————————————————————— */
    if (userExists) {
        throw new BadRequestError(
            'Email address already in use. Please sign in to continue.',
            409,
            true
        );
    }


    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Generate and send Verification Token                                        |
    \* —————————————————————————————————————————————————————————————————————————— */
    const tokenCreated = await sendVerificationCode(email);

    if (!tokenCreated) {
        throw new ApiError(
            'Failed to deliver verification token by email. Please try again later.',
            500,
            false
        );
    }


    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Create a new user                                                           |
    \* —————————————————————————————————————————————————————————————————————————— */
    const user = await registerUser(
        profilePicture,
        name,
        username,
        email,
        password
    );

    if (!user) {
        throw new ApiError(
            'Failed to complete registration. Please try again later.',
            500,
            false
        );
    }


    /* —————————————————————————————————————————————————————————————————————————— *\
    |  Return success response                                                     |
    \* —————————————————————————————————————————————————————————————————————————— */
    return res.redirect('/verify-notice');
});

export default createUser;
