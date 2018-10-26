$(function () {

    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }




	// Globals variables

		// 	An array containing objects with information about the products.
	var products = [],

		// Our filters object will contain an array of values for each filter

		// Example:
		// filters = {
		// 		"manufacturer" = ["Apple","Sony"],
		//		"storage" = [16]
		//	}
		filters = {},
		tokenKey = 'UserToken',
		userToken = null,
        userInfo = [],
        myCards = [],
        myCollections = [],
        choiceCollection = [];

     initLogin();

	//	Event handlers for frontend navigation

	hideWorkElements();

	//	Loading ny cards
	$('#mycards').click(function () {
        getMyCards();

        hideWorkElements();

        $('#btnNewCard').show();
        $('#tableMyCards').show();

	});


	function getMyCards() {
        $.ajax({
            type: "GET",
            url: "/manage/card/?me",
            contentType: "application/json",
            cache: false,
            success: function(data){
                myCards = data;
                renderMyCards(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }


    function renderMyCards(data) {
        var item;

        $('#tableMyCards > tbody > tr').remove();

        for(item = 0; item < data.length; item++) {
            row = '<tr>'+
                  '<th scope="row"><a href="/#card/' + data[item].id + '">' + data[item].id  + '</a></th>' +
                  '<td>' + data[item].status.name + '</td>' +
                  '<td>' + data[item].title + '</td>' +
                  '<td>' + cardDate(data[item], 'created') + '</td>' +
                  '<td>' + userName(data[item].assigned_to) + '</td>' +
                  '</tr>';

            $('#tableMyCards > tbody:last-child').append(row);
        }

    }


    function getMyCollections() {
        $.ajax({
            type: "GET",
            url: "/manage/collection/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                myCollections = data;
                renderMyCollections(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }


    function renderMyCollections(data) {
        var item;

        $('#tableMyCollections > tbody > tr').remove();

        for(item = 0; item < data.length; item++) {
            row = '<tr>'+
                  '<th scope="row"><a href="/#collection/' + data[item].id + '">' + data[item].id  + '</a></th>' +
                  '<td>' + data[item].name + '</td>'
                  '</tr>';

            $('#tableMyCollections > tbody:last-child').append(row);
        }
    }


    function getAvailableCards() {
        $.ajax({
            type: "GET",
            url: "/manage/card/?available",
            contentType: "application/json",
            cache: false,
            success: function(data){
                renderAvailableCards(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });

    }

    function renderAvailableCards(data) {
        var item;

        $('#availableCardsList > option').remove();

        for(item = 0; item < data.length; item++) {
            row = '<option value="' + data[item].title + '"id="' + data[item].value + '">';

            $('#assignedToList').append(row);
        }

    }


    function getAssignedTo() {
        $.ajax({
            type: "OPTIONS",
            url: "/manage/card/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                assignedTo = data;
                renderAssignedTo(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    function renderAssignedTo(data) {
        var item;
        var listAssignedTo = data.actions.POST.assigned_to_id.choices;

        $('#assignedToList > option').remove();

        for(item = 0; item < listAssignedTo.length; item++) {
            row = '<option value="' + listAssignedTo[item].display_name + '" id="' + listAssignedTo[item].value + '">';

            $('#assignedToList').append(row);
        }

    }


    function getCollection(){
        $.ajax({
            type: "OPTIONS",
            url: "/manage/card/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                collection = data;
                renderCollection(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    function renderCollection(data) {
        var item;
        var listCollection = data.actions.POST.collection_id.choices;

        $('#cardCollectionList > option').remove();

        for(item = 0; item < listCollection.length; item++) {
            row = '<option value="' + listCollection[item].display_name + '" id="' + listCollection[item].value + '">';

            $('#cardCollectionList').append(row);
        }

    }


    function getStatus() {
            $.ajax({
            type: "OPTIONS",
            url: "/manage/card/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                renderStatus(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    function renderStatus(data) {
        var item;
        var listStatus = data.actions.POST.status_id.choices;

        $('#cardStatusList > option').remove();

        for(item = 0; item < listStatus.length; item++) {
            row = '<option value="' + listStatus[item].display_name + '" id="' + listStatus[item].value + '">';

            $('#cardStatusList').append(row);
        }
    }

    function getBoardType() {
        $.ajax({
            type: "OPTIONS",
            url: "/manage/board/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                renderBoardType(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }


    function renderBoardType(data) {
        var item,
            listBoardType = data.actions.POST.type.choices;

        $('#boardTypeList > option').remove();

        for(item = 0; item < listBoardType.length; item++) {
            row = '<option value="' + listBoardType[item].display_name + '" id="' + listBoardType[item].value + '">';

            $('#boardTypeList').append(row);
        }
    }

    function getCurrentCollectionData(index) {
        $.ajax({
            type: "GET",
            url: "/manage/collection/" + index + "/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                renderCurrentCollectionData(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    function renderCurrentCollectionData(data) {
        var boards = data.boards,
            cards = data.cards,
            item;


        $('#tableCollectionCards > tbody > tr').remove();

        for(item = 0; item < cards.length; item++) {
            row = '<tr>'+
                  '<th scope="row"><a href="/#card/' + cards[item].id + '">' + cards[item].id  + '</a></th>' +
                  '<td>' + cards[item].title + '</td>' +
                  '<td>' + userName(cards[item].assigned_to) + '</td>' +
                  '<td>' + cards[item].status.name + '</td>' +
                  '</tr>';

            $('#tableCollectionCards > tbody:last-child').append(row);
        }


        $('#tableCollectionBoards > tbody > tr').remove();

        for(item = 0; item < boards.length; item++) {
            row = '<tr>'+
                  '<th scope="row"><a href="/#board/' + boards[item].id + '">' + boards[item].id  + '</a></th>' +
                  '<td>' + boards[item].name + '</td>'
                  '</tr>';

            $('#tableCollectionBoards > tbody:last-child').append(row);
        }

    }

    function getBoardView(index) {
        $.ajax({
            type: "GET",
            url: "/manage/boards/" + index + "/cards/",
            contentType: "application/json",
            cache: false,
            success: function(data){
                renderBoardView(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    function renderBoardView(data) {
        var index;

        clearBoard();

        for(index = 0; index < data.length; index++) {

            if (data[index].status.id == 1) {
                $('#colNew').append(ceateBoardItem(data[index]));
            } else if (data[index].status.id == 2) {
                $('#colReady').append(ceateBoardItem(data[index]));
            } else if (data[index].status.id == 3) {
                $('#colInProgress').append(ceateBoardItem(data[index]));
            } else if (data[index].status.id == 4) {
                $('#colReadyForTest').append(ceateBoardItem(data[index]));
            } else if (data[index].status.id == 5) {
                $('#colDone').append(ceateBoardItem(data[index]));
            } else if (data[index].status.id == 6) {
                $('#colArchived').append(ceateBoardItem(data[index]));
            } else {
                console.log('WTF : ' + data[index])
            }

        }

    }

    function clearBoard() {
        $('div.board-item').remove();
    }

    function ceateBoardItem(card) {
        var html = '';

        html = 	'<div card_id="' + card.id + '" class="card p-2 bg-faded board-item">' +
                '<h6 class="card-title">' + card.title + '</h6>' +
//											<!--<p>With supporting text below as a natural lead-in to additional content.</p>-->
                '</div>';

        return html;
    }


    function getAvailableForBoardCards(index) {
        $.ajax({
            type: "GET",
            url: "/manage/card/?board=" + index,
            contentType: "application/json",
            cache: false,
            success: function(data){
                console.log(data);
                renderAvailableForBoardCards(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    function renderAvailableForBoardCards(data) {
        // write code hire
        var index;

        $('#listCardOnBoard').find('li').remove();

        for(index = 0; index < data.length; index++) {
            row  = '<li id="' + data[index].id + '" class="list-group-item">' + data[index].title + '</li>'

            $('#listCardOnBoard').append(row);
        }

       setHendler();
    }

    function getSelectedCards() {
        var cards = [];

        var selected = $('#listCardOnBoard > li.active');

        for(var i = 0; i < selected.length; i++) {
            cards.push($(selected[i]).attr('id')) ;
        }

        return cards;
    }

    // Login
	$('#btnSignIn').click(function () {

        $.ajax({
            type: "POST",
            url: "/signin/",
            data: JSON.stringify({
                "email": $('#signInEmail').val(),
                "password": $('#signInPassword').val()
            }),
            contentType: "application/json",
            cache: false,
            success: function(data){
//                localStorage.setItem(tokenKey, data);
                localStorage.setItem('UserToken', data);
//                getProfile();
                initLogin();

                window.location.hash = '#';
            },
            error: function(xhr){
                $('#signInErr').html(xhr.responseText);
            }
        });

	});

    // Registration
	$('#btnRegister').click(function () {

        $.ajax({
            type: "POST",
            url: "/signup/",
            data: JSON.stringify({
                "email": $('#signUpEmail').val(),
                "username": $('#signUpUserName').val(),
                "first_name": $('#signUpFirstName').val(),
                "last_name": $('#signUpLastName').val(),
                "phone_number": $('#signUpPhonenumber').val(),
                "password":  $('#signUpPassword').val(),
                "password_confirm": $('#signUpPasswordConfirm').val()
            }),
            contentType: "application/json",
            cache: false,
            success: function(data){
                window.location.hash = '#sign-in';
            },
            error: function(xhr){
                $('#signUpErr').html(xhr.responseText);
            }
        });

	});

    // Redirect to Registration
	$('#btnToSignUp').click(function () {
	    window.location.hash = '#sign-up';
	});

    // Logout
	$('#btnLogout').click(function () {
	    try{
	        localStorage.clear();
	        initLogin();
	    }
	    catch(error) {
	        console.log(error);
	    }
	});

    // New Card
	$('#btnNewCard').click(function () {
        window.location.hash = '#card/new';
	});

    // New Collection
	$('#btnNewCollection').click(function () {
        window.location.hash = '#collection/new';
	});

	// Add card into collection
	$('#btnAddCard').click(function () {
	    var col_hash = '#collection/',
	        index = decodeURI(window.location.hash).split(col_hash)[1].split('/')[0];
	    window.location.hash = col_hash + index + '/add_card';
	});

	// Add board into collection
	$('#btnAddBoard').click(function () {
        var col_hash = '#collection/',
	        index = decodeURI(window.location.hash).split(col_hash)[1].split('/')[0];
	    window.location.hash = col_hash + index + '/add_board';
	});

	$('#btnAddCardIntoCollection').click(function () {
        $.ajax({
            type: "POST",
            url: "/manage/card/",
            data: JSON.stringify({
                "collection": $("#collectionIdForAddCard").val()
            }),
            contentType: "application/json",
            cache: false,
            async: false,
            success: function(data){
                window.location.hash = '#collection/' + $("#collectionIdForAddCard").val();
            },
            error: function(xhr){
                $('#cardErr').html(xhr.responseText);
            }
        });
	});

	$('#btnAddBoardIntoCollection').click(function () {
	    var collectionId = $('#collectionIdForAddBoard').val(),
            name = $('#inputBoardName').val(),
            type = getIdByName($('#boardType').val(), $('#boardType'))

	     $.ajax({
            type: "POST",
            url: "/manage/board/",
            data: JSON.stringify({
                "collection": collectionId,
                "name": name,
                "type": type
            }),
            contentType: "application/json",
            cache: false,
            async: false,
            success: function(data){
                window.location.hash = '#collection/' + $("#collectionIdForAddCard").val();
            },
            error: function(xhr){
                $('#addBoardErr').html(xhr.responseText);
            }
        });


	});

	$('#mycollections').on('click', function () {
	    getMyCollections()

        hideWorkElements();

	    $('#btnNewCollection').show();
	    $('#tableMyCollections').show();
	});

	$('#btnOnBoard').on('click', function () {
        var board_hash = '#board/',
	        index = decodeURI(window.location.hash).split(board_hash)[1].split('/')[0];
	    window.location.hash = board_hash + index + '/add_card';
	});


    $('#btnAddOnBoard').on('click', function () {
        var res = getSelectedCards(),
            boardId = $('#boardIdForOnBoard').val();

        if (res.length) {

            $.ajax({
                type: "PATCH",
                url: "/manage/board/" + boardId + "/",
                data: JSON.stringify({
                    "card": res
                }),
                contentType: "application/json",
                cache: false,
                async: false,
                success: function(data){
                    getBoardView(boardId);
                    window.location.hash = '#board/' + boardId + '/';
                },
                error: function(xhr){
                    $('#collectionErr').html(xhr.responseText);
                }
            });

        }
    });
    // Save Card
//	$('#btnSaveNewCard').click();

	function saveNewCard() {
        var title = $('#inputCardTitle').val(),
            assignedTo = null,
            dueDate = '2000-01-01 00:00:00+01',
            description = $('#cardDescription').val();


        $.ajax({
            type: "POST",
            url: "/manage/card/",
            data: JSON.stringify({
                "title": title,
                "description": description,
                "assigned_to": assignedTo,
                "due_date": dueDate
            }),
            contentType: "application/json",
            cache: false,
            async: false,
            success: function(data){
                window.location.hash = '#';
            },
            error: function(xhr){
                $('#cardErr').html(xhr.responseText);
            }
        });

	}

	function saveChangesCard() {

        var collectionId = getIdByName($("#cardCollection").val(), $("#cardCollection")),
            statusId = getIdByName($('#cardStatus').val(), $('#cardStatus')),
            assignedToId = getIdByName($('#cardAssignedTo').val(), $('#cardAssignedTo')),
            description = $('#cardDescription').val();

	    var url = decodeURI(window.location.hash),
	        cardId = url.split('#card/')[1].trim();

        $.ajax({
            type: "PATCH",
            url: "/manage/card/" + cardId + "/",
            data: JSON.stringify({
                "status_id": statusId,
                "collection_id": collectionId,
                "assigned_to": assignedToId,
                "description": description
            }),
            contentType: "application/json",
            cache: false,
            async: false,
            success: function(data){
                getMyCards();
                window.location.hash = '#';
            },
            error: function(xhr){
                $('#collectionErr').html(xhr.responseText);
            }
        });
	}

	function getIdByName(val, searchList) {
	    var res = null;
        var list = searchList.attr('list'),
            option = $('#'+list+' option').filter( function() {
            return ($(this).val() === val);
        });
//        var option = searchList.find("[value='" + val + "']");

//        var option = searchList.filter( function() {
//            return ($(this).val() === val);
//        });

        if (option.length > 0) {
          res = option.attr("id");
          // do stuff with the id
        }

        return res;
	}

	/*
$("input[name='Typelist']").on('input', function(e){
   var $input = $(this),
       val = $input.val();
       list = $input.attr('list'),
       match = $('#'+list + ' option').filter(function() {
           return ($(this).val() === val);
       });
    if(match.length > 0) {
        // value is in list
    } else {
        // value is not in list
    }
});
	*/


	function saveNewCollection() {
		// Do saving new collection
		var name = $('#inputCollectionName').val(),
            description = $('#collectionDescription').val();

        $.ajax({
            type: "POST",
            url: "/manage/collection/",
            data: JSON.stringify({
                "name": name,
                "description": description
            }),
            contentType: "application/json",
            cache: false,
            async: false,
            success: function(data){
                getMyCards();
                window.location.hash = '#';
            },
            error: function(xhr){
                $('#collectionErr').html(xhr.responseText);
            }
        });

	}


	var checkboxes = $('.all-products input[type=checkbox]');

	checkboxes.click(function () {

		var that = $(this),
			specName = that.attr('name');

		// When a checkbox is checked we need to write that in the filters object;
		if(that.is(":checked")) {

			// If the filter for this specification isn't created yet - do it.
			if(!(filters[specName] && filters[specName].length)){
				filters[specName] = [];
			}

			//	Push values into the chosen filter array
			filters[specName].push(that.val());

			// Change the url hash;
			createQueryHash(filters);

		}

		// When a checkbox is unchecked we need to remove its value from the filters object.
		if(!that.is(":checked")) {

			if(filters[specName] && filters[specName].length && (filters[specName].indexOf(that.val()) != -1)){

				// Find the checkbox value in the corresponding array inside the filters object.
				var index = filters[specName].indexOf(that.val());

				// Remove it.
				filters[specName].splice(index, 1);

				// If it was the last remaining value for this specification,
				// delete the whole array.
				if(!filters[specName].length){
					delete filters[specName];
				}

			}

			// Change the url hash;
			createQueryHash(filters);
		}
	});


    // SignIn page buttons
	var signInPage = $('.sign-in');

	signInPage.on('click', function (e) {

	    if (signInPage.hasClass('visible')) {

			var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);

			}

		}

	});


	// SignIn page buttons
	var signUpPage = $('.sign-up');

	signUpPage.on('click', function (e) {

	    if (signUpPage.hasClass('visible')) {

			var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);

			}

		}

	});


	// Single card page buttons

	var singleCardPage = $('.single-card');

	singleCardPage.on('click', function (e) {

		if (singleCardPage.hasClass('visible')) {

			var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay') || clicked.hasClass('btn-close')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);
			}

		}

	});


	// Collection page buttons

	var singleCollection = $('.single-collection');

	singleCollection.on('click', function (e) {

		if (singleCollection.hasClass('visible')) {

    		var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay') || clicked.hasClass('btn-close')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);

			}

		}
	});


    //Adding Card into Collection page buttons

	var addCardIntoCollectionPage = $('.collection-add-card');

	addCardIntoCollectionPage.on('click', function (e) {

	    if (addCardIntoCollectionPage.hasClass('visible')) {

    		var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay') || clicked.hasClass('btn-close')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);

			}

		}
	});


	//Single Board page buttons

	var singleBoardPage = $('.collection-add-board');

	singleBoardPage.on('click', function (e) {

	    if (singleBoardPage.hasClass('visible')) {

    		var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay') || clicked.hasClass('btn-close')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);

			}

		}
	});


	var boardAddCardPage =  $('.board-add-card');

	boardAddCardPage.on('click', function (e) {

	    if (boardAddCardPage.hasClass('visible')) {

    		var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay') || clicked.hasClass('btn-close')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);

			}

		}
	});

	function hideWorkElements() {
	    //Buttons
	    $('#btnNewCard').hide();
	    $('#btnNewCollection').hide();
        $('#btnAddCard').hide();
        $('#btnAddBoard').hide();
        $('#btnOnBoard').hide();
        //Tables
        $('#tableMyCards').hide();
        $('#tableBoardCard').hide();
        $('#tableCollectionBoards').hide();
        $('#tableMyCollections').hide();
        $('#tableCollectionCards').hide();
        $('#board').hide();
	}

	/*
					tableBoardCard
					tableCollectionBoards
					tableCollectionCards
					tableMyCollections
	*/



	// These are called on page load

	// Get data about our products from products.json.
//	$.getJSON( "products.json", function( data ) {
//
//		// Write the data into our global variable.
//		products = data;
//
//		// Call a function to create HTML for all the products.
//		generateAllProductsHTML(products);
//
//		// Manually trigger a hashchange to start the app.
//		$(window).trigger('hashchange');
//	});


	// An event handler with calls the render function on every hashchange.
	// The render function will show the appropriate content of out page.
	$(window).on('hashchange', function(){
		render(decodeURI(window.location.hash));
	});


	function getProfile() {

	    $.ajax({
            type: "GET",
            url: "/profile/",
            contentType: "application/json",
            cache: false,
            async: false,
            success: function(data){
                userInfo = JSON.stringify(data);
                localStorage.setItem("User", JSON.stringify(data));
            },
            error: function(xhr){
                console.log(xhr);
            }
        });

        console.log("User info : " + userInfo );
	}


	function setUserInfo() {
        try {
            t = JSON.parse(localStorage.getItem("User"));
            $('#username').html(t["username"]);
        } catch(error) {
            console.log(error);
            $('#username').html('User');
        }
	}


	function initLogin() {
	    try{
    	    userToken = localStorage.getItem('UserToken');
	    }catch(error){
	        userToken = null;
	        console.log(error);
	    }

	    getProfile();

	    if(userToken) {
            setUserInfo();

            $('.non-logged-in').hide();
            $('.logged-in').show();
	    } else {
            $('.non-logged-in').show();
            $('.logged-in').hide();
	    }
	}


    function userName(obj) {
        var user_name = '';

        if (obj) {
            user_name = obj.first_name + ' ' + obj.last_name;
        }

        return user_name;
    }

    function assignedUser(username) {

        if (!username) {
            username = 'None';
        }

        return username;
    }

    function cardDate(obj, type) {
        var date = "0000-00-00",
            time = "00:00:00";

        if (type == 'created') {
            date = obj.created_date.split('T')[0];
            time = obj.created_date.split('T')[1].substring(0,8);
        } else if(type == 'due') {
            date = obj.due_date.split('T')[0];
            time = obj.due_date.split('T')[1].substring(0,8);
        } else {
            console.log("Wrong type date !!!")
        }

        return date + ' ' + time;
    }


	// Navigation

	function render(url) {

		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');


		var	map = {

			// The "Homepage".
			'': function() {

				// Clear the filters object, uncheck all checkboxes, show all the products
				filters = {};
				checkboxes.prop('checked',false);

				renderProductsPage(products);
			},

			//Page with cards created by curent user
			'#card': function() {

				var index = url.split('#card/')[1].trim();

				renderSingleCardPage(index, myCards);

			},

            // Single Collection Page
			'#collection': function() {

				var index = url.split('#collection/')[1].trim();

				renderSingleCollectionPage(index, myCollections);

			},

			// Board
			'#board': function() {

			    var index = url.split('#board/')[1].trim();

			    renderSingleBoardPage(index);

			},


			// Single Products page.
			'#product': function() {

				// Get the index of which product we want to show and call the appropriate function.
				var index = url.split('#product/')[1].trim();

				renderSingleProductPage(index, products);
			},

			// Page with filtered products
			'#filter': function() {

				// Grab the string after the '#filter/' keyword. Call the filtering function.
				url = url.split('#filter/')[1].trim();

				// Try and parse the filters object from the query string.
				try {
					filters = JSON.parse(url);
				}
					// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
				catch(err) {
					window.location.hash = '#';
					return;
				}

				renderFilterResults(filters, products);
			},

			//Page for Sign In
			'#sign-in': function() {
                renderSignInPage();
			},

			//Page for Sign Up
			'#sign-up': function() {
                renderSignUpPage();
			}




		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}

	}


	// This function is called only once - on page load.
	// It fills up the products list via a handlebars template.
	// It recieves one parameter - the data we took from products.json.
	function generateAllProductsHTML(data){

		var list = $('.all-products .products-list');

		var theTemplateScript = $("#products-template").html();
		//Compile the template​
		var theTemplate = Handlebars.compile (theTemplateScript);
		list.append (theTemplate(data));


		// Each products has a data-index attribute.
		// On click change the url hash to open up a preview for this product only.
		// Remember: every hashchange triggers the render function.
		list.find('li').on('click', function (e) {
			e.preventDefault();

			var productIndex = $(this).data('index');

			window.location.hash = 'product/' + productIndex;
		})
	}

	// This function receives an object containing all the product we want to show.
	function renderProductsPage(data){

		var page = $('.all-products'),
			allProducts = $('.all-products .products-list > li');

		// Hide all the products in the products list.
		allProducts.addClass('hidden');

		// Iterate over all of the products.
		// If their ID is somewhere in the data object remove the hidden class to reveal them.
		allProducts.each(function () {

			var that = $(this);

			data.forEach(function (item) {
				if(that.data('index') == item.id){
					that.removeClass('hidden');
				}
			});
		});

		// Show the page itself.
		// (the render function hides all pages so we need to show the one we want).
		page.addClass('visible');

	}


	// Opens up a preview for one of the products.
	// Its parameters are an index from the hash and the products object.
	function renderSingleProductPage(index, data){

		var page = $('.single-product'),
			container = $('.preview-large');

		// Find the wanted product by iterating the data object and searching for the chosen index.
		if(data.length){
			data.forEach(function (item) {
				if(item.id == index){
					// Populate '.preview-large' with the chosen product's data.
					container.find('h3').text(item.name);
					container.find('img').attr('src', item.image.large);
					container.find('p').text(item.description);
				}
			});
		}

		// Show the page.
		page.addClass('visible');

	}


    function renderSingleCollectionPage(index, collections) {

		var arr_param = index.split('/')
		    arr_length = arr_param.length;


        if (arr_length == 1) {

        	if (arr_param[0] == 'new') {

                var page = $('.single-collection');

                $('#btnSaveCollection').unbind('click');

                $('#btnSaveCollection').on('click', saveNewCollection);

                // Show the page.
                page.addClass('visible');

            } else {

                hideWorkElements()

                //render collection
                getCurrentCollectionData(arr_param[0]);

                var page = $('.all-products');

                page.addClass('visible');

                $('#filters').show();
                $('#btnAddCard').show();
                $('#tableCollectionCards').show();
                $('#btnAddBoard').show();
                $('#tableCollectionBoards').show();

             }

        } else if (arr_length == 2) {

            if(arr_param[1] == 'add_card') {

                //loading add card page
                renderCollectionAddCard(arr_param[0]);

            } else if (arr_param[1] == 'add_board') {

                //loading add board page
                renderCollectionAddBoard(arr_param[0]);

            } else {
                renderErrorPage();
            }

        } else {
            renderErrorPage();
        }

	}


	function renderCollectionAddCard(index){

        var page = $('.collection-add-card');

        getAvailableCards()
//        $('#availableCards').val(index);
        $('#collectionIdForAddCard').val(index);

		page.addClass('visible');

	}

	function renderCollectionAddBoard(index) {
        getBoardType();

        $('#collectionIdForAddBoard').val(index);

        var page = $('.collection-add-board');


        page.addClass('visible');

	}

	function renderBoardAddCard(index) {
	    //load available cards
        $('#boardIdForOnBoard').val(index);

        getAvailableForBoardCards(index);

        var page = $('.board-add-card');


        page.addClass('visible');
	}

    function renderSingleBoardPage(index) {

        var arr_param = index.split('/')
                arr_length = arr_param.length;

//        getBoardType();
        if (arr_param.length == 1) {

            if (index == 'new') {

                var page = $('.collection-add-board');

                page.addClass('visible');

            } else {

                hideWorkElements();

                getBoardView(arr_param[0]);

                var page = $('.all-products');

                page.addClass('visible');

                $('#board').show();
                $('#btnOnBoard').show();

            }

        } else if (arr_param.length == 2) {

            if(arr_param[1] == 'add_card') {

                //loading add card page
//                renderCollectionAddCard(arr_param[0]);
                  renderBoardAddCard(arr_param[0]);

            } else {
                renderErrorPage();
            }

        } else {
            renderErrorPage();
        }



    }


	function renderSingleCardPage(index, data){

        var page = $('.single-card'),
            container = $('.preview-large');

        getAssignedTo();
        getCollection();
        getStatus();

        $('#btnSaveNewCard').unbind('click');

        $('#cardStatus').val('');
        $('#cardDescription').val('');
        $('#cardCollection').val('');
        $('#cardAssignedTo').val('');


        if (index == 'new') {
            $('#cardTitle').hide()
            $('#inputTitle').show();

//            $('#cardTitle').html('New card');
            $('#cardOwner').val(userName(JSON.parse(localStorage.getItem('User'))));

            //Set hendler for Save button

            $('#btnSaveNewCard').on('click', saveNewCard);


        } else {

            if(myCards.length){
                myCards.forEach(function(item) {
                    if(item.id == index){
                        $('#cardTitle').html('#' + item.id + ' ' + item.title);
                        $('#cardOwner').val(userName(item.owner));
                        $('#cardStatus').val(item.status.name);
                        $('#cardCreatedDate').val(cardDate(item,'created'));
                        $('#cardAssignedTo').val(assignedUser(userName(item.assigned_to)));
                        $('#cardCollection').val(collectionName(item.collection));
                        $('#cardDescription').val(item.description);

                        $('#btnSaveNewCard').on('click', saveChangesCard);
                        $('#cardStatus').prop("readonly", false);


                        $('#cardTitle').show();
                        $('#inputTitle').hide();
                    }
                });
            }


        }

        // Show the page.
        page.addClass('visible');

	}

	function collectionName(data) {
	    var res = '';

	    if (data) {
	        res = data.name
	    }

	    return res;
	}


    //Opens up a Sign-in view
    function renderSignInPage(){

		var page = $('.sign-in');

		page.addClass('visible');
	}


    //Opens up a Sign-in view
    function renderSignUpPage(){

		var page = $('.sign-up');

		page.addClass('visible');
	}


	// Find and render the filtered data results. Arguments are:
	// filters - our global variable - the object with arrays about what we are searching for.
	// products - an object with the full products list (from product.json).
	function renderFilterResults(filters, products){

			// This array contains all the possible filter criteria.
		var criteria = ['manufacturer','storage','os','camera'],
			results = [],
			isFiltered = false;

		// Uncheck all the checkboxes.
		// We will be checking them again one by one.
		checkboxes.prop('checked', false);


		criteria.forEach(function (c) {

			// Check if each of the possible filter criteria is actually in the filters object.
			if(filters[c] && filters[c].length){


				// After we've filtered the products once, we want to keep filtering them.
				// That's why we make the object we search in (products) to equal the one with the results.
				// Then the results array is cleared, so it can be filled with the newly filtered data.
				if(isFiltered){
					products = results;
					results = [];
				}


				// In these nested 'for loops' we will iterate over the filters and the products
				// and check if they contain the same values (the ones we are filtering by).

				// Iterate over the entries inside filters.criteria (remember each criteria contains an array).
				filters[c].forEach(function (filter) {

					// Iterate over the products.
					products.forEach(function (item){

						// If the product has the same specification value as the one in the filter
						// push it inside the results array and mark the isFiltered flag true.

						if(typeof item.specs[c] == 'number'){
							if(item.specs[c] == filter){
								results.push(item);
								isFiltered = true;
							}
						}

						if(typeof item.specs[c] == 'string'){
							if(item.specs[c].toLowerCase().indexOf(filter) != -1){
								results.push(item);
								isFiltered = true;
							}
						}

					});

					// Here we can make the checkboxes representing the filters true,
					// keeping the app up to date.
					if(c && filter){
						$('input[name='+c+'][value='+filter+']').prop('checked',true);
					}
				});
			}

		});

		// Call the renderProductsPage.
		// As it's argument give the object with filtered products.
		renderProductsPage(results);
	}


	// Shows the error page.
	function renderErrorPage(){
		var page = $('.error');
		page.addClass('visible');
	}


	// Get the filters object, turn it into a string and write it into the hash.
	function createQueryHash(filters){

		// Here we check if filters isn't empty.
		if(!$.isEmptyObject(filters)){
			// Stringify the object via JSON.stringify and write it after the '#filter' keyword.
			window.location.hash = '#filter/' + JSON.stringify(filters);
		}
		else{
			// If it's empty change the hash to '#' (the homepage).
			window.location.hash = '#';
		}

	}


	// SRFToken !!!
	function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", $('input[name="csrfmiddlewaretoken"]').val());
            }

            xhr.setRequestHeader("Authorization", localStorage.getItem('UserToken'));
        }
    });


// for list card
 function setHendler() {
   $('.list-group.checked-list-box .list-group-item').each(function () {

        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });


        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {

            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }

            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });

    $('#get-checked-data').on('click', function(event) {
        event.preventDefault();
        var checkedItems = {}, counter = 0;
        $("#check-list-box li.active").each(function(idx, li) {
            checkedItems[counter] = $(li).text();
            counter++;
        });
        $('#display-json').html(JSON.stringify(checkedItems, null, '\t'));
    });
   }
});