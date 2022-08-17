TweetList = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};

TweetList.prototype.initVis = function(){
    var vis = this;

   

    //This is ES6 way to clone array without reference to the original data
    tweet = [...calls];
    vis.updateData();
}
TweetList.prototype.modifiedData = function(){
    var vis = this;
    tweet = [...test];
    vis.updateData();

}


TweetList.prototype.updateData = function(){
    var vis = this;

    vis.variableTweet = $("#var-select-tweet").val()
    console.log(tweet)
    if(vis.variableTweet == "recent"){
        tweet.sort(function(a, b) {
            a = new Date(a.created_at);
            b = new Date(b.created_at);
            return a>b ? -1 : a<b ? 1 : 0;
        });

    }
    else{
        tweet.sort(function (a, b) {
            return [b.retweet_count,b.favorite_count].reduce((a, b) => a + b, 0) - [a.retweet_count,a.favorite_count].reduce((a, b) => a + b, 0)
        });

    
    }

    vis.state = {
        'querySet': tweet,
        'page': 1,
        'rows': 5,
        'window': 5,
    }
    

    buildTable()

    function pagination(querySet, page, rows) {

        var trimStart = (page - 1) * rows
        var trimEnd = trimStart + rows

        var trimmedData = querySet.slice(trimStart, trimEnd)

        var pages = Math.round(querySet.length / rows);

        return {
            'querySet': trimmedData,
            'pages': pages,
        }
    }

    function pageButtons(pages) {
        var wrapper = document.getElementById('pagination-wrapper')

        wrapper.innerHTML = ``
        console.log('Pages:', pages)

        var maxLeft = (vis.state.page - Math.floor(vis.state.window / 2))
        var maxRight = (vis.state.page + Math.floor(vis.state.window / 2))

        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = vis.state.window
        }

        if (maxRight > pages) {
            maxLeft = pages - (vis.state.window - 1)
            
            if (maxLeft < 1){
                maxLeft = 1
            }
            maxRight = pages
        }
        
        

        for (var page = maxLeft; page <= maxRight; page++) {
            if(vis.state.page == page)
            {wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-primary">${page}</button>`}
            else
            {wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`}
        
        }

        if (vis.state.page != 1) {
            wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` + wrapper.innerHTML
        }

        if (vis.state.page != pages) {
            wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`
        }

        $('.page').on('click', function() {
            $('.tweetlist').empty()

            vis.state.page = Number($(this).val())
            buildTable()
        })

    }


    function buildTable() {
        
        var table = $('.tweetlist')

        var data = pagination(vis.state.querySet, vis.state.page, vis.state.rows)
        var myList = data.querySet
        for (var i = 0; i < myList.length; i++) {
        if(myList[i].tweet_sentiment == '0'){
            myList[i].tweet_sentiment="Negative"
        }
        else{
            myList[i].tweet_sentiment="Positive"
        }
    }
        for (var i = 1 in myList) {
            if(myList[i].tweet_sentiment == 'Positive'){
            //Keep in mind we are using "Template Litterals to create rows"
            var row ='<div class="panel panel-default">'+
                    '<div class="panel-body">'+
                        '<div class="media-block pad-al">'+
                            '<a class="media-left" href="#"><img class="img-circle img-sm" alt="Profile Picture" src='+myList[i]['profile_pic']+'></a>'+
                            '<div class="media-body">'+
                                '<div class="mar-btm">'+
                                  '<a href="#" class="btn-link text-semibold media-heading box-inline">'+ myList[i]['name']+'</a>'+
                                 '<span class="positiveSentimentTweets">'+myList[i]['tweet_sentiment']+'</span>'+

                                  '<p class="text-muted text-sm"><i class="fa fa-twitter fa-lg"></i> - @'+myList[i]['screen_name']+' -'+myList[i]['created_at']+'</p>'+
                                  
                                '</div>'+
                                    '<p>'+
                                        myList[i]['text']+
                                    '</p>'+
                                '<div class="pad-ver">'+
                                    '<span class="tag tag-sm"><i class="fa fa-heart"></i> ' +myList[i]['favorite_count']+' Likes</span>'+
                                    '<span class="tag tag-sm"><i class="fa fa fa-retweet"></i> ' +myList[i]['retweet_count']+' Retweet</span>'+

                                '</div>'+
                                '<hr>'+
                              '</div>'+
                            '</div>'+
                            '</div>'+
                        '</div>';
            table.append(row)
            }
            else{
                var row ='<div class="panel panel-default">'+
                    '<div class="panel-body">'+
                        '<div class="media-block pad-al">'+
                            '<a class="media-left" href="#"><img class="img-circle img-sm" alt="Profile Picture" src='+myList[i]['profile_pic']+'></a>'+
                            '<div class="media-body">'+
                                '<div class="mar-btm">'+
                                  '<a href="#" class="btn-link text-semibold media-heading box-inline">'+ myList[i]['name']+'</a>'+
                                 '<span class="negativeSentimentTweets">'+myList[i]['tweet_sentiment']+'</span>'+

                                  '<p class="text-muted text-sm"><i class="fa fa-twitter fa-lg"></i> - @'+myList[i]['screen_name']+' -'+myList[i]['created_at']+'</p>'+
                                  
                                '</div>'+
                                    '<p>'+
                                        myList[i]['text']+
                                    '</p>'+
                                '<div class="pad-ver">'+
                                    '<span class="tag tag-sm"><i class="fa fa-heart"></i> ' +myList[i]['favorite_count']+' Likes</span>'+
                                    '<span class="tag tag-sm"><i class="fa fa fa-retweet"></i> ' +myList[i]['retweet_count']+' Retweet</span>'+

                                '</div>'+
                                '<hr>'+
                              '</div>'+
                            '</div>'+
                            '</div>'+
                        '</div>';
            table.append(row)
            }
        }
        pageButtons(data.pages)
    }

};



