app.activity("download", new function(){

    this.color = "green";

    this.title = "";

    this.actions = [
        {
            id: "close-downloads",
            icon: "mdi-content-clear",
            showAsAction: "always"
        }
    ];

    var activity = this;

    this.onCreate = function(eActivity, invokeArg){

        var getter = $.get("http://82.176.111.248:50080/services/download-service.php", {imdb: invokeArg});
        getter.done(function(json){
            var list = paper.list.create(eActivity, function(li, item, isHeader){
                if(isHeader){
                    li.addClass("header").html(item);
                }else{
                    li.addClass("medium").addClass("wrippels");
                    $("<div class='title main'></div>").html(item.title).appendTo(li);
                    var subTitle = $("<div class='title sub'><div><span class='fg-green'>" + item.seeders + "</span> | <span class='fg-blue'>" + item.leechers + " </span></div></div>").appendTo(li);
                    $("<b>" + item.size + "</b>").appendTo(subTitle);
                    if(item.res != null) {
                        var color = "";
                        if(item.res === "1080p" || item.res === "BRRip"){
                            color = "fg-green";
                        }else if(item.res === "720p" || item.res === "HDRip"){
                            color = "fg-blue";
                        }else if(item.res === "DVD"){
                            color = "fg-orange";
                        }else{
                            color = "fg-red";
                        }
                        $("<b class='" + color + "'>" + item.res + "</b>").appendTo(subTitle);
                    }
                    li.click(function(){
                        paper.modal.question("Open magnet link", "Open 'magnet://' protocol", function(){
                            location.href = item.link;
                        }, "Open link", "Cancel");
                    });
                }
            });
            if(json.length == 0){
                list.render({"No results":[]});
            }else{
                list.render(json);
            }
            activity.loaded();
        });
        getter.fail(function(){
            paper.toast("Connection error");
        });

        return false;
    };

    $("body").on("click", "#close-downloads", function(){
        app.back();
    });

});