

function BarChart(dataFile ,{
    x = (d, i) => i,
    y = d => d,
    bartype = d => d,
    marginTop = 50,
    marginRight = 0,
    marginBottom = 30,
    marginLeft = 400,
    width = 1540,
    height = 600,
    xDomain,
    xRange = [marginLeft, width - marginRight],
    yType = d3.scaleLinear,
    yDomain,
    xPadding = 0.1,
    yRange = [height - marginBottom, marginTop], 
    yFormat,
    yLabel,
    duration: initialDuration = 250,
    delay: initialDelay = (_, i) => i * 20
    



} = {}) {
    
    const keys = [ "IRC", "SL", "SM"];
     // Compute values.
     let data =  dataFile.filter(d => keys.includes(d.Type))
    

    
        
    
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Typearr = d3.map(data, bartype);
    
    // Compute default domains, and unique the x-domain.
    const maxim = d3.max(Y)
    const maxround = Math.round(maxim)
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, maxround];
    xDomain = new d3.InternSet(xDomain);
    console.log(d3.max(Y))
    
    
    

    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    const legendData = {  "IRC": "green", "SL": "yellow", "SM": "blue" }

    const myColor = d3.scaleOrdinal().domain(keys).range([ "green", "yellow", "blue"]);


    // Compute the x-scale.


    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding)
    const yScale = yType(yDomain, yRange)
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
    const yAxis = d3.axisLeft(yScale).ticks(height / d3.max(Y))
    const format = yScale.tickFormat(50);
    

    
    
  
    



    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    
    const yGroup = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").call(grid))
        .call(g => g.append("text")
            .attr("x", marginLeft-400)
            .attr("y", 1)
            .attr("text-anchor", "start")
            .text(yLabel)
    )

    let rect = svg.append("g")
    .selectAll("rect")
    .data(I)
    .join("rect")
        .property("key", i => X[i])
        .call(position, i => xScale(X[i]), i => yScale(Y[i]))
        .style("mix-blend-mode", "multiply")
        .style("fill",  i => myColor(Typearr[i]))
        .call(rect => rect.append("title").text(i => [X[i], format(Y[i])].join("\n")))
    
    
    const xGroup = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
    
    function position(rect, x, y) {
        return rect
            .attr("x", x)
            .attr("y", y)
            .attr("width", xScale.bandwidth())
            .attr("height", typeof y === "function" ? i => yScale(0) - y(i) : i => yScale(0) - y)
            
    }


    function grid(tick) { 
        return tick.append("line")
            .attr("class", "grid")
            .attr("x2", width - marginLeft- marginRight)
            .attr("stroke", "#ccc")
            .attr("stroke-opacity", 0.1)
        

    }
    

    var legendItemSize = 12;
        var legendSpacing = 4;
  var xOffset = 150;
  var yOffset = 100;
        var legend = d3
   .select('#legend')
   .append('svg')
            .selectAll('.legendItem')
            .data(keys);
    legend
    .enter()
    .append('rect')
    .attr('class', 'legendItem')
    .attr('width', legendItemSize)
        .attr('height', legendItemSize)
        // add label text
        
        .attr("fill", function (d) { return legendData[d]; })
        
    .attr('transform',
    (d, i) => {
        var x = xOffset;
        var y = yOffset + (legendItemSize + legendSpacing) * i;
        return `translate(${x}, ${y})`;
        });
    
    
    
    legend
    .enter()
        .append('text')
        
    .attr('x', xOffset + legendItemSize + 5)
.attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
.text(function (d) { return d; });

    




    

    

    
 

    
    


    
    
















    return Object.assign(svg.node(), {
        update(data, {
            xDomain,
            yDomain,
            duration = initialDuration,
            delay = initialDelay
        } = {}) {
            const X = d3.map(data, x)
            const Y = d3.map(data, y)
            const Typearr = d3.map(data, bartype)

            


            // Compute the domains.
            const maxim = d3.max(Y)
            const maxround = Math.round(maxim)
            if (xDomain === undefined) xDomain = X;
            if (yDomain === undefined) yDomain = [0, maxround];
            xDomain = new d3.InternSet(xDomain);


            // Omit any data not present in the x-domain.
            const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

            xScale.domain(xDomain);
            yScale.domain(yDomain);


            const t = svg.transition().duration(duration);

            rect = rect
                .data(I, function (i) { return this.tagname === "rect" ? this.key : x[i] })
                .join(
                    enter => enter.append("rect")
                        .property("key", i => Typearr[i])
                        .call(position, i => xScale(X[i]), i => yScale(Y[i]))
                        .style("mix-blend-mode", "multiply")
                        .attr("fill", function (d, i) { 
                            return myColor(Typearr[i])
                        })        
                        .call(enter => enter.append("title")),
                    update => update,
                    exit => exit.transition(t)
                        .delay(delay)
                        .attr("y", yScale(0))
                        .attr("height", 0)

                        .remove()
                
            
            )
            rect.select("title").text(i => [X[i], format(Y[i])].join("\n"))
            rect.style("fill", function (d, i) { 
                return myColor(Typearr[i])
            })

            // plut bars with the same color together
            
                
             
            rect.transition(t)
                .delay(delay)
                .call(position, i => xScale(X[i]), i => yScale(Y[i]))
                .style("mix-blend-mode", "multiply")
            xGroup.transition(t)
                .call(xAxis)
                .call(g => g.selectAll(".tick").delay(delay))
            yGroup.transition(t)
                .call(yAxis)
                .selection()
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick").selectAll(".grid").data([,]).join(grid));
                
                
                                                                    
        }
     


    }
    
    
    
    
    
    )  

}





