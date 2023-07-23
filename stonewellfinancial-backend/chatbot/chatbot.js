const dialogflow = require('dialogflow');
const structjson = require('./structjson');
require('dotenv').config()


const googleProjectID = process.env.GOOGLE_PROJECT_ID
const dialogFlowSessionID = process.env.DIALOGFLOW_SESSION_ID
const dialogFlowSessionLanguageCode = process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL
// const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY
const googlePrivateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNCaIuSMwf+URm\nuqgQP/qmtnXST8qHrdPlPWuXWBobXS98LAu4U61PCHwc+X/Z0aOX0+7Xz5v4A+5S\ngbuSZ2opxP2hY6mtf7mZH1zBN4CKQl+QSXcuvwFa5KVyM/bMCLYB432oE9gpYX1o\nLG0xumKfkceJZ587homvTqrlIXu3c3hdqbwJ/6Sq3pKFCw+hdi20s2cGq/1nnrjA\nTrJp6vigeWVjzk0Uxp457lgue1beEJSMfuZcV4J8Oainf2ViHYttiSbgagR1rZpk\nrCYPj+iPVUITCG8kfg/C7yAtTCDuwtlz9KjhIbru/PM4irZA1Fz8AEEpJ5L4UzEg\nO0kVJQN/AgMBAAECggEAOhdoo8RsUQLGpnRr+W6nDWTUrOl+cEKHroNgYFjNzMLy\nGTRBfc/3YlT9FRh7aLNErleVa/+eKP60HxwykKBMK9lsIrWh9U4iv4drODMJcCKu\nAKtP4Sass5vkZB7k5ZnyN0bE60H0FIVSiplLtrMgDiW3au645pyPleOr948tBiRm\ny1ERW6XXBWYsV282E32vUzn+hje6XMHbtViyFeJKEbT8XZ/jfPExtsInF++BLRV6\ne73/21W7Z9neLdyBt9WzTRyEFrngfKTenVJYRAj/QtkdikQDsF9GzKRICUm1TQ8M\nMofUaOsVPWoaCrfcSaCLc+iBf2RhhidwMRWT4aVYwQKBgQD4sKBq4DLjKLMjL5b7\nh8CJMHjM38vJGCzxhvuSNlwqfyDT0Z8gBybXkXptamvkackwebXYAAKNw1ud3R6L\nrzqo2RLVIgCHZDlwhD6On5YiRFFAMywa0nLnGUBZOfuXCO5yURMtXgVD9n6WIRL0\nNID6U5sGUzOKlENDVBcs1VKviwKBgQDTEIbFWgLDx7IVeXi+zamxE+2XK8DC+SI/\nWUANXDJ8rP7QLxQjR8vp1/AH90HyqqyKG+7y4NUHSRBBK7vZ+EVyluQoqyNZruJq\new05mMStF5ynRhW2UHVi9MCw7Kw3FN3fAfToznODwiBJnOa7FDNUQfwm+9CBIaZl\nrvFqWbl6XQKBgQCpioiitBwdH1cZCs2sxzysip4gVgYxH0ksk/CYGnU1B5xSq9sG\n07lYRzamt2G8w53EbYVaL4+OI/wmoGO9qQWdrPeY0+h2ZQ5/tbiMNSH+VILr+Lb9\nxjFNebqT2eK6cf1VdA5V5H5EehyMrxmj4NN5VVwfsMM3m6JLmV1/VCNdxwKBgBJ1\ny5PPP5aoDKdcLHdjvYfDWnByXzWuXJR11ehVPAUzjEXhGD3NtcQKIvBPa/ExhE3A\nC7Iqf/dXKJjKnm9+C3TuRZ5Y+YqKhTsS8CEtf2Y0PntS4etENkAlcAUJbjaTGKS8\noxMJm4jWncRSeMu8BJFGBCvUsnPY4ZjbKDpJBrPxAoGBAL+T90/B5PCHj/VZ6kZh\nAoqlYBu8xZFUxlmaJS+fGjGiECi8zo8WPmU0YjhYeOkEBrAfZn6tUhA4IusdT8/e\nd3T9/CG/NrfdI0R+EFyA3Q6/xsZBG42Lfnb5AzCKWrbZsY/Zp4wU/8nwkEKROXKW\nPm+DcsgEo2YwjGcL77Ub1gbK\n-----END PRIVATE KEY-----\n"

const projectID = googleProjectID;
const credentials = {
  client_email : googleClientEmail,
  private_key : googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectID: projectID, credentials:credentials})

const sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID);

module.exports ={
  textQuery: async function(text, parameters = {}){

    let self = module.exports;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
            text: text,
            languageCode: dialogFlowSessionLanguageCode
        }
      },
      queryParams: {
        payload: {
            data: parameters
        }
     }
    };
 
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);

    return responses;
  },

  eventQuery: async function(event, parameters = {}){

    let self = module.exports;

    const request = {
      session: sessionPath,
      queryInput: {
        event: {
            name: event,
            parameters: structjson.jsonToStructProto(parameters),
            languageCode: dialogFlowSessionLanguageCode
        }
      }
    };

    let responses = await sessionClient.detectIntent(request);
    // responses = await self.handleAction(responses);
    responses = self.handleAction(responses);

    return responses;
  },

  handleAction: function(responses){
    let queryResult = responses[0].queryResult;
    
        switch (queryResult.action) {
            case 'recommandcourses-yes':
                if (queryResult.allRequiredParamsPresent) {
                  console.log('queryResult.parameters.field',queryResult.parameters.fields)
                  // self.saveRegistration(queryResult.parameters.fields);
                }
                break;
        }

        // console.log(queryResult.action);
        // console.log(queryResult.allRequiredParamsPresent);
        // console.log(queryResult.fulfillmentMessages);
        // console.log(queryResult.parameters.fields);

    return responses;
  },

  saveRegistration: async function(fields){
    const registration = new Registration({
        name: fields.name.stringValue,
        address: fields.address.stringValue,
        phone: fields.phone.stringValue,
        email: fields.email.stringValue,
        dateSent: Date.now()
    });
    try{
        let reg = await registration.save();
        console.log(reg);
    } catch (err){
        console.log(err);
    }
}

}