package cn.showclear.www.pojo.common;

import java.io.InputStream;

/**
 * 在文件下载中， 返回文件 二进制数据 和 文件名 两个信息使用
 * (二进制数据对于内存的开销过大 使用流可以减小开销)
 */
public class LocalFile {
    @Deprecated
    private byte[] fileBytes;

    private String fileName;
    private InputStream fileInputStream;
    public LocalFile(){}

    public LocalFile(byte[] fileBytes, String fileName) {
        this.fileBytes = fileBytes;
        this.fileName = fileName;
    }

    public LocalFile(String fileName, InputStream fileInputStream) {
        this.fileName = fileName;
        this.fileInputStream = fileInputStream;
    }

    public byte[] getFileBytes() {
        return fileBytes;
    }

    public void setFileBytes(byte[] fileBytes) {
        this.fileBytes = fileBytes;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public InputStream getFileInputStream() {
        return fileInputStream;
    }

    public void setFileInputStream(InputStream fileInputStream) {
        this.fileInputStream = fileInputStream;
    }
}
