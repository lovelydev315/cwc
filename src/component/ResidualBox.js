import React from "react";
import * as d3 from "d3";
import "../style/default.css"
import { Chart } from "react-charts"

let data = [];
export default class ResidualBox extends React.Component{
  
      constructor(props){
        super(props);
        const series = {
          showPoints: false,
        }

        const axes = [
          { primary: true, type: 'linear', position: 'bottom' },
          { type: 'log', position: 'left' }
        ]
        let colorsWithNames;
      }
    componentDidMount() {
        //console.log("caseResidualBox", this.props);
    }

    componentWillUpdate(nextProps, nextState, nextContext) {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drawChart();
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
            data = [];
            for(let eachName in colorsWithNames[0]) {
                let eachData={label: eachName, color: colorsWithNames[eachName], data: []};
                for(let each of resid) {
                    if(each.step === eachData.data.length) eachData.data.push([each.step, each[eachName]]);
                }
                data.push(eachData);
            }
            this.colorsWithNames = colorsWithNames[0];
            console.log(resid, //{step, residualMass, ...
                colorsWithNames[0] //{name: color}
            )
        }

    }
    render() {
    console.log("data",data)
        return <div className="margin10" id={`d3line-${this.props.id}`} style={{ width: this.props.data.width, height: this.props.data.height}}>
        </div>
    }
}