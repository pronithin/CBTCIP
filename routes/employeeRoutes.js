const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Employee = require('../models/employee');
const Log = require('../models/userselflog');
const UserWall = require('../models/wall');
const Log1 = require('../models/empselflog');
const Log2 = require('../models/empuserlog');
const Log3 = require('../models/empemplog');
const book=require('../models/book');

router.post('/register', async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, phoneNumber, role, previousWorkPlace, experience, education, skills, availability, password } = req.body;
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.send('Employee already exists');
  }

  const newUser = new Employee({ firstName, lastName, email, phoneNumber, role, previousWorkPlace, experience, education, skills, availability, password });
  await newUser.save();

  res.render('side/thank_you');
});

router.get('/manageUsers', async (req, res) => {
  const user = req.session.user;
  if (user.role === 'admin' || user.role === 'Event manager' || user.role === 'Event coordinator' || user.role === 'Event sales' || user.role === 'Employee') {
    const users = await User.find({ role: 'client' });
    res.render('manageUsers', { users, currentUser: user });
  } else {
    res.send('Access denied');
  }
});

router.get('/view-logs/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    console.log('User Email:', userEmail);
    const logs = await Log.find({ user: userEmail }).sort({ timestamp: -1 });
    console.log('Logs:', logs);
    res.render('userLogs', { logs }); // Pass the logs variable to the view
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching logs');
  }
});

