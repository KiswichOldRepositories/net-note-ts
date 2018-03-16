package cn.showclear.www.pojo.common;

import java.io.InputStream;

/**
 * 用于service和controller层的交互 包括一个文件的输入流和这个文件的文件名
 */
public class ReturnFile {
    //文件的输入流
    private InputStream inputStream;
    //文件的文件名
    private String fileName;

    public ReturnFile() {
    }

    public ReturnFile(InputStream inputStream, String fileName) {
        this.inputStream = inputStream;
        this.fileName = fileName;
    }

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
