if (Meteor.isClient) {
  Session.setDefault('spamRecipientInputAlert', '');
  Session.setDefault('recipientEmailAddressInputAlert', '');
  Session.setDefault('senderEmailAddressInputAlert', '');
  Session.setDefault('subjectInputAlert', '');
  Session.setDefault('textInputAlert', '');

  Template.emailPage.greeting = function () {
    return "Welcome to email-infrastructure.";
  };
  Template.emailPage.alertLevel = function(){
    console.log('Template.emailPage.alertLevel: ' + Session.get('alertLevel'));
    return Session.get('spamRecipientInputAlert');
  };


  Template.emailPage.senderAlertLevel = function(){
    console.log('Template.emailPage.senderAlertLevel: ' + Session.get('senderEmailAddressInputAlert'));
    return Session.get('senderEmailAddressInputAlert');
  };
  Template.emailPage.recipientAlertLevel = function(){
    console.log('Template.emailPage.recipientAlertLevel: ' + Session.get('recipientEmailAddressInputAlert'));
    return Session.get('recipientEmailAddressInputAlert');
  };
  Template.emailPage.subjectAlertLevel = function(){
    console.log('Template.emailPage.subjectAlertLevel: ' + Session.get('subjectInputAlert'));
    return Session.get('subjectInputAlert');
  };
  Template.emailPage.textAlertLevel = function(){
    console.log('Template.emailPage.textAlertLevel: ' + Session.get('textInputAlert'));
    return Session.get('textInputAlert');
  };


  Template.emailPage.events({
    'keyup #recipientEmailAddressInput':function(){
      Session.set('recipientEmailAddressInputAlert', '');
    },
    'keyup #senderEmailAddressInput':function(){
      Session.set('senderEmailAddressInputAlert', '');
    },
    'keyup #subjectInput':function(){
      Session.set('subjectInputAlert', '');
    },
    'keyup #textInput':function(){
      Session.set('textInputAlert', '');
    },
    'click #sendButton': function () {
      var dirtyForm = false;

      var emailObject = {
        sender: $('#senderEmailAddressInput').val(),
        recipient: $('#recipientEmailAddressInput').val(),
        subject: $('#subjectInput').val(),
        text: $('#textInput').val()
      };

      if(!emailObject.recipient){
        Session.set('recipientEmailAddressInputAlert', 'has-error');
        dirtyForm = true;
      }
      if(emailObject.recipient.indexOf('@') < 0){
        Session.set('recipientEmailAddressInputAlert', 'has-error');
        dirtyForm = true;
      }
      if(!emailObject.sender){
        Session.set('senderEmailAddressInputAlert', 'has-error');
        dirtyForm = true;
      }
      if(emailObject.sender.indexOf('@') < 0){
        Session.set('senderEmailAddressInputAlert', 'has-error');
        dirtyForm = true;
      }
      if(!emailObject.text){
        Session.set('textInputAlert', 'has-error');
        dirtyForm = true;
      }
      if(!emailObject.subject){
        Session.set('subjectInputAlert', 'has-error');
        dirtyForm = true;
      }
      if(!dirtyForm){
        Meteor.call('sendEmail',
          emailObject.recipient,
          emailObject.sender,
          emailObject.subject,
          emailObject.text,
          emailObject.html
        );

        $('#recipientEmailAddressInput').val('');
        $('#senderEmailAddressInput').val('');
        $('#subjectInput').val('');
        $('#textInput').val('');
      }

    },
    'click #spamButtonA':function(){
      var emailObject = {
        recipient: $('#spamRecipientInput').val(),
        sender: "nobody@nowhere.com",
        subject: 'You have mail.',
        text: 'Duis sed velit in magna vestibulum ultrices at vitae tortor. Nulla pharetra gravida venenatis. Fusce at ultrices sem. Nulla venenatis neque feugiat, porta nibh nec, interdum est. Vestibulum scelerisque eros vitae risus malesuada fermentum ac a est.'
      };
      sendSpam(emailObject, "Blue Spam");
    },
    'click #spamButtonB':function(){
      var emailObject = {
        recipient: $('#spamRecipientInput').val(),
        sender: "nobody@nowhere.com",
        subject: 'You have spam.',
        html: '<html><body><img src="http://email-api-test.meteor.com/images/spam-can.jpg" alt="spam"></body></html>'
      };

      sendSpam(emailObject, "Red Spam");

    },
    'click #spamButtonC':function(){
      var emailObject = {
        recipient: $('#spamRecipientInput').val(),
        sender: "nobody@nowhere.com",
        subject: 'You have green eggs and spam.',
        html: '<html><body><img src="http://email-api-test.meteor.com/images/green-eggs-and-ham.jpg" alt="spam"></body></html>'
      };

      sendSpam(emailObject, "Green Spam");
    },
    'keyup #spamRecipientInput':function(){
      if($('spamRecipientInput').val() === ""){
        Session.set('spamRecipientInputAlert', 'has-error');
      }else{
        Session.set('spamRecipientInputAlert', '');
      }
    }
  });
}

sendSpam = function(emailObject, spamType){
  console.log('sendSpam');
  console.log($('spamRecipientInput').val());

  if(!emailObject.recipient){
    Session.set('spamRecipientInputAlert', 'has-error');
    return;
  }
  if(emailObject.recipient.indexOf('@') < 0){
    Session.set('spamRecipientInputAlert', 'has-error');
    return;
  }


  if(emailObject.recipient){
    if(confirm('Are you sure you want to send ' + spamType + "?")){
      Meteor.call('sendEmail',
        emailObject.recipient,
        emailObject.sender,
        emailObject.subject,
        emailObject.text,
        emailObject.html
      );
    }
  }
};



if (Meteor.isServer) {
Meteor.methods({
  sendEmail: function (to, from, subject, text, html) {
    check([to, from, subject], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    console.log(to);
    console.log(from);
    console.log(subject);
    console.log(text);
    console.log(html);

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text,
      html: html
    });
  }
});
}
