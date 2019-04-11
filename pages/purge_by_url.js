var purgeByUrlPage = (function(global) {
  'use strict';

  function loadPage() {
    return new Promise(function(resolve, reject) {
      var tophtml = '<button id="purge_url_button" class="ui button icon small orange" data-tooltip="Purge" data-position="bottom right">';
      tophtml += '<i class="cog icon"></i></button>';
      var html = '<div id="purge_url_page">';
      html += '<div class="ui message small">'; 
      // html += '<div class="small header">';
      // html += '';
      // html += '</div>';
      html += '<ul class="list">';
      html += '<li>You can enter multiple URLs.</li>';
      html += '<li>Wildcards are not supported with single file purge. Specify the full path to the file.'
      html += '<li>URL should include <a class="ui basic label inline_label">https://</a>or';
      html += '<a class="ui basic label inline_label">https://</a></li>';
      html += '<li>Delimiters are<a class="ui basic label inline_label">enter</a>';
      html += '<a class="ui basic label inline_label">,</a>and';
      html += '<a class="ui basic label inline_label">tab</a></li>';
      html += '</ul>';
      html += '</div>';

      html += '<div id="purgeurl" class="ui form small">';
      html += '<div class="field required">';
      html += '<label>Purge by URL</label>';
      html += "<input id='urls' name='tags-outside' class='required tagify--outside' placeholder='Enter URLs here'>";
      html += '</div>';
      html += '</div>';
      html += '</div>';
      resolve({html: html, tophtml: tophtml});
    });
  }

  return {
    loadPage: loadPage
  }
})(this);
