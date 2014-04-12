$(function () {
    'use strict';
    var dataJSON,
        languageJSON,
        dataTemplate;

    $.when($.getJSON('data/phases.json'),
        $.getJSON('data/language.json'),
        $.ajax({
            url: 't/main.html'
        }),
        $.getScript('js/handlebars.min.js')).done(function() {
            dataJSON = arguments[0];
            languageJSON = arguments[1];
            dataTemplate = arguments[2];
            $('head').append(dataTemplate[0]);
            render();
        }).fail(function () {
            console.log(arguments);
        });

    $('body').on('click', 'a', function(e) {
        e.preventDefault();
        var href = this.href;
        history.pushState('', '', this.href);
        render();
    });

    window.onpopstate = render;
    
    function render() {
        var $main = $('body').empty(),
            pathSplit = location.pathname.split('/'),
            page = pathSplit[pathSplit.length - 1].slice(0, -5) || 'index',
            templateHead = Handlebars.compile($("#head_template").html()),
            templateMain = Handlebars.compile($("#" + page + "_template").html()),
            path = location.pathname.split('/')[1], // need change to 1
            lang = path.length === 2 ? path : 'ru',
            templatePhases = Handlebars.compile($("#phases_template").html()),
            all = languageJSON[0][lang].all,
            data = languageJSON[0][lang][page],
            $phases;// = $('.header__phases');

        $main.append(templateHead($.extend({}, data.head, all)));
        $main.append(templateMain(data.content));
        $phases = $('.header__phases');

        $('head title').html(data.content.title);

        dataJSON[0].forEach(function (element) {
            $phases.append(templatePhases(element));
        });
        $phases.slide();
    }

    $.fn.slide = function () {
        var $child = $('.blockquote', this),
            count = $child.length;

        function getRandom() {
            return $child.eq(Math.ceil(Math.random() * count) - 1);
        }
        
        function destroy() {
            clearInterval(slider);
        }

        getRandom().fadeIn('slow');
        var slider = setInterval(function () {
            if ($child.parents('body').length === 0) {
                destroy();
            } else {
                $child.has(':visible').fadeOut('slow', function () {
                    var rnd = getRandom();
                    rnd.fadeIn('slow');
                });
            }
        }, 15000);
    };
});