router.get('/otheruserlogs', async (req, res) => {
  try {
    const empuserlogs = await Log2.find();
    res.render('otheruserlogs', { empuserlogs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user logs');
  }
});

router.get('/otheremplogs', async (req, res) => {
  try {
    const empemplogs = await Log3.find();
    res.render('otheremplogs', { empemplogs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user logs');
  }
});

router.get('/view-logs1/:employeeEmail', async (req, res) => {
  try {
    const employeeEmail = req.params.employeeEmail;
    console.log('Employee Email:', employeeEmail);
    const logs = await Log1.find({ employee: employeeEmail }).sort({ timestamp: -1 });
    console.log('Logs:', logs);
    res.render('employeeLogs', { logs }); // Pass the logs variable to the view
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching logs');
  }
});

router.get('/manageEmployees', async (req, res) => {
  const employee = req.session.user;
  if (employee.role === 'admin') {
    const employees = await Employee.find({ role: { $nin: ['admin'] } });
    res.render('manageEmployees', { employees, employee });
  } else if (employee.role === 'Event manager') {
    const employees = await Employee.find({ role: { $nin: ['admin', 'Event manager'] } });
    res.render('manageEmployees', { employees, employee });
  } else if (employee.role === 'Event coordinator') {
    const employees = await Employee.find({ role: { $nin: ['admin', 'Event manager', 'Event coordinator'] } });
    res.render('manageEmployees', { employees, employee });
  } else {
    res.send('Access denied');
  }
});

router.post('/empempupdate/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, role, previousWorkPlace, experience, education, skills, availability } = req.body;
    const userId = req.params.id;

    // Find the employee to be updated
    const employeeToUpdate = await Employee.findById(userId);
    const wallemail = await UserWall.findOne({ email: employeeToUpdate.email });
    if (wallemail) {
      return res.send('Cannot update employee as their session is not over');
    }

    // Get the previous data of the affected employee before updating
    const previousEmployeeData = {
      firstName: employeeToUpdate.firstName,
      lastName: employeeToUpdate.lastName,
      email: employeeToUpdate.email,
      phoneNumber: employeeToUpdate.phoneNumber,
      role: employeeToUpdate.role,
      previousWorkPlace: employeeToUpdate.previousWorkPlace,
      experience: employeeToUpdate.experience,
      education: employeeToUpdate.education,
      skills: employeeToUpdate.skills,
      availability: employeeToUpdate.availability
    };

    // Update employee profile in the database
    await Employee.findByIdAndUpdate(userId, { firstName, lastName, email, phoneNumber, role, previousWorkPlace, experience, education, skills, availability });

    // Get the updated employee data
    const updatedEmployee = await Employee.findById(userId);

    // Log the employee update action
    await Log3.create({
      action: 'Employee Update',
      performedBy: req.session.user.email, // Use the currently logged-in user's email
      employeeAffected: employeeToUpdate.email, // Log the email of the affected employee
      timestamp: new Date(),
      details: {
        previousData: previousEmployeeData, // Details of the affected employee before update
        updatedData: updatedEmployee // Details of the update
      }
    });

    res.send('Updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating');
  }
});

router.get('/empempupdate/:id', async (req, res) => {
  try {
    const currentUser = await Employee.findById(req.params.id);
    res.render('empempupdate', { currentUser, Employeetoupdate: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user data');
  }
});

router.get('/selfempupdate/:id', async (req, res) => {
  try {
    const userToUpdate = await Employee.findById(req.params.id);
    res.render('selfempupdate', { userToUpdate });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user data');
  }
});

router.post('/selfempupdate/:id', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, previousWorkPlace, experience, education, skills, availability } = req.body;
    const teamMemberId = req.params.id;

    // Find the employee to be updated
    const employeeToUpdate = await Employee.findById(teamMemberId);
    if (!employeeToUpdate) {
      return res.status(404).send('Employee not found');
    }

    // Update employee profile in the database
    await Employee.findByIdAndUpdate(teamMemberId, {
      email,
      password,
      firstName,
      lastName,
      role,
      previousWorkPlace,
      experience,
      education,
     skills,
      availability
    });

    // Log the update team action
    await Log1.create({
      action: 'Update profile',
      employee: email, // Use the updated email directly here
      details: {
        teamMemberId: teamMemberId,
        email: email,
        password: password,
        firstName: firstName, // Include firstName
        lastName: lastName, // Include lastName
        role: role, // Include role
        previousWorkPlace: previousWorkPlace, // Include previousWorkPlace
        experience: experience, // Include experience
        education: education, // Include education
        skills: skills, // Include skills
        availability: availability, // Include availability
        // Assuming you store login time in the session
        loginTime: req.session.loginTime
      }
    });

    res.send('Your profile updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

router.get('/admin', (req, res) => {
  const employee = req.session.user;
  res.render('admin', { employee });
});

const authenticateUser = (req, res, next) => {
  // Check if user is authenticated
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  next(); // User is authenticated, proceed to next middleware/route handler
};

router.post('/delete-empemp/:id', authenticateUser, async (req, res) => {
  try {
    const employeeToDelete = await Employee.findById(req.params.id);
    const wallemail = await UserWall.findOne({ email: employeeToDelete.email });
    if (wallemail) {
      return res.send('Cannot delete employee as their session is not over');
    }

    // Log the delete action
    await Log3.create({
      action: 'delete',
      performedBy: req.session.user.email, // Assuming user information is stored in session
      employeeAffected: employeeToDelete.email,
      timestamp: new Date(),
      details: {
        previousData: {
          firstName: employeeToDelete.firstName,
          lastName: employeeToDelete.lastName,
          email: employeeToDelete.email,
          phoneNumber: employeeToDelete.phoneNumber,
          role: employeeToDelete.role,
          previousWorkPlace: employeeToDelete.previousWorkPlace,
          experience: employeeToDelete.experience,
          education: employeeToDelete.education,
          skills: employeeToDelete.skills,
          availability: employeeToDelete.availability // Assuming you have loginTime stored in the user document
        },
        // No updated data for deletion
      }
    });

    // Delete user from the database
    await Employee.findByIdAndDelete(req.params.id);

    res.send('Employee deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting employee');
  }
});

router.get('/managebookings', async (req, res) => {
  const employee = req.session.user;
  if (employee.role === 'Event sales'||employee.role==='admin' || employee.role==='Event manager') {
    const bookings = await book.find();
    res.render('managebookings', { bookings });
  }else{
    res.send('Access denied');
  }
});
module.exports = router;