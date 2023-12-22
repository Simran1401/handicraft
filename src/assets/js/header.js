
$(function() {
    var nav = $('.center-nav');

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 36) {
            nav.addClass("fixed-lower-nav");
        } else {
            nav.removeClass("fixed-lower-nav");
        }
    });
});
