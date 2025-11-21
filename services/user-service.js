/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* user-service.js | {√}/services                                             *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Defines business logic for the user resource.                              *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Runtime dependencies                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
import mongoose from 'mongoose';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Application modules                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import User from '../models/User.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Is Username Taken                                                           |
\* —————————————————————————————————————————————————————————————————————————— */
export async function isUsernameTaken(username) {
    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
        return true;
    }

    return false;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Find Or Fail                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export async function findOrFail(identifier) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let user;

    if (emailRegex.test(identifier)) {
        user = await User.findOne({ email: identifier }).select('+password');
    } else if (mongoose.Types.ObjectId.isValid(identifier)) {
        user = await User.findById(identifier).select('+password');
    } else {
        return false;
    }

    if (!user) {
        return false;
    }

    return user;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Create a new user                                                           |
\* —————————————————————————————————————————————————————————————————————————— */
export async function registerUser(profilePicture, name, username, email, password) {
    const user = new User({
        profilePicture,
        name,
        username,
        email,
        password
    });

    return await user.save();
}
