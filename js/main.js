$(function () {
    'use strict';
    $.when($.getJSON('data/phases.json'),
           $.ajax({ url: 't/main.html'}),
           $.getScript('js/handlebars.min.js')).done(function (dataJSON, dataTemplate) {
        
        $('head').append(dataTemplate[0]);
        
        var $phases = $('.header__phases'),
            template   = Handlebars.compile($("#phases_template").html());
        dataJSON[0].forEach(function (element) {
            $phases.append(template(element));
        });
        $phases.slide();
    }).fail(function () {
        console.log(arguments);
    });

    $.fn.slide = function () {
        var $this = $(this),
            $child = $('.blockquote', this),
            count = $child.length;
        
        function getRandom() {
            return $child.eq(Math.ceil(Math.random() * count) - 1);
        }
        
        getRandom().fadeIn('slow');
        setInterval(function () {
            $child.has(':visible').fadeOut('slow', function () {
                var rnd = getRandom();
                console.log(rnd);
                rnd.fadeIn('slow');
            });
        }, 15000);
    };
});