window.onload = function() {
  chrome.runtime.sendMessage({type: "init", target: "backpage"});
};

$(document).ready(function() {
  chrome.runtime.sendMessage({type: "load", page: "active_key"});
  chrome.runtime.sendMessage({type: "load", page: "load_version"});

  chrome.storage.local.get("notice_installed", function(result) {
    if(result['notice_installed']) {
      chrome.runtime.sendMessage({
        type: "notification", 
        msg: "Thanks for installing. Enjoy purging in a few clicks! :)", 
        dom_id: "main_notification_area",
        disappear: 300000,
        msgtype: "orange"
      });
    }
    chrome.storage.local.set({'notice_installed': false});
  });

  chrome.storage.local.get("notice_updated", function(result) {
    if(result['notice_updated']) {
      var manifest = chrome.runtime.getManifest();
      chrome.runtime.sendMessage({
        type: "notification", 
        msg: 'Updated to v'+ manifest.version +' ;)',
        dom_id: "main_notification_area",
        disappear: 300000,
        msgtype: "orange"
      });
    }
    chrome.storage.local.set({'notice_updated': false});
  });

  eventjs = [
    'manage_key.js',
    'purge_url.js',
    'purge_tag.js',
    'purge_host.js',
    'purge_json.js',
    'purge_custom.js',
    'purge_all.js',
    'log_list.js'
  ]

  loadScripts(eventjs); 

  $(".backbutton").click(function() { chrome.runtime.sendMessage({type: "page", page: "back"}); });
  $("#main_page").on("click", "#goto_managekey", function() { $("#manage_key").trigger('click'); });
  $("#purge_by_url").click(function() { chrome.runtime.sendMessage({type: "page", page: "purge_by_url", previous_page: "main_page"}); });
  $("#purge_by_host").click(function() { chrome.runtime.sendMessage({type: "page", page: "purge_by_host", previous_page: "main_page"}); });
  $("#purge_by_tag").click(function() { chrome.runtime.sendMessage({type: "page", page: "purge_by_tag", previous_page: "main_page"}); });
  $("#purge_custom").click(function() { chrome.runtime.sendMessage({type: "page", page: "purge_custom_page", previous_page: "main_page"}); });
  $("#purge_all").click(function() { chrome.runtime.sendMessage({type: "page", page: "purge_all", previous_page: "main_page"}); });
  $("#purge_json").click(function() { chrome.runtime.sendMessage({type: "page", page: "purge_json", previous_page: "main_page"}); });
  $("#manage_key").click(function() { chrome.runtime.sendMessage({type: "page", page: "key_list_page", previous_page: "main_page"}); });
  $("#view_purge_logs").click(function() { chrome.runtime.sendMessage({type: "page", page: "log_list_page", previous_page: "main_page"}); });
});
