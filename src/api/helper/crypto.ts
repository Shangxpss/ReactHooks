import CryptoJS from "crypto-js";
const iv = CryptoJS.enc.Utf8.parse("12345678");

/**
 * DES方法加密
 * @param f 明文
 * @param e key
 * @returns {string}
 */
export function desEncrypt(f: string, e: string) {
	const h = CryptoJS.enc.Utf8.parse(e);
	const g = CryptoJS.DES.encrypt(f, h, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return g.toString();
}

/**
 * DES方法解密
 * @param g 明文
 * @param f key
 * @returns {string}
 */
export function desDecrypt(g: string, f: string) {
	const h = CryptoJS.enc.Utf8.parse(f);
	const e = CryptoJS.DES.decrypt(
		{
			ciphertext: CryptoJS.enc.Base64.parse(g)
		} as any,
		h,
		{
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}
	);
	return e.toString(CryptoJS.enc.Utf8);
}
