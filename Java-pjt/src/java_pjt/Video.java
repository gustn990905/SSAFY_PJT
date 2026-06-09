package java_pjt;

public class Video {
	private int videoId;
	private String videoTitle;
	private String videoPart;
	private String videoUrl;

	public Video() {

	}

	public Video(int videoId, String videoTitle, String videoPart, String videoUrl) {
		this.videoId = videoId;
		this.videoTitle = videoTitle;
		this.videoPart = videoPart;
		this.videoUrl = videoUrl;
	}

	public int getVideoId() {
		return videoId;
	}

	public void setVideoId(int videoId) {
		this.videoId = videoId;
	}

	public String getVideoTitle() {
		return videoTitle;
	}

	public void setVideoTitle(String videoTitle) {
		this.videoTitle = videoTitle;
	}

	public String getVideoPart() {
		return videoPart;
	}

	public void setVideoPart(String videoPart) {
		this.videoPart = videoPart;
	}

	public String getVideoUrl() {
		return videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	@Override
	public String toString() {
		return "video [videoId=" + videoId + ", videoTitle=" + videoTitle + ", videoPart=" + videoPart + ", videoUrl="
				+ videoUrl + "]";
	}

}
