var manageKey = (function(global) {
  'use strict';

  function loadApiKeyList(callback) {
    apiKey.getApiKeys().then(function(arr_api_keys) {
      var html = '<div id="key_list" class="ui middle aligned selection list small">';
      var active_button ='<button class="ui basic button circle activate_button positive">';
      var deactive_button ='<button class="ui basic button circle activate_button">';
      var html2 = '<div id="add_new_key" class="ui icon button backbutton small" data-tooltip="Add new API Key" data-position="bottom right">';
      html2 += '<i class="plus icon"></i>';
      html2 += '</div>';
      if(arr_api_keys.length === 0) {
        html += '<div class="ui message small">';
        html += '<div class="header">No API keys are available</div>';
        html += '<p>You can obtain your API key from the bottom of the "My Account" page in Cloudflare dashboard.</p>';
        html += '</div>';
      } else {
        for (var i=0; i < arr_api_keys.length; i++) {
          html += '<div class="item">';
          html += '<img id="keyimg" class="ui avatar image" src="'+ KeyImage + '">';
          html += '<div class="content" id="' + arr_api_keys[i].id + '">';
          html += '<a class="header">'+ arr_api_keys[i].zone_domain + '</a>';
          html += arr_api_keys[i].email;
          html += '</div>';
          html += '<div class="ui mini basic icon buttons circle right floated">';
          html += (activeApiKeyCache.id === arr_api_keys[i].id) ? active_button : deactive_button;
          html += '<i class="power off icon" keyid=' + arr_api_keys[i].id + '></i>';
          html += '</button></div>';
          html += '</div>';
        }
      }
      html += '</div>';

      callback({html: html, tophtml: html2});
    });
  }

  function loadApiKeyInfo(key_id, callback) {
    apiKey.getApiKeys(key_id).then(function(arr_api_keys) {
      var key = arr_api_keys[0];
      var html = '<form class="ui form small" id="update_key">';
      html += '<div class="field required">';
      html += '<label>Domain</label>';
      html += '<input type="text" id="updated_zone_domain" required value="' + key.zone_domain + '">';
      html += '</div>';
      html += '<div class="field required">';
      html += '<label>Zone ID</label>';
      html += '<input type="text" id="updated_zone_id" required value="' + key.zone_id + '">';
      html += '</div>';
      html += '<div class="field required">';
      html += '<label>API Key</label>';
      html += '<input type="text" id="updated_api_key" required value="' + key.api_key + '">';
      html += '</div>';
      html += '<div class="field required">';
      html += '<label>Email</label>';
      html += '<input type="email" id="updated_email" required value="' + key.email + '">';
      html += '</div>';
      html += '<input type="text" id="updated_key_id" value="' + key.id + '" style="display: none;">';
      html += '<button class="ui button orange small" type="submit">Save</button>';
      html += '</form>';
      var html2 = '<div id="delete_key_button" class="ui icon button small" keyid="' + key.id + '"data-tooltip="Delete Key" data-position="bottom right">';
      html2 += '<i class="trash icon"></i>';
      html2 += '</div>';
      callback({html: html, tophtml: html2});
    });
  }

  function loadNewKeyPage(callback) {
    var html = '<form id="new_key" class="ui form small">';
    html += '<div class="field required">';
    html += '<label>Domain</label>';
    html += '<input type="text" id="new_zone_domain" required placeholder="example.com">';
    html += '</div>';
    html += '<div class="field required">';
    html += '<label>Zone ID</label>';
    html += '<input type="text" id="new_zone_id" required placeholder="7626211ffabbc676bbd50c7f6865a1">';
    html += '</div>';
    html += '<div class="field required">';
    html += '<label>API Key</label>';
    html += '<input type="text" id="new_api_key" required placeholder="3b33d123k9c8469956e2a80d9cb8c837ab">';
    html += '</div>';
    html += '<div class="field required">';
    html += '<label>Email</label>';
    html += '<input type="email" id="new_email" required placeholder="hello@gmail.com">';
    html += '</div>';
    html += '<button class="ui button orange small" type="submit">Save</button>';
    html += '</form>';
    callback({html: html});
  }

  return {
    loadApiKeyList: loadApiKeyList,
    loadApiKeyInfo: loadApiKeyInfo,
    loadNewKeyPage: loadNewKeyPage
  }
})(this);
