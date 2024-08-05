const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const login = require('./routes/auth');
const UserWall =require('./models/wall');


app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Set maxAge for session cookie
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 *10000
  }
}));

mongoose.connect('mongodb://localhost:27017/EventPro', { useNewUrlParser: true, useUnifiedTopology: true });
app.use('/', login);
app.use('/', userRoutes);
app.use('/', employeeRoutes);
app.use('/', profileRoutes);
app.use('/', indexRoutes); 

process.on('SIGINT', async () => {
  try {
    await UserWall.deleteMany({});
    console.log('All data removed from Wall collection');
    process.exit(0);
  } catch (error) {
    console.error('Error removing data from Wall collection:', error);
    process.exit(1);
  }
});

// Start the server
const port =3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});