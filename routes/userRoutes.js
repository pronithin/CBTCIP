// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Log=require('../models/userselflog');
const Log2=require('../models/empuserlog');
const book=require('../models/book');
const { render } = require('ejs');



router.post('/signup', async (req, res) => {
    const { username, email,phoneNumber, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('User already exists');
    }
    const newUser = new User({ username, email,phoneNumber, password,role });
   
    await newUser.save();
  
    res.send('User registered successfully');
  });


  router.post('/empuserupdate/:id', async (req, res) => {
    try {
      const { email,username,phoneNumber } = req.body;
      const userToUpdate = await User.findById(req.params.id);
      console.log('User ID:', req.params.id); 
      if (!userToUpdate) {
        return res.status(404).send('User not found');
      }
  
      // Get the current user data before update
      const previousUserData = {
        userId: userToUpdate._id,
        email: userToUpdate.email,
        username: userToUpdate.username,
        phoneNumber: userToUpdate.phoneNumber,
        loginTime: userToUpdate.loginTime // Assuming you have loginTime stored in the user document
      };
  
      // Update user in the database
      await User.findByIdAndUpdate(req.params.id, { email,username,phoneNumber });
  
      // Log the update action with detailed information
      await Log2.create({
        action: 'update',
        performedBy: req.session.user.email, // Use the currently logged-in user's email
        userAffected: userToUpdate.email, // Assuming you want to use the email field for identifying the user
        timestamp: new Date(),
        details: {
          previousData: previousUserData,
          updatedData: { email,username,phoneNumber }
        }
      });
  
      res.send('Updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating user');
    }
  });
  
  // Delete route
 

// Route to delete a user
const authenticateUser = (req, res, next) => {
  // Check if user is authenticated
  if (!req.session.user) {
      return res.status(401).send('Unauthorized');
  }
  next(); // User is authenticated, proceed to next middleware/route handler
};

// Route to delete a user
router.post('/delete-useremp/:id', authenticateUser, async (req, res) => {
  try {
      const userToDelete = await User.findById(req.params.id);
      if (!userToDelete) {
          return res.status(404).send('User not found');
      }

      // Log the delete action
      await Log2.create({
          action: 'delete',
          performedBy: req.session.user.email, // Assuming user information is stored in session
          userAffected: userToDelete.email,
          timestamp: new Date(),
          details: {
              previousData: {
                userId: userToDelete._id,
                email: userToDelete.email,
                username: userToDelete.username,
                phoneNumber: userToDelete.phoneNumber,
                loginTime: userToDelete.loginTime // Assuming you have loginTime stored in the user document
              },
              updatedData: null // No updated data for deletion
          }
      });

      // Delete user from the database
      await User.findByIdAndDelete(req.params.id);

      res.send('User deleted successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting user');
  }
});
  
  router.get('/empuserupdate/:id', async (req, res) => {
    try {
      const userToUpdate = await User.findById(req.params.id);
      res.render('empuserupdate', { userToUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user data');
    }
  });
  


   
  router.get('/selfuserupdate/:id', async (req, res) => {
    try {
      const userToUpdate = await User.findById(req.params.id);
      res.render('selfuserupdate', { userToUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user data');
    }
  });

  router.post('/selfuserupdate/:id', async (req, res) => {
    try {
        const { email, username, phoneNumber, password } = req.body;
        const userId = req.params.id;

        // Find the user to be updated
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).send('User not found');
        }

        // Get the previous data of the user before updating
        const previousUserData = {
            email: userToUpdate.email,
            username: userToUpdate.username,
            phoneNumber: userToUpdate.phoneNumber,
            // Note: Password field is typically hashed and not directly accessible
            // If you need to log password changes, consider storing metadata instead
        };

        // Update user profile in the database
        // Ensure that the password field is included in the update operation
        await User.findByIdAndUpdate(userId, { email, username, phoneNumber, password });

        // Log the user update action
        const loginTime = req.session.loginTime; // Assuming you store login time in the session
        await Log.create({
            action: 'User Update',
            user: email, // Use the updated email directly here
            details: {
                userId: userId,
                email: email,
                username: username,
                phoneNumber: phoneNumber,
                password: password, // Include password in the log (not recommended for sensitive data)
                loginTime: loginTime // Add login time to the details
            }
        });

        res.send('Updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});



  router.post('/delete-userself/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user before deleting for logging purposes
      const userBeforeDelete = await User.findById(userId);
  
      if (!userBeforeDelete) {
        return res.status(404).send('User not found');
      }
  
      // Delete the user from the database
      await User.findByIdAndDelete(userId);
  
      // Log the user deletion action using the user's email
      const loginTime = req.session.loginTime; // Assuming you store login time in the session
      await Log.create({ 
        action: 'User Deletion', 
        user: userBeforeDelete.email, // Log the user's email
        details: { 
          userId: userId, 
          email: userBeforeDelete.email,
          username: userBeforeDelete.username, 
          phoneNumber: userBeforeDelete.phoneNumber,// Log password for completeness, though it's not recommended to log sensitive information
          loginTime: loginTime // Add login time to the details
        } 
      });
  
      res.send('User deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting user');
    }
  });



  router.get('/deleted-user-logs', async (req, res) => {
    try {
      // Find logs with action 'User Deletion'
      const deletedUserLogs = await Log.find({ action: 'User Deletion' });
      res.render('deletedUserLogs', { deletedUserLogs });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching deleted user logs');
    }
  });
  
  router.post('/booking',async(req,res) => {
    const { firstname,lastname,email,phonenumber,address,noofattendees,eventdate,specialRequests,noofdays,eventName} = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            console.log("User not found. Redirecting to login page.");
            return res.redirect('signup');
        }

      
      const newBook = new book({ firstname,lastname,email,phonenumber,address,noofattendees,eventdate,specialRequests,noofdays,eventName});
      await newBook.save();
      
        console.log("Booking saved successfully");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving booking");
    }
});


router.get('/mybooking', async (req, res) => {
  try {
    const user = req.session.user;

    const user1 = await User.findOne({ email: user.email });
    
    if (!user1) {

      return res.status(404).send("User not found");
    }


    const bookings = await book.find({ email: user.email }); // Assuming 'Book' is your model name
    
    if (bookings.length === 0) {

      return res.status(404).send("No bookings found");
    }

    res.render('mybooking', { bookings });
  } catch (error) {
   
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

  
 
  module.exports=router;