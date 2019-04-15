/*jshint esversion: 6 */

(function ($) {

  const RESTROOT = 'http://restassured.local/wp-json';
  const $ENTRYTITLE = $('.post-title');
  const $LOGIN = $('#loginform');
  const $LOGOUT = $('#logout');

  var token = sessionStorage.getItem('newToken');
  console.info('Token on load: ', token);

  function runAjax(postID, newTitle) {
    $.ajax({
      url: RESTROOT + '/wp/v2/posts/' + postID,
      method: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          'Authorization', 'Bearer ' + sessionStorage.getItem('newToken')
        );
      },

      data: {
        title: newTitle,
      },
    })

    .done(function (response) {
      console.info(response);
      $('#title-input').toggle();
      $ENTRYTITLE.text(newTitle);
      $ENTRYTITLE.toggle();
      $('.navigation-list a[data-id="' + postID + '"]').text(newTitle);
      $('.edit-title.edit-button').toggle();
      $('.edit-title.save').toggle();
    });
  }

  // Add edit post functionality
  function editPost() {
    $ENTRYTITLE.after(
      `<button class="edit-button edit-title">Edit title</button>
      <button class="edit-title save" style="display: none">Save title</button>`
    );

    $('.edit-title.edit-button').click(function () {
      let $originalTitle = $ENTRYTITLE.text();
      $ENTRYTITLE.toggle();
      $ENTRYTITLE.after(`<input id="title-input" type="text">`);
      document.querySelector('#title-input').value = $originalTitle;
      $(this).toggle();
      $('.edit-title.save').toggle();
    });

    $('.save').click(function () {
      let postID = document.querySelector('.post').getAttribute('data-id');
      let newTitle = document.querySelector('#title-input').value;
      runAjax(postID, newTitle);
    });
  }

  // get a new token and store it in session storage
  function getToken(username, password) {

    $.ajax({
      url: RESTROOT + '/jwt-auth/v1/token',
      method: 'POST',
      data: {
        username: username,
        password: password,
      },
    })

    .done(function (response) {
      sessionStorage.setItem('newToken', response.token);
      $LOGIN.toggle();
      $LOGOUT.toggle();
      editPost();
    })

    .fail(function (response) {
      console.error('REST error');
    });
  }

  function clearToken() {
    sessionStorage.removeItem('newToken');
    $LOGIN.toggle();
    $LOGOUT.toggle();
    $('.edit-title').remove();
  }

  if (token === null) {
    $LOGIN.toggle();
    $('#login_button').click(function (e) {
      // prevent form from submitting and reloading the page
      e.preventDefault();
      let username = document.querySelector('#user_login').value;
      let password = document.querySelector('#user_pass').value;
      console.info('Username: ' + username + ' Password: ' + password);

      getToken(username, password);
    });
  } else {
    $LOGOUT.toggle();
    editPost();
  }

  $('#logout').click(clearToken);

})(jQuery);
