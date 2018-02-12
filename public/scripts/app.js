$(document).ready(function () {


  var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination'
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

  // Swipe button navigation
  //
  $('#books-btn').click(function (event) {
    event.preventDefault();
    mySwiper.slideTo(1, 200);
  });
  $('#dining-btn').click( function ( event ) {
    event.preventDefault();
    mySwiper.slideTo(2, 400);
  });
  $('#movies-btn').click(function (event) {
    event.preventDefault();
    mySwiper.slideTo(3, 600);
  });
  $('#products-btn').click(function (event) {
    event.preventDefault();
    mySwiper.slideTo(4, 800);
  });

  $("#todo-textarea").keyup(function () {
    let count = this.value.length;
  });

  $("#post-todo").click( function( event ) {
    console.log($("#todo-textarea"))
    event.preventDefault();
    let isContent = $("#todo-textarea").val();
    if(!isContent.trim()){
      throw err;
    }
    $.post("/todo", $( "#todo-textarea" ).serialize(), function () {
      console.log($("#todo-textarea").text());

      loadNewTodos();
    });
  });

  //Builds todo row and returns to render todos
  //
  const createTodoElement = function (todoDB) {

    let template = `<tr data-id="${todoDB.id}"><td>${todoDB.item}</td><td></td><td id="data-icon"><i class="fas fa-pencil-alt"></i><a ><i class="far fa-trash-alt"></i></a></td></tr>`;

    return template;
  };

  const getSlideFromCategory = (category) => {
    console.log(category);

    if (category === 'books') {
      return 1;
    } else if (category === 'movies') {
      return 2;
    } else if (category === 'restaurants') {
      return 3;
    } else if (category === 'products') {
      return 4;
    }
  };

  // builds slide page navigation login
  //
  const renderTodos = (todos, newTodo) => {

    //checks authorization
    if (!todos) {
      return null;
    }
    $(".slide-2")
      .attr("style", "display: inline");
    $(".slide-3")
      .attr("style", "display: inline");
    $(".slide-4")
      .attr("style", "display: inline");
    $(".slide-5")
      .attr("style", "display: inline");
    $(".slide-6")
      .attr("style", "display: inline");

    if (newTodo) {

      $(createTodoElement(todos)).appendTo(`#${todos.name}Table`);
      console.log(getSlideFromCategory(todos.name), todos.action );

      mySwiper.slideTo(getSlideFromCategory(todos.name));
    } else {
      todos.forEach(function (todo) {
        $(createTodoElement(todo)).appendTo(`#${todo.name}Table`);
      });
    }
    mySwiper.update();
  };

  let updateCategories = () => {
    $.getJSON("/todo/categories", (json) => {

      $(`#books-badge`).text(json.books);
      $(`#dining-badge`).text(json.restaurants);
      $(`#movies-badge`).text(json.movies);
      $(`#products-badge`).text(json.products);
    });

  };

  let loadNewTodo = () => {
    console.log('hello');

    updateCategories();
    $.getJSON("/todo", (json) => {
      console.log(json);
      renderTodos(json[json.length - 1], true);
    });
  };

  let loadTodos = () => {
    updateCategories();
    $.getJSON("/todo", (json) => {
      renderTodos(json, false);
    });
  };

  //login ajax & auth
  //
  const userAuthorized = function() {
    mySwiper.removeSlide(0);
    mySwiper.update();
    mySwiper.slideTo(1, 200);
  };
  $('#signup-btn').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    const queryString = `email=${$('#input-email').val()}&password=${$('#input-password').val()}`;
    $.ajax({
      url: '/user/register',
      method: 'POST',
      data: queryString
    }).done(function(response){
      if(!response.isUser) {
        userAuthorized();
      } else {
        $(".warning").hide().slideDown();
      }
    });
    loadTodos();
  });

  $('#login-btn').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    const queryString = `email=${$('#input-email').val()}&password=${$('#input-password').val()}`;
    $.ajax({
      url: '/user/login',
      method: 'POST',
      data: queryString
    }).done(function(response){
      // response.email to navbar
      if(response.auth){
        userAuthorized();
        loadTodos();
      } else {
        $(".warning").hide().slideDown();
      }
    });
  });


  //Spencer, add class = trash if not used yet
  $('.trash').on('click', function() {
    const id = $($(this).parent().parent().parent()).data('id');
    console.log(id);
    $.ajax({
      url: `/todo/${id}`,
      method: 'DELETE',
    }).done(function(response){
      $(`tr[data-id=${id}]`).remove();
    });
  });

  //select delete btn
  //on click
  //ajax to /todo/:item
  //method put
  //Spencer, can i loadtodos here
  $('.edit').on('click', function() {
    const id = $($(this).parent().parent().parent()).data('id');
    const newItem = $('').serialize();
    const newCatg = $('').serialize();
    console.log(id);
    $.ajax({
      url: `/todo/${id}`,
      method: 'PUT',
      data: `${newItem}&${newCatg}`
    }).done(function(response){
      loadTodos();
    });
  });

});
