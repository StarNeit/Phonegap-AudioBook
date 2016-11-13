var audio_cnt = 0;

$('.infinite-carousel').infiniteCarousel({
    itemsPerMove : 1,
    duration : 50,
    vertical : true
});




// Music Player Controlls
function stopAudio()
{
    // alert("stop!");
    if (is_playing == 1)
    {
        my_media.stop();
        is_playing = 0;
        $('.wheel').css({'animation': 'none', '-webkit-animation': 'none', '-moz-animation': 'none'});    
    }                
}
function playAudio(url)
{
    // alert("playAudio!");
    if (my_media != null) {
        my_media.release();
    }

    my_media = new Media(url, 
        null, 
        // funtion(){alert('success!!!!!');},
        null);

    is_playing = 1;    
    $('.wheel').css({'animation': 'spin 3s linear infinite', '-webkit-animation': 'spin 3s linear infinite', '-moz-animation': 'spin 3s linear infinite'});
    my_media.play();
}
function play(url) 
{
    //alert("play!");
    if (is_playing != 0){
        stopAudio();
    }
    $(".loader").show();
    setTimeout(function () {
        $(".loader").hide();
        playAudio(url);
    }, 4000);
}
function pause()
{
    if (is_playing == 1){
        $('.wheel').css({'animation': 'none', '-webkit-animation': 'none', '-moz-animation': 'none'});    
        is_playing = 2;
        my_media.pause();
    }else if (is_playing == 2){
        $('.wheel').css({'animation': 'spin 3s linear infinite', '-webkit-animation': 'spin 3s linear infinite', '-moz-animation': 'spin 3s linear infinite'});
        is_playing = 1;
        my_media.play();
    }
}





//Initialize datas
$(document).ready(function()
{
    // Stop Player
    $('.wheel').css({'animation': 'none', '-webkit-animation': 'none', '-moz-animation': 'none'});
    
    // Loading Music Image/File Datas from Backend Sites
    $.ajax({
        url: audio_endpoints,
        type: "GET",
        processData: false,
        contentType: false,
        success: function(data, status){
            if (status == "success")
            {
                var datas = JSON.parse(data);
                audio_cnt = datas.length;

                var imageList = "", audioList = "";
                for (var i = 0; i < audio_cnt; i ++)
                {
                    imageList += "<img src='" + imageBaseUrl + datas[i].image_url + "' class='audio_item' id='audio_image" + i + "'/>";
                    audioList += "<input id='audio_url_english"+ i +"' type='hidden' value='" + audioBaseUrl + datas[i].audio_url_english + "'/>";
                    audioList += "<input id='audio_url_chinese"+ i +"' type='hidden' value='" + audioBaseUrl + datas[i].audio_url_chinese + "'/>";
                }   

                $("#screen_view2 .list").html(imageList);        
                $("#variables").html(audioList);

                for (var i = 0; i < audio_cnt; i ++)
                {
                    $('#audio_image' + i).on('click', function(){
                        if (!$(this).hasClass('active-list')) {
                            $('.list img').removeClass('active-list');
                            $(this).addClass('active-list');
                        }

                        var id = $(this).attr('id').substr(11);
                        // play($('#audio_url_english' + id).val());
                        // play($('#audio_url_chinese' + id).val());
                        
                        $("#selected_file_id").attr("value", id);
                    });
                }
            }else{
                alert("Load music data error.Please check network status.");
            }
        }
    }); 

    // Music Player Control Buttons
    $("#btn_play").on('click', function()
    {
        // Current selected File Id
        var selected_file_id = $("#selected_file_id").attr("value");

        // Validation
        if (selected_file_id == "0")
        {
            alert("Please select audio file");
            return;
        }

        // Get selected File url
        var selected_file = "";
        if ($("#lang_mode").attr("value") == 0)//english_mode
        {
            selected_file = $('#audio_url_english' + selected_file_id).val();
        }else if ($("#lang_mode").attr("value") == 1) //chinese_mode
        {
            selected_file = $('#audio_url_chinese' + selected_file_id).val();
        }
       
        // Play Audio
        play(selected_file);
    });
    $("#btn_stop").on('click', function(){
        stopAudio();
    });
    $("#btn_resume").on('click', function(){
        pause();
    });
    $("#btn_lang").on('click', function(){
        if ($("#lang_mode").attr('value') == 0)//english_mode
        {
            $("#lang_mode").attr('value', 1);
            $("#btn_lang").attr('src', 'img/btn_ch.png');    
        }else if ($("#lang_mode").attr('value') == 1)//chinese_mode
        {
            $("#lang_mode").attr('value', 0);
            $("#btn_lang").attr('src', 'img/btn_en.png');
        }
        
    });
}); 