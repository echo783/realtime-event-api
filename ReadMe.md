# Factory Monitoring System

RTSP 기반 실시간 영상 분석 및 API 중심 모니터링 시스템
(C#, ASP.NET Core, OpenCV, MSSQL, Web UI)

영상 데이터를 기반으로 이벤트를 감지하고,
API를 통해 상태를 관리하며 웹 UI에서 실시간으로 제어/확인할 수 있는 시스템입니다.

---

## 프로젝트 개요

본 프로젝트는 RTSP 영상 스트림을 분석하여
특정 영역(ROI)에서 발생하는 이벤트를 감지하고
이를 상태 데이터로 변환하여 API를 통해 관리하는 시스템입니다.

웹 기반 운영 UI를 통해
카메라 제어, 상태 조회, ROI 설정까지 통합적으로 수행할 수 있도록 설계되었습니다.

---

## 시스템 구성

* **Backend**: ASP.NET Core API
* **Vision**: OpenCV (OpenCvSharp)
* **Web UI**: HTML / JavaScript (운영 페이지)
* **Communication**: SignalR
* **Database**: MSSQL

---

## 핵심 기능

* RTSP 영상 기반 이벤트 감지
* ROI 영역 기반 객체 변화 및 라벨 진입 판단
* 생산 이벤트(Count) 생성 로직 구현
* 웹 UI 기반 카메라 제어 (Start / Stop / Status)
* ROI 실시간 수정 및 저장 기능
* JWT 기반 인증 및 보호된 API 접근

---

## 핵심 기술 포인트

* OpenCV 기반 프레임 변화량 분석 로직
* ROI 기반 이벤트 감지 구조
* CameraOrchestrator 기반 세션 관리
* SignalR 기반 실시간 상태 전달
* API 중심 구조 (Controller → Application → Infrastructure)
* DTO 기반 요청/응답 분리 설계
* Web UI + API 연동 구조

---

## 사용 기술

* RTSP (영상 스트리밍)
* OpenCV (영상 분석)
* ASP.NET Core API
* SignalR
* MSSQL
* EF Core / Dapper
* HTML / JavaScript (운영 UI)

---

## 웹 운영 기능

* 로그인 (JWT 기반 인증)
* 카메라 시작 / 중지 / 상태 조회
* 실시간 상태 모니터링
* ROI 디버그 페이지 (좌표 수정 및 저장)
* 인증 기반 접근 제어 ([Authorize])

---

## 프로젝트 구조

* **FactoryApi**

  * Controllers
  * Application (서비스 계층)
  * Contracts (Request / Response DTO)
  * Infrastructure (CameraRuntime / Persistence)
  * wwwroot (Web UI)

* **docs**

  * 포트폴리오 및 설명 자료

---

## 기술적 특징

* 실시간 영상 데이터를 기반으로 상태를 생성하는 이벤트 중심 구조
* API 중심 아키텍처로 확장성과 유지보수성 확보
* 외부 장비(RTSP 카메라) 연동 처리 경험
* 웹 기반 운영 시스템으로 전환하여 접근성 개선

---

## Portfolio

* [Factory Monitoring Portfolio PDF](docs/JeongChanwook_Factory_Monitoring_Portfolio.pdf)


※ 해당 PDF는 초기 WPF 클라이언트 기반 구조를 기준으로 작성된 자료이며,  
현재는 API 중심 아키텍처로 리팩토링을 진행하고 웹 기반 운영 UI 구조로 확장하고 있습니다.