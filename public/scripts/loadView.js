function displayActive() {
    $(".main").hide();
    $("#active-computer").show();
}

var jsonResponse;
var modalTSdata = {};
var progressBarCounter = 0;
var assetMap = {};
//Load the screen with default view
window.onload = function () {
    httpGet("https://hpsreporting2.azurewebsites.net/AssetList/Getall");
};

function showHi(){
    var ctx = document.getElementById("myChart");
    var ctx = document.getElementById("myChart").getContext("2d");
    var ctx = $("#myChart");
    var ctx = "myChart";
    showChart();
    //httpGet()
}
//Reload the screen
function refreshScreen() {
    clearBox();
    httpGet("https://hpsreporting2.azurewebsites.net/AssetList/Getall");
}

//Http Get call method
function httpGet(URL) {
    progressBarVisible();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://hpsreporting2.azurewebsites.net');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr.timeout = 7000;
    xhr.ontimeout = function () {
        jsonResponse = hardCodedResponse;
        getFilterData();
    }
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            jsonResponse = response;
            getFilterData()
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

//This method is used to load the homepage with all assets.
function loadPage() {
    'use strict';
    var current_value;
    var assetObject = assetMap['AssetSearch'];
    var admin= assetObject['Administration'];
    var state = assetObject['State'];
    var assetList = assetObject['Asset'];
    if (assetList.indexOf("Computer") > -1) {
        assetList.push("System");
        assetList.push("Server");
    }
    for (var asset in jsonResponse) {
        current_value = jsonResponse[asset];
        var $iconComputer = null;
        var $iconVerified = null;
        var $iconInfo = null;
        var $iconOverlay = null;
        var $icons = null;
        var $viewModal = null;

        if (assetList.indexOf(current_value.assetType) > -1 && state.indexOf(current_value.state) > -1
            && admin.indexOf(current_value.administration) > -1) {


            if ("System" === current_value.assetType) {
                if ("Active" === current_value.state) {
                    $iconComputer = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Active and Collecting Data"/>').addClass('icon icon-computer green icon-hyperlink');
                    $iconVerified = $('<div />').addClass('icon icon-verified');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $icons = $('<div />').addClass('components');
                } else if ("Inactive" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-computer');
                    $iconVerified = $('<div />').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info disabled');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Inactive");
                    $icons = $('<div />').addClass('components');
                } else if ("Disabled" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-computer');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Has Been Disabled"/>').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Disabled");
                    $icons = $('<div />').addClass('components');
                } else {
                    $iconComputer = $('<div />').addClass('icon icon-computer red');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="No Agent Information Available"/>').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Disconnected");
                    $icons = $('<div />').addClass('components');
                }

                if ("Non Honeywell" === current_value.administration) {
                    if ("Active" === current_value.state) {
                        $iconComputer = $('<div data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')"/>').addClass('icon icon-computer purple icon-hyperlink');
                    } else {
                        $iconComputer = $('<div data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')"/>').addClass('icon icon-computer purple');
                    }
                }
            } else if ("Network Device" === current_value.assetType) {
                if ("Active" === current_value.state) {
                    $iconComputer = $('<div data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')"/>').addClass('icon icon-network-device green icon-hyperlink');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Active and Collecting Data"/>').addClass('icon icon-verified');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $icons = $('<div />').addClass('components device-spacing');
                } else if ("Inactive" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-network-device');
                    $iconVerified = $('<div />').addClass('icon icon-verified');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text-network').html(
                        "Inactive");
                    $icons = $('<div />').addClass('components device-spacing');
                } else if ("Disabled" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-network-device');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Has Been Disabled"/>').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text-network').html(
                        "Disabled");
                    $icons = $('<div />').addClass('components device-spacing');
                } else {
                    $iconComputer = $('<div />').addClass('icon icon-network-device red');
                    $iconVerified = $('<div />').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text-network').html(
                        "Disconnected");
                    $icons = $('<div />').addClass('components device-spacing');
                }
            } else if ("Controller" === current_value.assetType) {
                if ("Active" === current_value.state) {
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Active and Collecting Data"/>').addClass('icon icon-verified');
                    $iconComputer = $('<div data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')"/>').addClass('icon icon-controller green icon-hyperlink');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $icons = $('<div />').addClass('components controller-spacing');
                } else if ("Inactive" === current_value.state) {
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="No Agent Information Available"/>').addClass('icon icon-verified');
                    $iconComputer = $('<div />').addClass('icon icon-controller');
                    $iconInfo = $('<div />').addClass('icon icon-info disabled');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Inactive");
                    $icons = $('<div />').addClass('components controller-spacing');
                } else if ("Disabled" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-controller ');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Has Been Disabled"/>').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info disabled');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Disabled");
                    $icons = $('<div />').addClass('components controller-spacing');
                } else {
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="No Agent Information Available"/>').addClass('icon icon-disable');
                    $iconComputer = $('<div />').addClass('icon icon-controller red');
                    $iconInfo = $('<div />').addClass('icon icon-info disabled');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Disconnected");
                    $icons = $('<div />').addClass('components controller-spacing');
                }
            } else {
                if ("Active" === current_value.state) {
                    $iconComputer = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Active and Collecting Data"/>').addClass('icon icon-computer green icon-hyperlink');
                    $iconVerified = $('<div />').addClass('icon icon-verified');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $icons = $('<div />').addClass('components');
                } else if ("Inactive" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-computer');
                    $iconVerified = $('<div />').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info disabled');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Inactive");
                    $icons = $('<div />').addClass('components');
                } else if ("Disabled" === current_value.state) {
                    $iconComputer = $('<div />').addClass('icon icon-computer');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="Agent Has Been Disabled"/>').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Disabled");
                    $icons = $('<div />').addClass('components');
                } else {
                    $iconComputer = $('<div />').addClass('icon icon-computer red');
                    $iconVerified = $('<div data-toggle="tooltip" data-placement="bottom" title="No Agent Information Available"/>').addClass('icon icon-disable');
                    $iconInfo = $('<div />').addClass('icon icon-info');
                    $iconOverlay = $('<div />').addClass('overlay-text').html(
                        "Disconnected");
                    $icons = $('<div />').addClass('components');
                }

                if ("Non Honeywell" === current_value.administration) {
                    if ("Active" === current_value.state) {
                        $iconComputer = $('<div data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')"/>').addClass('icon icon-computer purple icon-hyperlink');
                    } else {
                        $iconComputer = $('<div data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')"/>').addClass('icon icon-computer purple');
                    }
                }
            }

            var $computerRole = $('<span />').addClass('computer-name').html(
                current_value.assetName),

                $computerName = $('<div />').addClass('computer-role').html(
                    current_value.assetType),
                $labelPlace = $('<div />').addClass('labels').append($computerRole).append($computerName),
                $viewModal = $('<a data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')">').append($iconComputer),
                $iconModal = $('<a data-toggle="modal" data-target="#myModal" onclick="getModaldata(' + asset + ')">').append($iconInfo),
                $iconsMerge = $icons.append($iconModal).append($iconVerified),
                $outerDiv = $('<div />')
                    .addClass('col-xs-3 col-sm-3 col-md-2 col-lg-1 placeholder').append(
                        $labelPlace).append(
                        $viewModal).append($iconsMerge).append($iconOverlay);
            $("#assetData").append($outerDiv);
        }
    }
    if (current_value === null || current_value === undefined) {
        $("#assetData").append('<h2 />').html('No Asset available');
    } else if ($outerDiv === null || $outerDiv === undefined) {
        $("#assetData").append('<h2 />').html('No Asset available for selected criteria.');
    }
    progressBarHidden();
}

