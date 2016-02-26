window.onload = start;

function start() {

    var graph = document.getElementById('graph');
    var department_filter = document.getElementById('department');
    var gpa_filter = document.getElementById('GPA_filter');

    var width = 1300;
    var height = 600;
    //var department_selected;
    var GPA_selected; 
    var options; 

    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var dropDown = d3.select(department_filter)
        .append("select")
        .attr("name", "department-list"); 

    d3.select(gpa_filter).on("input", function() {
        GPA_selected = this.value;                       
    });

    var bars = svg.append('g');

    var xScale = d3.scale.linear().range([0, width-600]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height - 30], 0.3);

    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom'); 

    d3.select(graph)
        .append('p')
        .append('button')
        .text('Filter Data')
        .on('click', function() {    
            bars.selectAll('.bar')
                .filter(function(d) {
                    return (d.GPA >= GPA_selected && d.Department == department_selected);
                })
                .transition()
                .duration(function(d) {
                    return Math.random()*3000;
                })
                .delay(function(d) {
                    return d["GPA"] * 500;
                })
                .style('fill', 'Chartreuse')
                .attr('width', function(d) {
                    return xScale(d.GPA);
                });
            bars.selectAll('.bar')
                .filter(function(d){
                    return (d.GPA < GPA_selected) || (department_selected != d.Department);
                })
                .transition()
                .duration(function(d) {
                    return Math.random()*3000;
                })
                .delay(function(d) {
                    return d["GPA"] * 500;
                })
                .style('fill', 'CadetBlue')
                .attr('width', 0);
        });

    d3.csv('Courses.csv', function(d) {
        d["Course"] = d["Department"] + d["Course Number"];
        d["GPA"] = +d["GPA"];
        return d;
    }, function(error, data) {

        data = data.filter(function(d) {
            if (d["GPA"] <=0){
                return false;
            }
            d["GPA"] = +d["GPA"];
            return true; 
        });

        xScale.domain([0, d3.max(data, function(d) {
            return d.GPA;
        })]);

        yScale.domain(data.map(function(d) {
            return d["Department"] + d["Course Number"];
        }));



        var gpaByDepartment = d3.nest()
            .key(function (d) {return d.Department;})
            .entries(data) 

        options = dropDown.selectAll("option")
            .data(gpaByDepartment)
          .enter()
            .append("option");

        options.text(function (d) {return d.key; })
            .attr("value", function (d) {return d.key; });

        bars.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(100, 0)')
            .call(yAxis);

        bars.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(100,' + (height - 35) +')')
            .call(xAxis);

        bars.append('g')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 110)
            .attr('y', function(d) {
                return yScale(d["Department"] + d["Course Number"]);
            })
            .attr('width', function(d) {
                return xScale(d.GPA);
            })
            .attr('height', function(d) {
                return yScale.rangeBand();
            })
            .style("fill", function(d){
                return "Chartreuse";
            });

        dropDown.on("change", function(){
            //var selected = this.value;
            department_selected = this.value;
            //displayOthers = this.checked ? "inline" : "none";
            //display = this.checked ? "none" : "inline"; 

            //bars.selectAll('.bar')
                //.filter(function(d) {return department_selected != d.Department;})
                //.attr("display", displayOthers); 

            //bars.selectAll('.bar')
                //.filter(function(d) {return department_selected == d.Department;})
                //.attr("display", display);
        });

    });
}

