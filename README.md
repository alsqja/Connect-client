<div align="center">
  <img src="https://github.com/user-attachments/assets/aad16e45-1181-4a8f-ae43-0b13512add69" width="200px"/>
</div>

<h1 align="center">Connect Client</h1>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Recoil-3578E5?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURQRERERERHx/f////3Fxcf///3Vn/AgAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAGSURBVEjHY2AYBaNgFIQwCkAABBgA9ykB2AAAAABJRU5ErkJggg==" alt="Recoil Badge"/>
  <img src="https://img.shields.io/badge/Styled--Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" alt="Styled-Components Badge"/>
</div>



## 프로젝트 소개
> [배포링크](https://www.97s-connect.com),
> [프로젝트 노션](https://furry-mochi-5e8.notion.site/1-Connect-1960ae1ed0ec80c08f12cad5450040c9?pvs=4),
> [팀 노션](https://furry-mochi-5e8.notion.site/97s-1960ae1ed0ec80ae81a9e4985b2c990e?pvs=4),

- 하루의 일정 계획을 세우면 유사한 계획을 가진 일정을 매칭해주어 다른 사람과 함께 즐길 수 있게 해주는 서비스입니다.


## 팀원 구성

<div align="center">



| **김민범** | **조현지** | **이경섭** |
| :------: |  :------: | :------: |
| [<img src="https://ca.slack-edge.com/T06B9PCLY1E-U07LT2WDQ85-2bd91a3eb763-512" height=150 width=150> <br/> @alsqja](https://github.com/alsqja) | [<img src="https://ca.slack-edge.com/T06B9PCLY1E-U07NJ6AHV0W-3ece7e57f12a-512" height=150 width=150> <br/> @chohyuun](https://github.com/chohyuun) | [<img src="https://ca.slack-edge.com/T06B9PCLY1E-U07M8FNBTJP-7db687842db3-512" height=150 width=150> <br/> @gyungsubLee](https://github.com/gyungsubLee) | 
</div>


## 백엔드

👉🏻 [Github - 백엔드](https://github.com/alsqja/Connect)


<br>

## 와이어프레임
👉🏻 [와이어프레임 바로보기](https://www.figma.com/design/iMqa9R5iK9aNcW81Xyl2Bi/01-%25EC%25B5%259C%25EC%25A2%2585-%25ED%2594%2584%25EB%25A1%259C%25EC%25A0%259D%25ED%258A%25B8-%25EC%2599%2580%25EC%259D%25B4%25EC%2596%25B4-%25ED%2594%2584%25EB%25A0%2588%25EC%259E%2584?kind=file&node-id=45-5282)



<br/>


## API 명세서
작성한 API는 아래에서 확인할 수 있습니다.

👉🏻 [API 바로보기](https://www.notion.so/teamsparta/API-7d191d644a674fbe971141dd2e02c782)

<br/>




##  커밋 컨벤션
<details>
<summary>👉🏻 커밋 컨벤션 펼치기</summary>

- feat : 기능 추가

- fix : 기능 수정
  
- hotfix : 기능 급하게 수정
  
- test : 테스트 코드 작성
  
- refactor : 리팩토링
  
- docs : 문서 작업
  
- style : 코드 스타일 등 로직 변경 외 처리

- PR 은 이슈당 하나 씩
  
- 브랜치 기능별로 분리 (feature/login, feature/signup)

- 모두 approve 되면 merge

</details>

<details>
<summary>👉🏻 브랜치 전략</summary>
  
- Git-flow 전략을 기반으로 main, develop 브랜치와 feature 보조 브랜치를 운용했습니다.
  
- main, develop, Feat 브랜치로 나누어 개발을 하였습니다.
    
    - main 브랜치는 배포 단계에서만 사용하는 브랜치입니다.
    - develop 브랜치는 개발 단계에서 git-flow의 master 역할을 하는 브랜치입니다.
    - Feat 브랜치는 기능 단위로 독립적인 개발 환경을 위하여 사용하고 merge 후 각 브랜치를 삭제해주었습니다.
  
</details>

</br>




## 구현 기능
<details>
<summary>👉🏻 구현 기능 펼치기</summary>

### 🧑‍🧑‍🧒 user

- 회원가입 & 회원 탈퇴
- 로그인 & 로그아웃
- 리프레시 토큰 발급
- 프로필 수정 & 조회
- 비밀번호 확인
- 관리자 유저 수정
- 관리자 유저 전체 조회

### 🪜 카테고리/서브 카테고리

- 카테고리 생성 & 수정 & 삭제
- 서브 카테고리 생성 & 수정 & 삭제
- 카테고리, 서브 카테고리 전체 조회

### 🎬 배너 

- 배너 생성 & 수정
- 배너 전체 조회 & 단건 조회

### 💰 포인트

- 포인트 생성 & 수정
- 포인트 내역 조회

### 💌 쿠폰

- 쿠폰 생성 & 수정
- 쿠폰 발급
- 유저 쿠폰 확인

### 🚨 신고

- 관리자
  - 신고 내역 조회
  - 신고 삭제
  - 해당 유저 신고 당한 내역 확인
- 사용자
  - 신고 하기
  - 신고 취소
  - 본인 신고 내역 확인

### 💬 채팅

- 채팅 보내기 & 받기
- 채팅방 목록 확인
- 채팅방 입장

### 🗓️ 일정

- 일정 등록 & 수정 & 삭제
- 일정 전체 조회 & 단일 조회
- 월별 일정 조회

### 💸결제

- 결제 등록
- 결제 취소
- 결제 내역

### 🤝 매칭

- 일정 매칭 생성
- 매칭 신청
- 매칭 수정
- 매칭 전체 조회
- 단일 일정 매칭 조회
</details>


<br />
