import React from "react";
import * as d3 from "d3";
import "../style/default.css"
export default class ResidualBox extends React.Component{
  
    componentDidMount() {
        //console.log("caseResidualBox", this.props);
    }

    componentWillUpdate(nextProps, nextState, nextContext) {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        this.drawChart();
    }

    drawResidual(resid, colors) {
        // transform data
        var margin = {top: 20, right: 120, bottom: 60, left: 120},
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(`#d3line-${this.props.id}`).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLog().base(10).domain([1E-12, 1]).range([height,0]);

        // define the line
        var valuelines = {};
        for (var k in colors) {
            valuelines[k] = d3.line()
                .x(function(d) { return x(d.step); })
                .y(function(d) { return y(d[k]); });
        }

        // Scale the range of the residual
        x.domain(d3.extent(resid, function(d) { return d.step; }));

        // Add the valueline path.
        for (var k in colors) {
            svg.append("path")
                .data([resid])
                .attr("class", "line")
                .attr("stroke", colors[k])
                .attr("d", valuelines[k]);
        }

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", 'axis')
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("y", height+40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .text("step");

        const axisFunctions = {
            'red' : d3.axisLeft,
            'blue' : d3.axisRight,
            'green' : d3.axisLeft
        };

        const axisShift = {
            'red' : 0,
            'blue' : width,
            'green' : width
        };

        const axisLabelShift = {
            'red' : -80,
            'blue' : width+120,
            'green' : width-80
        };

        // Add the Y Axis
        svg.append("g")
            .attr("class", 'axis')
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("y", height / 2)
            .attr("x",-80)
            .style("text-anchor", "middle")
            .text('Residual');
        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(5)
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            for (var k in colors)
                return d3.axisLeft(y)
                    .ticks(5)
        }

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

        var y = 0;
        for (var k in colors) {
            svg.append("text")
                .attr("y", y + 20)
                .attr("x", width - 20)
                .style("text-anchor", "end")
                .style("fill", colors[k])
                .text(k);
            y += 20;
        }

    } 

    drawChart() {
        const get_residual_body = this.props.data;
        d3.select(`#d3line-${this.props.id}`).selectAll("svg").remove();


        if(get_residual_body && get_residual_body.step) {
            const buildName = (name) => {
                let newName;
                if (name !== 'step' && name.indexOf("_") >= 0) {
                    const splitName =  name.split('_')[1];
                     newName =  `residual${splitName[0].toUpperCase() + splitName.slice(1)}`;
                     if (newName === 'residualCont') {
                         newName = 'residualMass';
                     }
                     return newName
                } else {
                    return name;
                }
            }

            var resid = [];
            let colorsWithNames = [];
            let names= {};
            for (let i = 0; i < get_residual_body.step.length; i++) {
                let obj = {};
                
                Object.keys(get_residual_body).map((item, index) => {    
                   const name = buildName(item); 
                    ;
                    let colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#32efba', '#007bff', '#BD9E39', '#BDBDBD', '#5254A3', '#AD494A', '#A55194', '#8C564B', '#969696', '#9C9EDE', '#E7969C', '#DE9ED6', '#C49C94', '#D9D9D9', '#393B79', '#843C39', '#7B4173', '#8C6D31', '#636363', '#6B6ECF', '#D6616B', '#CE6DBD', '#BD9E39', '#BDBDBD', '#5254A3', '#AD494A', '#A55194', '#8C564B', '#969696', '#9C9EDE', '#E7969C', '#DE9ED6', '#C49C94', '#D9D9D9'];
                    if (name !== 'step') {
                        names[name] = colors[index]; 
                    }
                    obj[name] = get_residual_body[item][i];
                    resid.push(
                        obj
                    );
                })
            }
            colorsWithNames.push(
                names
             )
            this.drawResidual(resid, 
                colorsWithNames[0]
            );
        }

    }
    render() {
        return <div className="margin10" id={`d3line-${this.props.id}`} ></div>
    }
}