$(document).ready(function () {
    var DateFormats = {
        short: "MM/DD/YYYY",
        medium: "MM/DD/YYYY HH:mm:ss",
        long: "dddd MM/DD/YYYY HH:mm"
    };
    var currentUrl = document.URL;
    var idx = currentUrl.lastIndexOf('?Id=');
    var id = currentUrl.substr(idx + 4);

    //Hook the submit event for the form
    $('#form-content').submit(function (e) {

        //prevent Default functionality
        e.preventDefault();

        //Post the data to the service
        //var serviceUrl = e.currentTarget.action;
        //submitForm(this, serviceUrl)
        alert("Form submitted!");
        forwardTo("/index.html");
    });

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

    function findContact(c, id) {
        var contact = null;
        var Id = Number(id);
        //console.log('length: ' + c.length);
        for (var cnt in c) {
            //console.log('Id: ' + c[cnt].Id);
            if (c[cnt].Id === Id) {
                contact = c[cnt];
                break;
            }
        }
        return contact;
    };

    //forward to url from context menu
    function forwardTo(url) {
        window.location = url;
    };

    //Load contact data
    $.getJSON('contact.json')
        .done(function (results) {
            data = { Contact: findContact(results, id) };
            source = $('#contactHForm').html();
            template = Handlebars.compile(source);
            $('#form-content').html(template(data));
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
});