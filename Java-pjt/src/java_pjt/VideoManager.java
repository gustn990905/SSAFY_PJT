package java_pjt;

import java.io.File;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.Reader;
import java.io.Writer;
import com.google.gson.Gson;

public class VideoManager {
	private int size = 0;
	private int MAX_SIZE = 100;

	// 싱글턴
	private static VideoManager instance = new VideoManager();

	private VideoManager() {
	};

	Gson gson = new Gson();

	public static VideoManager getInstance() {
		return instance;
	}


	public Video[] readFile() {
	    File f = new File("Video.txt");
		try {
		    if (!f.exists()) {
	            f.createNewFile();
	        }

	        if (f.length() == 0) {
	            return new Video[MAX_SIZE];
	        }
			Reader reader = new FileReader("Video.txt");
			Video[] videoList = gson.fromJson(reader, Video[].class);
			reader.close();
			return videoList;

		} catch (Exception e) {
			System.out.println("error");
			return null;
		}
	}
	public boolean writeFile(Video[] Videos) {
		try {
			Writer writer = new FileWriter("Video.txt");
			String json = gson.toJson(Videos);
			writer.write(json);
			writer.close();
			return true;

		} catch (Exception e) {
			System.out.println("error");
			return false;
		}
	}
	public String add(Video video) {
		Video[] videoList = readFile();

		if (size < 100) {
			videoList[size++] = video;
		}
		writeFile(videoList);
		return "등록 성공";

	}

	public Video[] getList() {
		Video[] videoList = readFile();
		return videoList;
	}

	public boolean videoEdit(Video video) {
		Video[] videoList = readFile();
		for (int i = 0; i < size; i++) {
			if (videoList[i].getVideoId() == video.getVideoId()) {
				videoList[i] = video;
			}
		}
		writeFile(videoList);
		return true;
	}

	public boolean videoRemove(Video video) {
		Video[] videoList = readFile();
		for (int i = 0; i < size; i++) {
			if (videoList[i].getVideoId() == video.getVideoId()) {
				videoList[i] = null;
			}

			for (int j = i; j < size - 1; j++) {
				videoList[j] = videoList[j + 1];
			}
			writeFile(videoList);
			return true;
		}
		return false;
	}

	public Video[] searchByTitle(String title) {
		Video[] videoList = readFile();
		int cnt = 0;
		for (int i = 0; i < size; i++) {
			if (videoList[i].getVideoTitle().contains(title)) {
				cnt++;
			}
		}

		Video[] result = new Video[cnt];
		int idx = 0;
		for (int j = 0; j < size; j++) {
			if (videoList[j].getVideoTitle().contains(title)) {
				result[idx++] = videoList[j];
			}
		}
		return result;
	}

}
