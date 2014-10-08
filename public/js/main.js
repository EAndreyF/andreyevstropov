(function () {
    'use strict';
    var dataJSON,
        languageJSON,
        dataTemplate,
        node = false;

    function main(context) {
        var window = context,
            $ = window.$,

            dfd = $.Deferred(),
//            prefix = 'http://andreyevstropov.com',
            prefix = 'http://localhost:3002',
            $phases = $('.header__phases');

        $.ajaxSettings.cache = true;

        if (node) {
            $.getJSON = function(url) {
                var dfd = $.Deferred();
                $.ajax({
                    url: url,
                    success: function(data) {
                        if (typeof data === 'string') {
                            dfd.resolve([JSON.parse(data)]);
                        } else {
                            dfd.resolve([data]);
                        }
                    }
                });
                return dfd;
            };
        } else {
            $('body').on('click', 'a', function(e) {
                var href = this.href;
                if (href.indexOf(prefix) !== -1) {
                  e.preventDefault();
                  window.history.pushState('', '', this.href);
                  render();
                }
            });

            window.onpopstate = render;
        }

        $.when($.getJSON(prefix + '/data/phases.json'),
            $.getJSON(prefix + '/data/language.json'),
            $.ajax({
                url: prefix + '/t/main.html'
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

        function render(not_empty) {
            var path = node ? window.location.url : window.location.pathname,
                $main = not_empty ? $('body') : $('body').empty(),
                pathSplit = path.split('/'),
                page = pathSplit[pathSplit.length - 1].slice(0, -5) || 'index',
                templateHead = window.Handlebars.compile($("#head_template").html());
            var templateMain = window.Handlebars.compile($("#" + page + "_template").html()),
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
        
        $phases.length && $phases.slide();

        return dfd;
    }

    try {
        exports.main = main;
        node = true;
    } catch (e) {
        $(function () {
            main(window);
        });
    }
})();