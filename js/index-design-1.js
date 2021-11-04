/* TOPOJSON DEFINATION*/
L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {    
      if (jsonData.type === "Topology") {
        for (key in jsonData.objects) {
          geojson = topojson.feature(jsonData, jsonData.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      }    
      else {
        L.GeoJSON.prototype.addData.call(this, jsonData);
      }
    }  
  });


var chart ;
var graph1 = false;
var graph2 = false;
var sidebarEnabled = true;
var filteredMarkerArray = [];
var allUsersMarkerArray = [];
var markerList = [];
var selectedMonth = [{
    name: 'Jan',
    val: 1,
    season : 'winter'
}];
var selectedPalette = 'sequential';
var selectedSeason = 'all';

var selectedLayer = $('input[name="polygonLayerSelector"]').val();

const sequentialPalette = ['rgb(254 235 226 / 70%)','#fcc5c0','#fa9fb5','#f768a1','#c51b8a','#7a0177'];
// const divergingPalette = ['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6'];
const divergingPalette = ['rgb(208 28 139 / 55%)','rgb(241 182 218 / 42%)','#f7f7f7','#b8e186','#4dac26'];
//CLASSES FOR DATA
let classesInterval = [
    {
        'name': 'sports',
        'classes': [{
            class : 'class-1',
            startVal: 0,
            endVal :1 
        },
        {
            class : 'class-2',
            startVal: 1,
            endVal :3 
        },
        {
            class : 'class-3',
            startVal: 3,
            endVal : 5  
        },
        {
            class : 'class-4',
            startVal: 5,
            endVal :9  
        },
        {
            class : 'class-5',
            startVal: 9,
            endVal : 108 
        } 
        ]
    },
    {
        'name': 'wildlife',
        'classes': [{
            class : 'class-1',
            startVal: 0,
            endVal : 1 
        },
        {
            class : 'class-2',
            startVal: 1,
            endVal : 13 
        },
        {
            class : 'class-3',
            startVal: 13,
            endVal : 34  
        },
        {
            class : 'class-4',
            startVal: 34,
            endVal : 68  
        },
        {
            class : 'class-5',
            startVal: 68,
            endVal : 233 
        } 
        ]
    },
    {
        'name': 'aesthetic',
        'classes': [{
            class : 'class-1',
            startVal: 0,
            endVal : 1 
        },
        {
            class : 'class-2',
            startVal: 1,
            endVal : 5 
        },
        {
            class : 'class-3',
            startVal: 5,
            endVal : 12
        },
        {
            class : 'class-4',
            startVal: 12,
            endVal : 20  
        },
        {
            class : 'class-5',
            startVal: 20,
            endVal : 85 
        } 
        ]
    },
    {
        'name': 'cultural',
        'classes': [{
            class : 'class-1',
            startVal: 0,
            endVal : 1 
        },
        {
            class : 'class-2',
            startVal: 1,
            endVal : 3 
        },
        {
            class : 'class-3',
            startVal: 3,
            endVal : 5
        },
        {
            class : 'class-4',
            startVal: 5,
            endVal : 14 
        },
        {
            class : 'class-5',
            startVal: 14,
            endVal : 99
        } 
        ]
    },
    {
        'name': 'users',
        'classes': [{
            class : 'class-1',
            startVal: 0,
            endVal : 1 
        },
        {
            class : 'class-2',
            startVal: 1,
            endVal : 46 
        },
        {
            class : 'class-3',
            startVal: 46,
            endVal : 106
        },
        {
            class : 'class-4',
            startVal: 106,
            endVal : 222 
        },
        {
            class : 'class-5',
            startVal: 222,
            endVal : 568
        } 
        ]
    }

];


var map ;

$(document).ready(function() {
    
    $('#left_map_year').text($('#left_year_selector').val());
    $('#right_map_year').text($('#right_year_selector').val());
    /*event for layer selection change*/
    $('input[name="polygonLayerSelector"]').change(function (){
        selectedLayer = this.value;
        drawPalete();
        updateLeftMap(this.value);
        // resetGeojsonStyle(this.value);
    });
    $('input[name="polygonLayerSelectorR"]').change(function (){
        selectedLayer = this.value;
        drawPalete();
        updateRightMap(this.value);
        // resetGeojsonStyle(this.value);
    });
    
 

});

