/**
 * 加密，解密工具类
 */
import CryptoJS from 'crypto-js/crypto-js' //引用AES源码js
//key值，要和后端的key相同
 var key = CryptoJS.enc.Utf8.parse("abcdef0123456789");
// export	function Encrypt(word) {
// 		var srcs = CryptoJS.enc.Utf8.parse(word);
// 		var encrypted = CryptoJS.AES.encrypt(srcs, key, {
// 			mode : CryptoJS.mode.ECB,
// 			padding : CryptoJS.pad.Pkcs7
// 		});
// 		return encrypted.toString();
// 	}
export function Encrypt(word) {
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
	return encrypted.ciphertext.toString().toUpperCase();
  }
	// export	function Decrypt(word) {
	// 	// var srcs = CryptoJS.enc.Utf8.parse(word);
	// 	var decrypt = CryptoJS.AES.decrypt(word, key, {
	// 		mode : CryptoJS.mode.ECB,
	// 		padding : CryptoJS.pad.Pkcs7
	// 	});
	// 	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	// }
export	function Decrypt(word) {
		let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
		let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
		let decrypt = CryptoJS.AES.decrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
		let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
		return decryptedStr.toString();
	  }

