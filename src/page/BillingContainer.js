import React from 'react'

import autoBind from 'react-autobind';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actionCreators} from "../reducer/CaseReducer";
import "../style/default.css"
import {buildBillingChartData, generateBillingNew} from "./Shared";
import {getOrgId, getS3User, getS3UserId} from '../reducer/utils';
import {Button, Card, Row, Table} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BillingChart from "../component/BillingChart";

class BillingContainer extends React.Component {


    constructor(props, context) {
        const currentDate = new Date();
        super(props, context);
        autoBind(this);
        this.state = {
            startBillMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1),
            endBillMonth: currentDate,
        };
    }

    componentDidMount() {
        const orgId = getOrgId();
        if(orgId !== undefined && orgId != null && orgId.length > 0) {
            this.props.getOrganize(orgId);
        }
    }

    render() {
        let {caseListResult, organizeDetail} = this.props;
        const {startBillMonth, endBillMonth, isEditing} = this.state;

        let userId = getS3UserId();
        let user = getS3User();
        //console.log("caseListResult", caseListResult);
        let orgDetail = organizeDetail;
        return (
            <Card>
                <Card.Header>Flow360 Billing Summary

                    <i className="margin10">
                    </i>
                </Card.Header>
                <div>
                    {orgDetail && <div>
                    <Row style={{marginLeft:30}}>
                        <label style={{marginRight:20}}>Organization: </label>{orgDetail.name}
                    </Row>
                    <Row style={{marginLeft:30}}>
                        <label style={{marginRight:20}}>Service Level: </label>{orgDetail.serviceLevel}
                    </Row>
                    <Row style={{marginLeft:30}}>
                        <label style={{marginRight:20}}>Last Payment Date: </label>{orgDetail.lastPaymentDate}
                    </Row>
                    <Row style={{marginLeft:30}}>
                        <label style={{marginRight:20}}>Reminder Email Threshold: </label>
                        <input
                            type="text"
                            name="reminderEmailThreshold"
                            placeholder="Reminder Email Threshold..."
                            value={orgDetail.reminderEmailThreshold}
                            onChange={e => {
                                organizeDetail.reminderEmailThreshold = parseInt(e.target.value);
                                this.setState({...this.state, organizeDetail:organizeDetail});
                            }}
                        />
                        {false && <button onClick={(e) => this.updateReminderOfEmailThreshold()}>update</button>}
                    </Row>
                    <Row style={{marginLeft:30}}>
                        <label style={{marginRight:20}}>Require Approval Threshold: </label>

                            <input
                                type="text"
                                name="approvalThreshold"
                                placeholder="Require Approval Threshold..."
                                value={orgDetail.requriedApprovalThreshold}
                                onChange={e => {
                                    organizeDetail.requriedApprovalThreshold = parseInt(e.target.value);
                                    this.setState({...this.state, organizeDetail:organizeDetail});
                                }}
                            />
                        {false && <button onClick={(e) => this.updateApprovalThreshold()}>update</button>}
                    </Row>

                    </div>}
                    <Row style={{marginLeft:30}}>
                        <label style={{marginRight:20}}>Select Start Month: </label>
                        <DatePicker
                            selected={startBillMonth}
                            onChange={this.handleStartBillMonthChange}
                            dateFormat="yyyy.MM"
                            showMonthYearPicker placeholderText="select start month"/>
                        <label style={{marginRight:20}}>Select End Month: </label>
                        <DatePicker
                            selected={endBillMonth}
                            onChange={this.handleEndBillMonthChange}
                            dateFormat="yyyy.MM"
                            showMonthYearPicker placeholderText="select end month"/>
                        <Button variant="light" onClick={this.handleFetchBill}>Fetch</Button>
                    </Row>
                    {caseListResult && <BillingChart data={buildBillingChartData(caseListResult)}/>}
                    {caseListResult &&
                     generateBillingNew(caseListResult, userId)}
                <Table striped bordered condensed hover size="sm" style={{visibility:'hidden'}} >
                    <thead>
                    <tr>
                        <th></th>
                        <th>Case</th>
                        <th>Case Id</th>
                        <th>Mesh Id</th>
                        <th>Submit Time</th>
                        <th>Finish Time</th>
                        <th>Mesh Size</th>
                        <th>Nodes</th>
                        <th>Priority</th>
                    </tr>
                    </thead>
                </Table>
            </div>
            </Card>
        );

    }
    handleStartBillMonthChange = date => {
        this.setState({startBillMonth : date});

    }
    handleEndBillMonthChange = date => {
        this.setState({endBillMonth : date});

    }

    handleFetchBill = () => {
        const {startBillMonth, endBillMonth} = this.state;
        if(endBillMonth < startBillMonth) {
            alert('the end date must be after start date');
            return;
        }
        //console.log(endBillMonth.getFullYear());
        //console.log(startBillMonth.getFullYear());
        if((endBillMonth.getFullYear() - startBillMonth.getFullYear()) * 12 + (endBillMonth.getMonth() - startBillMonth.getMonth())> 11) {
            alert("can't show the bill more than 1 years");
            return;
        }
        this.props.listCasesForBilling(startBillMonth, endBillMonth);
    }

    updateReminderOfEmailThreshold() {
        const {organizeDetail} = this.state;
        this.props.updateOrganize(organizeDetail, 'reminderEmailThreshold');

    }

    updateApprovalThreshold() {
        const {organizeDetail} = this.state;
        this.props.updateOrganize(organizeDetail, 'requriedApprovalThreshold');
    }
}

export default connect(
    state => state.meshCase,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(BillingContainer);
