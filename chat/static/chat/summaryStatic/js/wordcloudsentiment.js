WordCloudSentiment = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};
WordCloudSentiment.prototype.initVis = function(){
	var vis = this;
	
	//This function split the string in tokenize array, and also replace any unneccessary symbol, special character to ""
    vis.new_arrays = calls.map(function(e) {
      return {
        //Remove symbol,emoji,special character, #xxx, @xxx, http://xxx, yy@xx, yy#xx
        text:e.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace(/([@#][\w_-]*)/g,'').replace(/(\b\w*[#]\w*\b|[#]\w*\b|\b\w*[#])/g,'').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,'').replace(/([\|\\!.,:;?$%^&*'"-]|\n)/g,'').toLowerCase()
        //Split to array and remove empty string ""
        .split(/\s/).filter(function(e){return e}),
        //add sentiment key to the object
        sentiment:e.tweet_sentiment

        }

    });
    //remove empty array
    vis.new_arrays=vis.new_arrays.filter(e => e.text.length)
    var output = [];

    vis.new_arrays.forEach(function(item) {
      var existing = output.filter(function(v, i) {
        return v.sentiment == item.sentiment;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].text = output[existingIndex].text.concat(item.text);
      } else {
        if (typeof item.text == 'string')
          item.text = [item.text];
        output.push(item);
      }
    });

    //initialize freqeuent words
    stopwordss =["0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "A", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "after", "afterwards", "ag", "again", "against", "ah", "ain", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appreciate", "approximately", "ar", "are", "aren", "arent", "arise", "around", "as", "aside", "ask", "asking", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "B", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "been", "before", "beforehand", "beginnings", "behind", "below", "beside", "besides", "best", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "C", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "ci", "cit", "cj", "cl", "clearly", "cm", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "could", "couldn", "couldnt", "course", "cp", "cq", "cr", "cry", "cs", "ct", "cu", "cv", "cx", "cy", "cz", "d", "D", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "dj", "dk", "dl", "do", "does", "doesn", "doing", "dont", "done", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "E", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "F", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "fs", "ft", "fu", "full", "further", "furthermore", "fy", "g", "G", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "H", "h2", "h3", "had", "hadn", "happens", "hardly", "has", "hasn", "hasnt", "have", "haven", "having", "he", "hed", "hello", "help", "hence", "here", "hereafter", "hereby", "herein", "heres", "hereupon", "hes", "hh", "hi", "hid", "hither", "hj", "ho", "hopefully", "how", "howbeit", "however", "hr", "hs", "http", "hu", "hundred", "hy", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "im", "immediately", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "inward", "io", "ip", "iq", "ir", "is", "isn", "it", "itd", "its", "iv", "ix", "iy", "iz", "j", "J", "jj", "jr", "js", "jt", "ju", "just", "k", "K", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "ko", "l", "L", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "M", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "my", "n", "N", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "neither", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "O", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "otherwise", "ou", "ought", "our", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "P", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "pp", "pq", "pr", "predominantly", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "Q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "R", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "S", "s2", "sa", "said", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "seem", "seemed", "seeming", "seems", "seen", "sent", "seven", "several", "sf", "shall", "shan", "shed", "shes", "show", "showed", "shown", "showns", "shows", "si", "side", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somehow", "somethan", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "sz", "t", "T", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "thereof", "therere", "theres", "thereto", "thereupon", "these", "they", "theyd", "theyre", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "U", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "used", "useful", "usefully", "usefulness", "using", "usually", "ut", "v", "V", "va", "various", "vd", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "W", "wa", "was", "wasn", "wasnt", "way", "we", "wed", "welcome", "well", "well-b", "went", "were", "weren", "werent", "what", "whatever", "whats", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "whom", "whomever", "whos", "whose", "why", "wi", "widely", "with", "within", "without", "wo", "won", "wonder", "wont", "would", "wouldn", "wouldnt", "www", "x", "X", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "Y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "your", "youre", "yours", "yr", "ys", "yt", "z", "Z", "zero", "zi", "zz","i", "myself", "ours", "ourselves", "yourself", "yourselves", "him", "his", "himself", "she", "her", "hers", "herself", "itself", "being", "because", "other", "same", "will", "should"]    //Remove frequent words
    
    //Remove frequent words
    neg = []
    pos = []

    for(i=0;i<output[1].text.length;i++) {
        if(!stopwordss.includes(output[1].text[i].toLowerCase())) {
            //valid word is push to new array
            neg.push(output[1].text[i])
        }

    }
    for(i=0;i<output[0].text.length;i++) {
        if(!stopwordss.includes(output[0].text[i].toLowerCase())) {
            //valid word is push to new array
            pos.push(output[0].text[i])
        }
    }
    
    //Handle bug with "" which could not be remove by previous.replace
    for (var y=0; y<neg.length; y++){
        if(neg[y] == "️"){
            neg.splice(y,1)
        }
    }
    //Handle bug with "" which could not be remove by previous.replace
    for (var y=0; y<pos.length; y++){
        if(pos[y] == "️"){
            pos.splice(y,1)
        }
    }
    vis.countWords=neg.length+pos.length


    neg= neg.reduce((total, letter) => {
        total[letter] ? total[letter]++ : total[letter] = 1;
        return total;
      }, {})

    pos= pos.reduce((total, letter) => {
        total[letter] ? total[letter]++ : total[letter] = 1;
        return total;
      }, {})

    //tidy the data for convenient of process further
    neg = Object.keys(neg).map(function(key) {
        return { text: key, size: neg[key] };
    });
    //tidy the data for convenient of process further
    pos = Object.keys(pos).map(function(key) {
        return { text: key, size: pos[key] };
    });


    var result = Object.values([...neg, ...pos].reduce((acc, { text, size }) => {
      acc[text] = { text, size: (acc[text] ? acc[text].size : 0) + size, sentiment: -(acc[text] ? acc[text].size : 0) + size};
      return acc;
    }, {}));
    for (var i = 0; i < result.length; i++) {
        result[i].xla = result[i].sentiment/result[i].size;
        if(result[i].sentiment/result[i].size == 0){
            result[i].sentiment="Neutral"
        }
        else if(result[i].sentiment/result[i].size > 0 && result[i].sentiment/result[i].size <= 0.5){
            result[i].sentiment="Positive"
        }
        else if(result[i].sentiment/result[i].size > 0.5){
            result[i].sentiment="Strongly Positive"
        }
        else if(result[i].sentiment/result[i].size < 0 && result[i].sentiment/result[i].size >= -0.5){
            result[i].sentiment="Negative"
        }
        else if(result[i].sentiment/result[i].size < -0.5 && result[i].sentiment/result[i].size >= -1){
            result[i].sentiment="Strongly Negative"
        }
        else{
            //for debug purpose
            result[i].sentiment = result[i].sentiment/result[i].size;
            console.log("error")
        }
      }

    //Initialize count of unique words
    vis.countUniqueWords = result.length
        

    //try to get dynamic relevant size of WC to filter. Just to make the WC relevance
    relevanceSizeOfWC=Math.ceil(vis.countWords/vis.countUniqueWords)
    //filter the array based on relevant size got above    
    result = result.filter(function(d){return d.size>relevanceSizeOfWC})
            .sort(function(a,b){ return d3.descending(a.size,b.size);})
    console.log(result)
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 1100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var scale = d3.scaleLinear().range([10,95])
    scale.domain([0,d3.max(result,function(d) {return d.size})
      ]);


    const colour = d3.scaleOrdinal()
	    .domain(["Neutral","Positive","Strongly Positive","Negative","Strongly Negative"])
	    .range(["#778899","#00BFFF","#0000CD","#F08080","#B22222"]);

    // append the svg object to the body of the page
    var svg = d3.select(vis.parentElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
      .size([width, height])
      .words(result)
      .padding(1)        //space between words
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font('Impact')
      .fontSize(function(d) { return scale(d.size); })      // font size of words
      .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
      svg
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size ; })
            .style("fill", function(d) {return colour(d.sentiment); })
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });

    }
}