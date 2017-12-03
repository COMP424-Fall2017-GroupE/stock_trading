function getHistoricalData() {
    "use strict";
    let ticker;
    let quote;
    let historyData;
    let quantity;
    let dealSum;
    let apiKey = "38HEIOY4TO9U5D4S";
    let trnumber = 1;
    let {transaction} = {};
    let {portfolio} = {};
    // change when user management is ready
    const userID = 1;
    const spinner = $(".spinner img");
    const chart = $(".chart");

    chart.hide();

    getPortfolio().then(response => {
        displayPortfolio(response).then(response => {
            spinner.hide();
        });
    });

    function getData() {

        // first get a current quote for the item
        ticker = $(".get-data input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
        fetchQuote(ticker).then(response => {
        quote = response;
    },
    error => {
                $(".render-quote").empty().append($quote.html(error));
            });
    }

        // now get the historical data
        ticker = $(".get-data input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchData(ticker).then(response => {
                historyData = response;
                
                $(".render-data").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-data").empty().append($historyData.html(error));
            });
        } else {
            $(".render-data").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }



    function getChartData() {

        // first get a current quote for the item
        ticker = $(".get-data input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
        fetchQuote(ticker).then(response => {
        quote = response;
    },
    error => {
                $(".render-quote").empty().append($quote.html(error));
            });
    }

        // now get the historical data
        ticker = $(".get-chart input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchChartData(ticker).then(response => {
                historyData = response;
                
                $(".render-data").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-data").empty().append($historyData.html(error));
            });
        } else {
            $(".render-data").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }



    function getAxes1Data() {

        // first get a current quote for the item
        ticker = $(".get-data input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
        fetchQuote(ticker).then(response => {
        quote = response;
    },
    error => {
                $(".render-quote").empty().append($quote.html(error));
            });
    }

        // now get the historical data
        ticker = $(".get-axes1 input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchAxes1Data(ticker).then(response => {
                historyData = response;
                
                $(".render-axes1").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-axes1").empty().append($historyData.html(error));
            });
        } else {
            $(".render-axes1").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }


    function getGridData() {

        // first get a current quote for the item
        ticker = $(".get-data input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
        fetchQuote(ticker).then(response => {
        quote = response;
    },
    error => {
                $(".render-quote").empty().append($quote.html(error));
            });
    }

        // now get the historical data
        ticker = $(".get-grid1 input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchGridData(ticker).then(response => {
                historyData = response;
                
                $(".render-grid1").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-grid1").empty().append($historyData.html(error));
            });
        } else {
            $(".render-grid1").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }


           // This is a function to walk through a json object
    function walkAndDraw(obj) {
      var dailySeries = []; // create a new json object to hold the data
      var i = 0;


      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {


//            console.log(key);                                            

           var val = obj[key]; // the objects contents

           var volume = obj[key]["5. volume"]; // the objects volume

           var dateString = key;  // to add the date as a string to the new object

           var newMember = i;  // call each day a member of our daily series

//            console.log(val);
//          dailySeries[newMember] = val; //  add the data with date as key
          dailySeries[newMember] = { key } ; //  add the data with a number as key
          dailySeries[newMember].dateString = key; // add a dateString property and set the value to the date
          dailySeries[newMember].volume = volume; // add a volume property

          i++; // increment the index

        // walk(val);   // recursive call
        }
      }

      console.log(dailySeries);






      // call draw with data

   //   drawBasic(dailySeries)
      drawBasicShapes(dailySeries)







      return dailySeries;

    }




    // divide the volume property by a large number to make the number manageable, otherwise the same as walkAndDraw
    function walkAndDrawAdjustedVolume(obj) {
      var dailySeries = []; // create a new json object to hold the data
      var i = 0;


      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {


//            console.log(key);                                            

           var val = obj[key]; // the objects contents

           var volume = obj[key]["5. volume"]; // the objects volume

           var dateString = key;  // to add the date as a string to the new object

           var newMember = i;  // call each day a member of our daily series

//            console.log(val);
//          dailySeries[newMember] = val; //  add the data with date as key
          dailySeries[newMember] = { key } ; //  add the data with a number as key
          dailySeries[newMember].dateString = key; // add a dateString property and set the value to the date
          dailySeries[newMember].volume = volume; // add a volume property
          dailySeries[newMember].unixDate = new Date(key).getTime() / 1000; // add a unix timestamp

          i++; // increment the index

        // walk(val);   // recursive call
        }
      }

      console.log(dailySeries);






      // call draw with data

   //   drawBasic(dailySeries)
   //   drawBasicShapes(dailySeries)



   //     drawBasicCharts(dailySeries)

        drawBasicGrid(dailySeries)



      return dailySeries;

    }



    // D3 functions


    function drawBasic(dailySeries){

//sample D3 array
var data = dailySeries;

//set title
d3.select('#test-container3').append('h5').text('Basic - add array value to element (with colour)');    
//output array value instead of dummy text
d3.select('#test-container3').selectAll('p').data(data).enter().append('p').text(function(d) { return d.volume; });

 //set title
d3.select('#test-container4').append('h5').text('Basic - add key & value to element');  
//output array value instead of dummy text
d3.select('#test-container4').selectAll('p').data(data).enter().append('p').text(function(d, i) { return 'key = '+ i + ', value = ' + d.volume; });
    
//bind css style to elements
d3.select('#test-container3').selectAll('p').style('color', 'blue');
    
//bind css style to even or numbers from array
d3.select('#test-container3').selectAll('p')
    .data(data)
    .style('color', function(d) {
        if (d.volume % 2 == 0) {
            return 'green';
        } else {
            return 'blue';
        }
    });

    }


    function drawBasicShapes(dailySeries){

//sample D3 array
var data = dailySeries.slice(0, 10);

//set title
d3.select('#test-container').append('h5').text('Basic drawing - add text'); 
//append p element, add some text, and set css class with attr
d3.select('#test-container').append('p').text('genius is 1% inspiration, 99% perspiration').attr('class', 'text');
    
//set title 2
d3.select('#test-container2').append('h5').text('Basic drawing - add circles');
//create svg variable for #test2 - acts as a reference to the svg object
var svg = d3.select('#test-container2').append('svg');
//width and height
var w = 1250;
var h = 300;

//set width and height for svg
svg.attr('width', w).attr('height', h);
//create some test circles from data
var circles = svg.selectAll('circle').data(data).enter().append('circle');

//set positions and sizes for circles
circles.attr('cx', function(d, i) {//in svg, cx is the x position value of the centre of the circle
    return (i * 50) + 25;//i is the numeric index value from the data loop
}).attr('cy', h/2)//cy is the y position value in the centre of the circle
   .attr('r', function (d) {//r is the radius of the circle
        return d.volume/1000000;
    });

//add some colour to the circles...
circles.attr('fill', 'navy')
        .attr('stroke', 'pink')
        .attr('stroke-width', function (d) {
            d.volume = d.volume/1000000
            return d.volume/2;
        });
        
//set title 3
d3.select('#test-container3').append('h5').text('Basic drawing - add rectangles');
//create svg variable for #test2 - acts as a reference to the svg object
var svg2 = d3.select('#test-container3').append('svg');
//width and height
var w = 1250;
var h = 300;

//set width and height for svg
svg2.attr('width', w).attr('height', h);
//create some test rectangles from data
var rects = svg2.selectAll('rect').data(data).enter().append('rect');

//set positions and sizes for rectangles
rects.attr('x', function(d, i) {
        return (i * 50) + 35;
        })
        .attr ('y',  h/2)
        .attr('width', 20
        
        )
        .attr('height', 40
        
        );

//add some colour to the circles...
rects.attr('fill', 'navy')
        .attr('stroke', 'pink')
        .attr('stroke-width', function (d) {
            return d.volume/3;
        });




    }


    function drawBasicCharts(dailySeries){




//sample D3 array
dailySeries.reverse();

var dataset = dailySeries.slice(70, 99);








//specify width and height
var w = 960;
var h = 200;



//define scales
var scaleX = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.volume; })])
    .range([0, w]);//set output range from 0 to width of svg
