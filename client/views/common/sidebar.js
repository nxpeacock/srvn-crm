Template['sidebar'].rendered = function(){
    $(document).ready(function(){
        // INITIALIZE LEFT NAV
        $.fn.extend({

            //pass the options variable to the function
            jarvismenu : function(options) {
                try{
                    var defaults = {
                        accordion : 'true',
                        speed : 200,
                        closedSign : '[+]',
                        openedSign : '[-]'
                    };

                    // Extend our default options with those provided.
                    var opts = $.extend(defaults, options);
                    //Assign current element to variable, in this case is UL element
                    var $this = $(this);

                    //add a mark [+] to a multilevel menu
                    $('li',this).each(function() {

                        if ($(this).find("ul").size() != 0) {
                            //add the multilevel sign next to the link
                            $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");
                            //avoid jumping to the top of the page when the href is an #
                            if ($(this).find("a:first").attr('href') == "#") {
                                $(this).find("a:first").click(function() {
                                    return false;
                                });
                            }
                        }
                    });

                    //open active level
                    $this.find("li.active").each(function() {
                        $(this).parents("ul").slideDown(opts.speed);
                        $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
                        $(this).parents("ul").parent("li").addClass("open")
                    });
                    $this.find('li a').on('click',function() {
                        if ($(this).parent().find("ul").size() != 0) {

                            if (opts.accordion) {
                                //Do nothing when the list is open
                                if (!$(this).parent().find("ul").is(':visible')) {
                                    parents = $(this).parent().parents("ul");
                                    visible = $this.find("ul:visible");
                                    visible.each(function(visibleIndex) {
                                        var close = true;
                                        parents.each(function(parentIndex) {
                                            if (parents[parentIndex] == visible[visibleIndex]) {
                                                close = false;
                                                return false;
                                            }
                                        });
                                        if (close) {
                                            if ($(this).parent().find("ul") != visible[visibleIndex]) {
                                                $(visible[visibleIndex]).slideUp(opts.speed, function() {
                                                    $(this).parent("li").find("b:first").html(opts.closedSign);
                                                    $(this).parent("li").removeClass("open");
                                                });

                                            }
                                        }
                                    });
                                }
                            }// end if
                            if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
                                $(this).parent().find("ul:first").slideUp(opts.speed, function() {
                                    $(this).parent("li").removeClass("open");
                                    $(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
                                });

                            } else {
                                $(this).parent().find("ul:first").slideDown(opts.speed, function() {
                                    /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
                                    $(this).parent("li").addClass("open");
                                    $(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
                                });
                            } // end else
                        } // end if
                    });
                }catch(error){
                    console.log(error);
                }

            } // end function
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

        // COLLAPSE LEFT NAV
        $('.minifyme').click(function(e) {
            $('body').toggleClass("minified");
            $(this).effect("highlight", {}, 500);
            e.preventDefault();
        });
    }).promise().done(function(e){
        setTimeout(function(){
            $('nav ul').jarvismenu({
                accordion : true,
                speed : $.menu_speed,
                closedSign : '<em class="fa fa-plus-square-o"></em>',
                openedSign : '<em class="fa fa-minus-square-o"></em>'
            });
        },500)
    });
};

Template['sidebar'].events({
    'click #show-shortcut': function(e){
        if ($('#shortcut').is(":visible")) {
            shortcut_buttons_hide();
        } else {
            shortcut_buttons_show();
        }
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
    }
})