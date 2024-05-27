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

    /**
        --------------------------end--------------------------
    **/

    /**
	----------------------Event handler for library page----------------------
	**/

    $(document).on("pagecontainershow", function (event, ui) {
        var page = ui.toPage[0].id;
        if (page === "libraryPage") {
            getCurrentUserCards();
        }
    });
    
    function getCurrentUserCards() {
        $.get("http://localhost:3000/currentUserCards", function(data, status, xhr) {
            if (status === "success") {
                displayFlashcards(data.userFlashcards, data.userName);
            } else if (xhr.status === 401) {
                $("#flashcardContainer").text("User is not logged in.");
                $(".navigation").hide(); 
            } else {
                console.error("Error fetching current user's cards:", status);
            }
        });
    }
    
    function displayFlashcards(userFlashcards, userName) {
        var flashcardContainer = $("#flashcardContainer");
        flashcardContainer.empty();    
    
        userFlashcards.forEach(function(flashcard, index) {
            console.log(JSON.stringify(flashcard));
            const flashcardElement = $("<div class='flashcard' id='libraryCard'></div>");
            flashcardElement.attr("data-id", flashcard._id); // Set the card ID
            flashcardElement.data("flipped", localStorage.getItem(flashcard._id) === 'true'); // Set the flipped status
    
            const flashcardStatus = $("<div class='flashcardStatus'></div>");
            const answerDiv = $("<div class='answer'></div>").text(flashcard.answer);
            const questionDiv = $("<div class='question'></div>").text(flashcard.question);
            const subjectDiv = $("<div class='subject'></div>").text(flashcard.subject);
            const typeDiv = $("<div class='type'></div>").text(flashcard.cardType);
    
            flashcardElement.addClass('flipped');
            questionDiv.hide();
            answerDiv.show();
    
            if (flashcardElement.data("flipped")) {
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
            flashcardStatus.append(subjectDiv);
            flashcardStatus.append(typeDiv);
    
            if (index === 0) {
                flashcardElement.show();
            } else {
                flashcardElement.hide();
            }
    
            flashcardContainer.append(flashcardElement);
            flashcardElement.append(flashcardStatus);
        });
    
        if (userFlashcards.length <= 1) {
            $(".navigation").hide();
        } else {
            $(".navigation").show();
        }
    
        var navigationDiv = $("<div class='navigation'></div>");
        navigationDiv.append("<img src='img/backward.png' class='b1'>");
        navigationDiv.append("<img src='img/edit.png' class='e1'>");
        navigationDiv.append("<img src='img/delete.png' class='d1'>");
        navigationDiv.append("<img src='img/forward.png' class='f1'>");
        flashcardContainer.append(navigationDiv);
    
        $(".b1").click(showPreviousFlashcard);
        $(".f1").click(showNextFlashcard);
        $(".e1").click(goToEditPage);
        $(".d1").click(confirmDeleteFlashcard);
    }
    
    function showPreviousFlashcard() {
        var currentFlashcard = $(".flashcard:visible");
        var previousFlashcard = currentFlashcard.prev(".flashcard");
    
        if (previousFlashcard.length > 0) {
            currentFlashcard.hide();
            previousFlashcard.show();
        } else {
            alert("No previous flashcard available.");
        }
    }
    
    function showNextFlashcard() {
        var currentFlashcard = $(".flashcard:visible");
        var nextFlashcard = currentFlashcard.next(".flashcard");
    
        if (nextFlashcard.length > 0) {
            currentFlashcard.hide();
            nextFlashcard.show();
        } else {
            alert("No next flashcard available.");
        }
    }
    

    function goToEditPage() {
        var flashcardId = $(".flashcard:visible").attr("data-id"); 

        var subject = $(".flashcard:visible").find(".subject").text();
        var question = $(".flashcard:visible").find(".question").text();
        var answer = $(".flashcard:visible").find(".answer").text();
        var cardType = $(".flashcard:visible").find(".type").text();
        sessionStorage.setItem("editCardId", flashcardId); 
        console.log("Flashcard ID:", flashcardId);
        
        $.mobile.changePage("#editFlashCard", { transition: "fade" });
    
        $("#editCardForm #subjectEdited").val(subject);
        $("#editCardForm #questionEdited").val(question);
        $("#editCardForm #answerEdited").val(answer);
        $("#editCardForm #cardTypeEdited").val(cardType).selectmenu('refresh'); 
    }
    
    function confirmDeleteFlashcard(cardId) {
        if (confirm("Are you sure you want to delete this flashcard?")) {
            console.log("Attempting to delete card with ID:", cardId); // Debugging statement
    
            $.ajax({
                url: `http://localhost:3000/deleteCard?cardId=${encodeURIComponent(cardId)}`,
                type: "DELETE",
                success: function(response) {
                    console.log("Delete success response:", response); // Debugging statement
                    const flashcardElement = $(`.flashcard[data-id='${cardId}']`);
                    const nextFlashcard = flashcardElement.next(".flashcard");
    
                    flashcardElement.remove();
    
                    if ($(".flashcard").length === 0) {
                        $("#flashcardContainer").text("No flashcards available.");
                        $(".navigation").hide();
                    } else if (nextFlashcard.length > 0) {
                        nextFlashcard.show();
                    } else {
                        const previousFlashcard = flashcardElement.prev(".flashcard");
                        if (previousFlashcard.length > 0) {
                            previousFlashcard.show();
                        } else {
                            alert("No more flashcards available.");
                            $(".navigation").hide(); // Hide navigation if no cards are left
                        }
                    }
    
                    alert(response);
                },
                error: function(xhr, status, error) {
                    console.error("Error deleting card:", status, error);
                    alert("Error deleting card.");
                }
            });
        }
    }

    $(document).on("pagecreate", "#libraryPage", function() {
        $(document).on("click", ".d1", function() {
            const cardId = $(".flashcard:visible").attr("data-id");
            if (cardId) {
                confirmDeleteFlashcard(cardId);
            } else {
                console.error("Invalid card ID:", cardId);
                alert("Invalid card ID.");
            }
        });
    });
    

    /**
        --------------------------end--------------------------
    **/

    /**
	----------------------Event handler for Edit flash card page----------------------
	**/

    $(document).on("pagecreate", "#editFlashCard", function () {
        $(document).on("click", "#saveCardBtn", function(event) {
            event.preventDefault();
            console.log("Save Flashcard button clicked");
            var cardId = sessionStorage.getItem("editCardId");
            var subject = $("#subjectEdited").val();
            var question = $("#questionEdited").val();
            var answer = $("#answerEdited").val();
            var cardType = $("#cardTypeEdited").val();

            // Debugging statement
            console.log("Subject before update request:", subject);

            // Call the function to save edited flashcard
            saveEditedFlashcard(cardId, subject, question, answer, cardType);
        });
    });
    
    function saveEditedFlashcard(cardId, subject, question, answer, cardType) {
        var flipped = $(".flashcard:visible").hasClass("flipped");

    var requestData = {
        cardId: cardId,
        subject: subject,
        question: question,
        answer: answer,
        cardType: cardType,
        flipped: flipped
    };

    $.ajax({
        url: "http://localhost:3000/updateCard",
        type: "PUT",
        data: JSON.stringify(requestData),
        contentType: "application/json",
        success: function(response) {
            console.log("Flashcard updated successfully:", response);
            console.log("Edited card:", requestData);
            refreshLibraryPage();
            $.mobile.changePage("#libraryPage", { transition: "slide" });
            alert("Flashcard updated successfully!");
        },
        error: function(xhr, status, error) {
            console.error("Error updating flashcard:", error);
        }
    });
    }

    function refreshLibraryPage() {
        fetchLatestFlashcardData(function(data) {
            updateLibraryPage(data); 
        });
    }

    function fetchLatestFlashcardData(callback) {
        $.get("http://localhost:3000/getFlashcards", function(data, status) {
            if (status === "success") {
                callback(data);
            } else {
                console.error("Error fetching flashcards:", status);
            }
        });
    }

    function updateLibraryPage(data) {
        if (data && data.flashcards) {
            var flashcardContainer = $("#flashcardContainer");
            flashcardContainer.empty();
    
            data.flashcards.forEach(function(flashcard, index) {
                var flashcardElement = $("<div class='flashcard'></div>");
                var subjectDiv = $("<div class='subject'></div>").text(flashcard.subject);
                var questionDiv = $("<div class='question'></div>").text(flashcard.question);
                var answerDiv = $("<div class='answer'></div>").text(flashcard.answer);
                var cardTypeDiv = $("<div class='cardType'></div>").text(flashcard.cardType);
    
                flashcardElement.append(subjectDiv);
                flashcardElement.append(questionDiv);
                flashcardElement.append(answerDiv);
                flashcardElement.append(cardTypeDiv);
    
                flashcardContainer.append(flashcardElement);
            });
    
            var editedCardId = sessionStorage.getItem("editCardId");
            var editedCard = data.flashcards.find(card => card._id === editedCardId);
            if (editedCard) {
                $("#subjectEdited").val(editedCard.subject);
            }
        }
    }
    
    

});

function openNav() {
document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
document.getElementById("mySidenav").style.width = "0";
}
