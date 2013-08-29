var ckan = {};

ckan.get_data_url = '/download_resource';

ckan.packageSearch = function(){

  this.start = function() {

   $.ajax({
        url: ckan.get_data_url,
        type: "GET",
        data: {},
        success: function(dataSet){         
         display_chart();
         console.log(dataSet);
         
        },
        error:function(){
            $("#errorMessage").html('Errors Encountered getting dataSet, try again later or contact your system admin');
        }
    });

  }

}

function display_chart(){
  $('#chart_container').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Historic World Population by Region'
            },
            subtitle: {
                text: 'Source: Wikipedia.org'
            },
            xAxis: {
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population (millions)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' millions'
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
                name: 'Year 1800',
                data: [107, 31, 635, 203, 2]
            }, {
                name: 'Year 1900',
                data: [133, 156, 947, 408, 6]
            }, {
                name: 'Year 2008',
                data: [973, 914, 4054, 732, 34]
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