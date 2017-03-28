/**
 * Created by beyouth on 2017/3/12.
 */

var earthquakeLayer = null;
var flightLayer = null;

var lineLayer = null;
var polygonLayer = null;
var dijiLayer = null;

var popup = L.popup();

var videos = [
    "<iframe height=360 width=100% src='http://player.youku.com/embed/XODM2ODUyMDUy' frameborder=0 'allowfullscreen'></iframe>",
    "<iframe height=360 width=100% src='http://player.youku.com/embed/XNDI3MjU0MzY4' frameborder=0 'allowfullscreen'></iframe>",
    "<iframe height=360 width=100% src='http://player.youku.com/embed/XODkyMTE0NDQ4' frameborder=0 'allowfullscreen'></iframe>",
    "<iframe height=360 width=100% src='http://player.youku.com/embed/XNjY3NTA4MjIw' frameborder=0 'allowfullscreen'></iframe>"
];


function showImageGallery() {
    $('#imageGallery').modal('show');
}


function createSubComDom(subCom) {
    var table = $('<table class="ui celled striped table info-table"></table>');
    var thead = $('<thead><tr><th colspan="2">' + subCom['properties']['name'] + '</th></thead>');
    table.append(thead);
    var tbody = $('<tbody></tbody>');
    for (var property in subCom['properties']) {
        var tr = $('<tr></tr>');
        var tdOne = $('<td></td>').text(subComNameMap[property]);
        var tdTwo = $('<td></td>').text(subCom['properties'][property]);
        tr.append(tdOne);
        tr.append(tdTwo);
        tbody.append(tr);
    }
    table.append(tbody);
    return table;
}

function showSubCom() {
    sub_com = L.geoJSON.ajax('dist/json/sub_com.json', {
        pointToLayer: function (feature, latlng) {
            var icon = L.icon.pulse({iconSize: [20, 20], color: 'red'});
            return L.marker(latlng, {icon: icon});
        }
    });
    sub_com.on('data:loaded', function () {
        map.addLayer(sub_com);
        map.fitBounds(sub_com.getBounds());
    });
    sub_com.on('click', function (e) {
        marker.setLatLng(e.latlng);
        var table = createSubComDom(e.layer.feature);
        map.addLayer(marker);
        marker.bindPopup(table[0].outerHTML).openPopup();
        $('.leaflet-popup-content-wrapper').width(440).height(328);
        map.flyTo([e.latlng.lat + 0.7, e.latlng.lng], 8);
    });
};

//添加点要素
function addEarthquakePoints() {
    if (earthquakeLayer == null) {
        var earthquakeFeedPointsURL = 'dist/json/gas_station.geojson';

        earthquakeLayer = L.geoJson.ajax(earthquakeFeedPointsURL, {
            pointToLayer: function (feature, latlng) {
                var icon = L.AwesomeMarkers.icon({
                    icon: icons[Math.floor(Math.random() * icons.length)],
                    markerColor: colors[Math.floor(Math.random() * colors.length)]
                });
                return L.marker(latlng, {icon: icon});
            }
        });
        earthquakeLayer.on('data:loaded', function () {
            map.addLayer(earthquakeLayer);
            map.fitBounds(earthquakeLayer.getBounds());
            earthquakeLayer.on('click', function (e) {
                var index = Math.floor(Math.random() * 2);
                if (index == 1) {
                    $('#3dLinesShow').modal('setting', 'transition', 'fade up ').modal('show');
                } else {
                    $('#3dPointsShow').modal('setting', 'transition', 'fade up ').modal('show');
                }
            })
        })
    } else {
        map.fitBounds(earthquakeLayer.getBounds());
        map.addLayer(earthquakeLayer);
    }
}


function addFlightPoints() {
    var flightURL = 'dist/json/feed.json'
    if (flightLayer != null) {
        map.addLayer(flightLayer);
        map.fitBounds(flightLayer.getBounds());
    } else {
        $.get(flightURL, function (data) {
            flightLayer = L.markerClusterGroup();
            for (var key in data) {
                if (data[key].length !== undefined) {
                    var title = '航班' + data[key][7] + '_' + data[key][6];
                    var flightMarker = L.marker(new L.LatLng(data[key][1], data[key][2]), {title: title});
                    map.addLayer(flightMarker);
                    var table = createFlightDom(details, details_map);
                    flightMarker.bindPopup(table[0].outerHTML).openPopup();
                    flightLayer.addLayer(flightMarker);
                    $('.leaflet-popup-content-wrapper').width(440).height(560);
                }
            }
            map.addLayer(flightLayer);
        })
    }
}

