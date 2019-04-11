$("#display_page").on("click", "#purge_all_button", function() {
  $("#loader").removeClass("disabled").addClass("active");
  chrome.runtime.sendMessage({type: "page", page: "purge_result_page", previous_page: "purge_all", purge: {type: "all"}}, function(response) {
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
