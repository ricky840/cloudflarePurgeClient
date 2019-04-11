$("#display_page").on("click", "#purge_tag_button", function() {
  try {
    var tags = JSON.parse($("#display_area").find("#tag").val());
    if (tags.length <= 0) throw "No tag was entered";
  } catch(err) {
    chrome.runtime.sendMessage({
      type: "notification", 
      msg: "Please enter tags",
      msgtype: "negative",
      disappear: 2000
    });
    return false;
  }
  $("#loader").removeClass("disabled").addClass("active");
  var taggings = [];
  for(var i=0; i < tags.length; i++) {
    taggings.push(tags[i].value);
  }
  chrome.runtime.sendMessage({type: "page", page: "purge_result_page", previous_page: "purge_by_tag", purge: {type: "tag", targets: taggings}}, function(response) {
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
