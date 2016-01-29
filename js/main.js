$(document).ready(function () {
    var DateFormats = {
        short: "MM/DD/YYYY",
        medium: "MM/DD/YYYY HH:mm:ss",
        long: "dddd MM/DD/YYYY HH:mm"
    };
    //Setup context menu
    $('.ajaxGrid').contextMenu({
        selector: 'tr',
        items: {
            'Details': { name: 'Details', icon: '', callback: function (key, options) { var link = '/details.html?Id=' + options.$trigger.context.id; forwardTo(link); } },
            'Edit': { name: 'Edit', icon: '', callback: function (key, options) { var link = '/edit.html?Id=' + options.$trigger.context.id; forwardTo(link); } },
            'Delete': { name: 'Delete', icon: '', callback: function (key, options) { var link = '/delete.html?Id=' + options.$trigger.context.id; forwardTo(link); } }
        }
    });

    //forward to url from context menu
    function forwardTo(url) {
        window.location = url;
    };

    //Register Handlebars helpers
    Handlebars.registerHelper("formatDate", function (format, datetime) {
        if (moment) {
            format = DateFormats[format] || format;
            return moment(datetime).format(format);
        }
        else {
            return datetime;
        }
    });
    Handlebars.registerHelper("formatCurrency", function (amount) {
        formatted = amount.toFixed(2);
        return '$' + formatted.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    });
    Handlebars.registerHelper("formatPercent", function (amount) {
        amount = amount;
        formatted = amount.toFixed(2);
        return formatted + '%';
    });

    //Load contact data
    $.getJSON('contact.json')
        .done(function (results) {
            data = { Contact: results };
            source = $('#contactHGrid').html();
            template = Handlebars.compile(source);
            $('#Contact').html(template(data));
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
});

