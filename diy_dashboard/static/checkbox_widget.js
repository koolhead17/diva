var widgetname = document.currentScript.dataset.widgetname;
FigureWidgets.add(widgetname, {
    getCurrentValue: function(name) {
        return $('#' + name).is(':checked');
    },
    resetToDefault: function(name) {
        var input = document.getElementById(name);
        input.checked = input.defaultChecked;
    }
});
