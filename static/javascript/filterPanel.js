
$(function () {

var filterPanel = {};
// filterPanel.panels = 1;
    var filterPanelElement = $(".filterPanel");
    var toggleElement = $('.toggleSidebar');
    var toggleIcon = filterPanelElement.find(".toggle-icon");

    // function sidebar(panels) {
    //     filterPanel.panels = panels;
    //     if (panels === 1) {     
            
    //     } else if (panels === 2) {        
    //         $('.filterPanel').animate({
    //             left: 20,
    //         });
           
    //     }
    // }

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

    // expandSidebar();

    

    toggleElement.click(function () {   
        if (filterPanelElement.hasClass("expanded"))
        {
            collapseSidebar();
        } else {
            expandSidebar();
        }

    });

});
