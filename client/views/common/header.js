Template['header'].events({
    'click #btnLogout' : function(e){
        Meteor.logout(function(err){
            if(err)
                console.log(err);
            Router.go('/dangnhap');
        })
    },
    'click #hide-menu' : function(e){
        e.preventDefault();
        console.log(e);
        $('body').toggleClass("hidden-menu");
    }
});

Template['header'].rendered = function(){
    $(document).ready(function(){
        // ACTIVITY
        // ajax drop
        $('#activity').click(function(e) {
            var $this = $(this);

            if ($this.find('.badge').hasClass('bg-color-red')) {
                $this.find('.badge').removeClassPrefix('bg-color-');
                $this.find('.badge').text("0");
                // console.log("Ajax call for activity")
            }

            if (!$this.next('.ajax-dropdown').is(':visible')) {
                $this.next('.ajax-dropdown').fadeIn(150);
                $this.addClass('active');
            } else {
                $this.next('.ajax-dropdown').fadeOut(150);
                $this.removeClass('active')
            }

            var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
            //console.log(mytest)

            e.preventDefault();
        });

        $('input[name="activity"]').change(function() {
            //alert($(this).val())
            var $this = $(this);

            url = $this.attr('id');
            container = $('.ajax-notifications');

            loadURL(url, container);

        });

        $('#fullscreen').click(function(){
            var element = document.documentElement;
            launchFullscreen(element);
        })
        // Find the right method, call on correct element
        function launchFullscreen(element) {

            if (!$('body').hasClass("full-screen")) {

                $('body').addClass("full-screen");

                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }

            } else {

                $('body').removeClass("full-screen");

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }

            }

        }
    })
}