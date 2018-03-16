package cn.showclear.utils.zip;

import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 用来往zipoutputstream中加入文件，重名文件就在文件后依次加入"（数字）"解决
 * ps：（按照文件规则 现在在创建、修改文件数据时校验重名问题。）
 */
public class FileZipNameManeger {
    private ZipOutputStream zipOutputStream;
    private String zipFolderName;
    private String fileName;
    private String filePostfix;
    private int fileNumber;

    public FileZipNameManeger(ZipOutputStream zipOutputStream, String zipFolderName, String fileName) {
        this.zipOutputStream = zipOutputStream;
        this.zipFolderName = zipFolderName;
        //文件名分割成 文件名和后缀名 方便处理
        String[] strings = fileName.split("\\.");
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < strings.length - 1; i++) {
            stringBuilder.append(strings[i]).append(".");
        }
        stringBuilder.deleteCharAt(stringBuilder.length() - 1);

        this.fileName = stringBuilder.toString();
        this.filePostfix = strings[strings.length - 1];
    }

    /**
     * 处理重名的情况，（重名时文件后面加（n））,并加入到zipoutputstream
     *
     * @return
     */
    public void putFileEntry() {
        while (!checkZipName()) {//先尝试着放一次
            //进行失败处理
            fileNumber++;
        }
    }

    private boolean checkZipName() {
        try {
            ZipEntry zipEntry = null;
            if (fileNumber == 0) {//第一次忽略文件序号
                zipEntry = new ZipEntry(new StringBuilder().append(zipFolderName)
                        .append(fileName).append(".").append(filePostfix)
                        .toString());
            } else {//第2+次加上文件序号
                zipEntry = new ZipEntry(new StringBuilder().append(zipFolderName)
                        .append(fileName).append("(").append(fileNumber).append(").").append(filePostfix)
                        .toString());
            }
            zipOutputStream.putNextEntry(zipEntry);//尝试着放
            return true;
        } catch (Exception e) {//一般是重名了
            return false;
        }
    }
}