//添加线要素
function addLineStrings() {
    if (lineLayer == null) {
        var lineLayerURL = 'dist/json/railway.geojson';

        lineLayer = L.geoJson.ajax(lineLayerURL, {
            style: {
                "color": "#312fff",
                "weight": 2,
                "opacity": 1,
                "width": 3
            }
        });

        L.Util.ajax(lineLayerURL).then(function (data) {
            var unit = 'meters';
            var buffered = turf.buffer(data, 1000, unit);
            bufferLayer = L.geoJSON(buffered, {
                style: {
                    "fillColor": '#312fff',
                    "color": "#312fff",
                    "weight": 5,
                    "opacity": 0.2,
                    "fillOpacity": 0.2
                }
            }).addTo(map);
        });

        lineMarkerLayer = L.geoJson.ajax('dist/json/railway_point.geojson', {
            pointToLayer: function (feature, latlng) {
                var jiantong = L.icon({
                    iconUrl: 'dist/css/images/favicon1.png',
                    iconSize: [35, 28]
                });
                return L.marker(latlng, {icon: jiantong});
            }
        });
        lineMarkerLayer.on('data:loaded', function () {
            map.addLayer(lineMarkerLayer);
            lineMarkerLayer.on('click', function (e) {
                marker.setLatLng(e.latlng);
                var index = Math.floor(Math.random() * details.length);
                var data = details[index];
                //顺序很重要
                map.addLayer(marker);
                marker.bindPopup('<h3>' + data['name'] + '段监控</h3>' + '<p>拍摄时间: 2017-02-01 09:30</p>' + videos[Math.floor(Math.random() * videos.length)]).openPopup();
                $('.leaflet-popup-content-wrapper').height(468).width(440);
                map.flyTo([e.latlng.lat + 0.7, e.latlng.lng], 9)
            })
        });

        lineLayer.on('data:loaded', function () {
            map.fitBounds(lineLayer.getBounds());
            map.addLayer(lineLayer);
        })

    } else {
        map.fitBounds(lineLayer.getBounds());
        map.addLayer(lineLayer);
        map.addLayer(bufferLayer);
        map.addLayer(lineMarkerLayer);
    }
}


function runDijiChartScript() {
    var myChart = echarts.init(document.getElementById('dijiChart'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {show: true}
            }
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['建设用地', '公园用地', '耕地', '保留地', '工业用地']
        },
        series: [
            {
                name: '土地使用情况',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: Math.floor(Math.random() * 400 + 50), name: '建设用地'},
                    {value: Math.floor(Math.random() * 300 + 50), name: '公园用地'},
                    {value: Math.floor(Math.random() * 250 + 50), name: '耕地'},
                    {value: Math.floor(Math.random() * 400 + 50), name: '保留地'},
                    {value: Math.floor(Math.random() * 400 + 50), name: '工业用地'}
                ]
            }
        ]
    };
    myChart.setOption(option);
}

function runPolygonChart() {
    var chart = echarts.init(document.getElementById('polygonChart'));
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO', '气压', '湿度', '风']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'PM2',
                type: 'bar',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: 'PM10',
                type: 'bar',
                // stack: '广告',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'O3',
                type: 'bar',
                // stack: '广告',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'NO2',
                type: 'bar',
                // stack: '广告',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: 'SO2',
                type: 'bar',
                data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'dashed'
                        }
                    },
                    data: [
                        [{type: 'min'}, {type: 'max'}]
                    ]
                }
            },
            {
                name: 'CO',
                type: 'bar',
                barWidth: 5,
                // stack: '搜索引擎',
                data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
                name: '气压',
                type: 'bar',
                // stack: '搜索引擎',
                data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
                name: '湿度',
                type: 'bar',
                // stack: '搜索引擎',
                data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
                name: '风',
                type: 'bar',
                // stack: '搜索引擎',
                data: [62, 82, 91, 84, 109, 110, 120]
            }
        ]
    };
    chart.setOption(option);
}

