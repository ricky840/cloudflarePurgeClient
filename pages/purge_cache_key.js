var purgeCacheKey = (function(global) {
  'use strict';

  function loadCustomCacheKeyPurge(callback) {
    return new Promise(function(resolve, reject) {
      var html = '';
      var tophtml = '<button id="purge_cache_key_button" class="ui button icon orange small" data-tooltip="Purge" data-position="bottom right">';
      tophtml += '<i class="trash icon"></i></button>';

      html += '<div class="ui message small">'; 
      html += '<ul class="list">';
      html += '<li>To purge files with custom cache keys, include the headers used to compute the cache key as in the example.</li>';
      html += '<li>To purge files with ${geo} or ${devicetype} in their cache keys, include the CF-Device-Type or CF-IPCountry headers.</li>';
      html += '</ul>';
      html += '</div>';

			html += '<div id="add_header" class="add_header">';
			html += '<button class="circular ui icon button mini" style="margin:0px;" data-tooltip="Add header" data-position="top right">';
      html += '<i class="plus icon"></i>';
			html += '</button>';
			html += '</div>';

      html += '<div id="custom_header_form" class="ui form small">';
      html += '<div class="fields" style="margin-bottom: 0px;">';
      html += '<div class="field field_header">';
      html += '<label>Header</label>';
      html += '</div>';
      html += '<div class="field field_value">';
      html += '<label>Value</label>';
      html += '</div>';
      html += '</div>';
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
      html += '</div>';

      html += '<div class="divider"></div>';

      html += '<div id="purge_custom_url" class="ui form small">';
      html += '<div class="field required">';
      html += '<label>Purge URL</label>';
      html += "<input id='custom_purge_urls' name='tags-outside' class='required tagify--outside' placeholder='Enter URL here'>";
      html += '</div>';
      html += '</div>';

      resolve({html: html, tophtml: tophtml});
    });
  }

  return {
    loadCustomCacheKeyPurge: loadCustomCacheKeyPurge
  }
})(this);