var scaleY = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.dateString; })])
    .range([0, h]);//set output range from 0 to height of svg



//add option for padding within the barchart
var padding = 3;    
    
/**
 * build a bar chart - 1
 */ 
//set title
d3.select('#test-container').append('h5').text('Bar chart 1 - no correction');
//create svg and add to the DOM
var svg = d3.select('#test-container').append('svg').attr('width', w).attr('height', h);
    
svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', 0)
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume; //outputs bars from upper left corner (they grow down, not up) due to svg upper-left corner for x and y - origin is top left
    });

/**
 * build a bar chart - 2 (use existing width, height, padding, dataset...)
 */
 //set title
d3.select('#test-container2').append('h5').text('Bar chart 2 - correction');
//create svg2 and add to the DOM
var svg2 = d3.select('#test-container2').append('svg').attr('width', w).attr('height', h);
    
    svg2.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
            return i * (w / dataset.length); //works well for basic charts but D3 scales are better
        })
        .attr('y', function (d) {
            return h - d.volume;//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
        })
        .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
        .attr('height', function (d) {
            return d.volume;
        });

/**
 * build a bar chart with colour - 3 (use existing width, height, padding, dataset...)
 */
 //set title
d3.select('#test-container3').append('h5').text('Bar chart 3 - colours');   
//create svg3 and add to the DOM
var svg3 = d3.select('#test-container3').append('svg').attr('width', w).attr('height', h);
    
