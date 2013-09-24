
$(function () {

var filterPanel = {};
filterPanel.panels = 1;

function sidebar(panels) {
    filterPanel.panels = panels;
    if (panels === 1) {         
        $('#sidebar').animate({           
            left: '-33%',
        });
    } else if (panels === 2) { 
        $('#sidebar').animate({
            left: 20,
        });
       
    }
}

$('#toggleSidebar').click(function () {   
    if (filterPanel.panels === 1) {        
        //$('#toggleSidebar').addClass('icon-chevron-left');
        //$('#toggleSidebar').removeClass('icon-chevron-right');
        sidebar(2);
    } else {
        //$('#toggleSidebar').removeClass('icon-chevron-left');
        //$('#toggleSidebar').addClass('icon-chevron-right');
         sidebar(1);
    }

});

});
