//Linkedin groups title and link scraper
var facebookScraper = (function(){

  //default limit of groups to scrape
  var limit = 100;

  var groups = [];

  var scrapingLoop;

  //initialize Loop
  function init(milliseconds,limitGroups){
    if(milliseconds === undefined || milliseconds !== parseInt(milliseconds, 10)){
      console.log("An int for milliseconds is required");
      return;
    }
    limit = limitGroups ? limitGroups : limit;
    scrapingLoop = setInterval(loadAllResults, milliseconds);
  }

  function loadAllResults(){
    results = document.querySelectorAll("div._3u1._gli._5und[data-bt]");
    //Stop loading if results is greather than the groups requiered or there are no more 
    // data to load browse_end_of_results_footer
    if(results.length >= limit || 
        document.getElementById("browse_end_of_results_footer") !== null){
      scrapingFacebookGroups();
      clearInterval(scrapingLoop);
      exportToCsv();
    }else{
      window.scrollTo(0,document.body.scrollHeight);
    }
  }
  
  //save groups data on array
  function scrapingFacebookGroups(){
    window.scrollTo(0,document.body.scrollHeight);
    for(let result of results){
      var title = result.querySelector("._gll a").innerText
              .replace(/,/g, "")
              .replace(/(?:\r\n|\r|\n)/g, "");
      var url = "facebook.com" + result.querySelector("._gll a").getAttribute("href");

     var desc  =  result.querySelectorAll("._ajw")[0] ?  result.querySelectorAll("._ajw")[0].innerText
        .replace(/,/g, "")
        .replace(/(?:\r\n|\r|\n)/g, "") : "N/A";

      var membersCount = result.querySelectorAll("._ajw")[1] ?  result.querySelectorAll("._ajw")[1].innerText
        .replace(/,/g, "")
        .replace(/(?:\r\n|\r|\n)/g, "") : "N/A";

      //Hack for no description groups
      if(result.querySelectorAll("._ajw")[1] === undefined){
        membersCount = desc;
        desc = "N/A";
      }

      groups.push([title,url,desc,membersCount]);
    }
    console.log(groups);
  }
  
  //Createa .csv format with groups
  function exportToCsv(){
    var lineArray = [];
    groups.forEach(function (infoArray, index) {
        var line = infoArray.join(",");
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "facebook_scraper.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
  }

  return {
      init : init
  }
  
})();

facebookScraper.init(1000);