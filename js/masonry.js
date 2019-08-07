(function($) {
    $.fn.createGallery = function(options) {
        const $this = $(this).addClass('masonry-container');
        const $masonryWrapper = $this.wrap('<div class="masonry-wrapper"></div>');
        let defaults = {
           width: 250,
           gap: 0
        };

        options = $.extend({}, defaults, options);

        function createImages() {
            let imagesLoaded = 0;
            $this.children().each(function() {
                let $li = $(this);

                $li.addClass('masonry-brick').css({
                    width: options.width + options.gap
                });
                let dataUrl = $li.attr('data-url');
                $(`<img src=${dataUrl} class="masonry-content"/>`)
                    .css('width', options.width)
                    .appendTo($li)
                    .on('load', function() {
                        imagesLoaded++;
                        if(imagesLoaded === $this.children().length) {
                            calculate();
                        }
                    }).on('error', function(err) {
                        let newChildNodes = $this.children().filter((i, node) => $(node).children()[0].src !== err.currentTarget.src);
                        $this.empty();
                        newChildNodes.appendTo($this);
                        calculate();
                    });
            })

        }

        
        function calculate() {
            let width = options.width;
            let length = Math.ceil($masonryWrapper.width() / (width + options.gap));
            if(!length || $masonryWrapper.width() <= (width + options.gap)) {
                return;
            }
            let elementsOptions = Array(length - 1).fill(0);
            let left = 0;
            let top = 0;

            $this.children().each(function() {
                let current = $(this);                
                top = Math.min(...elementsOptions);
                let index = elementsOptions.indexOf(top);
                left = (index * current.width());
                current.css({left, top});
                elementsOptions[index] += current.children().height() + options.gap;
            });

            $masonryWrapper.height(Math.max.apply(null, elementsOptions) + (2 * options.gap));
        }

        function setListeners() {
            $(window).resize(function() {
                calculate();
            });
        }

        createImages();
        setListeners();
    }
})(jQuery)




