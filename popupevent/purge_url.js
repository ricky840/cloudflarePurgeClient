// purge url button
$("#display_page").on("click", "#purge_url_button", function() {
  try {
    var input_urls = JSON.parse($("#display_area").find("#urls").val());
    if (input_urls.length <= 0) throw "No URL was entered";
  } catch(err) {
    chrome.runtime.sendMessage({
      type: "notification", 
      msg: "Please enter URLs",
      msgtype: "negative",
      disappear: 2000
    });
    return false;
  }
  $("#loader").removeClass("disabled").addClass("active");
  var urls = [];
  for(var i=0; i < input_urls.length; i++) {
    urls.push(input_urls[i].value);
  }
  chrome.runtime.sendMessage({type: "page", page: "purge_result_page", previous_page: "purge_by_url", purge: {type: "url", targets: urls}}, function(response) {
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

// see purge log button
$("#display_page").on("click", "#see_purge_log", function() {
  let reqid = $(this).attr("reqid"); 
  chrome.runtime.sendMessage({type: "page", page: "see_purge_log", previous_page: "purge_result_page", reqid: reqid});
});