let layersObject = {
    wildlife: 'wildlife',
    sports: 'sports',
    aesthetic: 'aesthetic',
    cultural: 'cultural',
    users: 'users'
};

//Seasonal Aggregation 
let monthsLookup = [{
        name: 'Jan',
        val: 1,
        season : 'winter'
    },
    {
        name: 'Feb',
        val: 2,
        season : 'winter'
    },
    {
        name: 'Mar',
        val: 3,
        season : 'spring'
    },
    {
        name: 'Apr',
        val: 4,
        season : 'spring'
    },
    {
        name: 'May',
        val: 5,
        season : 'spring'
    },
    {
        name: 'Jun',
        val: 6,
        season : 'summer'
    },
    {
        name: 'Jul',
        val: 7,
        season : 'summer'
    },
    {
        name: 'Aug',
        val: 8,
        season : 'summer'
    },
    {
        name: 'Sep',
        val: 9,
        season : 'autumn'
    },
    {
        name: 'Oct',
        val: 10,
        season : 'autumn'
    },
    {
        name: 'Nov',
        val: 11,
        season : 'autumn'
    },
    {
        name: 'Dec',
        val: 12,
        season : 'winter'
    }
]

$('#left_year_selector').on('change', function (event) {
    // applyFilterOnUsers();
    console.log($('#left_year_selector').val());
    let value = $('input[name="polygonLayerSelector"]').val();
    $('#left_map_year').text($('#left_year_selector').val());
    updateLeftMap(value);
  });
  $('#right_year_selector').on('change', function (event) {
    // applyFilterOnUsers();
    let value = $('input[name="polygonLayerSelectorR"]').val()
    $('#right_map_year').text($('#right_year_selector').val());
    updateRightMap(value);
    //left_map_year
  });
drawChart();
/* dropdown and slider init END*/

/*BASEMAPS */
var mapBox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
})

var mapBox2 = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
})


var OpenStreetMap =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
    });
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	});
  var dark =L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
  noWrap: true,
	maxZoom: 20
});


  var light =  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    noWrap: true,
    maxZoom: 19});

    var OpenStreetMap2 =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
    });
var Esri_WorldImagery2 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	});
  var dark2 =L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
  noWrap: true,
	maxZoom: 20
});


  var light2 =  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    noWrap: true,
    maxZoom: 19});


/*MAP CONFIG */
map = L.map('map',{zoomControl: false, attributionControl: false, }).setView([51.059,13.739], 12);
var map2 = L.map('map2', {
    // layers: [light],
    zoomControl: false,
    attributionControl: false,
}).setView([51.059,13.739], 12);

var zoomHome = L.Control.zoomHome({position:'bottomright'});
var zoomHome2 = L.Control.zoomHome({position:'bottomright'});
                zoomHome.addTo(map);
                zoomHome2.addTo(map2);
// L.control.zoom({position: 'bottomright'}).addTo(map);
var control = new L.Control.Bookmarks({position:'bottomright'}).addTo(map);
var control2 = new L.Control.Bookmarks({position:'bottomright'}).addTo(map2);
/*MAP CONFIG END*/


let basemaps = {
  'Satellite': Esri_WorldImagery.addTo(map),
  'Open Street Map': OpenStreetMap,
  'Map (Dark Mode)': dark,
  'Map (Light Mode)': light,
  'Mapbox Basemap' : mapBox
}
let basemaps2 = {
    'Satellite': Esri_WorldImagery2.addTo(map2),
    'Open Street Map': OpenStreetMap2,
    'Map (Dark Mode)': dark2,
    'Map (Light Mode)': light2,
    'Mapbox Basemap' : mapBox2
  }
var layerControl = L.control.layers(basemaps, null,{position: 'bottomright',collapsed:true});
var layerControl2 = L.control.layers(basemaps2, null,{position: 'bottomright',collapsed:true});

