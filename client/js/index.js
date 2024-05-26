//==================================index.js==================================//

var debug = false;


$(document).ready(function () {

	localStorage.removeItem("allUsers");

	if (!localStorage.allUsers) {
	  
		if (debug) alert("Users not found - creating a default user!");
		
		var userData = {email:"admin@domain.com",password:"admin",firstName:"CQU",lastName:"User",state:"QLD",phoneNumber:"0422919919", address:"700 Yamba Road", postcode:"4701"};
		
		var allUsers = [];
		allUsers.push(userData); 
		
		if (debug) alert(JSON.stringify(allUsers));  
		localStorage.setItem("allUsers", JSON.stringify(allUsers));

	} else {
        
		if (debug) alert("Names Array found-loading.."); 		
		
		var allUsers = JSON.parse(localStorage.allUsers);    
		if (debug) alert(JSON.stringify(allUsers));
	} 

	if (!localStorage.allCards) {
	  
		if (debug) alert("Cards not found");
		
		var cardData = {question:"What is my name", answer:"Vinay"};
		
		var allCards = [];
		allCards.push(cardData); 
		
		if (debug) alert(JSON.stringify(allCards));  
		localStorage.setItem("allCards", JSON.stringify(allCards));

	} else {
        
		if (debug) alert("Names Array found-loading.."); 		
		
		var allCards = JSON.parse(localStorage.allCards);    
		if (debug) alert(JSON.stringify(allCards));
	} 


	/**
	----------------------Event handler to process login request----------------------
	**/
	
	$('#loginButton').click(function () {

		localStorage.removeItem("inputData")

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));

			$.post("http://localhost:3000/verifyUser", inputData,  function(data, status){
					if (debug) alert("Data received: " + JSON.stringify(data));
					if (debug) alert("\nStatus: " + status);
				
				if (data.length > 0) {
					alert("Login success");
					authenticated = true;
					localStorage.setItem("userInfo", JSON.stringify(data[0]));	
					$.mobile.changePage("#homePage");
				} 
				else {
					alert("Login failed");
				}

				$("#loginForm").trigger('reset');	
			})
		}
		
	})


	$("#loginForm").validate({ // JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			authenticated = false;
			
			var formData =$(form).serializeArray();
			var inputData = {};
			formData.forEach(function(data){
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));		

		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "please enter your email",
				email: "The email format is incorrect  "
			},
			password: {
				required: "It cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	})
    
	/**
	--------------------------end--------------------------
	**/	
        // Event handler for Sign-up form submission
    $('#signupForm').submit(function (e) {
        e.preventDefault(); // Prevent default form submission
        
        // Validate the form using jQuery Validation plugin
        if ($(this).valid()) {
            var inputData = {
                email: $('#email').val(),
                password: $('#password').val(),
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                state: $('#state').val(),
                phoneNumber: $('#phoneNumber').val(),
                address: $('#address').val(),
                postcode: $('#postcode').val()
            };

            var allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
            var existingUser = allUsers.find(user => user.email === inputData.email);

            if (existingUser) {
                alert("User already exists! Please use a different email.");
            } else {
                allUsers.push(inputData);
                localStorage.setItem("allUsers", JSON.stringify(allUsers));
                alert("Sign up successful! You can now log in.");
                $.mobile.changePage("#loginPage");
            }
            loadProfile();
            $("#signupForm")[0].reset(); // Reset the form
        }
    });

    

    // Initialize form validation rules using jQuery Validation plugin
    $("#signupForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6 // Minimum password length
            },
            firstName: {
                required: true
            },
            lastName: {
                required: true
            },
            state: {
                required: true
            },
            phoneNumber: {
                required: true,
                digits: true // Only allow digits
            },
            address: {
                required: true
            },
            postcode: {
                required: true,
                digits: true // Only allow digits
            }
        },
        messages: {
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email address"
            },
            password: {
                required: "Please enter a password",
                minlength: "Password must be at least 6 characters long"
            },
            firstName: {
                required: "Please enter your first name"
            },
            lastName: {
                required: "Please enter your last name"
            },
            state: {
                required: "Please select your state"
            },
            phoneNumber: {
                required: "Please enter your phone number",
                digits: "Please enter only digits"
            },
            address: {
                required: "Please enter your address"
            },
            postcode: {
                required: "Please enter your postcode",
                digits: "Please enter only digits"
            }
        }
    });
});




function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let currentCardIndex = 0;
let isViewingCards = false;

