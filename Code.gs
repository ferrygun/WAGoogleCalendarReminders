function WAReminders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var twilio = ss.getSheetByName("Twilio"); 
  
  var twilio_sid = twilio.getRange(2,2).getValue();
  var twilio_token = twilio.getRange(3,2).getValue();
  
  var today = new Date();
  var events = CalendarApp.getDefaultCalendar().getEventsForDay(today);

  Logger.log('Number of events: ' + events.length);
  
  var ev = null;
  var cellno = null;
  
  var contact = ss.getSheetByName("Contact");
  
  for(var i=0; i < events.length; i++)  {
    ev = events[i];
    
    if(ev.getTitle().substring(ev.getTitle().length-3, ev.getTitle().length) !== "~!#") {
      
      for(n=2; n <= contact.getLastRow(); ++n) {
        cellno = contact.getRange(n,1).getValue();      
        sendWA(ev.getTitle(), ev.getStartTime(), twilio_sid, twilio_token, cellno);
      }   
      ev.setTitle(ev.getTitle() + "~!#");
    } 
        
    
    Logger.log('Item '+ ev.getTitle() +' found on '+ ev.getStartTime()); 
  } 

}

function sendWA(title, time, twilio_sid, twilio_token, cellno) {
  var url = "https://api.twilio.com/2010-04-01/Accounts/" + twilio_sid + "/Messages.json";
  
  var options = {
    "method": "post",
    "headers": {
      "Authorization": "Basic " + Utilities.base64Encode(twilio_sid + ":" + twilio_token)
    },
    "payload": {
      "From": "whatsapp:+14155238886",
      "To": "whatsapp:" + cellno,
      "Body": "Your appointment is coming up on " + title + " at " + time
    },
    "followRedirects" : true,
    "muteHttpExceptions": true
  };
  
  var response = UrlFetchApp.fetch(url, options);
}
