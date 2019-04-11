// purge host button
$("#display_page").on("click", "#purge_host_button", function() {
  try {
    var hostnames = JSON.parse($("#display_area").find("#hostname").val());
    if (hostnames.length <= 0) throw "No hostname was entered";
  } catch(err) {
    chrome.runtime.sendMessage({
      type: "notification", 
      msg: "Please enter Hostnames",
      msgtype: "negative",
      disappear: 2000
    });
    return false;
  }
  $("#loader").removeClass("disabled").addClass("active");
  var hosts = [];
  for(var i=0; i < hostnames.length; i++) {
    hosts.push(hostnames[i].value);
  }
  chrome.runtime.sendMessage({type: "page", page: "purge_result_page", previous_page: "purge_by_host", purge: {type: "hostname", targets: hosts}}, function(response) {
    $("#loader").addClass("disabled").removeClass("active");
    if(response.msg !== undefined) {
      chrome.runtime.sendMessage({
        type: "notification", 
        msg: response.msg,
        msgtype: "negative",
        disappear: 3000
      });
    }
  });
});