document.getElementById("flashcardForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer").value;
    if (question.trim() !== "" && answer.trim() !== "") {
        flashcards.push({ question, answer });
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
        document.getElementById("question").value = "";
        document.getElementById("answer").value = "";
        alert("Flashcard saved successfully!");
    } else {
        alert("Please enter both question and answer.");
    }
});

function displayFlashcard(index) {
    const flashcardContainer = document.getElementById("flashcardContainer");
    flashcardContainer.innerHTML = "";
    if (flashcards.length > 0) {
        const flashcard = flashcards[index];
        const card = document.createElement("div");
        card.classList.add("flashcard");

        const front = document.createElement("div");
        front.classList.add("flashcard-face", "flashcard-front");
        front.textContent = flashcard.question;

        const back = document.createElement("div");
        back.classList.add("flashcard-face", "flashcard-back");
        back.textContent = flashcard.answer;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener("click", () => {
            card.classList.toggle("is-flipped");
        });

        flashcardContainer.appendChild(card);
    } else {
        flashcardContainer.textContent = "No flashcards available.";
    }
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayFlashcard(currentCardIndex);
    }
}

function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        displayFlashcard(currentCardIndex);
    }
}

function toggleView() {
    const inputPage = document.getElementById("inputPage");
    const flashcardPage = document.getElementById("flashcardPage");

    if (isViewingCards) {
        inputPage.style.display = "block";
        flashcardPage.style.display = "none";
    } else {
        inputPage.style.display = "none";
        flashcardPage.style.display = "block";
        displayFlashcard(currentCardIndex);
    }
    isViewingCards = !isViewingCards;
}

// Initial call to display the first flashcard
if (flashcards.length > 0) {
    displayFlashcard(currentCardIndex);
}

function loadProfile() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
        document.getElementById("profileEmail").textContent = userInfo.email;
        document.getElementById("profileName").textContent = userInfo.firstName + ' ' + userInfo.lastName;
        document.getElementById("profileMobileNumber").textContent = userInfo.phoneNumber;
        document.getElementById("profileAddress").textContent = userInfo.address+ ', ' +userInfo.state + ', ' + userInfo.postcode;
    }
}

function toggleEditProfile() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
        document.getElementById("editEmail").value = userInfo.email;
        document.getElementById("editFirstName").value = userInfo.firstName;
        document.getElementById("editLastName").value = userInfo.lastName;
        document.getElementById("editPassword").value = userInfo.password;
        document.getElementById("editMobileNumber").value = userInfo.phoneNumber;
        document.getElementById("editAddress").value = userInfo.address;
        document.getElementById("editPostcode").value = userInfo.postcode;
    }
    document.getElementById("userProfilePage").style.display = "none";
    document.getElementById("editProfilePage").style.display = "block";
}

document.getElementById("editProfileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    $("#editProfileForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6 // Minimum password length
            },
            firstName: {
                required: true
            },
            lastName: {
                required: true
            },
            phoneNumber: {
                required: true,
                digits: true // Only allow digits
            },
            address: {
                required: true
            },
            postcode: {
                required: true,
                digits: true // Only allow digits
            }
        },
    });
    const updatedProfile = {
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        password: document.getElementById("editPassword").value,
        phoneNumber: document.getElementById("editMobileNumber").value,
        address: document.getElementById("editAddress").value,
        postcode: document.getElementById("editPostcode").value
    };
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
    loadProfile();
    toggleProfileView();
});

function toggleProfileView() {
    document.getElementById("userProfilePage").style.display = "block";
    document.getElementById("editProfilePage").style.display = "none";
}

function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        localStorage.removeItem("userInfo");
        loadProfile();
    }
}

// Initial call to load the profile data
loadProfile();


function deleteFlashcard() {
    if (confirm('Are you sure you want to delete this flashcard?')) {
        flashcards.splice(currentCardIndex, 1);
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        if (flashcards.length === 0) {
            alert('No cards available');
        } else {
            currentCardIndex = currentCardIndex > 0 ? currentCardIndex - 1 : 0;
            showPage(currentCardIndex);
        }
    }
}
function editFlashcard() {
    const question = prompt('Edit the question:', flashcards[currentCardIndex].question);
    const answer = prompt('Edit the answer:', flashcards[currentCardIndex].answer);

    if (question !== null && answer !== null) {
        flashcards[currentCardIndex].question = question;
        flashcards[currentCardIndex].answer = answer;
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        showPage(currentCardIndex);
        window.location.reload(true);
    }
    else{
        alert('No cards available');
    }
}