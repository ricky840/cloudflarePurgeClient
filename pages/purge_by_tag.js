var purgeByTag = (function(global) {
  'use strict';

  function loadTagPurge(callback) {
    return new Promise(function(resolve, reject) {
      var tophtml = '<button id="purge_tag_button" class="ui button icon small orange" data-tooltip="Purge" data-position="bottom right">';
      tophtml += '<i class="cog icon"></i></button>';
      var html = '';

      html += '<div class="ui message small">'; 
      html += '<p>Cache-Tag and host purging each have a rate limit of 30,000 purge API calls in every 24 hour period. You may purge up to 30 tags or hosts in one API call. This rate limit can be raised for customers who need to purge at higher volume.</p>';
      html += '</div>';

      html += '<div id="purgetag" class="ui form small">';
      html += '<div class="field required">';
      html += '<label>Purge by Tag</label>';
      html += '<input id="tag" placeholder="tag"></input>';
      html += '</div>';
      html += '</div>';
      resolve({html: html, tophtml: tophtml});
    });
  }

  return {
    loadTagPurge: loadTagPurge
  }
})(this);
