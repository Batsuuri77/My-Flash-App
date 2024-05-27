//==================================index.js==================================//

var debug = false;


$(document).ready(function () {

	localStorage.removeItem("allUsers");

	// if (!localStorage.allUsers) {
	  
	// 	if (debug) alert("Users not found - creating a default user!");
		
	// 	var userData = {email:"admin@domain.com",password:"admin",firstName:"CQU",lastName:"User",state:"QLD",phoneNumber:"0422919919", address:"700 Yamba Road", postcode:"4701"};
		
	// 	var allUsers = [];
	// 	allUsers.push(userData); 
		
	// 	if (debug) alert(JSON.stringify(allUsers));  
	// 	localStorage.setItem("allUsers", JSON.stringify(allUsers));

	// } else {
        
	// 	if (debug) alert("Names Array found-loading.."); 		
		
	// 	var allUsers = JSON.parse(localStorage.allUsers);    
	// 	if (debug) alert(JSON.stringify(allUsers));
	// } 

	// if (!localStorage.allCards) {
	  
	// 	if (debug) alert("Cards not found");
		
	// 	var cardData = {question:"What is my name", answer:"Vinay"};
		
	// 	var allCards = [];
	// 	allCards.push(cardData); 
		
	// 	if (debug) alert(JSON.stringify(allCards));  
	// 	localStorage.setItem("allCards", JSON.stringify(allCards));

	// } else {
        
	// 	if (debug) alert("Names Array found-loading.."); 		
		
	// 	var allCards = JSON.parse(localStorage.allCards);    
	// 	if (debug) alert(JSON.stringify(allCards));
	// } 


	/**
	----------------------Event handler to process login request----------------------
	**/
	
	$('#loginButton').click(function () {
		$("#loginForm").submit();
    });


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

            $.post("http://localhost:3000/verifyUser", inputData, function(data, status) {
                if (debug) alert("Data received: " + JSON.stringify(data));
                if (debug) alert("\nStatus: " + status);

                if (data.length > 0) {
                    alert("Login success");
                    localStorage.setItem("userInfo", JSON.stringify(data[0]));
                    $.mobile.changePage("#homePage");
                } else {
                    alert("Login failed: Incorrect email or password");
                }

                $("#loginForm").trigger('reset');
            }).fail(function() {
                alert("An error occurred while verifying the user. Please try again later.");
            });
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

    /**
	----------------------Event handler for signing up----------------------
	**/

        // Event handler for Sign-up form submission
    $('#signupButton').on('click', () => {
        $("#signupForm").submit();
    });

    // Initialize form validation rules using jQuery Validation plugin
    $("#signupForm").validate({

        focusInvalid: false,
			onkeyup: false,
			submitHandler: function (form) {

				var formData = $(form).serializeArray();
				var userData = {};

				formData.forEach(function (data) {
					userData[data.name] = data.value;
				});

				if (debug) alert(JSON.stringify(userData));

				localStorage.setItem("userData", JSON.stringify(userData));

                $.post("http://localhost:3000/registerUser", userData)
                .done(function (data, status, xhr) {
                    if (debug) alert("Data sent: " + JSON.stringify(data));
                    if (debug) alert("\nStatus: " + status);
                    alert("Signing up successfully!");
                    $("#signupForm").trigger('reset');

                    $.mobile.changePage("#loginPage");
                })
                .fail(function (xhr, status, error) {
                    if (xhr.status === 409) {
                        alert("User already exists. Please use a different email.");
                    } else {
                        alert("An error occurred: " + error);
                    }
                    $("#signupForm").trigger('reset');
                });
			},

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

    /**
	--------------------------end--------------------------
	**/

    // let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
    // let currentCardIndex = 0;
    // let isViewingCards = false;

    // document.getElementById("flashcardForm").addEventListener("submit", function(event) {
    //     event.preventDefault();
    //     const question = document.getElementById("question").value;
    //     const answer = document.getElementById("answer").value;
    //     if (question.trim() !== "" && answer.trim() !== "") {
    //         flashcards.push({ question, answer });
    //         localStorage.setItem("flashcards", JSON.stringify(flashcards));
    //         document.getElementById("question").value = "";
    //         document.getElementById("answer").value = "";
    //         alert("Flashcard saved successfully!");
    //     } else {
    //         alert("Please enter both question and answer.");
    //     }
    // });

    // function displayFlashcard(index) {
    //     const flashcardContainer = document.getElementById("flashcardContainer");
    //     flashcardContainer.innerHTML = "";
    //     if (flashcards.length > 0) {
    //         const flashcard = flashcards[index];
    //         const card = document.createElement("div");
    //         card.classList.add("flashcard");

    //         const front = document.createElement("div");
    //         front.classList.add("flashcard-face", "flashcard-front");
    //         front.textContent = flashcard.question;

    //         const back = document.createElement("div");
    //         back.classList.add("flashcard-face", "flashcard-back");
    //         back.textContent = flashcard.answer;

    //         card.appendChild(front);
    //         card.appendChild(back);

    //         card.addEventListener("click", () => {
    //             card.classList.toggle("is-flipped");
    //         });

    //         flashcardContainer.appendChild(card);
    //     } else {
    //         flashcardContainer.textContent = "No flashcards available.";
    //     }
    // }

    /**
	----------------------Event handler for user profile----------------------
	**/
    $(document).on("pagecontainershow", function (event, ui) {
        console.log("Page containers show event triggered.");
        var page = ui.toPage[0].id;
        if (page === "userProfilePage") {
            console.log("Navigated to userProfilePage");
            $.get("http://localhost:3000/getCurrentUser", function (data) {
                console.log("getCurrentUser API response:", data);
                data = JSON.parse(data);
                $("#profileInfo").empty();
                if (!data) {
                    $("#profileInfo").append("<br><p>No user information available</p><br>");
                } else {
                    $("#profileInfo").append("<table class='profile-table'><tbody>");
                    $("#profileInfo").append("<tr><td><b><span class=\"textcolor\">" + data.firstName + " " + data.lastName + "</span></b></td></tr>");
                    $("#profileInfo").append("<tr><td><span class=\"textcolor\">" + data.email + "</span></td></tr>");
                    $("#profileInfo").append("<tr><td><span class=\"textcolor\">" + data.phoneNumber + "</span></td></tr>");
                    $("#profileInfo").append("<tr><td><span class=\"textcolor\">" + data.address + " " + data.state + " " + data.postcode + "</span></td></tr>");
                    $("#profileInfo").append("</tbody></table><br>"); 
                }
                $("#profileInfo").trigger("create");
            }).fail(function (xhr, status, error) {
                console.error("Error fetching getCurrentUser:", error);
            });
        }
    });
    /**
	--------------------------end--------------------------
	**/


    /**
	----------------------Event handler for editing user profile----------------------
	**/
    $("#saveProfileButton").on("click", function(event) {
        event.preventDefault(); 
        
        var formData = $(form).serializeArray();
        var updatedUser = {};

        formData.forEach(function (data) {
            updatedUser[data.name] = data.value;
        });

        if (debug) alert(JSON.stringify(updatedUser));

        $.ajax({
            url: "http://localhost:3000/updateUser",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedUser),
            success: function(response) {
                console.log("User updated successfully:", response);
                alert(updatedUser.firstName + " " + updatedUser.lastName + "info updated successfully.");
                window.location.href = "#userProfilePage";
            },
            error: function(xhr, status, error) {
                console.error("Error updating user:", error);
                alert("There was an error updating your profile. Please try again.");
            }
        });
    });

    $(document).on("pagecontainershow", function(event, ui) {
        console.log("Page containers show event triggered.");
        var page = ui.toPage[0].id;
        if (page === "editProfilePage") {
            console.log("Navigated to editProfilePage");
            $.get("http://localhost:3000/getCurrentUser", function(data) {
                console.log("getCurrentUser API response:", data);
                data = JSON.parse(data);
                $("#editProfile").empty();
                if (!data) {
                    $("#editProfile").append("<br><p>No user information available</p><br>");
                } else {
                    $("#editProfile").append("<form id='editProfileForm' class='editProfile form wrap'>");
                    $("#editProfileForm").append("<label for='editFirstName'>First Name</label>");
                    $("#editProfileForm").append("<input type='text' id='editFirstName' name='editFirstName' value='" + data.firstName + "' required>");
                    $("#editProfileForm").append("<label for='editLastName'>Last Name</label>");
                    $("#editProfileForm").append("<input type='text' id='editLastName' name='editLastName' value='" + data.lastName + "' required>");
                    $("#editProfileForm").append("<label for='editEmail'>Email</label>");
                    $("#editProfileForm").append("<input type='email' id='editEmail' name='editEmail' value='" + data.email + "' required>");
                    $("#editProfileForm").append("<label for='editPhonenumber'>Phone Number</label>");
                    $("#editProfileForm").append("<input type='text' id='editPhonenumber' name='editPhonenumber' value='" + data.phoneNumber + "' required>");
                    $("#editProfileForm").append("<label for='editAddress'>Address</label>");
                    $("#editProfileForm").append("<input type='text' id='editAddress' name='editAddress' value='" + data.address + "' required>");
                    $("#editProfileForm").append("<label for='editState'>State</label>");
                    $("#editProfileForm").append(`<select name="state" id="state" required>
                        <option value="">Select State</option>
                        <option value="ACT" ${data.state === "ACT" ? "selected" : ""}>ACT</option>
                        <option value="VIC" ${data.state === "VIC" ? "selected" : ""}>VIC</option>
                        <option value="NSW" ${data.state === "NSW" ? "selected" : ""}>NSW</option>
                        <option value="QLD" ${data.state === "QLD" ? "selected" : ""}>QLD</option>
                        <option value="SA" ${data.state === "SA" ? "selected" : ""}>SA</option>
                        <option value="TAS" ${data.state === "TAS" ? "selected" : ""}>TAS</option>
                    </select>`);
                    $("#editProfileForm").append("<label for='editPostcode'>Postcode</label>");
                    $("#editProfileForm").append("<input type='text' id='editPostcode' name='editPostcode' value='" + data.postcode + "' required>");
                    $("#editProfileForm").append("<label for='editPassword'>Password</label>");
                    $("#editProfileForm").append("<input type='password' id='editPassword' name='editPassword' value='" + data.password + "' required>");
                    
                    $("#editProfile").append("</form><br>"); 
                }
                $("#editProfile").trigger("create");
            }).fail(function(xhr, status, error) {
                console.error("Error fetching getCurrentUser:", error);
            });
        }
    });

    /**
	--------------------------end--------------------------
	**/

    /**
	----------------------Event handler for adding a new flash card----------------------
	**/
    $("#flashcardForm").validate({
        submitHandler: function(form) {

            var formData = $(form).serializeArray();
            var cardData = {};

            formData.forEach(function (data) {
                cardData[data.name] = data.value;
            });

            if (debug) alert(JSON.stringify(cardData));

            $.post("http://localhost:3000/postCard", cardData).done(function(data, status, xhr){
                if (debug) {
                    alert("Data sent: " + JSON.stringify(data));
                    alert("\nStatus: " + status);
                }
                alert("Card saved successfully");
                $("#flashcardForm").trigger('reset');
                $.mobile.changePage("#homePage");
            })
            .fail(function(xhr, status, error) {
                if (xhr.status === 409) {
                    alert("User already exists. Please use a different email.");
                } else {
                    alert("An error occurred: " + error);
                }
                $("#flashcardForm").trigger('reset');
            });
        },

        rules: {
            subject: {
                required: true
            },
            question: {
                required: true
            },
            answer: {
                required: true
            }
        },
        messages: {
            subject: {
                required: "Please enter a subject"
            },
            question: {
                required: "Please enter a question"
            },
            answer: {
                required: "Please enter an answer"
            }
        }
    });
    
    $('#saveCardBtn').on('click', function() {
        $("#flashcardForm").submit();
    });
    /**
	--------------------------end--------------------------
	**/

    /**
	----------------------Event handler for home page----------------------
	**/
    $(document).on("pagecontainershow", function (event, ui) {
        var page = ui.toPage[0].id;
        if (page === "homePage") {
            getFlashcardsBySubject();
            getFlashcards();
        }
    });

    function getFlashcardsBySubject() {
        $.get("http://localhost:3000/getCardSubject", function(data, status) {
            console.log("Data:", data);
            console.log("Status:", status);
            if (status === "success") {
                $("#subjectBoxContainer").empty();
                for (const subject in data.flashcardsBySubject) {
                    const cardCount = data.flashcardsBySubject[subject];
                    const userName = data.userName;
                    const subjectBox = $("<div class='subjectBox'></div>");

                    subjectBox.append("<div class='subject'>" + subject + "</div>");
                    subjectBox.append("<div class='cardNumber'>" + cardCount + " cards." + "</div>");
                    subjectBox.append("<div class='userName'>" + userName + "</div>");

                    $("#subjectBoxContainer").append(subjectBox);
                }
            } else {
                console.error("Error fetching flashcards:", status);
            }
        });
    }

    function getFlashcards() {
    $.get("http://localhost:3000/getFlashcards", function(data, status) {
        if (status === "success") {
            $("#cardBox").empty();
            data.flashcards.reverse().forEach(function(flashcard) {
                if (flashcard.cardType === 'public') { // Only display public type flashcards
                    const flashcardElement = $("<div class='flashcard'></div>");
                    const answerDiv = $("<div class='answer'></div>").text(flashcard.answer);
                    const questionDiv = $("<div class='question'></div>").text(flashcard.question);

                    flashcardElement.addClass('flipped');
                    questionDiv.hide();
                    answerDiv.show();

                    const isFlipped = localStorage.getItem(flashcard._id) === 'true';

                    if (isFlipped) {
                        flashcardElement.addClass('flipped');
                        questionDiv.hide();
                        answerDiv.show();
                    } else {
                        flashcardElement.removeClass('flipped');
                        questionDiv.show();
                        answerDiv.hide();
                    }

                    flashcardElement.on("click", function() {
                        flashcardElement.toggleClass("flipped");
                        const currentlyFlipped = flashcardElement.hasClass('flipped');

                        if (currentlyFlipped) {
                            questionDiv.hide();
                            answerDiv.show();
                        } else {
                            questionDiv.show();
                            answerDiv.hide();
                        }

                        localStorage.setItem(flashcard._id, currentlyFlipped);
                    });

                    flashcardElement.append(answerDiv);
                    flashcardElement.append(questionDiv);

                    $("#cardBox").append(flashcardElement);
                }
            });
        } else {
            console.error("Error fetching flashcards:", status);
        }
    });
}
    
    

});



function openNav() {
document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
document.getElementById("mySidenav").style.width = "0";
}

    
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
