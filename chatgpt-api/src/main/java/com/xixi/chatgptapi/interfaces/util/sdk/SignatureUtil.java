package com.xixi.chatgptapi.interfaces.util.sdk;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @description: TODO
 * @date 2023/11/20 17:35
 */
public class SignatureUtil {
    /**
     * 验证签名
     */
    public static boolean check(String token, String signature, String timestamp, String nonce) {
        String[] arr = {token, timestamp, nonce};
        // 将token、timestamp、nonce三个参数进行字典序排序
        sort(arr);
        StringBuilder content = new StringBuilder();
        for (String s : arr) {
            content.append(s);
        }
        MessageDigest md;
        String tmpArr = null;
        try {
            md = MessageDigest.getInstance("SHA-1");
            // 将三个参数字符串拼接成一个字符串进行sha1加密生成摘要
            byte[] digest = md.digest(content.toString().getBytes());
            tmpArr = byteToStr(digest);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        // 将SHA-1加密后的字符串可与signature对比，标识该请求来源于微信
        return tmpArr != null && tmpArr.equals(signature.toUpperCase());
    }

    /**
     * 将字节数组转换为十六进制字符串
     */
    private static String byteToStr(byte[] byteArray) {
        StringBuilder strDigest = new StringBuilder();
        for (byte b : byteArray) {
            strDigest.append(byteToHexStr(b));
        }
        return strDigest.toString();
    }

    /**
     * 将字节转换为十六进制字符串
     */
    private static String byteToHexStr(byte mByte) {
        char[] Digit = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        char[] tempArr = new char[2];
        tempArr[0] = Digit[(mByte >>> 4) & 0X0F];
        tempArr[1] = Digit[mByte & 0X0F];
        return new String(tempArr);
    }

    /**
     * 字典排序
     *
     * @paramarr
     */
    private static void sort(String[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j].compareTo(arr[i]) < 0) {
                    String temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    }
}
