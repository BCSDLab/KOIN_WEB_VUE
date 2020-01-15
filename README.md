# KOIN_FrontEnd_Vue
KOIN community (ver. vue.js framework)

### deploy command
- npm run build

### development command
- npm run dev

### directory structure

    └── koin-web-application
        ├── build
        ├── config
        ├── dist
        │   └── static
        │       ├── css
        │       └── js
        ├── src
        │   ├── SharedComponents
        │   │   ├── CopyRight
        │   │   ├── Footer
        │   │   └── Topnav
        │   ├── SpaComponents
        │   │   ├── BoardFunction
        │   │   ├── BusFunction
        │   │   ├── DietFunction
        │   │   ├── FaqFunction
        │   │   ├── IndexFunction
        │   │   ├── RoomFunction
        │   │   ├── StoreFunction
        │   │   └── UserFunction
        │   ├── api
        │   ├── assets
        │   ├── router
        │   ├── static
        │   └── stores
        │       └── modules
        └── static
___
### PATCH NOTE

***version_1.0.0***

- 메인페이지
  - event
  - 자유게시판
  - 취업게시판
  - 학사일정
  - 바로가기
- 학생정보
  - 상점
  - 버스/교통
  - 식단
  - faq
- 커뮤니티
  - 자유게시판
  - 취업게시판
  - 익명게시판
  - 가장 많이 본 게시글

***version_1.0.1***

- 폰트 경로 cdn으로 변경

***version_1.1.0***

- 중고장터 추가
  - 팝니다
  - 삽니다
- topnav 변경
  - new badge 추가
  - dropdown transition 추가
- 디자인 가이드 라인에 맞게끔 css 변경
- 가장 많이 본 게시글 링크 추가
- 로딩 컴포넌트 추가

***version_1.1.1***

- thumbnail image api 주소 변경
- 중고장터 등록 가격 콤마 추가하는 정규식 추가

***version_1.1.2***

- 학사일정 현재날짜 css 수정

***version_1.1.3***

- 게시글 수정 refresh init 오류 수정

***version_1.1.4***

- 메인페이지 중고장터 0원 가격 설정
- 메인페이지 중고장터 new badge 위치 수정

***version_1.1.5***

- 커뮤니티
  - 에디터 커스텀
  - 게시글 우클릭 허용
  - 댓글 개행문자 출력 추가
  - 댓글 수정하기 css 변경
  - 아이폰 위지윅 글쓰기 불가능 해결
- 중고장터
  - 중고장터 이미지형식 파일만 업로드 제한
- 로그인 리다이렉트 예외 추가
- 로그인 layout 수정
- 모바일 기준 topnav 미출력 해결
- viewport 추가
- 회원탈퇴 추가
- 휴대폰번호 예외처리 추가
- 라우팅 주소 변경
- vuex pollyfill 추가
- 모든 토큰 사용 api 토큰 위치 header로 변경

***version_1.1.6***

- 중고장터 게시글 max-width 변경

***version_1.1.7***

- 메인페이지 중고장터 new badge 로직 변경

***version_1.2.0***

- 메인페이지
  - 메인페이지 공지사항 추가
  - 메인페이지 이벤트 캐러셸 속도 변경
- topnav
  - topnav 회원가입/로그인/정보수정/로그아웃 폰트색상 수정
  - topnav 하위 메뉴 폰트색상 수정
- 버스
  - 시간표 테이블 디자인 수정
  - 시간표 테이블 활성화 row 텍스트 bold로 변경
- 커뮤니티
  - 게시판 댓글 위치 수정
  - 게시판 게시글 hover 시 배경, 폰트색상 수정
  - 중고장터 댓글 수정 디자인 변경
- 공지사항 추가
- 로그인 체크박스 디자인 수정
- 로그인 placeholder padding 수정
- 회원정보수정, 로그인, 회원가입 input border 수정

***version_1.2.1***

- 학사일정 css 수정

***version_1.2.2***

- patch note 추가

***version_1.2.3***

- 자동로그인 기능 추가
- 전역으로 router guard 교체

***version_1.2.4***

- 회원탈퇴 배경색 변경
- 모바일 회원가입 체크박스 버그 수정

***version_1.2.5***

- board detail 하이퍼링크 정규식 수정

***version_1.2.6***

- board detail select all -> text 로 변경

***version_1.2.7***

- 메인페이지 top board contents length 수정

***version_1.3.0***

- 동아리 소개 기능 추가

***version_1.4.0***

- 주변 상점 기능 추가
- 중고장터 썸네일 개선
- url 정규식 개선

***version_1.4.1***

- 신입부원 모집 event 제거

***version_1.4.2***

- 회원가입 412에러 문구 변경
- 회원가입 이름 지우고 가입 오류 수정

***version_1.4.3***

- 내가 등록한 물품 페이지네이션 오류 수정

***version_1.5.0***

- 분실물 기능 추가
- 썸네일 같은 사진 재등록 오류 수정

*** version_1.5.1***

- 동아리 주요사업 -> 주요활동으로 변경

***version_1.5.2***

- 버스 경로 선택 알고리즘 변경
- 버스 경로 선택시 progress bar 추가
- 버스 조회 버튼 삭제

***version_1.5.3***

- webpack-dev-server update

***version_1.6.0***

- 비로그인 서비스로 교체 (글 상세보기)
- 게시판 각 타이틀에 리스트페이지로 리다이렉트 링크 추가

***version_1.6.1***

- 익명게시판 임시게시판으로 교체

***version_1.6.2***

- 임시게시판 글쓰기 버그 수정

***version_1.6.3***

- 임시게시판 어드민 계정 접근 시 토큰 무시

***version_1.7.0***

- 복덕방 오픈

***version_1.7.1***

- copyright 년도 현재의 년도로 변경

***version_1.8.0***

- 시간표 기능 추가

***version_1.8.1***

- 시간표 기능 숨기기

***version_1.8.2***

- naver maps api 키 변경

***version_1.8.3***

- 게시글 타이틀 XSS 대비

***version_1.9.0***

- 반응형 웹 적용

***version_1.9.1***

- 질문게시판 추가

***version_1.9.2***

- 댓글 오류 수정

***version_1.9.3***

- 돌림판 추가(미적용)

***version_1.9.4***

- 게시판모듈화