svg3.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', function (d) {
        return h - d.volume;//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
    })
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume;
    })
    .attr('fill', function (d) {
        return 'rgb(0, 0, ' + (d.volume * 5) + ')';//colour is set relative to data per bar
    });
    
/**
 * build a bar chart with labels - 4 (use existing width, height, padding, dataset...)
 */
 //set title
d3.select('#test-container4').append('h5').text('Bar chart 4 - values');        
//create svg4 and add to the DOM
var svg4 = d3.select('#test-container4').append('svg').attr('width', w).attr('height', h);
    
svg4.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', function (d) {
        return h - d.volume;//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
    })
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume;
    })
    .attr('fill', function (d) {
    return 'rgb(0, 0, ' + (d.volume * 5) + ')';//colour is set relative to data per bar
    });
        
    //add text to bar chart
    svg4.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text( function(d) {
            return d.volume;
        })
        .attr('x', function(d, i) {
            return i * (w / dataset.length) + ((w / dataset.length) / 2) - 6; //set posn of text tp centred in bar... -6 for font-size / 2
        })
        .attr('y', function(d, i) {
            return h - (d.volume) - 5;//set labels to the top of the bars with some taken off (-5) to move above bar itself
        })
        .attr('font-family', 'serif')
        .attr('font-size', '12px')
        .attr('fill', 'navy'); 

    }




function drawBasicAxes(dailySeries){


/**
 * build a scatterplot - adding axes
 */

//sample D3 dataset
var dataset = [
    [110, 25], [182, 105], [23, 59], [70, 105], [14, 95], [140, 72], [63, 35], [122, 132], [260, 13], [21, 139], [222, 27]
];

//specify width and height
var w = 600;
var h = 600;

//define scales
var scaleX = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d[0]; })])
    .range([0, w]);//set output range from 0 to width of svg
var scaleY = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
    .range([0, h]);//set output range from 0 to height of svg
    
//create svg and add to the DOM
var svg = d3.select('#test-container').append('svg').attr('width', w+70).attr('height', h+50).attr('class', 'svg-axes1');
    
//add simple circles to the svg for our scatterplot
svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
        return scaleX(d[0]);
    })
    .attr('cy', function(d) {
        return scaleY(d[1]);
    })
    .attr('r', function(d) {
        return Math.sqrt(d[1]);
    }
    )
    .attr('fill', function (d) {
    return 'rgb(125,' + (d[1]) + ', ' + (d[1] * 2) + ')';//colour is set relative to data per circle
    });

