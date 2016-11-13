/**
 * infinite loop carousel
 * @author newdongyuwei@gmail.com
 * @param  {Object} config 
 * @return {Object} this
 */
$.fn.infiniteCarousel = function(config){
    config = $.extend({
        itemsPerMove : 3,
        duration : 100,
        vertical : false
    },config);

    var viewportEl = this.find('.viewport'), listEl = viewportEl.find('.list');
    var first = listEl.children(":first"), last = listEl.children(":last");
    
    var distance, prevProp, nextProp;
    if(config.vertical){
        distance = Math.max(first.outerHeight(true),last.outerHeight(true)) * config.itemsPerMove;
        prevProp = { 'scrollTop' : "-=" + distance };
        nextProp = { 'scrollTop' : distance }; 
    }else{
        distance = Math.max(first.outerWidth(true),last.outerWidth(true)) * config.itemsPerMove;
        prevProp = { 'scrollLeft' : "-=" + distance };
        nextProp = { 'scrollLeft' : '+=' + distance };
    }

    function move(config) {
        
        if (config.dir === 'next') {
            viewportEl.stop().animate(nextProp,{
                duration : config.duration,
                complete : function() {
                    config.vertical ? viewportEl.scrollTop(0) : viewportEl.scrollLeft(0);
                    repeatRun(function(){
                        listEl.children(":last").after(listEl.children(":first"));
                    },config.itemsPerMove);
                }
            });
        }

        if (config.dir === 'pre') {
            for(var i = 0; i < config.itemsPerMove; i++){
                listEl.prepend(listEl.children(":last"));
            }
            viewportEl[config.vertical ? 'scrollTop' : 'scrollLeft'](distance)
            .stop().animate(prevProp, {
                duration : config.duration
            });
        }
    }

    function repeatRun(func,times){
        for(var i = 0; i < times; i++){
            func();
        }
    }

    this.find('.pre').click(function() {
        move($.extend(config,{
            dir: "pre"
        }));

        //$('.list img').removeClass('active-list');
        /*$('.wheel').css({'animation': 'none', '-webkit-animation': 'none', '-moz-animation': 'none'});
        my_media.stop();
        is_playing = false;*/
    });

    this.find('.next').click(function() {
        move($.extend(config,{
            dir: "next"
        }));
        // $('.list img').removeClass('active-list');
        /*$('.wheel').css({'animation': 'none', '-webkit-animation': 'none', '-moz-animation': 'none'});
        my_media.stop();
        is_playing = false;*/
    });

    return this;
};