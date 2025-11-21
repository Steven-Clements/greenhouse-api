/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* User.js | {√}/models                                                       *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Defines the properties and methods comprising the User resource.           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Runtime dependencies                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
import mongoose from 'mongoose';
import argon2 from 'argon2';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Define user schema                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
const UserSchema = new mongoose.Schema({
    /* —— ⦿ —— ⦿ —— ⦿ —— { STATUS } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description Specifies how the authentication system responds to a user's
     *      authentication request.
     * 
     * @default active
     * 
     * @enum - `active`: User is authenticated normally.
     * - `lock`: User is temporarily prevented from authenticating until
     *      the time in the `lockout_expires` property has passed.
     * - `suspend`: User is indefinitely prevented from authenticating
     *      until an administrator updates their status.
     * - `blacklist`: User is permanently banned from authenticating.
     * - `recovery`: User is referred to account recovery to complete
     *      an unfinished password reset request.
     */
    status: {
        type: String,
        required: true,
        enum: [
            'active',
            'lock',
            'suspend',
            'blacklist'
        ],
        default: 'active',
        index: true
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { PROFILE PICTURE } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The server-generated filename the profile picture was
     *      saved under.
     * 
     * @default 'default.png'
     */
    profilePicture: {
        type: String,
        required: true,
        default: 'default.png'
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { NAME } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The first, middle, and/or last name as provided 
     *      by the user during registration or through a profile
     *      update.
     */
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        match: /^[A-Za-z]+([ -][A-Za-z]+)*$/
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { USERNAME } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The unique username created by a user for
     *      authenticating to the application without an email
     *      address.
     */
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        minLength: 2,
        maxLength: 16,
        match: /^[A-Za-z][A-Za-z0-9_-]{2,15}$/
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { EMAIL } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The unique email address designated by the
     *      user for authentication, account notifications, and
     *      advertisements.
     */
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        minLength: 8,
        maxLength: 254,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { EMAIL VERIFIED AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The data and time the user's email address was
     *      verified by the application.
     */
    emailVerifiedAt: {
        type: Date,
        default: null,
        index: true
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { PASSWORD } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description A private, user-specified value, used to authenticate the user
     *      to the application.
     */
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false
    },


    /* —— ⦿ —— ⦿ —— ⦿ —— { SECRET PIN } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description A private, user-specified value, used to verify users
     *      before carrying out sensitive operations.
     */
    secretPin: {
        type: String,
        minLength: 4,
        maxLength: 8,
        select: false
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { IS MULTI-FACTOR ENABLED } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description Specifies whether or not the user has enabled (or if the
     *      application requires) multi-factor authentication. The default
     *      value for this property can be specified with the
     *      `AUTH_MFA_REQUIRED` option in `.env`.
     * 
     * @default process.env.MFA_REQUIRED
     */
    isMultiFactorEnabled: {
        type: Boolean,
        required: true,
        default: process.env.MFA_REQUIRED === 'false'
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { LAST LOGIN IP } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The last known IP address from which the user signed
     *      in to the application successfully.
     */
    lastLoginIp: {
        type: String,
        select: false
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { LAST LOGIN AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The date and time of the user's last successful login.
     */
    lastLoginAt: {
        type: Date,
        index: true
    }
}, {
    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATED AT/UPDATED AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The date and time the user was created as well as the
     *      date and time the user was last updated.
     */
    timestamps: true
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  Define pre-save hooks                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
UserSchema.pre('save', async function (next) {
    if (
		this.isModified('password') &&
		typeof this.password === 'string' &&
        this.password.trim() !== ''
	) {
        this.password = await argon2.hash(this.password);
    }

    if (
		this.isModified('secretPin') &&
		typeof this.secretPin === 'string' &&
        this.secretPin.trim() !== ''
	) {
        this.secretPin = await argon2.hash(this.secretPin);
    }

    next();
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  Define and export model                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
const User = mongoose.model('User', UserSchema);

export default User;