//This method is used to populate the modal pop up.
function getModaldata(id) {
    clearModal();
    $('#modalPlace').append('<div class="col-xs-12" id="modalData"></div>');
    'use strict';
    var current_Modal;
    var iconValue = null;
    var $progBar = null;
    var $iconInfo = $('<div />').addClass('section-label').html(
        "General Information");

    $("#modalData").append($iconInfo);
    for (var asset in jsonResponse) {
        iconValue = asset.replace(/"/g, "");

        iconValue = eval(iconValue);
        if (id === iconValue) {
            current_Modal = jsonResponse[asset];
            $("#myModalLabel").html("Device :" + current_Modal.assetName);
            for (var key in current_Modal) {
                if (current_Modal.hasOwnProperty(key)) {
                    var $iconDiv;
                    var textVal = current_Modal[key].toString();
                    if (textVal.indexOf("Date") !== -1) {
                        textVal = getFormatedDate(textVal);
                    }
                    console.log(key + " -> " + current_Modal[key]);
                    var $iconspan = $('<span />').addClass('status');
                    if (key === 'literals') {
                        var literals = current_Modal[key];
                        for (var perfValues in literals) {
                            textVal = literals[perfValues].toString();
                            if (textVal.indexOf("Date") !== -1) {
                                textVal = getFormatedDate(textVal);
                            }
                            console.log(perfValues + " -> " + literals[perfValues]);
                            var $iconspan = $('<span />').addClass('status');
                            if ($perfInfo === undefined || $perfInfo === null) {
                                var $perfInfo = "Additional Information";
                                $("#modalData").append($('<div />').addClass('section-label').html($perfInfo));
                            }
                            $iconDiv = $('<div />').addClass('info-label').html(perfValues + ":");
                            var $iconLabel = $('<div />').addClass(
                                'col-xs-6').append($iconspan).append($iconDiv),
                                $iconDivText = $('<div />').addClass('info-results').html(textVal),
                                $iconText = $('<div />').addClass(
                                    'col-xs-6').append($iconDivText),
                                $outerDiv = $('<div />')
                                    .addClass('row').append($iconLabel).append($iconText);
                            $("#modalData").append($outerDiv);
                        }
                    } else if (key === 'timeSeriesProperties') {
                        progressBarCounter = current_Modal.timeSeriesProperties.length;
                        for (var tsData in current_Modal.timeSeriesProperties) {
                            var tsValues = current_Modal.timeSeriesProperties[tsData];
                            var $iconDiv;

                            var tsLabel = tsValues['label'].toString();
                            var tsLabelValue = tsLabel + ":";
                            var $iconspan = $('<span />').addClass('status');

                            if ($perfInfo === undefined || $perfInfo === null || $perfInfo === 'Additional Information') {
                                var $perfInfo = "Time Series Information";
                                $("#modalData").append($('<div />').addClass('section-label').html($perfInfo));

                            }
                            if ($progBar === null) {
                                $progBar = $('<div class="progress row" style="height: 20px; width:100%; margin:0 auto;" id="progressBarTS"><div class="progress-bar  progress-bar-striped active" role="progressbar" aria-valuenow="20" aria-valuemin="10" aria-valuemax="100" style="width:100%"></div></div>');
                                $("#modalData").append($progBar);
                            }

                            loadTSDateValues(tsLabel, tsValues['pointId'].toString());
                        }
                    } else {
                        $iconDiv = $('<div />').addClass('info-label').html(key + ":");
                        var $iconLabel = $('<div />').addClass(
                            'col-xs-6').append($iconspan).append($iconDiv),
                            $iconDivText = $('<div id=""/>').addClass('info-results').html(textVal),
                            $iconText = $('<div />').addClass(
                                'col-xs-6').append($iconDivText),
                            $outerDiv = $('<div />')
                                .addClass('row').append($iconLabel).append($iconText);
                        $("#modalData").append($outerDiv);
                    }
                }
            }
        }
    }
    //$('#progressBarTS').empty();
    if (current_Modal === undefined) {
        $("#modalData").append('<div />').html("No Agent Information Available.");
    }
}

function loadTSDateValues(key, pointID) {
    httpGetTSData("https://hpsreporting2.azurewebsites.net/assetlist/timeseries?systemGuid=76a0bc61-3506-4e2f-b261-c0b91331558f&query=" + pointID + "&startOffset=61200000&endoffset=0", key)
}

//This method is used to get the chart populated.
function frameChartWindow(elmt) {
    var textAttri = elmt.text.substr(0, elmt.text.length - 1);
    var timeSeriesData = modalTSdata[textAttri];
    if (timeSeriesData === null || timeSeriesData === undefined || timeSeriesData.length == 0) {
        alert('Time series data not available.');
        return;
    }
    for (var timeVal in timeSeriesData) {
        current_value = timeSeriesData[timeVal];
        if (current_value.ItemDoubleValue === null || current_value.ItemDoubleValue === undefined) {
            alert('This value doesnt change over time');
            return;
        }
    };

    $('#modalData').addClass('col-xs-8');
    $('#modalPlace').append('<div class="col-xs-4" id="chartWindow"></div>');
    $('#chartWindow').empty();
    $('#chartWindow').append('<div class="progress" style="height: 20px; width:100%; margin:0 auto;" id="progressBarModal"><div class="progress-bar  progress-bar-striped active" role="progressbar" aria-valuenow="20" aria-valuemin="10" aria-valuemax="100" style="width:100%"></div></div>')

    var chartID = textAttri + "Chart";
    var $chartdiv = $('<div data-toggle="modal" data-target="#myChartModal"  onclick="getChart(\'' + textAttri + '\')"/>').addClass('row icon-hyperlink');
    var $chartCanvas = $('<canvas width="280" height="200" id="' + chartID + '" />');
    $chartdiv.append($chartCanvas);
    $("#chartWindow").append($chartdiv);
    loadChart(textAttri, "Chart");
}

//This method is used to get the expanded chart screen.
function getChart(chartVal) {
    $('#ChartData').empty();
    var elem = document.getElementById('progressBarModal');
    elem.style.visibility = 'visible';
    $("#myChartLabel").html("Chart Info :" + chartVal);
    var $chartdiv = $('<div class="col-xs-12" />').addClass('row');
    var $chartCanvas = $('<canvas width="400" height="200" id="' + chartVal + 'E' + '" />');
    $chartdiv.append($chartCanvas);
    $("#ChartData").append($chartdiv);
    loadChart(chartVal , 'E');
}

//This method is used to format a date from epoc calendar.
function getFormatedDate(textVal) {
    var date = new Date(parseFloat(textVal.substr(6)));
    var formatVal = (date.getMonth() + 1) + "/" +
        date.getDate() + "/" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds();
    return formatVal;
}

//This method is used to format to a time from epoc calendar.
function getFormatedTime(textVal) {
    var date = new Date(parseFloat(textVal.substr(6)));
    var formatVal = (date.getHours() + ":" +
    date.getMinutes() + ":" +
    date.getSeconds());
    return formatVal;
}

//Clear the home page
function clearBox() {
    $('#assetData').empty();
}

//Clear the modal
function clearModal() {
    $('#modalData').empty();
    $('#chartWindow').empty();
    $('#modalPlace').empty();
    $('#ModalWindow').empty();
    modalTSdata = {};
}

//Facet search option
function getFilterData() {

    assetMap['AssetSearch'] = getCheckedBoxes();
    clearBox();
    loadPage();
    //httpPost("https://hpsreporting2.azurewebsites.net/assetlist/queryassets", assetMap);
}


//Disable progress bar
function progressBarHidden() {
    var elem = document.getElementById('progressBar');
    if (elem != null) {
        elem.style.visibility = 'hidden';
    }
    elem = document.getElementById('progressBarModal');
    if (elem != null) {
        elem.style.visibility = 'hidden';
    }
    elem = document.getElementById('progressBarTS');
    if (elem != null) {
        elem.style.visibility = 'hidden';
        $('#progressBarTS').empty();
    }

}

// Check box selection:Pass the checkbox name to the function
function getCheckedBoxes() {
    var assetSearch = {};
    var valueList = [];
    var checkedValue = null;
    var categoryName;
    var inputElements = document.getElementsByName('theGroup');
    for (var i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            checkedValue = inputElements[i].value;
            console.log(categoryName, checkedValue);
            categoryName = inputElements[i].className;

            valueList = assetSearch[categoryName];
            if (valueList === undefined || valueList === null) {
                valueList = [];
            }
            valueList.push(checkedValue);

            assetSearch[categoryName] = valueList;
        }
    }
    for (var category in assetSearch) {
        if (assetSearch[category].length === 1) {
            var elements = document.getElementsByClassName(category);
            for (var i = 0; elements[i]; ++i) {
                if (elements[i].checked) {
                    elements[i].disabled = true;
                }
            }
        } else if (assetSearch[category].length === 2) {
            var elements = document.getElementsByClassName(category);
            for (var i = 0; elements[i]; ++i) {
                if (elements[i].disabled) {
                    elements[i].disabled = false;
                    elements[i].checked = true;
                }
            }
        }
    }
    return assetSearch;
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

function loadlatestTSValue(chartName, response) {
    var len = response.length;
    var $iconspan = $('<span />').addClass('status');
    var tsLabelValue = chartName + ":";
    var $iconDiv;
    var $iconHyperLink;
    var classNames;
    if (len > 0) {
        var value = response[len - 1].ItemDoubleValue;
        $iconHyperLink = $('<a onclick="frameChartWindow(this)"/>').html(tsLabelValue);
        classNames = 'info-label icon-hyperlink';
        if (value === null) {
            value = response[len - 1].ItemStringValue;
            $iconHyperLink = $('<span />').html(tsLabelValue);
            classNames = 'info-label';
        }
    } else {
        $iconHyperLink = $('<span />').html(tsLabelValue);
        classNames = 'info-label';
        value = "Time series data not available.";
    }
    $iconDiv = $('<div id="' + tsLabelValue + '" />').addClass(classNames).append($iconHyperLink);
    var $iconLabel = $('<div />').addClass(
        'col-xs-6').append($iconspan).append($iconDiv),
        $iconDivText = $('<div id=\'' + chartName + '\'/>').addClass('info-results').html(value),
        $iconText = $('<div />').addClass(
            'col-xs-6').append($iconDivText),
        $outerDiv = $('<div />')
            .addClass('row').append($iconLabel).append($iconText);
    $("#modalData").append($outerDiv);
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
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
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
//Load chart with chart div ID
function loadChart() {
    var ctx = document.getElementById(chartName + suffix);
    var dataVal = [];
    var labelData = [];
    var currentVal;
    var labels = [];
    var i = 0;
    var timeSeriesData = modalTSdata[chartName];
    for (var timeVal in timeSeriesData) {
        current_value = timeSeriesData[timeVal];
        labelData.push(getFormatedTime
        (current_value.SampleTime));
        dataVal.push(current_value.ItemDoubleValue)
    };

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelData,
            datasets: [{
                label: chartName,
                data: dataVal,
                backgroundColor: "rgba(220,220,220,0)",
                borderColor: getRandomColor(),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    progressBarHidden();
}


var hardCodedResponse =
    [{"0":1,"1":1,"2":1,"3":1,"4":1,"5":0,"6":1,"7":0,"8":1,"9":0,"10":1,"11":0,"12":1,"13":0,"14":1,"15":0,"16":0,"17":1,"18":1,"19":0,"20":0,"21":1,"22":0,"23":0 }];
