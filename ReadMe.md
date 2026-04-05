# Factory Monitoring System

RTSP 기반 실시간 영상 분석 및 API 중심 모니터링 시스템
(C#, ASP.NET Core, OpenCV, MSSQL, Web UI)

---

## 프로젝트 개요

본 프로젝트는 RTSP 영상 스트림을 분석하여
특정 영역(ROI)에서 발생하는 이벤트를 감지하고,
이를 상태 데이터로 변환하여 API를 통해 관리하는 시스템입니다.

웹 기반 운영 UI를 통해
카메라 제어, 상태 조회, ROI 설정을 통합적으로 수행할 수 있도록 설계하였습니다.

---

## 시스템 구성

* **Backend**: ASP.NET Core API
* **Vision**: OpenCV (OpenCvSharp)
* **Web UI**: HTML / JavaScript
* **Communication**: SignalR
* **Database**: MSSQL (EF Core + Dapper)

---

## 핵심 기능

* RTSP 영상 기반 이벤트 감지
* ROI 영역 기반 객체 변화 및 라벨 진입 판단
* 생산 이벤트(Count) 생성 및 상태 관리
* 카메라 제어 API (Start / Stop / Status)
* ROI 설정 및 저장 기능
* JWT 기반 인증 및 보호된 API

---

## 기술적 특징

* OpenCV 기반 프레임 변화량 분석 로직 구현
* ROI 기반 이벤트 감지 구조 설계
* CameraOrchestrator 기반 런타임 세션 관리
* API 중심 아키텍처 설계
  (Controller → Application → Infrastructure)
* DTO 기반 요청/응답 모델 분리
* EF Core + Dapper 혼합 데이터 접근 구조

---

## 웹 운영 기능

* 로그인 (JWT 인증)
* 카메라 상태 조회 및 제어
* 실시간 상태 모니터링
* ROI 디버그 페이지 (좌표 수정 및 저장)
* 인증 기반 접근 제어 ([Authorize])

---

## 프로젝트 구조

FactoryApi

* Controllers
* Application (서비스 계층)
* Contracts (Request / Response DTO)
* Infrastructure

  * CameraRuntime (영상 처리 / 런타임 로직)
  * Persistence (DB 접근)
  * DependencyInjection
* Models (Entity)
* wwwroot (Web UI)

docs

* 포트폴리오 자료

---

## 아키텍처 특징

* 실시간 영상 데이터를 기반으로 상태를 생성하는 이벤트 중심 구조
* API 중심 설계로 웹 UI 및 외부 시스템과의 확장성 확보
* 런타임 처리와 비즈니스 로직을 분리하여 유지보수성 개선
* 장비(RTSP 카메라) 연동 기반 시스템 구현 경험

---

## 포트폴리오

* Factory Monitoring Portfolio PDF
  docs/JeongChanwook_Factory_Monitoring_Portfolio.pdf

※ 해당 PDF는 초기 WPF 클라이언트 기반 구조를 기준으로 작성되었으며,
현재는 API 중심 아키텍처로 리팩토링하여 웹 기반 운영 구조로 확장 중입니다.

---

## 향후 개선 방향

* Camera Runtime 인터페이스화 (ICameraRuntimeManager)
* Detection 모듈 분리 및 확장 구조 개선
* Application 계층 표준화 (Query / Command 분리)
* Logging 및 모니터링 구조 개선
* Models → Domain/Entities 구조 개선

---
