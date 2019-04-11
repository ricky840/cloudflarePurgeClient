$("#display_page").on("click", "#add_header", function() {
  var custom_header_form = $("#display_page").find("#custom_header_form");
  var html = '';
  html += '<div class="fields">';
  html += '<div class="field field_header">';
  html += '<input type="text" name="header_name" placeholder="Header">';
  html += '</div>';
  html += '<div class="field field_value">';
  html += '<input type="text" name="header_value" placeholder="Value">';
  html += '</div>';
  html += '<div class="field remove_header_field">';
  html += '<button class="ui button icon remove_header"><i class="x icon"></i></button>';
  html += '</div>';
  html += '</div>';
  custom_header_form.append(html);
});

$("#display_page").on("click", ".remove_header", function() {
  $(this).closest(".fields").remove();
});

$("#display_page").on("click", "#purge_cache_key_button", function() {
  try {
    var input_urls = JSON.parse($("#display_area").find("#custom_purge_urls").val());
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
  var raw_headers = $("#display_area").find("#custom_header_form input").serializeArray();
  var names = []; 
  var values = [];
  var headers = {};
  for (var i = 0; i < raw_headers.length; i++) {
    raw_headers[i].name === "header_name" ? names.push(raw_headers[i].value.trim()) : values.push(raw_headers[i].value.trim());  
  }
  names.forEach((key, i) => headers[key] = values[i]);
  chrome.runtime.sendMessage({type: "page", page: "purge_result_page", previous_page: "purge_custom_page", purge: {type: "custom", targets: [urls, headers]}}, function(response) {
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
