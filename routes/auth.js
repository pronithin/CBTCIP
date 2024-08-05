const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Employee = require('../models/employee');
const Log = require('../models/userselflog');
const UserWall = require('../models/wall');


router.get('/login', (req, res) => {
    res.render('signup');
});

router.post('/login', async (req, res) => {
   
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        const employee = await Employee.findOne({ email, password });

        if (user) {
            const exist = await UserWall.findOne({ email });

            if (!exist) {
                const newUserWall = new UserWall({ email });
                await newUserWall.save();
            }

            req.session.user = user;
            req.session.loginTime = new Date();
            req.session.profilePage = '/userprofile';
            res.redirect('/userprofile');
        } else if (employee) {
            const exist = await UserWall.findOne({ email });

            if (!exist) {
                const newUserWall = new UserWall({ email });
                await newUserWall.save();
            }

            req.session.user = employee;
            req.session.loginTime = new Date();

            switch (employee.role) {
                case 'admin':
                    req.session.profilePage = '/admin';
                    break;
                case 'Event manager':
                    req.session.profilePage = '/eventmanager';
                    break;
                case 'Event coordinator':
                    req.session.profilePage = '/eventcoordinator';
                    break;
              case 'Event sales':
                    req.session.profilePage = '/eventsales';
                    break;
                case 'Employee':
                    req.session.profilePage = '/employee';
                    break;
                default:
                    req.session.profilePage = '/userprofile';
                    break;
            }
            res.redirect(req.session.profilePage);
        } else {
            res.send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/logout', async (req, res) => {
    try {
        // Clear session data
        await UserWall.deleteOne({ email: req.session.user.email });
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;