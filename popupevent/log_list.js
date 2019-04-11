$("#display_page").on('click', '#log_list .content', function() {
  var log_id = $(this).attr('id');
  chrome.runtime.sendMessage({type: "page", page: "see_purge_log", previous_page: "log_list_page", reqid: log_id});
});

// purge delete all button
$("#display_page").on('click', '#delete_all_purgelog_button', function() {
  chrome.runtime.sendMessage({type: "purge", action: "delete_all_log"}, function(response){
    if (response.result) {
      $("#display_area").empty();
      chrome.runtime.sendMessage({ type: "notification", msg: "Removed Successfully" });
    }
  });
});
