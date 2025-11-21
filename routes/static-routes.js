/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* static-routes.js | {√}/routes                                              *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Routes requests to static views and assets within the backend server.      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import express from 'express';
import path from 'path';


/* —————————————————————————————————————————————————————————————————————————— *\
| Initialize router                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
const router = express.Router();


/* —————————————————————————————————————————————————————————————————————————— *\
|  Define Upload Path                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
router.use('/uploads', express.static(path.join(process.cwd(), 'assets', 'uploads')));


/* —————————————————————————————————————————————————————————————————————————— *\
| Define static views                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Sign Up | Greenhouse',
        description: 'Sign up for a new account.',
        keywords: 'register, sign up, greenhouse, account, user',
        image: '/assets/logo.png',
        imageAlt: 'Greenhouse product logo',
        url: '/register',
    });
});

router.get('/verify-notice', (req, res) => {
    res.render('verify-notice', {
        title: 'Verify Your Email | Greenhouse',
        description: 'Verify your email address before signing in.',
        keywords: 'verification, email, greenhouse, account, user',
        image: '/assets/logo.png',
        imageAlt: 'Greenhouse product logo',
        url: '/verify-notice',
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Sign In | Greenhouse',
        description: 'Sign in to access your account.',
        keywords: 'authentication, greenhouse, account, user',
        image: '/assets/logo.png',
        imageAlt: 'Greenhouse product logo',
        url: '/login',
    });
});


/* —————————————————————————————————————————————————————————————————————————— *\
| Export router                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default router;
