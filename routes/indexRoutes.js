// Import required modules
const express = require('express');
const router = express.Router();

// Define your routes
router.get('/', (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.user !== undefined;

  if (isAuthenticated && req.session.profilePage) {
    return res.redirect(req.session.profilePage);
}


  if (isAuthenticated) {
      const user = req.session.user;
      if (user instanceof User) {
          // If the authenticated user is a regular user, redirect to their profile
          return res.redirect('/userprofile');
      } else if (user instanceof Employee) {
          // If the authenticated user is an employee, redirect based on their role
          if (user.role === 'admin') {
              return res.redirect('/admin');
          } else if (user.role === 'employee') {
              return res.redirect('/employee');
          } else if (user.role === 'Event manager') {
            return res.redirect('/Event manager');
          }  else if (user.role === 'Event coordinator') {
          return res.redirect('/Event coordinator');
         }  else if (user.role === 'Event sales') {
        return res.redirect('/Event sales');
    }
      }
  }

  // If not authenticated or session expired, render the index page with authentication status
  res.render('index', { isAuthenticated });
});

router.get('/index', (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.user !== undefined;

  if (isAuthenticated && req.session.profilePage) {
    return res.redirect(req.session.profilePage);
}


  if (isAuthenticated) {
      const user = req.session.user;
      if (user instanceof User) {
          // If the authenticated user is a regular user, redirect to their profile
          return res.redirect('/userprofile');
      } else if (user instanceof Employee) {
          // If the authenticated user is an employee, redirect based on their role
          if (user.role === 'admin') {
              return res.redirect('/admin');
          } else if (user.role === 'employee') {
              return res.redirect('/employee');
          } else if (user.role === 'Event manager') {
            return res.redirect('/Event manager');
          }  else if (user.role === 'Event coordinator') {
          return res.redirect('/Event coordinator');
         }  else if (user.role === 'Event sales') {
        return res.redirect('/Event sales');
    }
      }
  }

  // If not authenticated or session expired, render the index page with authentication status
  res.render('index', { isAuthenticated });
});

  router.get('/AboutUs', (req, res) => {
    res.render('side/AboutUs');
  });

router.get('/birthdayparty', (req, res) => {
    res.render('side/birthdayparty');
  }); 
  
router.get('/booking', (req, res) => {
    res.render('side/booking');
  }); 
  
  router.get('/corporate', (req, res) => {
    res.render('side/corporate');
  });

  router.get('/cultural', (req, res) => {
    res.render('side/cultural');
  });
  
  
  router.get('/dj', (req, res) => {
    res.render('side/dj');
  });

  router.get('/gettogether', (req, res) => {
    res.render('side/gettogether');
  });

  router.get('/Help', (req, res) => {
    res.render('side/Help');
  });

  router.get('/housewarming', (req, res) => {
    res.render('side/housewarming');
  });

  router.get('/marthon', (req, res) => {
    res.render('side/marthon');
  });

  router.get('/privacy', (req, res) => {
    res.render('side/privacy');
  });

  router.get('/rec', (req, res) => {
    res.render('side/rec');
  });

  router.get('/wa', (req, res) => {
    res.render('side/wa');
  });

  router.get('/wedding', (req, res) => {
    res.render('side/wedding');
  });

  router.get('/signup', (req, res) => {
    res.render('signup');
   });

   router.get('/register', (req, res) => {
    res.render('register');
   });   

   router.get('/thank_you', (req, res) => {
    res.render('side/thank_you');
   }); 


module.exports = router;
