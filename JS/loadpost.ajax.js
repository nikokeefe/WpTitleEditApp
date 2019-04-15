/**
 * WP Reader accepts a user-defined URL and tries to obtain
 * the 10 latest posts at the URL location through the WP REST API.
 *
 * NOT FOR PRODUCTION. PURELY FOR DEMONSTRATION PURPOSES!
 */

jQuery( document ).ready(function($){

    // Create global restURL variable.
    var restURL;

    // Get user specified URL from form.
    function getContent() {

        // Get the URL from the form.
        var rawURL = 'http://restassured.local';

        // Check if the string entered in the form is a porper URL.
        try {
            $('.error').remove();
            var cleanURL = (new URL(rawURL)).protocol + '//' + (new URL(rawURL)).hostname;
            restURL = cleanURL + '/wp-json/wp/v2/';
            // Get the posts from the new URL.
            console.log(restURL);
            getPostList();
        }
        // Otherwise, throw an error message.
        catch (e) {
            $('.site-header').append('<div class="error">That didn&rsquo;t work. Try a different URL.</div>');
            console.log('ERROR: User input is not a proper URL.');
        }
    };

    function getPostList() {

        $('.nav-loader').toggle();
        var jsonURL = restURL + 'posts/';

        $.ajax({
            dataType: 'json',
            url: jsonURL
        })

        .done(function(object){
            createPostList(object);
        })

        .fail(function() {
            console.error('REST error. Nothing returned for AJAX.');
        })

        .always(function() {
            $('.nav-loader').remove();
        })
    }

    function createPostList(object) {
        $('.navigation-list').empty().append('<ul></ul>');
        var navListItem;

        for(var i=0; i<object.length; i++) {
            navListItem =
                '<li>' +
                '<a href="javascript:void(0)" data-id="' + object[i].id + '">' +
                object[i].title.rendered +
                '</a>' +
                '</li>';
            $('.navigation-list ul').append(navListItem);
        }
        postTrigger();
    }

    function postTrigger() {
        $('.navigation-list a').on('click', getPost);
        $('.navigation-list a').first().trigger('click');
    }

    // Get the post selected from the navigation list.
    function getPost() {
        $('.navigation-list a').removeClass('current');
        $(this).addClass('current').append('<img src="JS/spinner.svg" class="ajax-loader" />');
        $('.main-area').addClass('loading');

        var postID = $(this).attr('data-id');

        // Create REST API request.
        var jsonURL = restURL + 'posts/' + postID + '?_embed=true';

        // AJAX the post data
        $.ajax({
            dataType: 'json',
     		url : jsonURL
     	})

        .done(function(object) {
            // Get the post data.
            thePostData(object);
        })

        .fail(function() {
            $('.site-header').append('<div class="error">That didn&rsquo;t work. Try slecting a different post or try a new URL.</div>');
            console.log('ERROR: Single post error.');
        })

        .always(function() {
            $('.ajax-loader').remove();
            $('.loading').removeClass('loading');
            console.log( 'Single post AJAX complete' );
        });
    }

    // Get the post data based on AJAX request.
    function thePostData(object) {

        // set up HTML to be added.
        $('.post').attr('data-id',object.id);
        $('.skeleton').removeClass('skeleton');
        $('.post-title').html(object.title.rendered).text();
        $('.post-content').replaceWith('<div class="post-content">' + object.content.rendered + '</div>');


    } // END function the_previous_post_data()

    getContent();

});
