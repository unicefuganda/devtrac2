
$(function () {

    var filterPanel = {};
    var filterPanelElement = $(".filterPanel");
    var toggleElement = $('.toggleSidebar');
    var toggleIcon = filterPanelElement.find(".toggle-icon");

    function collapseSidebar() {
        filterPanelElement.animate({           
            left: '-14%',
        });
        filterPanelElement.removeClass("expanded");
        toggleIcon.removeClass("glyphicon-chevron-left");
        toggleIcon.addClass("glyphicon-chevron-right");
    }

    function expandSidebar() {
        $('.filterPanel').animate({
            left: 10,
        });
        filterPanelElement.addClass("expanded");
        toggleIcon.removeClass("glyphicon-chevron-right");
        toggleIcon.addClass("glyphicon-chevron-left");
    }

    toggleElement.click(function () {   
        if (filterPanelElement.hasClass("expanded"))
        {
            collapseSidebar();
        } else {
            expandSidebar();
        }
        return false;
    });

});
