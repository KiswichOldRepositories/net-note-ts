package cn.showclear.utils.zip;



import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 将一组file和folder打包成zip流(会输出到本地的磁盘上)
 * 为减少运算时长 尽量减小遍历对象
 */
public class PackFolder2Zip {
    //
    private List<LoadFile> loadFiles;
    private List<Folder> folders;
    //zipouputstream包装fileoutputstream ，文件路径为用户目录下的一个临时文件，发送完即删除
    private ZipOutputStream zipOutputStream;
    //流传输常用 就拿出来了
    private byte[] bytes = new byte[1024];

    public PackFolder2Zip(List<LoadFile> loadFiles, List<Folder> folders, ZipOutputStream zipOutputStream) {
        this.loadFiles = loadFiles;
        this.folders = folders;
        this.zipOutputStream = zipOutputStream;
    }

    private PackFolder2Zip() {
    }//私有化无参构造器

    public void parse(int parentFolderID) {
        //new ZipInputStream();
        try {
            for (Folder folder : folders) {
                if (folder.getId() == parentFolderID) {
                    //找到父节点
                    ZipEntry zipEntry = new ZipEntry(folder.getFolderName() + File.separator);
                    zipOutputStream.putNextEntry(zipEntry);
                    //递归
                    parseREC(parentFolderID, zipEntry);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void parseREC(int parentFolderID, ZipEntry zipEntry) throws Exception {
        for (LoadFile loadFile : loadFiles) {
            //遍历文件
            if (loadFile.getFloderID() == parentFolderID) {
                //写入zipentry(文件名)
                //ZipEntry entry = new ZipEntry(zipEntry.getName() + loadFile.getFileName());
                try {
                    //zipOutputStream.putNextEntry(entry);//重名校验
                    new FileZipNameManeger(zipOutputStream,zipEntry.getName(),loadFile.getFileName()).putFileEntry();
                }catch (Exception e){
                    e.printStackTrace();
                }
                //写入此文件的数据
                InputStream inputStream = new FileInputStream(new File(loadFile.getLocalURL()));
                int len = 0;
                while ((len = inputStream.read(bytes)) != -1) {
                    zipOutputStream.write(bytes, 0, len);
                    zipOutputStream.flush();
                }
            }
        }
        for (Folder folder : folders) {
            //遍历文件夹
            if (folder.getParentFolderID() == parentFolderID) {
                //将文件夹添加到zip中
                ZipEntry Entry = new ZipEntry(zipEntry.getName() + folder.getFolderName() +File.separator);
                zipOutputStream.putNextEntry(Entry);
                //将其作为父节点遍历
                parseREC(folder.getId(), Entry);
            }
        }
    }
}
