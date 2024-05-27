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

client.connect(err => {
   userCollection = client.db("MyFlipCard").collection("users");
   cardCollection = client.db("MyFlipCard").collection("userFlipCard");
  // perform actions on the collection object
  console.log ('Database up!\n')
});

const { ObjectId } = require('mongodb');

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
app.put('/updateCard', (req, res) => {
    if (!currentUser) {
        return res.status(401).send("No user is currently logged in.");
    }

    const cardId = req.body.cardId;
    const updatedData = {
        question: req.body.question,
        answer: req.body.answer,
        cardType: req.body.cardType
    };

    const objectId = new require('mongodb').ObjectID(cardId);

    cardCollection.updateOne({ _id: objectId, userId: currentUser._id }, { $set: updatedData }, function(err, result) {
        if (err) {
            console.log("Error updating card:", err);
            return res.status(500).send({ error: "Error updating card." });
        } else {
            console.log("Card updated:", result);
            return res.status(200).send({ message: "Card updated successfully." });
        }
    });
});

//Endpoint to get card data
app.get('/getFlashcards', (req, res) => {
	cardCollection.find({}).toArray((err, flashcards) => {
		if (err) {
			console.error("Error fetching flashcards:", err);
			res.status(500).send("Error fetching flashcards from the database.");
		} else {
			//console.log("Retrieved flashcards:", flashcards);
			res.status(200).json({ flashcards: flashcards });
		}
	});
});

//Retrieve flashcard by subject with total number and created user's name
app.get('/getCardSubject', (req, res) => {
    cardCollection.find({}).toArray(function(err, allFlashcards) {
        if (err) {
            console.log("Error retrieving flashcards:", err);
            return res.status(500).send("Error retrieving flashcards.");
        }

        const flashcardsBySubject = {};
        let userName = '';

        allFlashcards.forEach(flashcard => {
            if (!flashcardsBySubject[flashcard.subject]) {
                flashcardsBySubject[flashcard.subject] = 0;
            }
            flashcardsBySubject[flashcard.subject]++;
            userName = flashcard.userName; 
        });

        return res.status(200).json({ flashcardsBySubject, userName });
    });
});

//Endpoint to add a new card 
app.post('/postCard', (req, res) => {
	if (!currentUser) {
        return res.status(401).send("No user is currently logged in.");
    }

    const userName = `${currentUser.firstName} ${currentUser.lastName}`;
    const cardData = {
        userName: userName,
        subject: req.body.subject,
        question: req.body.question,
        answer: req.body.answer,
        cardType: req.body.cardType,
		flipped: false
    };

    console.log("POST request received: " + JSON.stringify(cardData));

    cardCollection.insertOne(cardData, function(err, result) {
        if (err) {
            console.log("Error occurred: " + err);
            res.status(500).json({ error: "An error occurred while saving the flashcard." });
        } else {
            console.log("Flashcard saved: " + JSON.stringify(cardData));
            res.status(200).json(cardData);
        }
    });
});

//Endpoint to get current user's flashcards
app.get('/currentUserCards', (req, res) => {
    if (!currentUser) {
        res.status(401).send("No user is currently logged in.");
        return;
    }

	const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`;

    cardCollection.find({ userName: currentUserName }).toArray(function(err, userFlashcards) {
        if (err) {
            console.log("Error retrieving user's flashcards:", err);
            return res.status(500).send("Error retrieving user's flashcards.");
        }

        const userName = currentUser;
        return res.status(200).json({ userFlashcards, userName });
    });
});

//Endpoint to update current user's flashcards
app.put('/updateCard', (req, res) => {
    if (!currentUser) {
        return res.status(401).send("No user is currently logged in.");
    }

    const cardId = req.body.cardId;
    const updatedData = {
        subject: req.body.subject,
        question: req.body.question,
        answer: req.body.answer,
        cardType: req.body.cardType
    };

    console.log("Received update request with data:", req.body);

    const objectId = new ObjectId(cardId);

    cardCollection.updateOne({ _id: objectId, userId: currentUser._id }, { $set: updatedData }, (err, result) => {
        if (err) {
            console.log("Error updating card:", err);
            return res.status(500).send({ error: "Error updating card." });
        } else {
            console.log("Card update result:", result);
            if (result.modifiedCount === 0) {
                console.log("No documents were updated. Check if the card ID and user ID match.");
            }
            console.log("Updated document:", updatedData);
            return res.status(200).send({ message: "Card updated successfully." });
        }
    });
});

app.delete('/deleteCard', (req, res) => {
    const cardId = req.query.cardId;

    console.log("Received cardId in delete request:", cardId); // Debugging statement

    // Validate cardId
    if (!ObjectId.isValid(cardId)) {
        console.error("Invalid card ID:", cardId); // Debugging statement
        return res.status(400).send("Invalid card ID.");
    }

    const objectId = new ObjectId(cardId);

    cardCollection.deleteOne({ _id: objectId, userId: currentUser._id }, function(err, result) {
        if (err) {
            console.error("Error deleting card:", err); // Debugging statement
            return res.status(500).send("Error deleting card.");
        } else if (result.deletedCount === 0) {
            console.warn("Card not found or not deleted:", result); // Debugging statement
            return res.status(404).send("Card not found or you do not have permission to delete this card.");
        } else {
            console.log("Card deleted:", result); // Debugging statement
            return res.status(200).send("Card deleted successfully.");
        }
    });
});

app.listen(port, () => {
  console.log(`MyFlashCard app listening at http://localhost:${port}`) 
});