//add labels for each circle
svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d) {
        return d[0] + ', ' + d[1];//set each data point on the text label
    })
    .attr('x', function(d) {
        return scaleX(d[0])+(Math.sqrt(d[1]));//modify label x position to match new scale values
    })  
    .attr('y', function(d) {
        return scaleY(d[1]);//modify label y position to match new scale values
    })
    .attr('font-family', 'serif')
    .attr('font-size', '11px')
    .attr('fill', 'navy');
        
//define x axis for scatterplot
    var xAxis = d3.svg.axis()
        .scale(scaleX)
        .orient("bottom");
//call function to create the x axis & add styling attributes
svg.append("g")
        .attr("class", "axis")
        .call(xAxis);//in svg terms, 'g' elements can be used to contain (or 'group') other elements
        

//define y axis for scatterplot
    var yAxis = d3.svg.axis()
        .scale(scaleY)
        .orient("right");
//call function to create the y axis & add styling attributes
svg.append("g")
        .attr("class", "axis")
        .call(yAxis);//in svg terms, 'g' elements can be used to contain (or 'group') other elements

    }





function drawBasicGrid(dailySeries){






//an example of 7 days from our daily series
var week1 = dailySeries.slice(0, 7);


//a sample of the first year of our daily series
var year1 = dailySeries.slice(0, 364);




    function renderYearInWeeks(dataArray){
        var counter = 0; 
        var weeksArray = [];
        var testD3Array = [];

        dataArray.forEach(function(d, i) {
        
        
        
        
     //   console.log(d.volume + "  " + d.dateString + "  " + d.unixDate + "   " + counter);
      


        
        weeksArray.push(d);
        counter++;
        // every 7 days
        if(counter % 7 === 0 && counter <= 364){

      //      console.log("time for a new array");
            var currentWeek = renderWeeklyArray(weeksArray);
            var computedWeeklyVolume = weeklyVolumeSum(weeksArray);
            var unixDateInt = weeksArray[0].unixDate;
            // reset array after saving variables to set up for next week
            weeksArray.length = 0;



            // add them to our new object
            var testObject = { };
                testObject['days'] = currentWeek;
                testObject['total'] = computedWeeklyVolume;
                testObject['week'] = unixDateInt;


        //    console.log(testObject);
            testD3Array.push(testObject);
        }
        



        //    console.log(testD3Array);

        });

            return testD3Array;
    }


/*
// create variables to hold the result of our data functions
var week1VolumeArray = renderWeeklyArray(week1);
var week1VolumeTotal = weeklyVolumeSum(week1);
var week1Stamp = week1[0].unixDate;


// add them to our new object
var testObject = { };
    testObject['days'] = week1VolumeArray;
    testObject['total'] = week1VolumeTotal;
    testObject['week'] = week1Stamp;



console.log(testObject);


var week2 = dailySeries.slice(7, 14);
// create variables to hold the result of our data functions
var week2VolumeArray = renderWeeklyArray(week2);
var week2VolumeTotal = weeklyVolumeSum(week2);
var week2Stamp = week2[0].unixDate;

// add them to our new object
var testObject2 = { };
    testObject2['days'] = week2VolumeArray;
    testObject2['total'] = week2VolumeTotal;
    testObject2['week'] = week2Stamp;


console.log(testObject2);

var week3 = dailySeries.slice(14, 21);


// create variables to hold the result of our data functions
var week3VolumeArray = renderWeeklyArray(week3);
var week3VolumeTotal = weeklyVolumeSum(week3);
var week3Stamp = week3[0].unixDate;


// add them to our new object
var testObject3 = { };
    testObject3['days'] = week3VolumeArray;
    testObject3['total'] = week3VolumeTotal;
    testObject3['week'] = week3Stamp;


console.log(testObject3);

 */




// renderYearInWeeks(year1);



// var week4 = dailySeries.slice(72, 78);


// var week5 = dailySeries.slice(65, 71);


// var jsonTestObject = [];


// jsonTestObject.push(testObject);
// jsonTestObject.push(testObject2);
// jsonTestObject.push(testObject3);

// console.log(jsonTestObject);


//a function to change 7 days of data into an array of volume

    function renderWeeklyArray(dataArray){
    
    
    
    
    //sum daily values for volume total
    //  function weeklyVolume (dataArray, i) {
    //      var weeklyVolume = d3.sum(dataArray[i].days);
    //      console.log(weeklyVolume);
    //      return weeklyVolume;
    //  }
    
    
    //for(var i = 0; i < 6; i++){
    // weeklyVolume(week1, i);
    // }
    

    
    var daysVolumeArray = []; // array to hold the values of daily volume
    
    
        // iterate through every item in the dataArray
        dataArray.forEach(function(d, i) {
        
               
        
      //   console.log(d.volume + "  " + d.dateString + "  " + d.unixDate);

        // add value of volume to the array

        var volume = parseInt(d.volume, 10); //volume as an integer to add to our array


          daysVolumeArray.push((volume)); 
        
        
        });

    
    
       //     console.log(daysVolumeArray);
            return daysVolumeArray;
    

    }


//a function to add the items in an arry 
    function weeklyVolumeSum(dataArray){



        var totalVolume = 0;

        dataArray.forEach(function(d, i) {

            totalVolume += parseInt(d.volume, 10);

        });

    //    console.log(totalVolume);
        return totalVolume;

        }

















/**
 * commit totals - monthly and cumulative bar chart
 **/

//test data from github
var json_obj = [{"days":[6,18,11,5,12,2,10],"total":64,"week":1400371200},{"days":[7,6,9,9,11,2,2],"total":46,"week":1400976000},{"days":[3,5,4,2,9,17,15],"total":55,"week":1401580800},{"days":[9,11,9,11,10,1,10],"total":61,"week":1402185600},{"days":[10,20,10,3,8,7,6],"total":64,"week":1402790400},{"days":[4,13,5,6,6,2,1],"total":37,"week":1403395200},{"days":[2,10,8,8,2,4,10],"total":44,"week":1404000000},{"days":[3,6,4,5,8,6,5],"total":37,"week":1404604800},{"days":[10,10,7,9,1,0,0],"total":37,"week":1405209600},{"days":[0,9,4,5,11,12,17],"total":58,"week":1405814400},{"days":[8,5,16,6,3,6,8],"total":52,"week":1406419200},{"days":[9,12,5,1,11,9,4],"total":51,"week":1407024000},{"days":[4,7,8,11,11,10,2],"total":53,"week":1407628800},{"days":[2,9,16,6,7,8,10],"total":58,"week":1408233600},{"days":[3,3,14,10,6,11,4],"total":51,"week":1408838400},{"days":[3,3,9,2,8,18,12],"total":55,"week":1409443200},{"days":[4,14,7,10,2,8,3],"total":48,"week":1410048000},{"days":[3,4,8,10,6,7,4],"total":42,"week":1410652800},{"days":[10,5,9,12,4,5,6],"total":51,"week":1411257600},{"days":[1,8,3,1,5,1,10],"total":29,"week":1411862400},{"days":[2,5,6,8,9,5,8],"total":43,"week":1412467200},{"days":[3,4,8,12,4,6,5],"total":42,"week":1413072000},{"days":[10,8,7,9,7,7,2],"total":50,"week":1413676800},{"days":[1,10,5,4,13,11,1],"total":45,"week":1414281600},{"days":[0,10,8,9,3,2,1],"total":33,"week":1414886400},{"days":[4,10,10,10,10,3,40],"total":87,"week":1415491200},{"days":[11,17,21,14,13,11,16],"total":103,"week":1416096000},{"days":[5,13,12,7,12,9,13],"total":71,"week":1416700800},{"days":[3,13,8,11,11,7,11],"total":64,"week":1417305600},{"days":[3,6,6,0,10,3,8],"total":36,"week":1417910400},{"days":[11,10,3,12,6,7,3],"total":52,"week":1418515200},{"days":[5,3,14,11,2,16,9],"total":60,"week":1419120000},{"days":[3,9,10,8,8,12,14],"total":64,"week":1419724800},{"days":[1,8,8,6,10,12,16],"total":61,"week":1420329600},{"days":[10,12,10,8,7,12,32],"total":91,"week":1420934400},{"days":[22,10,6,4,3,6,1],"total":52,"week":1421539200},{"days":[3,7,9,8,8,11,2],"total":48,"week":1422144000},{"days":[4,2,13,9,12,10,9],"total":59,"week":1422748800},{"days":[9,15,15,12,11,6,15],"total":83,"week":1423353600},{"days":[7,17,7,7,5,9,16],"total":68,"week":1423958400},{"days":[16,7,4,7,4,6,5],"total":49,"week":1424563200},{"days":[1,5,6,10,9,4,12],"total":47,"week":1425168000},{"days":[8,8,7,7,11,8,1],"total":50,"week":1425772800},{"days":[5,8,9,6,3,11,8],"total":50,"week":1426377600},{"days":[15,2,2,2,6,4,8],"total":39,"week":1426982400},{"days":[1,6,8,19,9,5,7],"total":55,"week":1427587200},{"days":[1,4,4,6,4,0,3],"total":22,"week":1428192000},{"days":[0,14,12,2,5,3,3],"total":39,"week":1428796800},{"days":[5,8,5,2,3,15,4],"total":42,"week":1429401600},{"days":[1,6,4,5,5,4,6],"total":31,"week":1430006400},{"days":[3,3,5,3,5,4,7],"total":30,"week":1430611200},{"days":[0,3,1,8,1,1,0],"total":14,"week":1431216000}];
// console.log(json_obj);
// console.log(jsonTestObject);



// call the render year in weeks on the first year of data
var thisYearsData = renderYearInWeeks(year1);

var data = thisYearsData;

//sum daily values for weekly total
function weeklySum (dataArray, i) {
    var weeklySum = d3.sum(dataArray[i].days);
    return weeklySum;
}

//sum weekly values for yearly total
 function yearSum (dataArray) {
    var yTotal = [];

    dataArray.forEach(function(d, i) {
        yTotal.push(d.total);
    });

    var sumYear = d3.sum(yTotal);
    return sumYear;
} 

//get months from weeks & add weekly totals
function monthNos (dataArray) {
var repoMonths = [];
var weekMonths = [];

dataArray.forEach(function(d, i) {
    //week as unix time
    var week = d.week;
    var weekTotal = d.total;
    //convert unix time for js
    var date = new Date(week*1000);
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
//extract month no. from date
var monthNo = month[date.getMonth()];
    
var obj = {};   
    obj['month'] = monthNo;
    obj['weekTotal'] = weekTotal;
    weekMonths.push(obj);   
});

return weekMonths;
}

//sum all totals to get year total...
 var yearlyTotal = yearSum(data);
//create objects with month and weekly totals...
 var monthNum = monthNos(data);
    
//create nest, get length per leaf, and sum leafs to get total per month...
var nest = d3.nest()
    .key(function (d, i) { return d.month; })
    .rollup(function(leaves) { 
    return {
    "length": leaves.length, "month_total": d3.sum(leaves, function(d) {return parseFloat(d.weekTotal);})
    } 
    })
    .entries(monthNum);
    
var monthlyTotals = [];
var cMonthlyTotals = [];
    
nest.forEach(function(d, i) {
    //console.log(d.values['month_total'], i);
    monthlyTotals.push(d.values['month_total']);
    var cTotal = d3.sum(monthlyTotals);
    cMonthlyTotals.push(cTotal);
    });

//set custom axis labels for months...
function setMonths() {

var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        
d3.selectAll('svg g.axes g.x g.tick text').each(function(d,i) { }).text( function (d,i) {return month[i]});

} 

//output text labels
function outputText(text, container) {
    d3.select(container + " p").remove();
    d3.select(container).append("p").text(text); 
}

/**
Building the chart...
*/

//start of build lineChart
function lineChart() { // <-1A
    var _chart = {};
    var _width = 800, _height = 800, // <-1B
            _margins = {top: 220, left: 120, right: 120, bottom: 120},
            _x, _y,
            _data = [],
            _colors = d3.scale.category20(),
            _svg,
            _bodyG,
            _line;
            
    _chart.render = function () { // <-2A
        if (!_svg) {
            _svg = d3.select("#test-container").append("svg") // <-2B
                    .attr("height", _height)
                    .attr("width", _width);
            renderAxes(_svg);
            defineBodyClip(_svg);
        }
        renderBody(_svg);
    };
    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");
        renderXAxis(axesG);
        renderYAxis(axesG);
    }
    
    function renderXAxis(axesG){
        var xAxis = d3.svg.axis()
                .scale(_x.range([0, quadrantWidth()]))
                .orient("bottom");        
        axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);
                
        d3.selectAll("g.x g.tick")
            .append("line")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", - quadrantHeight());
    }
    
    function renderYAxis(axesG){
        var yAxis = d3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient("left");
                
        axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);
                
         d3.selectAll("g.y g.tick")
            .append("line")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", quadrantWidth())
                .attr("y2", 0);
    }
    function defineBodyClip(svg) { // <-2C
        var padding = 100;
        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }
    function renderBody(svg) { // <-2D
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                        + xStart() + "," 
                        + yEnd() + ")") // <-2E
                    .attr("clip-path", "url(#body-clip)");        
       renderLines();
     //  renderDots();
       renderScatter();
    }
    function renderLines() {
        _line = d3.svg.line() //<-4A
                        .x(function (d) { return _x(d.x); })
                        .y(function (d) { return _y(d.y); });
                        
        _bodyG.selectAll("path.line")
                    .data(_data)
                .enter() //<-4B
                .append("path")                
                .style("stroke", function (d, i) { 
                    return _colors(i); //<-4C
                })
                .attr("class", "line");
        _bodyG.selectAll("path.line")
                .data(_data)
                .transition() //<-4D
                .attr("d", function (d) { return _line(d); });
    }
    function renderDots() {
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i) //<-4E
                        .data(list)
                    .enter()
                    .append("circle")
                    .attr("class", "dot _" + i);
            _bodyG.selectAll("circle._" + i)
                    .data(list)                    
                    .style("stroke", function (d) { 
                        return _colors(i); //<-4F
                    })
                    .transition() //<-4G
                    .attr("cx", function (d) { return _x(d.x); })
                    .attr("cy", function (d) { return _y(d.y); })
                    .attr("r", 2.5);
        });
    }
    
    function renderScatter() {
    
    //add simple circles to the svg for our scatterplot
    _data.forEach(function (list, i) {
    _bodyG.selectAll('circle._' + i)
        .data(list)
        .enter()
        .append('circle')
        .attr("class", "dot _" + i);
            _bodyG.selectAll("circle._" + i)
                    .data(list)                    
                    .style("stroke", function (d) { 
                        return _colors(i); //<-4F
                    })
                    .transition() //<-4G
                    .attr("cx", function (d) { return _x(d.x); })
                    .attr("cy", function (d) { return _y(d.y); })
                    .attr("r", function (d) { return (Math.sqrt(d.y)/1.5)/400; }); //divide by 200 to make numbers
    });
    
    }
    
    function xStart() {
        return _margins.left;
    }
    function yStart() {
        return _height - _margins.bottom;
    }
    function xEnd() {
        return _width - _margins.right;
    }
    function yEnd() {
        return _margins.top;
    }
    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }
    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }
    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };
    _chart.height = function (h) { // <-1C
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };
    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };
    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };
    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };
    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };
    _chart.addSeries = function (series) { // <-1D
        _data.push(series);
        return _chart;
    };
    return _chart; // <-1E
}

