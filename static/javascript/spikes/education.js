var ckan = {};

ckan.get_data_url = '/download_resource';

ckan.packageSearch = function(){

  this.start = function() {

   $.ajax({
        url: ckan.get_data_url,
        type: "GET",
        data: {},
        success: function(dataSet){         
         
         var categories = [], data = [];
         var index =0;

         $.each(dataSet.results,function(district,schools){

            if(index < 10){
            categories.push(district);
            data.push(schools.length); 
        }

        index++;

         });

         display_chart(categories,data);
         
        },
        error:function(){
            $("#errorMessage").html('Errors Encountered getting dataSet, try again later or contact your system admin');
        }
    });

  }

}

function display_chart(districts,school_count){
  $('#chart_container').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Number of schools by district - Uganda'
            },
            subtitle: {
                text: 'Source: data.ug'
            },
            xAxis: {
                categories: districts,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'School count ',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Schools by district',
                data: school_count
            }]
        });
}
  function construct_table(data){

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