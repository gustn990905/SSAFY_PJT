package java_pjt;

import java.util.Scanner;

public class BoardTest {

    private static int nextInt(Scanner sc, String msg) {
        while (true) {
            System.out.print(msg);
            String line = sc.nextLine().trim();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println("숫자로 입력.");
            }
        }
    }

    private static String nextLine(Scanner sc, String msg) {
        System.out.print(msg);
        return sc.nextLine().trim();
    }

    private static <T> void printArr(String title, T[] arr) {
        System.out.println("\n== " + title + " ==");
        if (arr == null || arr.length == 0) {
            System.out.println("(empty)");
            return;
        }
        boolean any = false;
        for (T t : arr) {
            if (t != null) {
                System.out.println(t);
                any = true;
            }
        }
        if (!any) System.out.println("(empty)");
    }

    private static void printMenu() {
        System.out.println("\n========== MENU ==========");
        System.out.println("1. 사용자 추가");
        System.out.println("2. 사용자 전체 조회");
        System.out.println("3. 사용자 이름 검색");
        System.out.println("4. 비디오 추가");
        System.out.println("5. 비디오 전체 조회");
        System.out.println("6. 비디오 제목 검색");
        System.out.println("7. 리뷰 추가");
        System.out.println("8. 리뷰 전체 조회");
        System.out.println("9. 사용자ID로 리뷰 검색");
        System.out.println("-1. 종료");
        System.out.print("입력: ");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        IUserManager um = UserManagerImpl.getInstance();
        ReviewManager rm = ReviewManager.getInstance();

        VideoManager vm = VideoManager.getInstance();

        while (true) {
            printMenu();
            String input = sc.nextLine().trim();

            int menu;
            try {
                menu = Integer.parseInt(input);
            } catch (NumberFormatException e) {
                System.out.println("메뉴 번호를 숫자로 입력.");
                continue;
            }

            if (menu == -1) {
                System.out.println("프로그램 종료!");
                break;
            }

            try {
                switch (menu) {
                    case 1: {
                        int id = nextInt(sc, "id: ");
                        String pw = nextLine(sc, "password: ");
                        String name = nextLine(sc, "name: ");
                        int age = nextInt(sc, "age: ");

                        User user = new User(id, pw, name, age);
                        um.add(user);
                        System.out.println("사용자 추가 완료");
                        break;
                    }
                    case 2: {
                        User[] users = um.getList();
                        printArr("사용자 목록", users);
                        break;
                    }
                    case 3: {
                        String keyword = nextLine(sc, "검색할 이름: ");
                        User[] found = um.searchByName(keyword);
                        printArr("검색 결과", found);
                        break;
                    }
                    case 4: {
                        int videoId = nextInt(sc, "videoId: ");
                        String title = nextLine(sc, "videoTitle: ");
                        String part = nextLine(sc, "videoPart: ");
                        String url = nextLine(sc, "videoUrl: ");

                        Video v = new Video(videoId, title, part, url);

                        try {
                            String res = vm.add(v);
                            System.out.println("비디오 추가: " + res);
                        } catch (Throwable t) {
                            vm.add(v);
                            System.out.println("비디오 추가 완료");
                        }
                        break;
                    }
                    case 5: {
                        Video[] videos = vm.getList();
                        printArr("비디오 목록", videos);
                        break;
                    }
                    case 6: {
                        String keyword = nextLine(sc, "검색할 제목(포함): ");
                        Video[] found = vm.searchByTitle(keyword);
                        printArr("검색 결과", found);
                        break;
                    }
                    case 7: {
                        int reviewId = nextInt(sc, "reviewId: ");
                        int videoId = nextInt(sc, "videoId: ");
                        int userId = nextInt(sc, "userId: ");
                        String content = nextLine(sc, "content: ");

                        Review r = new Review(reviewId, videoId, userId, content);
                        rm.add(r);
                        System.out.println("리뷰 추가 완료");
                        break;
                    }
                    case 8: {
                        Review[] reviews = rm.getList();
                        printArr("리뷰 목록", reviews);
                        break;
                    }
                    case 9: {
                        int userId = nextInt(sc, "검색할 userId: ");
                        Review[] found = rm.searchByName(userId);
                        printArr("검색 결과", found);
                        break;
                    }
                    default:
                        System.out.println("없는 메뉴.");
                }
            } catch (Exception e) {
                System.out.println("처리 중 오류: " + e.getMessage());
            }
        }

        sc.close();
    }
}
