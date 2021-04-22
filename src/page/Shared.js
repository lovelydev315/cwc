import React from 'react'
import Humanize from 'humanize-plus'
import moment from "moment"
import {
    Table,
} from "react-bootstrap";
import "../style/default.css"
import {getCasePrice} from "../util/BillingUtils";

export function generateBilling(caseListResult, userId) {
    return (
        <div>
            <Table striped bordered condensed hover responsive size="sm">
                <thead>
                <tr>
                    <th>UserId: {userId}</th>
                </tr>
                <tr>
                    <th>Current S3 Storage Usage (delayed): {caseListResult && caseListResult.s3} GB</th>
                </tr>
                </thead>
            </Table>
            <Table striped bordered condensed hover size="sm">
                <thead>
                <tr>
                    <th>month</th>
                    <th>case name</th>
                    <th>case id</th>
                    <th>mesh id</th>
                    <th>submit date</th>
                    <th>finish time</th>
                    <th>mesh size(GB)</th>
                    <th>nodes</th>
                    <th>priority</th>
                    <th>price</th>
                    <th>succeeded</th>
                    <th>status</th>
                </tr>
                </thead>

                {caseListResult && caseListResult.jobs  && caseListResult.jobs.map(
                    monthItem => (
                        <tbody key={monthItem.m}>
                        <tr className='table-content-row'>
                            <td >{monthItem.m}</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                        </tr>
                        {monthItem.i && monthItem.i.map(
                            caseItem => (
                                <tr key={caseItem.caseId} className='table-content-row'>
                                    <td ></td>
                                    <td >{caseItem.name}</td>
                                    <td >{caseItem.caseId}</td>
                                    <td >{caseItem.meshId}</td>
                                    <td >{moment(caseItem.submitTime,'YYYY:MM:DD:hh:mm:ss').format('MM/DD/YYYY-hh:mm:ss A')}</td>
                                    <td >{caseItem.completeTime}</td>
                                    <td >{caseItem.meshSize}</td>
                                    <td >{caseItem.nodeSize}</td>
                                    <td >{caseItem.priority}</td>
                                    <td >{getCasePrice(caseItem)}</td>
                                    <td >{caseItem.hasSuccess}</td>
                                    <td >{caseItem.status}</td>
                                </tr>)
                        )}
                        <tr className='table-content-row'>
                            <td >Cases Count</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td >{monthItem.num}</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                        </tr>
                        <tr className='table-content-row'>
                            <td >Total Nodes</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td >{monthItem.nodes}</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                        </tr>
                        <tr className='table-content-row'>
                            <td >S3 Storage</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td >{monthItem.s3} (GB*Month)</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                        </tr>
                        <tr className='table-content-row dark' >
                            <td><br/></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                        </tr>
                        </tbody>
                    )
                )
                }

            </Table>
        </div>

    );
}
export  function buildBillingChartData(caseListResult) {

    // const data = [
    //     { name: '2020.1', case_cost: 2000, s3_cost: 2013},
    //     { name: '2020.2', case_cost: 2000, s3_cost: 2013 },
    //     { name: '2020.3', case_cost: 2000, s3_cost: 2013},
    //     { name: '2020.4', case_cost: 2000, s3_cost: 2013},
    //     { name: '2020.5', case_cost: 2000, s3_cost: 2013 },
    //     { name: '2020.6', case_cost: 2000, s3_cost: 2013},
    // ];
    if(caseListResult.monthItems) {
      var caseListResultForSorting = Object.entries(caseListResult.monthItems).map(([key, monthItem]) =>{
        return {
          name: key,
          database: monthItem.nodeCountOfLow,
          design: monthItem.nodeCountOfHigh
        }
      });
      var caseListResultSorted = caseListResultForSorting.sort((a,b) => {
        return a.name - b.name;
      });
      return caseListResultSorted;
    }
    else {
        return [];
    }

}

export function generateBillingNew(billingSummary, userId) {
    if(!billingSummary) return <div></div>
    let monthItems = Object.entries(billingSummary.monthItems);
    return (
        <div>
            <Table striped bordered condensed hover responsive size="sm">
                <thead>
                <tr>
                    <th>UserId: {userId}</th>
                </tr>
                <tr>
                    <th>Current S3 Storage Usage (delayed): {Humanize.fileSize(billingSummary.currentS3Usage)} </th>
                </tr>
                </thead>
            </Table>
            <Table striped bordered condensed hover size="sm">
                <thead>

                </thead>

                {monthItems.map(
                    ([month, monthItem]) => (
                        <tbody key={month}>
                        <tr className='table-content-row'>
                            <td colSpan={10}>
                                <div className="row">
                                    <label className="col-sm-2">{month} @ {Humanize.compactInteger(monthItem.caseCount)} Cases</label>
                                    <label className="col-sm-2">
                                        S3: {Humanize.formatNumber(monthItem.s3AveUsage/(1024*1024*1024),2)}G
                                    </label>
                                    <label className="col-sm-3">
                                        Node (database/design): {Humanize.formatNumber(monthItem.nodeCountOfLow)}/{Humanize.formatNumber(monthItem.nodeCountOfHigh)}
                                    </label>
                                    {false &&<label className="col-sm-5">
                                        Case Cost: ${Humanize.formatNumber(monthItem.caseCost, 2)} |
                                        S3 Cost: ${Humanize.formatNumber(monthItem.s3Cost, 2)} |
                                        Total Cost: ${Humanize.formatNumber(monthItem.caseCost + monthItem.s3Cost, 2)}
                                    </label>}
                                </div>

                            </td>
                        </tr>
                        {monthItem.caseModels &&
                        <tr>
                            <th></th>
                            <th>Case</th>
                            <th>Case Id</th>
                            <th>Mesh Id</th>
                            <th>Finish Time</th>
                            <th>Mesh Size</th>
                            <th>Nodes</th>
                            <th>Priority</th>
                        </tr>}
                        {monthItem.caseModels && monthItem.caseModels.map(
                            caseItem => (
                                <tr key={caseItem.caseId} className='table-content-row'>
                                    <td ></td>
                                    <td >{caseItem.caseName}</td>
                                    <td >{caseItem.caseId}</td>
                                    <td >{caseItem.caseMeshId}</td>
                                    <td >{moment(caseItem.caseFinishTime,'YYYY:MM:DD:hh:mm:ss').format('MM/DD/YYYY-hh:mm:ss A')}</td>
                                    <td >{Humanize.fileSize(caseItem.meshSize)}</td>
                                    <td >{Humanize.formatNumber(caseItem.nodeSize)}</td>
                                    <td >{caseItem.casePriority === 'low' ? 'database' : 'design'}</td>
                                    {/*<td >${Humanize.formatNumber(caseItem.cost,2)}</td>*/}
                                </tr>)
                        )}
                        <tr>
                            <td colSpan={9} />
                        </tr>
                        </tbody>
                    )
                )
                }

            </Table>
        </div>

    );
}
