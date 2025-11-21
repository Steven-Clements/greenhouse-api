/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* auth-service.js | {√}/services                                             *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Defines business logic for authentication and verification.                *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Runtime Dependencies                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
import crypto from 'crypto';
import argon2 from 'argon2';
import jsonwebtoken from 'jsonwebtoken';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Application modules                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import VerificationToken from '../models/Verification-Token.js';
import {
    sendEmailVerification
} from '../utilities/deliver-email.js';
import AuthError from '../errors/Auth-Error.js';
import BadRequestError from '../errors/Bad-Request-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Send Verification Token                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
export async function sendVerificationCode(email) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await new VerificationToken({
        email,
        verificationCode: hashedToken,
        purpose: 'email_verification',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).save();

    const deliveryStatus = await sendEmailVerification(email, rawToken);

    if (deliveryStatus.accepted.length > 0 && deliveryStatus.rejected.length === 0) {
        return true;
    }

    return false;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Verify verification code                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
export async function verifyToken(email, verificationCode, ipAddress) {
    const verificationToken = await VerificationToken.findOne({
        email,
        purpose: 'email_verification',
        consumed: { $ne: true },
        expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!verificationToken) {
    throw new AuthError('Verification token not found.', 401);
  }

  if (verificationToken.expiresAt < new Date()) {
    throw new BadRequestError('Verification token has expired.', 410);
  }

  console.log(verificationCode, verificationToken.verificationCode);

  // Hash the incoming raw token
  const rebuiltHash = crypto.createHash('sha256').update(verificationCode).digest('hex');

  const bufferedRebuiltHash = Buffer.from(rebuiltHash, 'hex');
  const bufferedHash = Buffer.from(verificationToken.verificationCode, 'hex');

  if (
    bufferedRebuiltHash.length === bufferedHash.length &&
    crypto.timingSafeEqual(bufferedRebuiltHash, bufferedHash)
  ) {
    verificationToken.consumed = true;
    verificationToken.consumedAt = Date.now();
    verificationToken.consumedByIp = ipAddress;

    await verificationToken.save();

    return true;
  }

  return false;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Mark email verified                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
export async function markEmailVerified(user) {
    user.emailVerifiedAt = new Date();

    const updatedUser = await user.save();

    if (updatedUser) {
        return true;
    }

    return false;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Verify password                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
export async function verifyPassword(hashedPassword, password) {
    return await argon2.verify(hashedPassword, password);
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Generate MFA session                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
export async function generateMfaSession(userId) {
    const token = jsonwebtoken.sign(
        { userId },
        process.env.JWT_SECRET, {
            expiresIn: '1h',
        }
    );

    return token;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  Generate user session                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
export async function generateUserSession(userId) {
    const token = jsonwebtoken.sign(
        { userId },
        process.env.JWT_SECRET, {
            expiresIn: '24h',
        }
    );

    return token;
}
