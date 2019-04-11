$("#display_page").on("keyup", "#json_input", function() {
  try {
    JSON.parse($(this).val());
    $("#json_status").html("Vaild JSON").removeClass("red").addClass("green"); 
    $(this).css("border-color", "green");
  } catch (e) {
    $("#json_status").html("Invaild JSON").removeClass("green").addClass("red"); 
    $(this).css("border-color", "red");
  }
});

$("#display_page").on("click", "#purge_json_button", function() {
  try {
    var input_json = JSON.parse($("#display_area").find("#json_input").val());
  } catch(err) {
    chrome.runtime.sendMessage({
      type: "notification", 
      msg: "Entered JSON is not in the right format",
      msgtype: "negative",
      disappear: 2000
    });
    return false;
  }
  $("#loader").removeClass("disabled").addClass("active");
  chrome.runtime.sendMessage({type: "page", page: "purge_result_page", previous_page: "purge_json", purge: {type: "json", targets: [input_json]}}, function(response) {
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