function randomData() {
    return Math.random() * 9;
}
function update(gitData) {
    for (var i = 0; i < data.length; ++i) {
        var series = data[i];
        series.length = 0;
        for (var j = 0; j < numberOfDataPoint; ++j)
            series.push({x: j, y: gitData[j]});
    }
    chart.render();
}

var numberOfSeries = 1,
    numberOfDataPoint = 12,
    data = [];

function buildChart(chartData) {

var numberOfSeries = 1,
    numberOfDataPoint = 12,
    data = [];

for (var i = 0; i < numberOfSeries; ++i)
    data.push(d3.range(numberOfDataPoint).map(function (i) {
    // console.log(monthlyTotals[i]);
        return {x: i, y: chartData[i]};
    }));
    
var maxHeight = Math.max.apply(Math, chartData); 

//console.log(maxHeight);
    
var chart = lineChart()
        .x(d3.scale.linear().domain([0, 11]))
        .y(d3.scale.linear().domain([0, maxHeight+50]));
        
data.forEach(function (series) {
console.log(series);
    chart.addSeries(series);
});

chart.render();
}

function outputText(text) {
    d3.select("#output_label p").remove();
    d3.select("#output_label").append("p").text(text); 
}

function setMonths() {

var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        
d3.selectAll('svg g.axes g.x g.tick text').each(function(d,i) { }).text( function (d,i) {return month[i]});

} 

