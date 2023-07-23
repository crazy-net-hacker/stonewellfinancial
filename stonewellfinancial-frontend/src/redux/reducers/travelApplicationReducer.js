import * as type from '../types';

const initialState = {
  result: [], //all result
  applications: [], //get data
  answer: [], //get data
  loading: false,
  error: null,
  renewableApplication: [], //renewable
  renewableLoading: false,
  renewableError: null,
  updatedApplication: [],
  UpdatedLoading: false,
  UpdatedError: null,
  sellTugoPolicyResult: [],
  sellTugoPolicyLoading: false,
  sellTugoPolicyError: null,
  sellCarewellResult: [],
  sellCarewellLoading: false,
  sellCarewellError: null,
  sendEmailResult: [],
  sendEmailLoading: false,
  sendEmailError: null,  
  mergedResult: [], //merge ZCRM Sales to ZApplications
  mergedLoading: false
}

export default function travelApplicationReducer(state = initialState, action) {
  //Add Travel Applications
  switch(action.type) {
        // Post travel application
        case type.POST_APPLICAION_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_APPLICAION_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_APPLICAION_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     

      // Put (update payment) travel application
      case type.PUT_APPLICAION_PAYMENT_REQUESTED: 
        return {
          ...state,
          UpdatedLoading: true,
        }
      case type.PUT_APPLICAION_PAYMENT_SUCCESS: 
        return {
          ...state,
          UpdatedLoading: false,
          updatedApplication: action.result
        }
      case type.PUT_APPLICAION_PAYMENT_FAILED:
        return {
          ...state,
          UpdatedLoading: false,
          UpdatedError: action.message
        }
      
      // Put (update status) travel application
      case type.PUT_APPLICAION_STATUS_REQUESTED: 
        return {
          ...state,
          UpdatedLoading: true,
        }
      case type.PUT_APPLICAION_STATUS_SUCCESS: 
        return {
          ...state,
          UpdatedLoading: false,
          updatedApplication: action.result
        }
      case type.PUT_APPLICAION_STATUS_FAILED:
        return {
          ...state,
          UpdatedLoading: false,
          UpdatedError: action.message
        }   

      // Put (update) travel application
      case type.PUT_APPLICAION_REQUESTED: 
        return {
          ...state,
          UpdatedLoading: true,
        }
      case type.PUT_APPLICAION_SUCCESS: 
        return {
          ...state,
          UpdatedLoading: false,
          updatedApplication: action.result
        }
      case type.PUT_APPLICAION_FAILED:
        return {
          ...state,
          UpdatedLoading: false,
          error: action.message
        }   

      // Get travel application
      case type.GET_APPLICAION_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_APPLICAION_SUCCESS: 
        return {
          ...state,
          loading: false,
          applications: action.applications.data,
        }
      case type.GET_APPLICAION_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     
        
      // Get travel applicant's medical questionnaire
      case type.GET_APPLICANT_MED_ANSWER_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_APPLICANT_MED_ANSWER_SUCCESS: 
        return {
          ...state,
          loading: false,
          answer: action.answer.data.rows,
        }
      case type.GET_APPLICANT_MED_ANSWER_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }   
        
      // Get travel application by client
      case type.GET_APPLICAION_BY_CLIENT_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_APPLICAION_BY_CLIENT_SUCCESS: 
        return {
          ...state,
          loading: false,
          applications: action.applications.data,
        }
      case type.GET_APPLICAION_BY_CLIENT_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }  

      // Get renewable application
      case type.GET_RENEWABLE_APPLICAION_REQUESTED: 
        return {
          ...state,
          renewableLoading: true,
        }
      case type.GET_RENEWABLE_APPLICAION_SUCCESS: 
        return {
          ...state,
          renewableLoading: false,
          renewableApplication: action.applications.data,
        }
      case type.GET_RENEWABLE_APPLICAION_FAILED:
        return {
          ...state,
          renewableLoading: false,
          renewableError: action.message
        }  

      //  Put (sell Tugo Policies & update policy number) Travel Application   
      case type.PUT_SELL_TUGO_POLICY_REQUESTED: 
        return {
          ...state,
          sellTugoPolicyLoading: true,
        }
      case type.PUT_SELL_TUGO_POLICY_SUCCESS: 
        return {
          ...state,
          sellTugoPolicyLoading: false,
          sellTugoPolicyResult: action.result
        }
      case type.PUT_SELL_TUGO_POLICY_FAILED:
        return {
          ...state,
          sellTugoPolicyLoading: false,
          sellTugoPolicyError: action.message
        }    
        
      //  Put (sell Carewell) Travel Application   
      case type.PUT_SELL_CAREWELL_REQUESTED: 
        return {
          ...state,
          sellCarewellLoading: true,
        }
      case type.PUT_SELL_CAREWELL_SUCCESS: 
        return {
          ...state,
          sellCarewellLoading: false,
          sellCarewellResult: action.result
        }
      case type.PUT_SELL_CAREWELL_FAILED:
        return {
          ...state,
          sellCarewellLoading: false,
          sellCarewellError: action.message
        }   

      // Send email after Gettting Renewable Application
      case type.SEND_EMAIL_RENEWABLE_APPLICAION_REQUESTED: 
        return {
          ...state,
          sendEmailLoading: true,
        }
      case type.SEND_EMAIL_RENEWABLE_APPLICAION_SUCCESS: 
        return {
          ...state,
          sendEmailLoading: false,
          sendEmailResult: action.result
        }
      case type.SEND_EMAIL_RENEWABLE_APPLICAION_FAILED:
        return {
          ...state,
          sendEmailLoading: false,
          sendEmailError: action.message
        }  

      // merge ZCRM Sales to ZApplications
      case type.GET_MERGE_ZAPPLICAION_REQUESTED: 
      return {
        ...state,
        mergedLoading: true,
      }
      case type.GET_MERGE_ZAPPLICAION_SUCCESS: 
      return {
        ...state,
        mergedLoading: false,
        mergedResult: action.result,
      }
      case type.GET_MERGE_ZAPPLICAION_FAILED:
      return {
        ...state,
        mergedLoading: false,
        error: action.message
      }  

        
    default:
      return state;
  }
}

