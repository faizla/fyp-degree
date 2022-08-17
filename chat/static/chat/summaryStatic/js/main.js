var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");

d3.json(link).then(function(data){

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    data.map(function(d){
        
        //doing this can reset the time 00:00:00
        d.created_at = new Date(d.date)
        d.date = parseTime(formatTime(new Date(d.date)))


        return d
    })
    //Print the data just for debug
    console.log(data)



    


    allCalls = data;
    //to make reference so that data can be accessed by others object
    calls = data;
    
    ////////////////////TO FIND UNIQUE CONTRIBUTOR
    //To fiter unique people
    var result = calls.reduce((unique, o) => {
        if(!unique.some(obj => obj.screen_name === o.screen_name)) {
            unique.push(o);
        }
        return unique;
    },[]);
    console.log(result);
    var audience_reach=0, engagement=0, positiveCounter=0, negativeCounter=0;
    for(var i=0; i<result.length; i++){
        audience_reach += result[i].follower_count;
    }
    for(var i=0; i<calls.length; i++){
        
        engagement += calls[i].retweet_count+calls[i].favorite_count
        if(calls[i].tweet_sentiment == '1'){
            positiveCounter++;
        }
        else{
            negativeCounter++;
        }

    }
    ////////////////////
    
    //The number of mentions of the event
    console.log("Mentions "+calls.length)
    //The number of unique people tweets about the event
    console.log("Unique Contributor "+result.length);
    //The estimated number of people make a contact with the tweets(saw the tweet) of the event 
    console.log("Potential Audience Reach "+audience_reach);
    //The total number of time people has interacted with the tweet of the event
    console.log("Tweet engagement "+engagement);

    console.log("Positive Mentions "+positiveCounter);
    positivePercentage=(positiveCounter/calls.length*100).toFixed(2);
    console.log(positivePercentage);

    console.log("Negative Mentions "+negativeCounter);
    negativePercentage=(negativeCounter/calls.length*100).toFixed(2);
    console.log(negativePercentage)

    document.getElementById("mentions").textContent = calls.length;
    document.getElementById("unique-contributor").textContent = result.length;
    document.getElementById("audience-reach").textContent = audience_reach;
    document.getElementById("engagement").textContent = engagement;
    document.getElementById("positive").textContent = positiveCounter;
    document.getElementById("negative").textContent = negativeCounter;




    
    donut = new DonutChart("#sentiment-donut") 

    sourceBar = new BarChart("#revenue", "call_revenue", "Average call revenue (USD)")
    // durationBar = new BarChart("#call-duration", "call_duration", "Average call duration (seconds)")
    // unitBar = new BarChart("#units-sold", "units_sold", "Units sold per call")
    mentionLineChart = new MentionLineChart("#mention-line-chart")
    mentionStackedChart = new MentionStackedChart("#mention-stacked-area")

    stackedArea = new StackedAreaChart("#stacked-area")
    wordcloud = new WordCloud("#wordcloud")
    wordcloudsent = new WordCloudSentiment("#wordcloudsent")


    tweetList = new TweetList("#tweetList")
    sentimentLineChart = new LineChart("#line-chart")

    timeline = new Timeline("#timeline")
    
    $("#var-select").on("change", function(){
        console.log($("#var-select").val())
        if($("#var-select").val() == "line"){
            document.getElementById("mention-line-chart").style.display = "block";
            document.getElementById("line-chart").style.display = "block";
            document.getElementById("mention-stacked-area").style.display = "none";
            document.getElementById("stacked-area").style.display = "none"

        }
        else if($("#var-select").val() == "stacked"){
            document.getElementById("mention-line-chart").style.display = "none";
            document.getElementById("line-chart").style.display = "none";
            document.getElementById("mention-stacked-area").style.display = "block";
            document.getElementById("stacked-area").style.display = "block"
            
        }
    })
    $("#sentimentworld").click(function(e) {
        e.preventDefault();

        if(document.getElementById("wordcloudsent").style.display == "none"){
            document.getElementById("wordcloudsent").style.display = "block"
            document.getElementById("wordcloud").style.display = "none"


        }
        else{
            document.getElementById("wordcloudsent").style.display = "none"
            document.getElementById("wordcloud").style.display = "block"

        }
    })
    $("#var-select-tweet").on("change", function(){
        $('.tweetlist').empty()
        tweetList.updateData();
    })
    $('#tweetSearch').keyup(function() {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
        test = calls.filter(function(d) {
            var text = d.text.toLowerCase();
            return ~text.indexOf(val);
        })
        $('.tweetlist').empty()
        tweetList.modifiedData();

    });


    document.getElementById("wordcloudsent").style.display = "none"
    document.getElementById("mention-stacked-area").style.display = "none";
    document.getElementById("stacked-area").style.display = "none"
});

function brushed() {
    var selection = d3.event.selection || timeline.x.range();
    var newValues = selection.map(timeline.x.invert)
    console.log(newValues)
    changeDates(newValues)

}

function changeDates(values) {
    calls = allCalls.filter(function(d){
        return ((d.date >= values[0]) && (d.date <= values[1]))
    })
    
    
    console.log(calls)

    $("#dateLabel1").text(formatTime(values[0]))
    $("#dateLabel2").text(formatTime(values[1]))

    mentionLineChart.wrangleData();
    mentionStackedChart.wrangleData();
    donut.wrangleData();
    sourceBar.wrangleData();
    // unitBar.wrangleData();
    // durationBar.wrangleData();
    stackedArea.wrangleData();
    sentimentLineChart.wrangleData();
}

