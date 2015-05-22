app.activity("index-drawer", new function(){

    this.onCreate = function(eActivity, invokeArg){
        var listHead = $("<div class='drawer-head'></div>").appendTo(eActivity);
        listHead.css("background-image", "url(images/wallpaper2.jpg)");
        var listContainer = $("<div class='drawer-container'></div>").appendTo(eActivity);

        var list = paper.list.create(listContainer, function(li, item, isHeader){
            if(isHeader){
                li.addClass("header");
                li.html(item);
            }else {
                li.addClass("wrippels");
                li.html(item.name);
                li.attr("data-key", item.id);
                if (item.id == invokeArg || item.id == 0 && invokeArg == undefined) {
                    li.addClass("selected");
                }
            }
        });

        var genreKey = paper.lang.getLanguage() + "-genres";
        console.debug("load genres: " + genreKey);
        var genres = localStorage.getItem(genreKey);
        if(genres == null){
            var params = {api_key: API_KEY, language: paper.lang.getLanguage()};
            var getter = $.get("http://api.themoviedb.org/3/genre/movie/list", params);
            getter.done(function(json){
                var genreList = [{id:0,name:paper.lang.get("all")}];
                for(var i = 0; i < json.genres.length; i++){
                    genreList.push(json.genres[i]);
                }
                var genreKey = paper.lang.getLanguage() + "-genres";
                console.debug("save genres: " +genreKey);
                localStorage.setItem(genreKey, JSON.stringify(genreList));
                var renderData = {};
                renderData[paper.lang.get("genres")] = genreList;
                list.render(renderData, 40);
            });
            getter.fail(function(){
                paper.toast(paper.lang.get("error-connection"));
            });
        }else{
            var renderData = {};
            renderData[paper.lang.get("genres")] = JSON.parse(genres);
            list.render(renderData, 40);
        }


    };

    $("body").on("click", "#e-index-drawer .paper-list li", function(){
        var tthis = this;
        setTimeout(function(){
            $(tthis).parent().children().removeClass("selected");
            $(tthis).addClass("selected");
            app.goToGroup(app.getUrlData().group, $(tthis).attr("data-key"));
        }, 300);
    });

});