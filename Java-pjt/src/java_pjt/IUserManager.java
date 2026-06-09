package java_pjt;

public interface IUserManager {
	void add(User user);
	User[] getList();
	User[] searchByName(String name);
}