layerControl.addTo(map);
layerControl2.addTo(map2);
drawPalete();
L.easyButton({
    position: 'topright',
    states: [{
            stateName: 'hide-legend',        
            icon:      '<i class="fas fa-angle-double-left"></i>',               
            title:     'Hide Legend',      
            onClick: function(btn, map) {      
                $('#legend').hide();
                btn.state('show-legend');    
            }
        }, {
            stateName: 'show-legend',
            icon:      '<i class="fas fa-list"></i>',
            title:     'Show Legend',
            onClick: function(btn, map) {
                $('#legend').show();
                btn.state('hide-legend');
            }
    }]
}).addTo(map2);
map.on('click', function(e) {        
    hideGraph('left-graph');
    hideGraph('right-graph');
});

/*Loading Polygon Layer */
topoLayer = new L.TopoJSON();
topoLayer2 = new L.TopoJSON();

$.getJSON('js/yearly_attributes_merged_2ndNov21.js').done(addTopoData);
function addTopoData(topoData){
    topoLayer.addData(topoData);
    topoLayer2.addData(topoData)
    topoLayer.addTo(map);
    topoLayer2.addTo(map2);
   topoLayer.eachLayer(handleLayer);
   topoLayer2.eachLayer(handleLayerRight);
}

    var layertopo;
    //Each Layer Function for Polygons
    function handleLayer(layer){
        layertopo = layer;
       var popup = L.popup();
       let content = `<h6><u><b>${layer.feature.properties.TARGET_nam}</b></u></h6><p>${layer.feature.properties.TARGET_typ}</p>`;
        popup.setContent(content);
        layer.bindPopup(popup,{className:'custom-popup'});
        let value = $('input[name="polygonLayerSelector"]:checked').val();
        
        let year = $('#left_year_selector').val();
        setStylebyValue(layer,value,year);
       
        layer.on({
          click: zoomToFeature
        });
        layer.on('mouseover', function (e) {
            var popup = e.target.getPopup();
            popup.setLatLng(e.latlng).openOn(map);
				this.setStyle({
			weight:2,
			opacity: 1
		  });
          });

          layer.on('mouseout', function(e) {
             e.target.closePopup();
			 this.setStyle({
				weight:1,
				opacity:.5
			  });
          });

        //   layer.on('mousemove', function (e) {
        //     // e.target.closePopup();
        //     var popup = e.target.getPopup();
        //     popup.setLatLng(e.latlng).openOn(map);
        //   });
    }
    var layertopoRight
    function handleLayerRight(layer2){
        layertopoRight = layer2;
       var popup2 = L.popup();
       let content = `<h6><u><b>${layer2.feature.properties.TARGET_nam}</b></u></h6><p>${layer2.feature.properties.TARGET_typ}</p>`;
        popup2.setContent(content);
        layer2.bindPopup(popup2,{className:'custom-popup'});
        let value = $('input[name="polygonLayerSelectorR"]:checked').val();
        let year = $('#right_year_selector').val();
        setStylebyValue(layer2,value,year);
        layer2.on({
          click: zoomToFeature2
        });
        layer2.on('mouseover', function (e) {
            var popupr = e.target.getPopup();
            popupr.setLatLng(e.latlng).openOn(map2);
				this.setStyle({
			weight:2,
			opacity: 1
		  });
          });

          layer2.on('mouseout', function(e) {
             e.target.closePopup();
			 this.setStyle({
				weight:1,
				opacity:.5
			  });
          });
    }


    //For Styling of polygons
    function setStylebyValue(layer,value,year){
        let id = 'sc_ex';
       // console.log(year.substring(2,4));

        let propertyValue = `${year.substring(2,4)}_${value}`;
        let featureProp = layer.feature.properties[propertyValue];
        
        color = getSequentialColorByValue(featureProp,value)
        layer.setStyle({
          fillColor : color,
          fillOpacity: 1,
          color:'#fff',
          weight:1,
          opacity:.5
        });
    }


    function getDivergingColor(d, v) {
        
        let filtered = classesInterval.filter(el =>{
            return el.name == v;
        })
        // console.log(filtered);
        let classes = filtered[0].classes;

        return d >= classes[0].startVal && d <= classes[0].endVal ? divergingPalette[0] :
        d > classes[1].startVal && d <= classes[1].endVal ? divergingPalette[1]  :
            d > classes[2].startVal && d <= classes[2].endVal ?  divergingPalette[2]  :
                d > classes[3].startVal && d <= classes[3].endVal ? divergingPalette[3]  :
                d > classes[4].startVal && d <= classes[4].endVal ?   divergingPalette[4]  :
                                '#eee';
        
    }

    function getDivergingColorByValue(d, v){
        return d == '0' ? divergingPalette[0] :
        d <= '20' ? divergingPalette[1]  :
            d <= '40'  ? divergingPalette[2]  :
                d <= '60'  ? divergingPalette[3]  :
                    d >= '60'  ? divergingPalette[4]  :
                                '#eee';

    }

    function getSequentialColorByValue(d, v){
        return d <= '0' ? sequentialPalette[0] :
        d >= '0' && d < '16'  ? sequentialPalette[1]  :
            d >= '16' && d < '46'  ? sequentialPalette[2]  :
                d >= '46' && d < '66'   ? sequentialPalette[3]  :
                    d >= '66' && d < '86'   ? sequentialPalette[4]  :
                        d >= '86' && d <= '100'   ? sequentialPalette[5]  :
                                '#eee';

    }
    function getSequentialColor(d, v){
        let filtered = classesInterval.filter(el =>{
            return el.name == v;
        })
        // console.log(filtered);
        let classes = filtered[0].classes;

        return d >= classes[0].startVal && d <= classes[0].endVal ? sequentialPalette[0] :
        d > classes[1].startVal && d <= classes[1].endVal ? sequentialPalette[1]  :
            d > classes[2].startVal && d <= classes[2].endVal ?  sequentialPalette[2]  :
                d > classes[3].startVal && d <= classes[3].endVal ? sequentialPalette[3]  :
                d > classes[4].startVal && d <= classes[4].endVal ?   sequentialPalette[4]  :
                                '#eee';
           
    }


    function removeAllLayers() {

        // }
        var all_data = topoLayer.getLayers();
        for(var i=0;i<all_data.length;i++){
            map.removeLayer(all_data[i]);
            
        }
        map.eachLayer(function(layer) {
            if(layer.options.pane === "tooltipPane") layer.removeFrom(map);
        });
    }

    function zoomToFeature(e) {
   
         map.fitBounds(e.target.getBounds());
        let year_l  = $('#left_year_selector').val();
        var prop = e.target.feature.properties;
        let polygon_id = prop.OBJECTID 
     
        let filteredDataLeft =  dbData.filter(obj => {
            return (obj.objectid == polygon_id && obj.year == year_l)
          })
        let data_l = [  filteredDataLeft[0].a, filteredDataLeft[0].c, filteredDataLeft[0].s, filteredDataLeft[0].w];
        let series_l = {
            name: 'Activities',
            color: '#ed0364',
            data: data_l
        }
        
        chart1.yAxis[0].options.plotLines[0].value = filteredDataLeft[0].tp;
      
        chart1.yAxis[0].update({
            max: filteredDataLeft[0].tp+2
        }); 
        chart1.update({
            series: series_l,
          });
          let arealeft = `Area:  ${Math.round(filteredDataLeft[0].area)} sq. meter`
          $('#locationName').text(filteredDataLeft[0].nam);
          $('#locationArea').text(arealeft);
         
       
          showGraph('left-graph');
    }
    function zoomToFeature2(e) {
        map2.fitBounds(e.target.getBounds());
        let year_r  = $('#right_year_selector').val();
        var prop = e.target.feature.properties;
        let polygon_id = prop.OBJECTID 
     
        let filteredDataRight =  dbData.filter(obj => {
            return (obj.objectid == polygon_id && obj.year == year_r)
          })
         
        
        let data_r = [filteredDataRight[0].a, filteredDataRight[0].c, filteredDataRight[0].s, filteredDataRight[0].w ];
        
       
        let series_r = {
            name: 'Activities',
            color: '#ed0364',
            data: data_r
        }
        chart2.yAxis[0].options.plotLines[0].value = filteredDataRight[0].tp;
        chart2.yAxis[0].update({
            max: filteredDataRight[0].tp+2
        }); 
      
        let arearight = `Area: ${Math.round(filteredDataRight[0].area)} sq. meter`
        chart2.update({
        series: series_r,
        });
        $('#locationName2').text(filteredDataRight[0].nam);
        $('#locationArea2').text(arearight);
       
        showGraphRight('right-graph');
    }

    function resetGeojsonStyle(value){
        
        updateLeftMap(value);
        updateRightMap(value);
        
        
    }
    function updateLeftMap(value){
        
        let leftYear = $('#left_year_selector').val();
        for(var i=0;i<topoLayer.getLayers().length;i++){
            setStylebyValue(topoLayer.getLayers()[i],value,leftYear);
        }
    }
    function updateRightMap(value){
        
        let rightYear = $('#right_year_selector').val();
        for(var i=0;i<topoLayer2.getLayers().length;i++){
            setStylebyValue(topoLayer2.getLayers()[i],value,rightYear);
        }
    }

    
    function drawPalete(){
        var palete = sequentialPalette;
        // if(selectedPalette == 'diverging'){
        //     palete = divergingPalette;
        // }else if(selectedPalette == 'sequential'){
        //     palete = sequentialPalette;
        // }
        let v = selectedLayer;
        // let filtered = classesInterval.filter(el =>{
        //     return el.name == v;
        // })
        
        // console.log(filtered);
       // let classes = filtered[0].classes;// 24thOct 2021
        let classes = [{
            class : 'class-1',
            startVal: 0,
            endVal : 0 
        },
        {
            class : 'class-2',
            startVal: 1,
            endVal : 15
        },
        {
            class : 'class-3',
            startVal: 16,
            endVal : 45  
        },
        {
            class : 'class-4',
            startVal: 46,
            endVal : 65 
        },
        {
            class : 'class-5',
            startVal: 66,
            endVal : 85
        },
        {
            class : 'class-6',
            startVal: 86,
            endVal : 100 
        } 
        ];

       
        let legendHtml = `
        <ul class='legend-labels'>
            <li><span style='background:${palete[0]}'></span>No Data</li>
            <li><span style='background:${palete[1]}'></span>Very Low</li>
            <li><span style='background:${palete[2]}'></span>Low</li>
            <li><span style='background:${palete[3]}'></span>Average</li>
            <li><span style='background:${palete[4]}'></span>High</li>
            <li><span style='background:${palete[5]}'></span>Very High</li>
        </ul>
        `;
        let legendTitleLeft = $("input[name='polygonLayerSelector']:checked").parent()[0].innerText;
        let legendTitleRight = $("input[name='polygonLayerSelectorR']:checked").parent()[0].innerText;
        $('.legend-title-l').html(legendTitleLeft);
        $('.legend-title-r').html(legendTitleRight);
        $('#legendScale').html(legendHtml);
       
      
    }

    function drawChart(){
	
        
        $('.highcharts-figure').hide();
        chart1 = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: [
                    'Aesthetic',
                    'Cultural',
                    'Sports',
                    'Wildlife',
                ],
                crosshair: true
            },
            plotOptions: {
                column: {
                    colorByPoint: true
                }
            },
            title: {
                text: null
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'No. of Posts'
                },
                plotLines: [{
                    color: 'red',
                    value: 0,
                    width: 2,
                    zIndex: 100,
                    label: {
                      text: 'Total Posts',
                      align: 'left',
                      rotation: 0,
                      x: 10,
                      y: -15,
                    }}]
               
            },
            tooltip: {
                formatter: function() {
                    let prep ='is'
                    if(this.y > 1){
                        prep = 'are'
                    }
                    return 'The total posts for <b>' + this.x + '</b> '+prep+' <b>' + this.y + '</b>';
                }
            },
            series: [{
                name: 'Events',
                data: [0,0,0,0]
            }],
          })

          chart2 = Highcharts.chart('container-2', {
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: [
                    
                    'Aesthetic',
                    'Cultural',
                    'Sports',
                    'Wildlife',
                ],
                crosshair: true
            },
            plotOptions: {
                
                column: {
                    colorByPoint: true
                }
            },
            title: {
                text: null
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'No. of Posts'
                },
                plotLines: [{
                    color: 'red',
                    value: 0,
                    width: 2,
                    zIndex: 100,
                    label: {
                      text: 'Total Posts',
                      align: 'left',
                      rotation: 0,
                      x: 10,
                      y: -15,
                    }}]
            },
            tooltip: {
                formatter: function() {
                    let prep ='is'
                    if(this.y > 1){
                        prep = 'are'
                    }
                    return 'The total posts for <b>' + this.x + '</b> '+prep+' <b>' + this.y + '</b>';
                }
            },
            series: [{
                name: 'Posts',
                data: [0,0,0,0]
            }],
          })
        
    }

    function showGraph(id){
        let graphId = `#${id}`;
        $(graphId).css({
            height: '390px'
        });
        // $('.modal-header').show();
        // $('.area-header').show();
        // $('.highcharts-figure').show();
        $('#mh-l').show();
        $('#locationArea').show();
        
        $('#left-figure').show();
    }
    function showGraphRight(id){
        let graphId = `#${id}`;
        $(graphId).css({
            height: '390px'
        });
        $('#mh-r').show();
        $('#locationArea2').show();
        
        $('#right-figure').show();
    }
    function hideGraph(id){
        let graphId = `#${id}`;
        $(graphId).css({
            height: '0'
        });
        $('#mh-l').hide();
        $('#locationArea').hide();
        
        $('#left-figure').hide();
         graph1 = false;
        
        let series = {
            name: 'Activities',
            color: '#ed0364',
            data: [0,0,0,0]
        }
        chart1.update({
            series: series,
        });
        
        $('#locationName').html("");
        // $('#locationName2').html("");
        $('#locationArea').html("");
        //$('#locationArea2').html("")
       
        
    }
    function hideGraphRight(id){
        let graphId = `#${id}`;
        $(graphId).css({
            height: '0'
        });
        $('#mh-r').hide();
        $('#locationArea2').hide();
        
        $('#right-figure').hide();
        // graph1 = false;
        graph2 = false;
        let series = {
            name: 'Activities',
            color: '#ed0364',
            data: [0,0,0,0]
        }
        // chart1.update({
        //     series: series,
        // });
        chart2.update({
            series: series,
        });
       // $('#locationName').html("");
        $('#locationName2').html("");
        //$('#locationArea').html("");
        $('#locationArea2').html("");
        
    }


 
    function toggleMenu(){
        // $('.leaflet-sidebar-content').height();
        console.log(sidebarEnabled);
        if(sidebarEnabled) {
            $('.layers-control-panel').css({'height': '32px'});
            sidebarEnabled = false;
        }
        else {
            $('.layers-control-panel').css({'height': ' calc(50% + 22px)'});
            sidebarEnabled = true;
        }
    
    }
    function toggleMenu2(){
        // $('.leaflet-sidebar-content').height();
        console.log(sidebarEnabled);
        if(sidebarEnabled) {
            $('.r-panels').hide()
            $('.layers-control-panel-r').css({'height': '32px'});
            
            sidebarEnabled = false;
        }
        else {
            $('.r-panels').show()
            $('.layers-control-panel-r').css({'height': ' calc(50% + 22px)'});
            sidebarEnabled = true;
        }
    
    }
 

    function setLegendTitle(){
        let legendTitle = $("input[name='polygonLayerSelector']:checked").parent()[0].innerText;
        $('.legend-title').html(legendTitle);
    }
