const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

let currentUser = null; //Declaring current user for storing it after login success.

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://12230726:12230726@cluster0.arkh66z.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
var userCollection;
var cardCollection;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.connect(err => {
   userCollection = client.db("MyFlipCard").collection("users");
   cardCollection = client.db("MyFlipCard").collection("userFlipCard");
  // perform actions on the collection object
  console.log ('Database up!\n')
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/verifyUser', (req, res) => {

	loginData = req.body;

	console.log(loginData);

	userCollection.find({email:loginData.email, password:loginData.password}, {projection:{_id:0}}).toArray( function(err, user) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.status(500).send("Internal Server Error");
		} else {
		    console.log(JSON.stringify(user) + " have been retrieved.\n");
			if (user.length > 0) {
				currentUser = user[0]; //Storing logged user in the currentUser
				console.log("Current user: " + JSON.stringify(currentUser));
				res.status(200).send(user);
			} else {
				res.status(401).send("Invalid email or password.");
			}
		}	   
	});

});

app.post('/registerUser', (req, res) => {
	console.log("POST request received : " + JSON.stringify(req.body)); 
    
	//Validating repetition of register user data by it's email and name  
	userCollection.findOne({ 
		email: req.body.email, 
		firstName: req.body.firstName, 
		lastName: req.body.lastName}, function(err, existingUser) {
			if (err) {
				console.log("Error checking user existence: " + err);
				res.status(500).send("Error checking user.");
			} else if (existingUser) {
				console.log("User already exists:", existingUser);
				res.status(409).send("User already exists.");
			} else {
				req.body.phoneNumber = parseInt(req.body.phoneNumber); //Parsing phoneNumber String to int. to store as an integer
				//insert new user's data to users collection.
				userCollection.insertOne(req.body, function(err, result) {
					if (err) {
						console.log("Some error.. " + err + "\n");
						res.status(500).send("Error registering user.");
					}else {
						console.log(JSON.stringify(req.body) + " have been uploaded\n"); 
						res.send(JSON.stringify(req.body))
					}
				});
			}
	});
});

app.get('/getCurrentUser', (req, res) => {
    console.log("GET request received for getCurrentUser");
    if (currentUser) {
        const currentUserString = JSON.stringify(currentUser);
        res.status(200).send(currentUserString);
        //console.log("currentUser sent:", currentUserString);
    } else {
        res.status(401).send("No user is currently logged in.");
        console.log("No user is currently logged in.");
    }
});
  
// Endpoint to update the current user's details
app.put('/updateUser', (req, res) => {
	if (!currentUser) {
		res.status(401).send("No user is currently logged in.");
		return;
	}

	const updatedData = req.body;
	userCollection.updateOne({ email: currentUser.email }, { $set: updatedData }, function (err, result) {
		if (err) {
		console.log("Some error.. " + err + "\n");
		res.status(500).send("Error updating user.");
		} else {
		console.log(JSON.stringify(updatedData) + " have been updated\n");
		// Update currentUser with new data
		Object.assign(currentUser, updatedData);
		res.status(200).send(currentUser);
		}
	});
});

  
app.listen(port, () => {
  console.log(`MyFlashCard app listening at http://localhost:${port}`) 
});
