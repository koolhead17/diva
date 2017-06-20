var FigureWidgets = {};
(function(obj) {
    // map from name to widget
    obj.widgetMap = {};

    obj.add = function(name, widget) {
        obj.widgetMap[name] = widget;
    };

    obj.getValues = function() {
        var values = {};
        for (var name in obj.widgetMap) {
            values[name] = obj.widgetMap[name].getCurrentValue(name);
        }
        return values;
    };

    // helper for defining widgets from HTML input forms
    obj.inputTagWidget = {
        getCurrentValue: function(myName) {
            var input = document.getElementById(myName);
            return input.value;
        }
    };
})(FigureWidgets);
