function displayActive() {
    $(".main").hide();
    $("#active-computer").show();
}

var jsonResponse;
var modalTSdata = {};
var progressBarCounter = 0;
var assetMap = {};


function showHi(){
    var ctx = document.getElementById("myChart");
    var ctx = document.getElementById("myChart").getContext("2d");
    var ctx = $("#myChart");
    var ctx = "myChart";

    refreshScreen();
}
//Reload the screen
function refreshScreen() {
    clearBox();
    httpGet("http://connected-home.mybluemix.net/api/schedule?id=1&day=MO");
    showChart();
}

//Http Get call method
function httpGet(URL) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://connected-home.mybluemix.net');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr.timeout = 7000;
    xhr.ontimeout = function () {
        jsonResponse = hardCodedResponse;

    }
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            hardCodedResponse = response;

        }
    }
}

//Http post call method
function httpPost(path, jsonObject) {
    clearBox();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Range, Content-Disposition, Content-Description');
    xhr.send(JSON.stringify(jsonObject));

    xhr.onloadend = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            jsonResponse = response;
            loadPage();
        }
    };
}




//Clear the home page
function clearBox() {
    $('#myChart').empty();
}




//Get Time series data
function httpGetTSData(URL, chartName) {
    var tsResponse = modalTSdata[chartName];
    if (tsResponse === null || tsResponse === undefined) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', URL, true);
        xhr.send();
        xhr.onreadystatechange = processRequest;
        var elem = document.getElementById('progressBarTS');
        elem.style.visibility = 'visible';
        function processRequest(e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                modalTSdata[chartName] = response;
                loadlatestTSValue(chartName, response)
                progressBarCounter--;
                //console.log(progressBarCounter);
                if (progressBarCounter === 0) {
                    var elem = document.getElementById('progressBarTS');
                    elem.style.visibility = 'hidden';
                    elem.style.height = '2px';
                }
            }
        }
    } else {
        loadlatestTSValue(chartName, tsResponse);
    }
}

//Load color for chart
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function showChart() {
    var dataVal = [];
    var labelData = [];
    var ctx = document.getElementById("myChart");
    var timeSeriesData = hardCodedResponse;
    for (var timeVal in timeSeriesData) {
        current_value = timeSeriesData[timeVal];
        for(var dayVal in current_value){
            labelData.push(
                (dayVal));
            dataVal.push(current_value[dayVal])
        }


    };

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: [{
                label: 'Motion Detected',
                data: dataVal,
                backgroundColor: getRandomColor(),
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}


var hardCodedResponse =
    [{"0":1,"1":1,"2":1,"3":1,"4":1,"5":0,"6":1,"7":0,"8":1,"9":0,"10":1,"11":0,"12":1,"13":0,"14":1,"15":0,"16":0,"17":1,"18":1,"19":0,"20":0,"21":1,"22":0,"23":0 }];
