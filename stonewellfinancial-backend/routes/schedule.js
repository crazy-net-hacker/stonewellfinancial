const schedule = require('node-schedule'); 
const travelApplications = require('./travel_applications')
const zcrmApplications = require('./zcrm_applications')

/*
values of rule
seound (0-59)
minute (0-59)
hour (0-23)
date (1-31)
month (1-12) 
year         
dayOfWeek (0-7) (0 or 7 is Sun)
*/

  function schedule_job(){
      // do at 8:00am  timezone:Toronto
      let rule = new schedule.RecurrenceRule();
      rule.tz = 'America/Toronto';
      rule.hour = 08;
      rule.minute = 00;

      schedule.scheduleJob(rule, async()=>{
          // console.log(`current time  ${rule.hour} : ${rule.minute} am. Execute the schedule jobs`)
					
          //Merge ZCRM Sales to Applications
          await zcrmApplications.mergeZSalesToApplications();
          
          //Send Insurance Expire Email to customer
          await travelApplications.sendExpireNoticEmail();

          //Send Insurance Expire Email to Vendor
          await travelApplications.sendDraftReminderEmails();

      })
  }
    
module.exports = { schedule_job }