// 添加面要素
function addPolygonLayer() {
    if (polygonLayer == null) {
        polygonLayer = L.geoJson.ajax('dist/json/guang_dong_geo.json', {
            style: function () {
                var color = colors_hex[Math.floor(Math.random() * colors_hex.length)];
                return {
                    "color": color,
                    "weight": 5,
                    "opacity": 0.9
                };
            }
        });

        polygonLayer.on('data:loaded', function () {
            map.addLayer(polygonLayer);
            map.fitBounds(polygonLayer.getBounds());
            polygonLayer.on('click', function (e) {
                marker.setLatLng(e.latlng);
                marker.options.opacity = 1;
                map.addLayer(marker);
                marker.bindPopup("<h3>" + e.layer.feature.properties.name + "一周空气质量监控</h3>" + '<div id="polygonChart" style="width:520px;height:300px"></div>').openPopup();
                $('.leaflet-popup-content-wrapper').width(560).height(365);
                setTimeout(function () {
                    runPolygonChart();
                    map.flyTo([e.latlng.lat + 0.7, e.latlng.lng], 8);
                }, 250);

            })
        })
    } else {
        map.fitBounds(polygonLayer.getBounds());
        map.addLayer(polygonLayer);
    }
};

function addDijiLayer() {
    if (dijiLayer == null) {
        dijiLayer = L.geoJson.ajax('dist/json/440100.json', {
            style: function () {
                var color = colors_hex[Math.floor(Math.random() * colors_hex.length)];
                return {
                    "color": color,
                    "weight": 5,
                    "opacity": 0.9
                };
            }
        });

        dijiLayer.on('data:loaded', function () {
            map.addLayer(dijiLayer);
            map.fitBounds(dijiLayer.getBounds());
            dijiLayer.on('click', function (e) {
                marker.setLatLng(e.latlng);
                marker.options.opacity = 1;
                // map.setView(e.latlng, 8);

                map.addLayer(marker);
                marker.bindPopup("<h3>" + e.layer.feature.properties.name + "土地使用情况</h3>" + '<div id="dijiChart" style="width:380px;height:300px"></div>').openPopup();
                $('.leaflet-popup-content-wrapper').width(420).height(365);
                setTimeout(function () {
                    runDijiChartScript();
                    map.flyTo([e.latlng.lat + 0.7, e.latlng.lng], 8);
                }, 250);
            })
        })
    } else {
        map.fitBounds(dijiLayer.getBounds());
        map.addLayer(dijiLayer);
    }
};

function showHeatmap() {
    if (heatmap == null) {
        addressPoints = addressPoints.map(function (p) {
            return [p[0], p[1]];
        });
        heatmapPointsLayer = L.polyline(addressPoints);
        markers = L.markerClusterGroup();

        for (var i = 0; i < addressPoints.length; i++) {
            var a = addressPoints[i];
            var title = a[2];
            var icon = L.AwesomeMarkers.icon({
                icon: icons[Math.floor(Math.random() * icons.length)],
                markerColor: colors[Math.floor(Math.random() * colors.length)]
            });
            var marker = L.marker(new L.LatLng(a[0], a[1]), {title: title, icon: icon});
            markers.addLayer(marker);
        }
        map.addLayer(markers);

        heatmap = L.heatLayer(addressPoints);
        map.fitBounds(heatmapPointsLayer.getBounds());
    } else {
        if (heatmapPointsLayer != null) {
            map.fitBounds(heatmapPointsLayer.getBounds());
        }
        map.addLayer(markers);
    }

    // 加载空间分析图层
    L.Util.ajax("dist/json/pp1.geojson").then(function (points) {
        spatialAnalyzeGeoJSON = points;
    });
}

function showISOMap() {
    if (isoLayer == null) {
        L.Util.ajax("dist/json/gas_station.geojson").then(function (points) {
            for (var i = 0; i < points.features.length; i++) {
                points.features[i].properties.z = Math.random() * 10;
            }

            var breaks = [0, 1, 2, 3, 4, 5, 6];
            var isolined = turf.isolines(points, 'z', 50, breaks);

            isoLayer = L.geoJSON(isolined);
            map.addLayer(isoLayer);
            map.fitBounds(isoLayer.getBounds());
        });

    } else {
        map.addLayer(isoLayer);
        map.fitBounds(isoLayer.getBounds());
    }
}
