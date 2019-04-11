var mainPage = (function(global) {

  var loadMainPage = function() {
    var popup = chrome.extension.getViews({type: "popup"})[0];
    popup.$("#display_page").transition('slide left', function() {
      popup.$("#main_page").removeClass('transition').removeClass('hidden');
      popup.$("#display_page").removeClass('transition').removeClass('hidden').hide();
      popup.$("#display_area").empty();
      popup.$("#display_top_area").empty();
    });
  }

  var loadClientVersion = function() {
    // only update when popup is active
    var popup = chrome.extension.getViews({type: "popup"})[0];
    if (popup !== undefined) {
      var manifest = chrome.runtime.getManifest();
      popup.$("#client_version").empty().append(manifest.version);
    }
  }

  var loadActiveKey = function() {
    var popup = chrome.extension.getViews({type: "popup"})[0];
    var html = "";
    apiKey.getActivatedApiKey().then(function(active_key) {
      if(popup.$.isEmptyObject(active_key)) {
        html += '<a class="ui small header">No Active API Key</a>';
        html += '<div id="goto_managekey" class="ui small meta">Go to <a class="ui label inline_label orange">Manage API Keys</a></div>';
        popup.$("#logoimg").attr("src", LogoImageBlack);
      } else {
        html += '<a class="ui small header">' + active_key.zone_domain + '</a>';
        html += '<div class="ui small meta">' + active_key.email + '</div>';
        popup.$("#logoimg").attr("src", LogoImage);
      }
      popup.$(".active.content").empty().append(html);
    });
  };

  var loadActiveKeyTop = function() {
    // only update when popup is active
    var popup = chrome.extension.getViews({type: "popup"})[0];
    if (popup !== undefined) {
      var html = "";
      if ($.isEmptyObject(activeApiKeyCache)) {
        html += '<div class="description">No Active API Key</div>';
        popup.$("#active_key_indicator").empty().append(html);
      } else {
        html += '<div>' + activeApiKeyCache.zone_domain +'</div>';
        html += '<div class="description">' + activeApiKeyCache.email + '</div>';
        popup.$("#active_key_indicator").empty().append(html);
      }
    }
  }

  return {
    loadMainPage: loadMainPage,
    loadActiveKey: loadActiveKey,
    loadActiveKeyTop: loadActiveKeyTop,
    loadClientVersion: loadClientVersion
  }
})(this);
