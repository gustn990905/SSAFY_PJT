package java_pjt;
import java.util.*;
import java.io.*;

import com.google.gson.Gson;

public class UserManagerImpl implements IUserManager {
	private int size = 0;
	private int MAX_SIZE = 100;
	private static IUserManager instance = new UserManagerImpl();
	Gson gson = new Gson();
	private UserManagerImpl() {};
	public static IUserManager getInstance() {
		return instance;
	}
	
	public User[] readFile() {
	    File f = new File("User.txt");
	    if (!f.exists() || f.length() == 0) {
	        return new User[MAX_SIZE];
	    }
		try {
			Reader reader = new FileReader("User.txt");
			User[] userList = gson.fromJson(reader, User[].class);
			reader.close();
			return userList;

		} catch (Exception e) {
			System.out.println("error");
			return null;
		}
	}
	public boolean writeFile(User[] users) {
		try {
			Writer writer = new FileWriter("User.txt");
			String json = gson.toJson(users);
			writer.write(json);
			writer.close();
			return true;

		} catch (Exception e) {
			System.out.println("error");
			return false;
		}
	}

	public void add(User user) {
		User[] userList = readFile();
		userList[size++] = user;
		writeFile(userList);
	}
	public User[] getList() {
		User[] userList = readFile();
		return userList;
	}
	public User[] searchByName(String name) {
		User[] userList = readFile();
		int cnt = 0;
		for (int i=0; i<MAX_SIZE; i++) {
			if (userList[i]!=null && userList[i].getName().contains(name)) {
				cnt++;
			}
		}
		if (cnt==0) return null;
		User[] ul = new User[cnt];
		for (int i=0, idx=0; i<MAX_SIZE; i++) {
			if (userList[i]!=null && userList[i].getName().contains(name)) {
				ul[idx++] = userList[i];
			}
		}
		return ul;
	}
	public boolean editUser(User user) {
		User[] userList = readFile();
		for (int i=0; i<MAX_SIZE; i++) {
			if (userList[i].getId()==user.getId()) {
				userList[i] = user;
				writeFile(userList);
				return true;
			}
		}
		return false;
	}
	public boolean removeUser(int userId) {
		User[] userList = readFile();
		for (int i=0; i<MAX_SIZE; i++) {
			if (userList[i].getId()==userId) {
				for (int j=i; j<MAX_SIZE-1;j++) {
					userList[j] = userList[j+1];
				}
				writeFile(userList);
				return true;
			}
		}
		return false;
	}
}
