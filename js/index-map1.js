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
var userMarkers = L.markerClusterGroup({
    polygonOptions:{ weight: 1.2, color: '#ed0364', opacity: 0.5 },
    singleMarkerMode: true

});// Defined Clusters markers

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
    drawPalete();
    let legendTitleLeft = $("input[name='polygonLayerSelector']:checked").parent()[0].innerText;
    let legendTitleRight = $("input[name='polygonLayerSelectorR']:checked").parent()[0].innerText;
    $('.legend-title-l').html(legendTitleLeft);
    $('.legend-title-r').html(legendTitleRight);
  

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
    zoomControl: false
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
  'Satellite': Esri_WorldImagery,
  'Open Street Map': OpenStreetMap,
  'Map (Dark Mode)': dark.addTo(map),
  'Map (Light Mode)': light,
  'Mapbox Basemap' : mapBox
}
let basemaps2 = {
    'Satellite': Esri_WorldImagery2,
    'Open Street Map': OpenStreetMap2,
    'Map (Dark Mode)': dark2.addTo(map2),
    'Map (Light Mode)': light2,
    'Mapbox Basemap' : mapBox2
  }
var layerControl = L.control.layers(basemaps, null,{position: 'bottomright',collapsed:true});
var layerControl2 = L.control.layers(basemaps2, null,{position: 'bottomright',collapsed:true});
layerControl.addTo(map);
layerControl2.addTo(map2);
// var layerControl2 = L.control.layers(basemaps, null,{position: 'bottomright',collapsed:true}).addTo(map2);

/* BASEMAPS END*/

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

// L.easyButton({
//     position: 'topright',
//     states: [{
//             stateName: 'hide-legend',        
//             icon:      '<i class="fas fa-angle-double-left"></i>',               
//             title:     'Hide Legend',      
//             onClick: function(btn, map) {      
//                 $('#legend').hide();
//                 btn.state('show-legend');    
//             }
//         }, {
//             stateName: 'show-legend',
//             icon:      '<i class="fas fa-list"></i>',
//             title:     'Show Legend',
//             onClick: function(btn, map) {
//                 $('#legend').show();
//                 btn.state('hide-legend');
//             }
//     }]
// }).addTo(map);
map.on('click', function(e) {        
    hideGraph();
});

/*Loading Polygon Layer */
topoLayer = new L.TopoJSON();
topoLayer2 = new L.TopoJSON();

$.getJSON('js/combined_attributes_withgeom.js').done(addTopoData);
function addTopoData(topoData){
    topoLayer.addData(topoData);
    topoLayer2.addData(topoData)
    topoLayer.addTo(map);
    topoLayer2.addTo(map2);
   topoLayer.eachLayer(handleLayer);
   topoLayer2.eachLayer(handleLayerRight);
    //loadUsersPoints(userPoints); DIsabled for v2
}


