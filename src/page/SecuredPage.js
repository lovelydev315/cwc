import React from 'react'
import {Link, NavLink, Redirect, Route} from "react-router-dom";
import MeshContainer from "./MeshContainer";
import BillingContainer from "./BillingContainer";
import CaseContainer from "./CaseContainer";
import ControlPage from "./ControlPage";
import {AUTH_HEADER, clearS3User, getS3User} from "../reducer/utils";
import {ControlRoute} from "../container/PrivateRoute";
import {actionCreators as authReducer} from "../reducer/AuthReducer";
import {actionCreators as caseReducer} from "../reducer/CaseReducer";
import {actionCreators as meshReducer} from "../reducer/MeshReducer";
import {DropdownButton, Dropdown, Nav, Navbar} from "react-bootstrap";
import MeshFactoryContainer from "./StudioContainer";
import logoDark from '../style/assets/images/logo.svg';
import autoBind from "react-autobind";
import {connect} from "react-redux"
import {bindActionCreators} from "redux";

const DropdownItem = Dropdown.Item;

class WorkspacePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        const s3User = getS3User();
        this.state = {
            accessUser:s3User
        };
    }
    componentDidMount() {

    }

    onAccountSelect(e) {
        const s3User = getS3User();
        if(s3User.guestUserIdentity != e.identity) {
            s3User.guestUserIdentity = e.identity;
            s3User.guestUserId = e.userId;
            localStorage.setItem(AUTH_HEADER, JSON.stringify(s3User));
            this.setState({accessUser:e})
            this.props.listCases('all');
            this.props.listMeshs();
        }
    }
    render() {
        const {match} = this.props;

        const s3User = getS3User();

        let {guestUsers} = s3User;
        const {accessUser} = this.state;
        //console.log(accessUser);
        if(!guestUsers) {
            guestUsers = [];
        }
        const hasOwnership = !s3User.guestUserIdentity || s3User.guestUserIdentity == s3User.identityId;

        guestUsers.push({identity:s3User.identityId, email: s3User.email, userId:s3User.userId});
        if(s3User && s3User.userId) {


            return (
              <div>
                  <Navbar bg="light" expand="lg">
                      <a href='https://www.flexcompute.com/'> <img src={logoDark} alt=''
                                                                   className='logo img-fluid mt-4 mb-4 ml-2 mr-2'/>
                      </a>
                      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                      <div className="collapse navbar-collapse" id="navbarText">

                          <Nav className="mr-auto">
                              <Nav.Link>
                                  <NavLink
                                    to={match.url && match.url.length > 10 ? `/app/mesh/${match.url}` : `/app/mesh`}>Mesh</NavLink>
                              </Nav.Link>
                              <Nav.Link>
                                  <NavLink to={'/app/case/all'}>Case</NavLink>
                              </Nav.Link>
                              {s3User && s3User.admin &&
                              <Nav.Link>
                                  <NavLink to={'/app/mesh_factory'}>Studio</NavLink>
                              </Nav.Link>}
                              {hasOwnership && <Nav.Link>
                                  <NavLink to={'/app/billing'}>Billing</NavLink>
                              </Nav.Link>
                              }
                              {s3User && s3User.admin &&
                              <Nav.Link>
                                  <NavLink to={'/app/control'}>Admin</NavLink>
                              </Nav.Link>}
                              <Nav.Link>
                                  <Link to={"/app/login"} onClick={() => {
                                      clearS3User();
                                  }}>Logout</Link>
                              </Nav.Link>

                          </Nav>
                          <DropdownButton id="guest_user_list" title={accessUser.email}
                                          onSelect={(e) => this.onAccountSelect(guestUsers[e])}>
                              {guestUsers.map((key, index) => (
                                <DropdownItem key={index} eventKey={index}>{guestUsers[index].email}</DropdownItem>
                              ))
                              }
                          </DropdownButton>
                      </div>
                  </Navbar>

                  <div>
                      <Route exact path={'/app/mesh'} component={MeshContainer}/>
                      <Route exact path={'/app/mesh_factory'} component={MeshFactoryContainer}/>
                      <Route exact path={'/app/billing'} component={BillingContainer}/>
                      <ControlRoute exact path={'/app/control'} component={ControlPage}/>
                      <Route exact path={'/app/case/:meshId'} component={CaseContainer}/>
                      <Redirect to={"/app/case/all"} />
                  </div>
              </div>)
        }
        else {
            return (<Redirect to={"/app/login"}/>);
        };
    }

}

export default connect(
    state => {return {auth:state.auth, mesh:state.mesh, caseMesh:state.caseMesh}},
    dispatch => bindActionCreators({...authReducer, ...meshReducer, ...caseReducer}, dispatch)
)(WorkspacePage);
