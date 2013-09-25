
$(function () {

var filterPanel = {};
filterPanel.panels = 1;

function sidebar(panels) {
    filterPanel.panels = panels;
    if (panels === 1) {     
        $('.filterPanel').animate({           
            left: '-26%',
        });
    } else if (panels === 2) {        
        $('.filterPanel').animate({
            left: 20,
        });
       
    }
}

sidebar(2);
$('.toggleSidebar').click(function () {   
    if (filterPanel.panels === 1) {        
        $('.toggleSidebar').text('<<');        
        sidebar(2);
    } else {
        $('.toggleSidebar').text('>>');        
         sidebar(1);
    }

});

});
