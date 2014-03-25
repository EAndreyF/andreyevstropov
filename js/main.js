$(function () {
    'use strict';
    $.when($.getJSON('data/phases.json'),
           $.getJSON('data/language.json'),
           $.ajax({ url: 't/main.html'}),
           $.getScript('js/handlebars.min.js')).done(function (dataJSON, languageJSON, dataTemplate) {
        
        $('head').append(dataTemplate[0]);
        
        var $main = $('body'),
            pathSplit = location.pathname.split('/'),
            page = pathSplit[pathSplit.length - 1].slice(0, -5) || 'index',
            templateHead = Handlebars.compile($("#head_template").html()),
            templateMain = Handlebars.compile($("#"+ page + "_template").html()),
            path = location.pathname.split('/')[1], // need change to 1
            lang = path.length === 2 ? path : 'ru',
            templatePhases = Handlebars.compile($("#phases_template").html()),
            all = languageJSON[0][lang].all,
            data = languageJSON[0][lang][page];
    
        $main.append(templateHead($.extend({}, data.head, all)));
        $main.append(templateMain(data.content));
        
        $('head title').html(data.content.title);
        
        var $phases = $('.header__phases');
        
        dataJSON[0].forEach(function (element) {
            $phases.append(templatePhases(element));
        });
        $phases.slide();
    }).fail(function () {
        console.log(arguments);
    });

    $.fn.slide = function () {
        var $child = $('.blockquote', this),
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