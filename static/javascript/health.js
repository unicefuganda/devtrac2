var ckan = {};

ckan.SearchURL = '/ugdata/';
ckan.SearchTerm = 'health';

ckan.packageSearch = function(){

  this.start = function() {

   $.ajax({
        url: ckan.SearchURL+ckan.SearchTerm,
        type: "GET",
        data: {},
        success: function(dataSet){
          $("#resultMessage").append('<h3>'+dataSet.count+'  records marched search query</h3>');          
          $.each(dataSet.results,function(index,data){

            $("#packageList").append(constructTable(data));

          });

        },
        error:function(){
            $("#errorMessage").html('Errors Encountered getting dataSet, try again later or contact your system admin');
        }
    });

  }

}

  function constructTable(data){

    var table = '<table style="border:1px solid #000000; width:90%;">';
    table += "<tr><td>Column<td><td>Value</td></tr>";

    table += '<tr><td>Package id <td><td>'+data.id+'</td></tr>';
    table += '<tr><td>Package name <td><td>'+data.name+'</td></tr>';
    table += '<tr><td>Package Title <td><td>'+data.title+'</td></tr>';
    table += '<tr><td>Aurthor<td><td>'+data.author+'</td></tr>';
    table += '<tr><td>metadata create date <td><td>'+data.metadata_created+'</td></tr>';
    table += '<tr><td>License Title <td><td>'+data.license_title+'</td></tr>';
    table += '<tr><td>Notes <td><td>'+data.notes+'</td></tr>';
    table += '<tr><td>Resource Format :  <td><td>'+data.resources[0].format+'</td></tr>';
    table += '<tr><td>Resource URL <td><td><a target="_blank" href='+data.resources[0].url+'>'+data.resources[0].url+'</a></td></tr>';
    table += "</table>";
    return table;

}

$(function(){
var ckan_search = new ckan.packageSearch();
  ckan_search.start();
});