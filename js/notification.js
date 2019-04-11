chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "notification") {
    var views = chrome.extension.getViews({type: "popup"});
    if (views.length > 0) {
      var popup = views[0];
      var target_dom = message.dom_id === undefined ? "notification_area" : message.dom_id;
      var notification_msg = message.msg; 
      var time_disappear = message.disappear === undefined ? "1000" : message.disappear;
      var msg_type = message.msgtype === undefined ? "info" : message.msgtype;

      var html = '<div class="ui small message ' + msg_type + '">';
      html += '<i class="close icon" style="float: right"></i>';
      html += '<div class="description">' + notification_msg + '</div>';
      html += '</div>';

      popup.$("#"+target_dom).prepend(html);

      setTimeout(function() {
        popup.$('.message .close').trigger("click");
      }, time_disappear);

      popup.$('.message .close').on('click', function() {
        popup.$(this).closest('.message').transition('fade down', function(){
          popup.$("#"+target_dom).empty();
        });
      });
    }
  }
});
