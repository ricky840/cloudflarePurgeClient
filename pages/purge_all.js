var purgeAll = (function(global) {
  'use strict';

  function loadPurgeAllPage(callback) {
    return new Promise(function(resolve, reject) {
      var tophtml = '';
      var html = '';
      var zone_html = '';
      zone_html = '<div class="ui message small">';
      zone_html += '<div class="header">'+ activeApiKeyCache.zone_domain + '</div>';
      zone_html += '</div>';

      html += '<div class="ui icon error message small">';
      html += '<i class="exclamation circle icon"></i>';
      html += '<div class="content">';
      html += '<div class="header">';
      html += 'Are you sure you want to purge everything?';
      html += '</div>';
      html += '<p>Purging everything clears all resources from the cache immediately. This might overload your origin server.</p>';
      html += '</div>';
      html += '</div>';

      html += '<div style="text-align: center;">';
      html += '<div class="ui small header" style="word-break: break-all; padding: 10px;">';
      html += ($.isEmptyObject(activeApiKeyCache)) ? "Please activate API key" : zone_html;
      html += '</div>';
      html += '<button id="purge_all_button" class="ui button small orange">Purge</button>';
      html += '</div>';

      resolve({html: html, tophtml: tophtml});
    });
  }

  return {
    loadPurgeAllPage: loadPurgeAllPage
  }
})(this);
