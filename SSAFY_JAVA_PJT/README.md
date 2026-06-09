SSAFIT Java Console Project
1. 프로젝트 개요

SSAFIT은 운동 영상 정보를 기반으로 영상 관리, 회원 관리, 리뷰 관리를 제공하는 Java 콘솔 기반 애플리케이션이다.
본 프로젝트는 객체지향 개념을 실제 프로그램 구조에 적용하고, JSON 파일 기반(File I/O) 데이터 관리를 통해 CRUD 기능을 구현하는 것을 목표로 한다.

Domain, Manager, UI 역할을 분리하여 유지보수성을 고려한 구조로 설계하였으며, Gson 라이브러리를 사용하여 객체와 JSON 데이터 간의 직렬화 및 역직렬화를 수행하였다.

2. 개발 환경

Language: Java 17

IDE: STS (Spring Tool Suite)

Execution Environment: Console Application

Library: Gson (JSON 파싱 및 직렬화)

3. 프로젝트 구조
java_pjt
 ┣ BoardTest.java
 ┣ User.java
 ┣ Video.java
 ┣ Review.java
 ┣ IUserManager.java
 ┣ UserManagerImpl.java
 ┣ VideoManager.java
 ┣ ReviewManager.java
 ┣ video.json

4. 클래스 역할 설명
UI

BoardTest
콘솔 메뉴를 출력하고 사용자 입력을 처리한다. 입력된 명령에 따라 각 Manager 클래스를 호출하고 결과를 출력한다.

Domain

User
사용자 정보(id, password, name, age)를 저장하는 도메인 클래스

Video
운동 영상 정보(videoId, title, part, url)를 저장하는 도메인 클래스

Review
리뷰 정보(reviewId, userId, videoId, content)를 저장하는 도메인 클래스

Manager

UserManager / UserManagerImpl
회원 추가, 전체 조회, 이름 검색 기능을 담당한다. Singleton 패턴으로 구현하였다.

VideoManager
영상 추가, 전체 조회, 제목 검색 기능을 담당하며 JSON 파일 입출력을 통해 데이터를 관리한다.

ReviewManager
리뷰 추가, 전체 조회, 사용자 ID 기반 검색 기능을 담당한다.

5. UML 다이어그램 설계 기준

UI는 Manager 클래스만 참조한다.

Manager 클래스는 Domain 객체를 사용하여 비즈니스 로직을 처리한다.

UserManager는 인터페이스로 정의하고 UserManagerImpl에서 구현한다.

VideoManager와 ReviewManager는 Singleton 패턴으로 구현한다.

전체 영상 조회 메서드는 getList(): Video[] 형태로 정의한다.

6. 구현 기능
회원 관리

회원 추가

회원 전체 조회

회원 이름 검색

영상 관리

영상 추가

영상 전체 조회

영상 제목 기반 검색

리뷰 관리

리뷰 추가

리뷰 전체 조회

사용자 ID 기반 리뷰 검색

7. JSON 파일 처리 방식

영상 데이터는 video.json 파일에 저장된다.

Gson 라이브러리를 사용하여 객체 배열과 JSON 간 변환을 수행한다.

데이터 변경(add, edit, remove) 시에만 파일에 저장하며, 조회 기능에서는 파일을 읽기만 수행한다.

8. 실행 방법

BoardTest.java 실행

콘솔 메뉴 출력

원하는 기능 번호 입력

안내에 따라 데이터 입력

========== MENU ==========
1. 사용자 추가
2. 사용자 전체 조회
3. 사용자 이름 검색
4. 비디오 추가
5. 비디오 전체 조회
6. 비디오 제목 검색
7. 리뷰 추가
8. 리뷰 전체 조회
9. 사용자ID로 리뷰 검색
-1. 종료

9. UML 및 코드 수정 사항 정리

VideoManager의 전체 조회 메서드는 getList() 형태로 통일하였다.

조회 기능에서는 writeFile을 호출하지 않도록 수정하였다.

JSON 파일 기반 데이터 관리 방식에 맞게 메서드 역할을 명확히 구분하였다.

10. 프로젝트 정리

본 프로젝트를 통해 Java 객체지향 설계, 콘솔 기반 UI 구성, JSON 파일 입출력 처리 과정을 경험하였다.
기능별 역할 분리를 통해 유지보수성을 고려한 구조를 설계하였으며, 향후 Repository 계층 분리 및 컬렉션 기반 자료구조로 확장 가능하도록 설계하였다.