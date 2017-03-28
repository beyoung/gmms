/**
 * Created by Administrator on 2017/3/22 0022.
 */

//  logic script
var isoLayer = null;
var heatmap = null;
var markers = null;
var tmpMarker = null;

// map control
var globalMiniMap = null;
var sidebar = null;

var timeline = null;
var playback = null;
var spatialAnalyzeGeoJSON = null;
var bufferLayer = null;
var lineMarkerLayer = null;

var heatmapPointsLayer = null;

var sub_com = null;

var zafLayer = null;
var zafLineLayer = null;
var zafPointsLayer = null;

var indlayer = null;
var indPointLayer = null;
var indLineLayer = null;

var thiLayer = null;
var thiLineLayer = null;
var thiPointLayer = null;

var bolLayer = null;
var bolPointLayer = null;
var bolLineLayer

//    draw control
var drawControl = null;

// spatial analyze layer
var spatialAnlyzeLayer = null;

// airline airline area layer

var airline = null;
var airlineArea = null;
var airlineMarker = null;

var colors_hex = [
    '#E52D34',
    '#BC252B',
    '#FBC17B',
    '#FFF38F',
    '#D1C029',
    '#9DE477',
    '#4B9C1F',
    '#7CA7FF',
    '#204CA3'
];

var icons = [
    'coffee',
    'map-marker',
    'map-signs',
    'photo',
    'bus',
    'bicycle',
    'cab'
];
var colors = [
    'red',
    'blue',
    'yellow'
];

var subComNameMap = {
    'name': '子公司名',
    'address': '地址',
    'email': '邮件',
    'telephone': '电话'
};

var urls = [
    'http://www.honlitech.com/d/file/contents/2016/03/56d7e3124368c.png',
    'http://www.lidar360.com/wp-content/uploads/2016/10/Viewernew-1-1024x555.png',
    'http://www.lidar360.com/wp-content/uploads/2015/10/%E9%A6%99%E8%95%89%E5%9B%AD%E7%82%B9%E4%BA%91%E5%B1%95%E7%A4%BA_%E5%89%AF%E6%9C%AC.png',
    'dist/css/images/lidar.jpg',
    'http://www.precisionsurveys.ie/wp-content/uploads/2012/12/primark-belfast-scan07.jpg',
    'http://www.frankham.com/wp-content/uploads/2013/01/Measured-Surveying_1000x420_a.jpg',
    'http://www.cs.cmu.edu/afs/cs/project/chopper/www/hmp_data/cliff-points.gif',
    'http://www.cs.cmu.edu/afs/cs/project/chopper/www/hmp_data/cliff-points.gif',
    'http://www.frankham.com/wp-content/uploads/2013/03/Measured-Building-and-Laser-Scanning-1-1000x420.jpg',
    'https://carbomap.files.wordpress.com/2014/01/pointcloud.png',
    'http://www.frankham.com/wp-content/uploads/2013/03/Measured-Building-and-Laser-Scanning-1-1000x420.jpg',
    'http://www.ifp.uni-stuttgart.de/forschung/Image_Processing/VirtualCity/fig2a.png',
    'https://syldan.files.wordpress.com/2011/03/tour_bonenfant_pc_couleur.jpg',

];

function getImageUrl() {
    return urls[Math.floor(Math.random() * urls.length)];
}

var details = [
    {
        name: 'H121巡线监控点',
        person: '张巍',
        type: '一级项目',
        position: 'XX省国道XX县市',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/china.json',
        final_data: 'dist/json/china.json',
        image: getImageUrl()
    },
    {
        name: 'M3812巡线监控点',
        person: '张巍',
        type: '二级项目',
        position: 'XX省国道XX县市',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/china.json',
        final_data: 'dist/json/china.json',
        image: getImageUrl()
    },
    {
        name: 'H12M12 国道勘察点',
        person: '张巍',
        type: '一级项目',
        position: 'XX省国道XX县市',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/gas_station.geojson',
        final_data: 'dist/json/gas_station.geojson',
        image: getImageUrl()
    },
    {
        name: 'M3ds12巡线监控点',
        person: '张巍',
        type: '三级项目',
        position: 'XX省国道XX县市',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/feed.json',
        final_data: 'dist/json/feed.json',
        image: getImageUrl()
    }
];

var detail_forign = [
    {
        name: 'FF CC Santa Cruz  点',
        person: '张巍',
        type: '一级项目',
        position: 'William Moffet Expressway',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/china.json',
        final_data: 'dist/json/china.json',
        image: getImageUrl()
    },
    {
        name: 'FFCC Oruro - Viacha  施工点',
        person: '张巍',
        type: '二级项目',
        position: 'Mill Park Road',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/china.json',
        final_data: 'dist/json/china.json',
        image: getImageUrl()
    },
    {
        name: 'El Beni 勘察点',
        person: '张巍',
        type: '一级项目',
        position: 'Pimloco Street',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/gas_station.geojson',
        final_data: 'dist/json/gas_station.geojson',
        image: getImageUrl()
    },
    {
        name: 'Chuquisaca  施工点',
        person: '张巍',
        type: '三级项目',
        position: 'Carnoustie Crescent',
        contract: '项目合同',
        start_time: '2016-09-10',
        end_time: '2016-12-22',
        raw_data: 'dist/json/feed.json',
        final_data: 'dist/json/feed.json',
        image: getImageUrl()
    }
]

var details_map = {
    name: '项目名称',
    person: '项目负责人',
    type: '项目类型',
    position: '项目地点',
    contract: '项目合同',
    start_time: '开始时间',
    end_time: '结束时间',
    raw_data: '原始数据',
    final_data: '成果数据',
    image: '项目展示'
};

var tableColors = [
    'red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'grey', 'black'
];

function createFlightDom(details, details_map, tableColor) {
    var color = '';
    if (tableColor !== '') {
        color = tableColors[Math.floor(Math.random() * tableColors.length)];
    }
    var table = $('<table class="ui ' + color + ' padded table info-table"></table>');
    var thead = $('<thead><tr><th colspan="2">项目简介</th></thead>');
    table.append(thead);
    var tbody = $('<tbody></tbody>');
    var index = Math.floor(Math.random() * details.length);
    var data = details[index];
    var imgSrc = '';
    for (var property in data) {
        var tr = $('<tr></tr>');
        var tdOne = $('<td></td>').text(details_map[property]);
        var tdTwo = null;
        if (property === 'image') {
            tdTwo = $('<td><img onclick="showImageGallery()" src="' + getImageUrl() + '" style="height: 100px;width: 200px;"></img></td>');
            imgSrc = data[property];
        } else if (property === 'raw_data' || property === 'final_data') {
            tdTwo = $('<td><a href="' + data[property] + '" target="_black">下载</a></td>');
        }
        else {
            tdTwo = $('<td></td>').text(data[property]);
        }

        tr.append(tdOne);
        tr.append(tdTwo);
        tbody.append(tr)
    }
    $('#imgAddress').attr('src', imgSrc);
    table.append(tbody);
    return table;
};