//Loading User POINTs
function loadUsersPoints(userPoints){
    for (var i = 0; i < userPoints.length; i++) {
        var a = userPoints[i];
        var marker = L.marker(L.latLng(a.latitude, a.longitude));
        // marker.bindPopup(title);
        markerList.push(marker);
    }
    userMarkers.addLayers(markerList);
    
}

    var layertopo;
    //Each Layer Function for Polygons
    function handleLayer(layer){
        layertopo = layer;
       var popup = L.popup();
       let content = `<h6><u><b>${layer.feature.properties.target_nam}</b></u></h6><p>${layer.feature.properties.target_typ}</p>`;
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
    function handleLayerRight(layer){
        layertopoRight = layer;
       var popup = L.popup();
       let content = `<h6><u><b>${layer.feature.properties.target_nam}</b></u></h6><p>${layer.feature.properties.target_typ}</p>`;
        popup.setContent(content);
        layer.bindPopup(popup,{className:'custom-popup'});
        let value = $('input[name="polygonLayerSelectorR"]:checked').val();
        let year = $('#right_year_selector').val();
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
    }


    //For Styling of polygons
    function setStylebyValue(layer,value,year){
        let id = 'sc_ex';

        let propertyValue = `${year}_${value}`;
        let featureProp = layer.feature.properties[propertyValue];
        // var featureProp ;
        // console.log(value);
        // if(value=='sports_pop'){
        //     console.log(layer.feature.properties[propertyValue]);
            
        // //    / layer.feature.properties;
        //     featureProp = layer.feature.properties[propertyValue];
        //     console.log(featureProp);
        // }
        // else if(value=='wildlife_pop'){
        //     featureProp = layer.feature.properties.Wildlife;
        // }
        // else if(value=='aesthetic_pop'){
        //     featureProp = layer.feature.properties.Aesthetic;
        // }
        // else if(value=='cultural_pop'){
        //     featureProp = layer.feature.properties.Cultural;
        // }
        // if(value=='sports_expec'){
        //     //console.log(layer.feature.properties);
        //     year = '2007';
        // //    / layer.feature.properties;
        //     featureProp = layer.feature.properties['2007_sc_ex'];
        // }
        // else if(value=='wildlife_expec'){
        //     featureProp = layer.feature.properties.Wildlife;
        // }
        // else if(value=='aesthetic_expec'){
        //     featureProp = layer.feature.properties.Aesthetic;
        // }
        // else if(value=='cultural_expec'){
        //     featureProp = layer.feature.properties.Cultural;
        // }
        // else if(value=='users'){
        //     featureProp = layer.feature.properties.Users;
        // }
        
        // else{
        //     featureProp = layer.feature.properties.Sports;
        // }
        // var color;
        // console.log(featureProp);
        // if(selectedPalette == 'diverging'){
        //     color = getDivergingColorByValue(featureProp,value)
        // }else if(selectedPalette == 'sequential'){
        //     color = getSequentialColorByValue(featureProp,value)
        // }
        // else{
        //     color= '#fff';
        // }
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
        //palete2
        // return d == '0' ? divergingPalette[0] :
        // d == '1' ? divergingPalette[1]  :
        //     d == '2'  ? divergingPalette[2]  :
        //         d <= '3'  ? divergingPalette[3]  :
        //             d >= '3'  ? divergingPalette[4]  :
        //                         '#eee';
        
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
        return d == '0' ? sequentialPalette[0] :
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
        
        var prop = e.target.feature.properties;
        // "Users":2,"Aesthetic":0,"Cultural":0,"Sports":0,"Wildlife":0
        let data = [prop.Sports, prop.Wildlife, prop.Aesthetic, prop.Cultural];
        let series = {
            name: 'Activities',
            color: '#ed0364',
            data: data
        }
        if(!graph1 || graph2){
            chart1.update({
                series: series,
              });
              $('#locationName').text(prop.Area_Name);
            graph1= true;
            graph2 = false;
        }
        else if(graph1 || !graph2){
          
            chart2.update({
                series: series,
              });
              $('#locationName2').text(prop.Area_Name);
           
            graph1= false;
            graph2 = true;

        }
        
          showGraph();
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

    function applyFilterOnUsers(){
        let year = dropdown.selectedOption;
        let month = selectedMonth[0].name;
       
        if(year !='all'){
            filteredMarkerArray = userPoints.filter(function (el) {
                return el.year == year &&
                    el.month == month ;   
              });
        }
        else{
            filteredMarkerArray = userPoints;
        }
        
        clearMarkers();
        loadUsersPoints(filteredMarkerArray);
        resetClusterColor();
    }
    function clearMarkers(){
        markerList = [];
        userMarkers.clearLayers();
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
            <li><span style='background:${palete[0]}'></span>${classes[0].startVal}</li>
            <li><span style='background:${palete[1]}'></span>${classes[1].startVal}-${classes[1].endVal}</li>
            <li><span style='background:${palete[2]}'></span>${classes[2].startVal}-${classes[2].endVal}</li>
            <li><span style='background:${palete[3]}'></span>${classes[3].startVal}-${classes[3].endVal}</li>
            <li><span style='background:${palete[4]}'></span>${classes[4].startVal}-${classes[4].endVal}</li>
            <li><span style='background:${palete[5]}'></span>${classes[5].startVal}-${classes[5].endVal}</li>
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
                    'Sports',
                    'Wildlife',
                    'Aesthetic Beauty',
                    'Cultural Events',
                    'Users'
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
                title: {
                    text: 'Total Tags'
                }
            },
            tooltip: {
                formatter: function() {
                    let prep ='is'
                    if(this.y > 1){
                        prep = 'are'
                    }
                    return 'The total tags for <b>' + this.x + '</b> '+prep+' <b>' + this.y + '</b>';
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
                    'Sports',
                    'Wildlife',
                    'Aesthetic Beauty',
                    'Cultural Events',
                    'Users'
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
                title: {
                    text: 'Total Tags'
                }
            },
            tooltip: {
                formatter: function() {
                    let prep ='is'
                    if(this.y > 1){
                        prep = 'are'
                    }
                    return 'The total tags for <b>' + this.x + '</b> '+prep+' <b>' + this.y + '</b>';
                }
            },
            series: [{
                name: 'Events',
                data: [0,0,0,0]
            }],
          })
        
    }

    function showGraph(){
        $('.bottom-panel').css({
            height: '380px'
        });
        $('.modal-header').show();
        $('.highcharts-figure').show();
    }
    function hideGraph(){

        $('.bottom-panel').css({
            height: '0'
        });
        $('.modal-header').hide();
        $('.highcharts-figure').hide();
        graph1 = false;
        graph2 = false;
        let series = {
            name: 'Activities',
            color: '#ed0364',
            data: [0,0,0,0]
        }
        chart1.update({
            series: series,
        });
        chart2.update({
            series: series,
        });
        $('#locationName').html("");
        $('#locationName2').html("");
        
    }

    function seasonAggregation(selectedSeason){
        if(selectedSeason !='all'){
            let seasonsArray  = monthsLookup.filter(function (el) {
           if(el.season ==  selectedSeason){
            return el.val;
           }
               
          });
          seasonsArray = seasonsArray.map(function (el) {
            if(el.season ==  selectedSeason){
             return el.name;
            }
            });
        
            filteredMarkerArray = userPoints.filter(function (el) {
                
                return seasonsArray.includes(el.month)  
              });
              
            
        }
        else{
            filteredMarkerArray = userPoints;
            resetClusterColor();
        }
        clearMarkers();
        loadUsersPoints(filteredMarkerArray);
        changeClusterColor(selectedSeason);
    }

    
 function changeClusterColor(selectedSeason){
    let color = clusterColor(selectedSeason)
    $('.marker-cluster-small,.marker-cluster-medium,.marker-cluster-large').css({
        'background-color' : color
      
    });
    $('.marker-cluster-small,.marker-cluster-medium,.marker-cluster-large').find('div').css({
        'background-color' : color
    });

 }
 function resetClusterColor(){
    $('.marker-cluster-small,.marker-cluster-medium,.marker-cluster-large').css({
        'background-color' : 'rgba(223, 3, 87, 0.6)'
      
    });
    $('.marker-cluster-small,.marker-cluster-medium,.marker-cluster-large').find('div').css({
        'background-color' : 'rgba(223, 3, 87, 0.6);'
    });
 }

 function clusterColor(d){
    return d == 'winter' ? 'rgb(1, 75, 162, 0.6)' :
    d == 'autumn' ? 'rgb(182, 64, 14, 0.6)' :
        d == 'spring' ? 'rgb(12, 99, 1, 0.6)' :
            d == 'summer' ? 'rgb(255, 198, 28,0.8)' :
            d == 'all' ? 'rgba(223, 3, 87, 0.6)' :
                            '#eee';
 }

 
    function toggleMenu(){
        // $('.leaflet-sidebar-content').height();
        console.log(sidebarEnabled);
        if(sidebarEnabled) {
            $('.layers-control-panel').css({'height': '32px'});
            sidebarEnabled = false;
        }
        else {
            $('.layers-control-panel').css({'height': ' calc(72% + 22px)'});
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
            $('.layers-control-panel-r').css({'height': ' calc(72% + 22px)'});
            sidebarEnabled = true;
        }
    
    }
 

    function setLegendTitle(){
        let legendTitle = $("input[name='polygonLayerSelector']:checked").parent()[0].innerText;
        $('.legend-title').html(legendTitle);
    }

//     sc_ex  aes
// sc__1  cul
// sc__2  sp
// sc__3  wi
// sc_po aes
// sc__4 cul
// sc__5  sp
// sc__6  wi