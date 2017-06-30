function newFigureWidgets() {
    var obj = {};

    // map from name to widget
    obj.widgetMap = {};

    obj.add = function(widget) {
        var name = document.currentScript.dataset.widgetname;
        obj.widgetMap[name] = widget;
    };

    obj.getValues = function() {
        var values = {};
        for (var name in obj.widgetMap) {
            values[name] = obj.widgetMap[name].getCurrentValue(name);
        }
        return values;
    };

    obj.resetToDefaults = function() {
        for (var name in obj.widgetMap) {
            obj.widgetMap[name].resetToDefault(name);
        }
    };

    return obj;
};

function newReport(reportIndex) {
    var obj = {reportIndex: reportIndex, widgets: newFigureWidgets()};
    
    obj.update =  function() {
        valueMap = obj.widgets.getValues();
        var updateRequest = {
            reportIndex: obj.reportIndex,
            widgetValues: valueMap
        };
        console.log('form values: ' + JSON.stringify(updateRequest));
        var currentPath = window.location.pathname;

        // on success, replace the report's HTML with the response
        var callback = function(data) {
            console.log(data);
            var figureId = '#figure-' + obj.reportIndex;
            $(figureId).html(data);
        }
        $.ajax({
            url: currentPath + 'update',
            type: "POST",
            data: JSON.stringify(updateRequest),
            contentType: "application/json",
            success: callback
        });    
    };

    // event listeners for the parent widget form
    var widgetFormId = '#widgetform-' + obj.reportIndex;

    $(widgetFormId).ready(function() {
        $(widgetFormId).on("submit", function(formEvent) {
            // prevent default get request
            console.log('submitting');
            formEvent.preventDefault();
            obj.update();
        });

        $(widgetFormId).on("reset", function(formEvent) {
            console.log('resetting');
            formEvent.preventDefault();
            obj.widgets.resetToDefaults();
            obj.update();
        });
    });

    return obj;
}

var Reports = {};
(function(obj) {
    obj.reportList = [];

    obj.create = function() {
        var reportIndex = obj.reportList.length;
        var report = newReport(reportIndex);
        obj.reportList.push(report);
    };

    // only for calling from widget-creator inline scripts
    obj.getCurrentReport = function() {
        var currentScript = document.currentScript;
        var reportDiv = currentScript.closest('.report');
        var reportIndex = Number(reportDiv.dataset.reportindex);
        return obj.reportList[reportIndex];
    };

    // helper for defining widgets from HTML input forms
    obj.inputTagWidget = {
        resetToDefault: function(myName) {
            var input = document.getElementById(myName);
            input.value = input.defaultValue;
        },
        getCurrentValue: function(myName) {
            var input = document.getElementById(myName);
            return input.value;
        }
    };
})(Reports);
