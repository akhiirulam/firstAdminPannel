const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/userdb')
  .then(() => {
    console.log('Mongoose connected');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

  const LogInSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  });

const userdb = mongoose.model('admins', LogInSchema);

module.exports = userdb;
