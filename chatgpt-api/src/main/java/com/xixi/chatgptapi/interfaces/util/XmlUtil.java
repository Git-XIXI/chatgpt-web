package com.xixi.chatgptapi.interfaces.util;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.core.util.QuickWriter;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.DomDriver;
import com.thoughtworks.xstream.io.xml.PrettyPrintWriter;
import com.thoughtworks.xstream.io.xml.XppDriver;
import org.apache.commons.lang3.StringUtils;

import java.io.Writer;

/**
 * @description: 微信公众号发送消息，解析工具类
 * @date 2023/11/20 17:34
 */
public class XmlUtil {

    // xstream拓展，bean转xml自动加上<[!CDATA[]]
    private static XStream getMyStream() {
        return new XStream(new XppDriver() {
            @Override
            public HierarchicalStreamWriter createWriter(Writer out) {
                return new PrettyPrintWriter(out) {
                    // 对所有xml节点增加CDATA标记
                    boolean cdata = true;

                    @Override
                    public void startNode(String name, Class clazz) {
                        super.startNode(name, clazz);
                    }

                    @Override
                    protected void writeText(QuickWriter writer, String text) {
                        // 判断是否是CDATA，并且文本是否是数字
                        if (cdata && !StringUtils.isNumeric(text)) {
                            // 如果是CDATA，并且文本不是数字，则写入CDATA标签
                            writer.write("<![CDATA[");
                            writer.write(text);
                            writer.write("]]>");
                        } else {
                            // 否则直接写入文本
                            writer.write(text);
                        }
                    }
                };
            }
        });
    }

    /**
     * bean转成微信的xml消息格式
     *
     * @param object
     * @return
     */
    public static String beanToXml(Object object) {
        XStream xStream = getMyStream();
        // 设置别名
        xStream.alias("xml", object.getClass());
        // 处理注解
        xStream.processAnnotations(object.getClass());
        // 转换成XML
        String xml = xStream.toXML(object);
        // 判断XML是否为空
        if (!StringUtils.isEmpty(xml)) {
            return xml;
        } else {
            return null;
        }
    }

    /**
     * xml转成bean泛型方法
     *
     * @param resultXml
     * @param clazz
     * @param <T>
     * @return
     */
    public static <T> T xmlToBean(String resultXml, Class clazz) {
        // XStresm对象默认安全防护，同时设置允许的类
        XStream xStream = new XStream(new DomDriver());
        // 设置默认安全防护
        XStream.setupDefaultSecurity(xStream);
        // 允许指定类型的类
        xStream.allowTypes(new Class[]{clazz});
        // 处理注解
        xStream.processAnnotations(new Class<?>[]{clazz});
        // 设置模式为XStream.NO_REFERENCES，表示不引用其他类
        xStream.setMode(XStream.NO_REFERENCES);
        // 为指定类创建一个别名，别名为xml
        xStream.alias("xml", clazz);
        return (T) xStream.fromXML(resultXml);
    }


}