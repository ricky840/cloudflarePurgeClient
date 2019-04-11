var encdec = (function(global) {
  'use strict';

  const enkey = '1655959604103034488113670823001292669092';

  function a(obj) {
    if (jQuery.isEmptyObject(obj)) {
      return false;
    } else {
      try {
        var str = JSON.stringify(obj);
        var encrypted = CryptoJS.AES.encrypt(str, enkey);
      } catch (err) {
        console.log(err);
        return false;
      }
      return encrypted.toString();
    }
  }

  function b(enstr) {
    if (enstr == undefined || enstr == null || enstr == '') {
      return false;
    } else {
      try {
        var decrypted = CryptoJS.AES.decrypt(enstr, enkey);
        var str = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(str);
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }

  function decryptKeys(arr_keys) {
    var arr_dec_keys = [];
    for (var i=0; i < arr_keys.length; i++) {
      var decrypted_key = b(arr_keys[i]);
      if (decrypted_key) {
        arr_dec_keys.push(b(arr_keys[i]));
      } else {
        debugOutput({text: "Failed to decrypt a key, please remove this key", data: arr_keys[i]});
      }
    }
    return arr_dec_keys;
  }

  function encryptKeys(arr_keys) {
    var arr_enc_keys = [];
    for (var i=0; i < arr_keys.length; i++) {
      var encrypted_key = a(arr_keys[i]);
      if (encrypted_key) {
        arr_enc_keys.push(a(arr_keys[i]));
      } else {
        debugOutput({text: "Failed to encrypt a key, please remove this key", data: arr_keys[i]});
      }
    }
    return arr_enc_keys;
  }

  return {
    encrypt: a,
    decrypt: b,
    decryptKeys: decryptKeys,
    encryptKeys: encryptKeys
  }

})(this);
