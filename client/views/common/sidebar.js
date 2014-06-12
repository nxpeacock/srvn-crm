Template['sidebar'].rendered = function(){
    $(document).ready(function(){
        // INITIALIZE LEFT NAV
        $('nav ul').jarvismenu({
            accordion : true,
            speed : $.menu_speed,
            closedSign : '<em class="fa fa-plus-square-o"></em>',
            openedSign : '<em class="fa fa-minus-square-o"></em>'
        });

        $('#show-shortcut').click(function(e) {
            if ($('#shortcut').is(":visible")) {
                shortcut_buttons_hide();
            } else {
                shortcut_buttons_show();
            }
            e.preventDefault();
        });

        /*
         * SHORTCUTS
         */

        // SHORT CUT (buttons that appear when clicked on user name)
        $('#shortcut').find('a').click(function(e) {

            e.preventDefault();

            window.location = $(this).attr('href');
            setTimeout(shortcut_buttons_hide, 300);

        });

        // SHORTCUT ANIMATE HIDE
        function shortcut_buttons_hide() {
            $('#shortcut').animate({
                height : "hide"
            }, 300, "easeOutCirc");
            $('body').removeClass('shortcut-on');

        }

        // SHORTCUT ANIMATE SHOW
        function shortcut_buttons_show() {
            $('#shortcut').animate({
                height : "show"
            }, 200, "easeOutCirc")
            $('body').addClass('shortcut-on');
        }
    });
};