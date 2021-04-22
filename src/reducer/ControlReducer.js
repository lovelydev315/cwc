import createAction, {
    callGet2WithToken,
    callPost,
    extra_param,
} from "./utils"

const GET_PENDING_ITEMS = "GET_PENDING_ITEMS";
const GET_PAST_ITEMS = "GET_PAST_ITEMS";
const UPDATE_CASE_SUCCESS = "UPDATE_CASE_SUCCESS";
const POPULATE_USERS_LIST = "POPULATE_USERS_LIST";
const LIST_BILLING = 'LIST_BILLING';
const LIST_HOSTS = 'LIST_HOSTS';
const LIST_DAEMONS = 'LIST_DAEMONS';

export const actionCreators = {
    listHosts: () => (dispatch, state) => {
      let body = {'operation': 'list_hosts'};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let hosts = resp.data;
          //console.log('hosts: ' + hosts);
          dispatch(createAction(LIST_HOSTS, hosts));
        })
        .catch(err => {
            //console.log("admin.err", err);
        })
    },
    listDaemons: () => (dispatch, state) => {
      let body = {'operation': 'list_daemon_info'};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let daemons = resp.data;
          daemons = daemons.map((val, index, array) => {
            val.daemonKey = val.worker + '/' + val.host;
            return val;
          });
          //console.log('xxx', daemons);
          dispatch(createAction(LIST_DAEMONS, daemons));
        })
        .catch(err => {
            //console.log("admin.err", err);
        })
    },
    switchOnOffHosts: (selectedHostState) => (dispatch, state) => {
      let body = {'operation': 'change_state', 'states': selectedHostState};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {

        })
        .catch(err => {
            //console.log("admin.err", err);
            alert('Fail to change hosts state');
        })
    },
    listPendingItems: () => (dispatch, state) => {
      let body = {'operation': 'list_pending_meshes_and_cases'};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let meshCaseList = resp.data;
          meshCaseList.case_list = meshCaseList.cases.uploaded.concat(meshCaseList.cases.processing);
          meshCaseList.mesh_list = meshCaseList.meshes.uploaded.concat(meshCaseList.meshes.processing);
          //console.log("pending", meshCaseList);
          dispatch(createAction(GET_PENDING_ITEMS, meshCaseList));
        })
        .catch(err => {
            //console.log("admin.err", err);
        })
    },
    listPastItems: () => (dispatch, state) => {
      let body = {'operation': 'list_past_cases'};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let caseList = resp.data;
          let res = [];
          res = res.concat(caseList.failed);
          res = res.concat(caseList.completed);
          res = res.concat(caseList.uploading);
          //console.log("pending", res);
          dispatch(createAction(GET_PAST_ITEMS, res));
        })
        .catch(err => {
            //console.log("admin.err", err);
        })
    },
    updateDaemonInfo: (instruction) => (dispatch, state) => {
      let body = instruction;
      body['operation'] = 'update_daemon_info';
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let res = resp.data;
          if (!res) {
            alert('Fail to update daemon pause');
          }
        })
        .catch(err => {
            //console.log("admin.err", err);
            alert('Fail to update daemon pause');
        })
    },
    updateCase: (case_id, worker, user_id) => (dispatch, state) => {
      let body = {'operation': 'lock_update_case', 'case_id': case_id,
                  'worker': worker, 'user_id': user_id};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let res = resp.data;
          if (!res) {
            alert('Fail to update case worker');
          }
        })
        .catch(err => {
            //console.log("admin.err", err);
        })
    },
    updateMesh: (mesh_id, worker, user_id) => (dispatch, state) => {
      let body = {'operation': 'lock_update_mesh', 'mesh_id': mesh_id,
                  'worker': worker, 'user_id': user_id};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let res = resp.data;
          if (!res) {
            alert('Fail to update mesh worker');
          }
        })
        .catch(err => {
            //console.log("admin.err", err);
            alert('Fail to update mesh worker');
        })
    },
    updateMonthlyLimit: (user_id, limit) => (dispatch, state) => {
      let body = {'operation': 'update_monthly_limit', 'user_id': user_id,
                  'limit': limit};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let res = resp.data;
          if (!res) {
            alert('Fail to update monthly limit');
          }
        })
        .catch(err => {
            //console.log("admin.err", err);
            alert('Fail to update monthly limit');
        })
    },
    fetchUsers: () => (dispatch, state) => {
      let body = {'operation': 'list_users'};
      return callPost("flow360-admin",  extra_param(), body)
        .then(resp => {
          let res = resp.data;
          let options = res.map(function(x) {
            return {value: x.user_id, label: x.user_id + '(' + x.email + '/' + x.monthlyLimit + '/' + x.login_times + '/' + x.invite_code  + ')'};
          });
          dispatch(createAction(POPULATE_USERS_LIST, options));
        })
        .catch(err => {
            //console.log("admin.err", err);
            alert('Fail to get users');
        })
    },
    listCasesForBilling: (user_id, startBillingDate, endBillingDate) => (dispatch, state) => {

        let billingGetURL = `admin/billing/user/${user_id}/from/${startBillingDate.getYear() + 1900}-${startBillingDate.getMonth() + 1}/to/${endBillingDate.getYear() + 1900}-${endBillingDate.getMonth() + 1}`;
        return callGet2WithToken(billingGetURL)
            .then(resp => {
                //console.log("billing", resp.data);
                let caseListResult = resp.data.data;
                dispatch(createAction(LIST_BILLING, caseListResult));

            })
            .catch(err => {
                //console.log("listCases.err", err.response);
            });
    },
};

export function reducer(state = {}, action) {
    //console.log("reducer_func", action.type, action.payload);
    switch (action.type) {
        case GET_PENDING_ITEMS:
            return {...state, pendingItems: action.payload};
        case UPDATE_CASE_SUCCESS:
            return {...state, updateItemSuccess: action.payload};
        case POPULATE_USERS_LIST:
            return {...state, userList: action.payload};
        case LIST_BILLING:
            return {...state, caseListResult: action.payload};
        case LIST_HOSTS:
            return {...state, hostList: action.payload};
        case GET_PAST_ITEMS:
            return {...state, pastCaseList: action.payload};
        case LIST_DAEMONS:
            return {...state, daemonList: action.payload};
        default:
            return state;
    }
};
