
app.activity("search-flow", new function(){

    var activity = this;
    var list;
    var timeout = undefined;

    this.actions = [
        {
            content: '<div class="paper-input"><input type="text" placeholder="@+search+@..."/><div class="stat"></div><div class="stat_active"></div> </div>'
        },
        {
            id: "overlay-search-button",
            icon: "mdi-action-search",
            showAsAction: "always"
        }
    ];

    this.title = " ";
    this.leftAction = null;
    this.icon = "mdi-content-clear";

    this.onVisible = function(){
        $("#a-search-flow .paper-input input").focus();
    };

    this.onCreate = function(eActivity){
        list = paper.list.create(eActivity, function(li, item, isHeader){
            if(isHeader){
                li.addClass("header").addClass("sep-top");
                li.html(item);
            }else{
                li.attr("data-key", item.id);
                li.addClass("wrippels").addClass("push-left");
                li.addClass("medium");
                var imageUrl = API_CONFIG.images.base_url + API_CONFIG.images.logo_sizes[1];
                var skipImage = false;
                if(item.poster_path != null){
                    imageUrl += item.poster_path;
                }else if(item.backdrop_path != null){
                    imageUrl += item.backdrop_path;
                }else{
                    skipImage = true;
                }
                if(!skipImage) {
                    var iconHolder = $("<div class='icon fade'></div>").appendTo(li);
                    var image = new Image();
                    image.onload = function () {
                        iconHolder.css("background-image", "url(" + imageUrl + ")");
                        iconHolder.removeClass("fade");
                    };
                    image.src = imageUrl;
                }
                $("<div class='title main'>" + item.title + "</div>").appendTo(li);
                var ratings = $("<div class='title sub'></div>").appendTo(li);
                var r = item.vote_average / 2;
                for(var i = 0; i < r; i++){
                    ratings.append("<i class='fg-yellow mdi-action-star-rate' style='font-size:20px;'></i>");
                }
            }
        });
    };

    $("body").on("click", "#e-search-flow .paper-list li:not(.header)", function(){
        var tthis = this;
        setTimeout(function(){
            $(tthis).parent().children().removeClass("selected");
            $(tthis).addClass("selected");
            app.goToActivity("film-info", 2, $(tthis).attr("data-key"));
        }, 300);
    });

    $("body").on("keyup", "#a-search-flow .paper-input input", function(){
        search();
    });

    $("body").on("click", "#a-search-flow #overlay-search-button", function(){
        search();
    });

    function search(){
        if(typeof(timeout) !== "undefined"){
            clearTimeout(timeout);
        }
        var input = $("#a-search-flow .paper-input input").val();
        if(input !== "" && input != null && typeof(input) !== "undefined"){
            timeout = setTimeout(function(){
                var params = {
                    api_key: API_KEY,
                    query: input
                };
                var getter = $.get("http://api.themoviedb.org/3/search/movie", params);
                getter.done(function(json){
                    for(var i = 0; i < json.results.length; i++){
                        localStorage.setItem("movie-" + json.results[i].id, JSON.stringify(json.results[i]));
                    }
                    if(json.results.length == 0){
                        var results = {};
                        results[paper.lang.get("no-results")] = [];
                        list.render(results, 0);
                    }else{
                        list.render(json.results, 0);
                    }
                });
                getter.fail(function(){
                    paper.toast("Connection error");
                });
            }, 500);
        }
    }

});