buildChart(monthlyTotals);
setMonths();














}






    function fetchQuote(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary quote
                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let quote = Number(json["Time Series (60min)"][key]["4. close"]);
                        spinner.hide();
                        resolve(quote.toFixed(2));
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }


    function fetchData(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                        let dailyQuote = json["Time Series (Daily)"][date];
                        walkAndDraw(json["Time Series (Daily)"]); 




                        spinner.hide();
                        resolve();
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }


    function fetchChartData(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                        let dailyQuote = json["Time Series (Daily)"][date];
                        walkAndDrawAdjustedVolume(json["Time Series (Daily)"]); 




                        spinner.hide();
                        resolve();
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }



    function fetchAxes1Data(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                        let dailyQuote = json["Time Series (Daily)"][date];
                          drawBasicAxes();
                      //  walkAndDrawAdjustedVolume(json["Time Series (Daily)"]); 




                        spinner.hide();
                        resolve();
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }




    function fetchGridData(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=full&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                        let dailyQuote = json["Time Series (Daily)"][date];
                        walkAndDrawAdjustedVolume(json["Time Series (Daily)"]); 
                      //  drawBasicGrid();



                        spinner.hide();
                        resolve();
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }





    // helper function to fetch user's portfolio from the database
    function getPortfolio() {
        spinner.show();
        return new Promise((resolve, reject) => {
            $.getJSON("portfolio.json")
                .done(function (json) {
                    spinner.hide();
                    resolve(json);
                })
                .fail(function () {
                    spinner.hide();
                    reject(alert(`Failed to fetch user's portfolio`));
                });
        });
    }

    // display user's portfolio
    function displayPortfolio(portfolio) {
        return new Promise((resolve, reject) => {
            $("#portfolio tbody").empty();

            let $tr = $("<tr>");
            let $td = [];
            $td.push($("<td>").html("Money"));
            $td.push($("<td>").html(portfolio.Money.toFixed(2)));
            $td.push($("<td>").html("-"));
            $td.push($("<td>").html(portfolio.Money.toFixed(2)));
            $td.forEach(function (item) {
                $tr.append(item);
            });

            $("#portfolio tbody").append($tr);

            portfolio.Stocks.forEach(function (item, i) {
                if (item.Quantity > 0) {
                    fetchQuote(item.Ticker).then(response => {
                        $tr = $("<tr>");
                        $td = [];
                        $td.push($("<td>").html(item.Ticker));
                        $td.push($("<td>").html(item.Quantity));
                        $td.push($("<td>").html(response));
                        $td.push($("<td>").html((item.Quantity * response).toFixed(2)));
                        $td.forEach(function (item) {
                            $tr.append(item);
                        });
                        $("#portfolio tbody").append($tr);
                    }, error => {
                        reject(error);
                    });
                } else {
                    return;
                }
            });
            resolve();
        });
    }


    //handle user events
        $(".get-data button").on("click", function (e) {
        getData();
    });

    $(".get-data input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getData();
        }
    });

        $(".get-chart button").on("click", function (e) {
        getChartData();
    });

    $(".get-chart input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getChartData();
        }
    });


        $(".get-axes1 button").on("click", function (e) {
        getAxes1Data();
    });

    $(".get-axes1 input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getAxes1Data();
        }
    });


        $(".get-grid1 button").on("click", function (e) {
        getGridData();
    });

    $(".get-grid1 input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getGridData();
        }
    });


}

$(document).ready(getHistoricalData);
