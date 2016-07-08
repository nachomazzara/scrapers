//Linkedin groups title and link scraper
var linkedinScraper = (function(){

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
    scrapingLoop = setInterval(scrapingLinkedinGroups, milliseconds);
  }
  
  //save groups data on array
  function scrapingLinkedinGroups(){
    var nextElement;
    if($.find(".artdeco.loading").length == 0){
      $("#results li.result").each(function(){
            var title = $(this).find(".title").text()
              .replace(/,/g, "")
              .replace(/(?:\r\n|\r|\n)/g, "");

            var url = "linkedin.com" + $(this).find(".title").attr("href");

            var desc  =  $(this).find(".description-text").text()
              .replace(/,/g, "")
              .replace(/(?:\r\n|\r|\n)/g, "");

            var membersCount =  $(this).find(".demographic dd").text()
              .replace(/,/g, "")
              .replace(/(?:\r\n|\r|\n)/g, "");
            membersCount = parseInt(membersCount.replace("miembros",""));
            groups.push([title,url,desc,membersCount]);
        });
        nextElement = $("#results-pagination").find(".next");
        //End if there are no more pages or reached the limit
        if(nextElement.length > 0  && groups.length < limit){
          nextElement.find(".page-link")[0].click();
        }else{          
          clearInterval(scrapingLoop);
          exportToCsv();
        }
    }
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
    link.setAttribute("download", "linkedin_scraper.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
  }

  return {
      init : init
  }
  
})();

linkedinScraper.init(1000);