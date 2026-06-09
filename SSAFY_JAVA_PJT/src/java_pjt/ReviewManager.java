package java_pjt;
import java.io.*;
import java.util.*;
import com.google.gson.Gson;

public class ReviewManager {
	private int size = 0;
	private int MAX_SIZE = 100;
	private static ReviewManager instance = new ReviewManager();
	Gson gson = new Gson();
	private ReviewManager() {};
	public static ReviewManager getInstance() {
		return instance;
	}

	public Review[] readFile() {
	    File f = new File("Review.txt");
	    if (!f.exists() || f.length() == 0) {
	        return new Review[MAX_SIZE];
	    }
		try {
			Reader reader = new FileReader("Review.txt");
			Review[] reviewList = gson.fromJson(reader, Review[].class);
			reader.close();
			return reviewList;

		} catch (Exception e) {
			System.out.println("error");
			return null;
		}
	}
	public boolean writeFile(Review[] reviews) {
		try {
			Writer writer = new FileWriter("Review.txt");
			String json = gson.toJson(reviews);
			writer.write(json);
			writer.close();
			return true;

		} catch (Exception e) {
			System.out.println("error");
			return false;
		}
	}
	
	public void add(Review review) {
		Review[] reviewList = readFile();
		if (size<100) {
			reviewList[size++] = review;
		}
		writeFile(reviewList);
	}
	public Review[] getList() {
		Review[] reviewList = readFile();
		return reviewList;
	}
	public Review[] searchByName(int userId) {
		Review[] reviewList = readFile();
		int cnt = 0;
		for (int i=0; i<size; i++) {
			if (reviewList[i].getUserId()==userId) {
				cnt++;
			}
		}
		if (cnt==0) return null;
		Review[] u = new Review[cnt];
		for (int i=0, idx=0; i<size; i++) {
			if (reviewList[i].getUserId()==userId) {
				u[idx++] = reviewList[i];
			}
		}
		return u;
	}
	public boolean editReview(Review review) {
		Review[] reviewList = readFile();
		for (int i=0; i<size; i++) {
			if (reviewList[i].getReviewId()==review.getReviewId()) {
				reviewList[i] = review;
				writeFile(reviewList);
				return true;
			}
		}
		return false;
	}
	public boolean removeReview(int reviewId) {
		Review[] reviewList = readFile();
		for (int i=0; i<size; i++) {
			if (reviewList[i].getReviewId()==reviewId) {
				for (int j=i; j<size-1;j++) {
					reviewList[j] = reviewList[j+1];
				}
				writeFile(reviewList);
				return true;
			}
		}
		return false;
	}
}
