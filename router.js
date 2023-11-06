var express = require("express");
var router = express.Router();
const session = require ('express-session')
const {v4:uuidv4}=require('uuid');
const db = require("./dbconnection")

const key=uuidv4();

router.use(session({
    secret:key,
    resave:false,
    saveUninitialized:false
  }))

  router.post('/login', async (req, res) => {
    const dbconnect = await db.findOne({ username: req.body.username });
  
    if (dbconnect.password === req.body.password) {
      // Store user data in the session
      req.session.user = dbconnect.username;
      res.status(201).redirect('/pannel');
    } else {
      res.render('base', { out: 'Incorrect credentials' });
    }
  });
  
router.get('/pannel', async (req, res) => {
  if(req.session.user)
  {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
      const dbconnect = await db.find();
      res.render('pannel', { userData: dbconnect });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  else {
    res.send("Please sign in");
}
  
});

router.get('/edit/:_id',async (req,res)=>{
  if(req.session.user)
  {
  const userData=req.params._id;
  const dbconnect = await db.findOne({_id:userData});
  res.render('edit', { user: dbconnect})
  }
  else {
    res.send("Please sign in");
}
});

router.post('/edit/:_id', async (req, res) => {
  if(req.session.user)
  {
  try {
    const userId = req.params._id;
    const updatedData = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    };
    
    const dbconnect = await db.findOne({ _id: userId });
    
    if (dbconnect) {
      // Update the user's data
      const result = await db.updateOne({ _id: userId }, { $set: updatedData });
      
      if (result.modifiedCount > 0) {
        // The data was updated successfully
        res.redirect('/pannel'); // Redirect to the user list page or another appropriate location
      } else {
        // Handle the case where the update didn't modify any records
        res.send('No records were updated.');
      }
    } else {
      // Handle the case where the user with the specified ID wasn't found
      res.send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
else {
  res.send("Please sign in");
}
});

router.post('/delete/:_id',async(req,res)=>
{
  if(req.session.user)
  {
  const delData = await req.params._id;
  const dbconnect = await db.findOne({_id:delData});
 
  if(dbconnect)
  {
    const result = await db.deleteOne({_id:delData})
    if(result)
    {
      res.redirect('/pannel');
    }
    else
    {
      res.send("Not deleted");
    }
  }
}
else {
  res.send("Please sign in");
}
});


  router.get('/register', async (req, res) => {
    if(req.session.user)
  {
   res.render('create')
  }
  else
  {
    res.send("Please sign in");
  }
  });

  router.post('/create', async (req, res) => {
    if(req.session.user)
  {
    const existUser = await db.findOne({ email: req.body.email });
    if (existUser) {
      return res.status(400).json({ error: "User already exists. Please choose a different username" });
    } else {
      try {
        // Data to be inserted
        const dataToInsert = {
          name: req.body.username,
          username: req.body.email,
          password: req.body.password
        };
  
        // Insert the data into the database
        const result = await db.insertMany(dataToInsert);
  
        if (result) {
          // Data inserted successfully, redirect to '/pannel'
          res.redirect('/pannel');
        } else {
          // Failed to insert data
          return res.status(500).json({ error: 'Failed to insert data' });
        }
      } catch (error) {
        console.error('Error while inserting data:', error);
        res.status(500).json({ error: 'Failed to insert data' });
      }
    }
  }
    else {
      res.send("Please sign in");
    }
  });

  router.post('/find',async (req,res)=>
  {
    if(req.session.user)
    {
    const searchData = await req.body.search;
    // console.log(searchData);
    const dbconnect = await db.findOne({username:searchData});
    // console.log(dbconnect);
    if(dbconnect)
    {
     
      res.render('searchview', { userData: dbconnect });
    }
    else
    {
      res.send("User not found");
    }
  }
    else {
      res.send("Please sign in");
    }
  });
  

  router.get('/logout', (req, res) => {

    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        res.clearCookie('connect.sid');
        res.render('login', { logout: "Logout Successfully" });
      }
    });
  });

module.exports = router;