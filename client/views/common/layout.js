Template['layout'].rendered = function(){
    $(document).ready(function(){
        // SHORTCUT buttons goes away if mouse is clicked outside of the area
        $(document).mouseup(function(e) {
            if (!$('#shortcut').is(e.target)// if the target of the click isn't the container...
                && $('#shortcut').has(e.target).length === 0) {
                $('#shortcut').animate({
                    height : "hide"
                }, 300, "easeOutCirc");
                $('body').removeClass('shortcut-on');
            }
        });
    })

}