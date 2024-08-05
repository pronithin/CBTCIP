// profileRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Employee = require('../models/employee');
const Log=require('../models/empselflog')




router.get('/userprofile', (req, res) => {
    const user = req.session.user;
    res.render('userprofile',{user});
  });
  
  router.get('/employeeProfile',  (req, res) => {
    const employee = req.session.user;
      res.render('employeeProfile',{employee});
  });
  
  router.get('/eventcoordinator',  (req, res) => {
    const employee = req.session.user;
      res.render('eventcoordinator',{employee});
  });

  router.get('/eventmanager',  (req, res) => {
    const employee = req.session.user;
      res.render('eventmanager',{employee});
  });



  router.get('/eventsales',  (req, res) => {
    const employee = req.session.user;
      res.render('eventsales',{employee});
  });

  
  router.get('/employee',  (req, res) => {
    const employee = req.session.user;
      res.render('employee',{employee});
  });




  router.get('/viewfullemployeeprofile/:id', async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      res.render('viewfullemployeeprofile', { employee });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user data');
    }
  });
  router.post('/viewfullemployeeprofile/:id', async (req, res) => {
    try {
        const { email, password, age, phoneNumber } = req.body;
        const employeeId = req.params.id;

        // Update user profile in the database
        await Employee.findByIdAndUpdate(employeeId, { password,email, phoneNumber,age });

        // Log the user update action
        const loginTime = req.session.loginTime; // Assuming you store login time in the session
        console.log("Updating user profile. Data:", {password, email, phoneNumber ,age });
        await Log.create({
            action: 'Employee Update',
            employee: email,
            details: {
                employeeId,
                password,
                email,
                phoneNumber,
                age,
                loginTime
            }
        });

        res.send('Updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});
  module.exports=router;