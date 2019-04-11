$("#display_area").on('click', ".activate_button", function() {
  $("#key_list button").removeClass("positive");
  let clicked_button = $(this);
  clicked_button.addClass("positive");
  var key_id = clicked_button.children("i").attr("keyid");
  chrome.runtime.sendMessage({type: "key", action: "activate", key_id: key_id }, function(response) {
    if (!response.result) {
      clicked_button.removeClass("positive");
    }
  });
});

// Key info
$("#display_page").on('click', '#key_list .content', function() {
  var key_id = $(this).attr('id');
  chrome.runtime.sendMessage({type: "page", page: "see_key_info", previous_page: "key_list_page", key_id: key_id});
});

// Add a new key button
$("#display_page").on('click', '#add_new_key', function() {
  chrome.runtime.sendMessage({type: "page", page: "add_new_key", previous_page: "key_list_page"});
});

// Save a new key button
$("#display_page").on('submit', '#new_key', function() {
  var zone_id = $("#new_zone_id").val().trim();
  var zone_domain = $("#new_zone_domain").val().trim();
  var email = $("#new_email").val().trim();
  var api_key = $("#new_api_key").val().trim();
  var new_key = {
    'zone_id': zone_id,
    'zone_domain': zone_domain,
    'api_key': api_key,
    'email': email,
    'id': new Date().getTime().toString()
  }
  chrome.runtime.sendMessage({type: "key", action: "save", new_key: new_key }, function(response) {
    if (response.result) {
      $(".backbutton").trigger('click');
      chrome.runtime.sendMessage({ type: "notification", msg: "Successfully saved", disappear: 2000});
    }
  });
  return false;
});

// Update - Save Key Button
$("#display_page").on('submit', '#update_key', function(event) {
  var zone_id = $("#updated_zone_id").val().trim();
  var zone_domain = $("#updated_zone_domain").val().trim();
  var email = $("#updated_email").val().trim();
  var api_key = $("#updated_api_key").val().trim();
  var key_id = $("#updated_key_id").val();
  var updated_apikey = {
    'zone_id': zone_id,
    'zone_domain': zone_domain,
    'api_key': api_key,
    'email': email,
    'id': key_id 
  }
  chrome.runtime.sendMessage({type: "key", action: "update", new_key: updated_apikey, key_id: key_id }, function(response) {
    if (response.result) {
      $(".backbutton").trigger('click');
      chrome.runtime.sendMessage({ type: "notification", msg: "Updated successfully!", disappear: 2000 });
    }
  });
  return false;
});

// Delete Key Button
$("#display_page").on('click', "#delete_key_button", function() {
  var key_id = $(this).attr("keyid"); 
  chrome.runtime.sendMessage({type: "key", action: "delete", key_id: key_id }, function(response){
    if (response.result) {
      $(".backbutton").trigger('click');
      chrome.runtime.sendMessage({ type: "notification", msg: "Removed Successfully", disappear: 2000 });
    }
  });
});
