(function () {
    'use strict';
    var dataJSON,
        languageJSON,
        dataTemplate,
        node = false,
        $,
        window;

    function main(context) {
        window = context;
        $ = window.$;

        var dfd = $.Deferred(),
            prefix = 'http://andreyevstropov.com',
            $phases = $('.header__phases');

        $.ajaxSettings.cache = true;

        if (node) {
            $.getJSON = function(url) {
                var dfd = $.Deferred();
                $.ajax({
                    url: url,
                    success: function(data) {
                        dfd.resolve([JSON.parse(data)]);
                    }
                });
                return dfd;
            };
        }

        $.when($.getJSON(prefix + '/public/data/phases.json'),
            $.getJSON(prefix + '/public/data/language.json'),
            $.ajax({
                url: prefix + '/public/t/main.html'
            })).done(function() {
                dataJSON = arguments[0];
                languageJSON = arguments[1];
                dataTemplate = arguments[2];
                $('head').append(dataTemplate[0]);
                if (!$('body main').length) { 
                    render(true);
                }
                dfd.resolve();
            }).fail(function () {
                console.log(arguments);
            });

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
        
        $phases.length && $phases.slide();

        return dfd;
    }

    function render(not_empty) {
        var path = node ? window.location.url : window.location.pathname,
            $main = not_empty ? $('body') : $('body').empty(),
            pathSplit = path.split('/'),
            page = pathSplit[pathSplit.length - 1].slice(0, -5) || 'index',
            templateHead = window.Handlebars.compile($("#head_template").html()),
            templateMain = window.Handlebars.compile($("#" + page + "_template").html()),
            lang = pathSplit[1].length === 2 ? pathSplit[1] : 'ru',
            templatePhases = window.Handlebars.compile($("#phases_template").html()),
            all = languageJSON[0][lang].all,
            data = languageJSON[0][lang][page],
            $phases;

        $main.append(templateHead($.extend({}, data.head, all)));
        $main.append(templateMain(data.content));
        $phases = $('.header__phases');

        $('head title').html(data.content.title);

        dataJSON[0].forEach(function (element) {
            $phases.append(templatePhases(element));
        });
        !node && !not_empty && $phases.slide();
    }

    if (exports) {
        exports.main = main;
        node = true;
    } else {
        $(function () {
            main(window);
            $('body').on('click', 'a', function(e) {
                e.preventDefault();
                var href = this.href;
                window.history.pushState('', '', this.href);
                render();
            });

            window.onpopstate = render;
        });
    }
})();