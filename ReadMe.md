# realtime-event-api

RTSP 카메라 스트림을 이벤트와 상태값으로 변환하고, ASP.NET Core API와 SignalR을 통해 실시간 UI로 전달하는 모니터링 API 프로젝트입니다.

## What is this?

이 프로젝트는 RTSP 카메라 영상을 단순 화면 출력에 그치지 않고, 특정 영역의 변화를 감지하여 이벤트로 만들고, 이를 상태값으로 관리한 뒤 API와 실시간 UI로 전달하는 구조를 검증한 포트폴리오입니다.

핵심 흐름은 다음과 같습니다.

```text
RTSP Stream
  → Frame Processing
  → ROI Detection
  → Event Generation
  → State Management
  → ASP.NET Core API
  → SignalR Realtime UI
```

## Why?

기존 장비나 카메라 중심 시스템은 영상 데이터는 존재하지만, 운영자가 판단할 수 있는 이벤트와 상태값으로 정리되지 않는 경우가 많습니다.

이 프로젝트는 물리 데이터인 RTSP 영상을 업무적으로 판단 가능한 이벤트와 상태값으로 변환하고, 이를 외부 화면과 시스템에 전달하는 구조를 목표로 했습니다.

## Key Features

* RTSP 카메라 스트림 수신
* ROI 기반 변화 감지
* 이벤트 생성 및 상태값 관리
* ASP.NET Core 기반 API 구성
* SignalR 기반 실시간 상태 전파
* MSSQL 기반 이벤트/상태 데이터 관리
* 외부 OCR 서비스 연동 구조
* 카메라 실행 상태 Start / Stop 관리

## Architecture

```text
Controller
  → Application
  → Infrastructure
  → Camera Runtime
  → MSSQL
```

외부 OCR 검증은 별도 서비스와 HTTP 기반으로 연동되도록 구성했습니다.

```text
Application
  → External Vision Service
  → OCR Result
```

## Camera Runtime Design

카메라 실행 상태는 cameraId 기준 단일 runner ownership 모델로 관리했습니다.

주요 구성 요소는 다음과 같습니다.

* CameraRuntimeRegistry: cameraId별 runner 상태 관리
* CameraOrchestrator: DB 기준 자동 실행 동기화
* CameraRuntimeController: 수동 Start / Stop 처리
* CameraRuntimeSessionLifecycle: runner Stop / Dispose 처리
* CameraRuntimeStatusNotifier: SignalR 상태 전파

핵심은 `TrySetRunner`와 `TryTakeRunner`를 통해 실행 소유권과 종료 소유권을 명확히 나눈 점입니다.

이를 통해 카메라 중복 실행, 종료 경합, 상태 불일치 문제를 줄이고자 했습니다.

## Tech Stack

* Backend: ASP.NET Core
* Realtime: SignalR
* Vision: OpenCvSharp
* Database: MSSQL, EF Core, Dapper
* Frontend: HTML, JavaScript
* External Service: OCR 기반 Realtime Vision Service
* RTSP Relay: MediaMTX

## Portfolio

* Portfolio PDF: `docs/myport.pdf`
* Realtime Vision Service: https://github.com/echo783/realtime-vision-service

## AI Collaboration

개발 과정에서 AI 도구는 설계 검토, 코드 리팩터링, UI 흐름 개선에 보조적으로 활용했습니다.

다만 최종 구조 판단, 코드 통합, 기능 연결, 실행 검증은 직접 수행했습니다.

## Quick Start

### 1. Database

MSSQL Express 기준으로 테스트했습니다.

```text
Database: FactoryDB
Script: docs/sql/schema-and-seed.sql
```

### 2. Run Server

서버 실행 후 아래 페이지로 접속합니다.

```text
/login.html
```

### 3. Demo Login

```text
ID: admin
PW: 1234
```

데모용 계정이며, 실제 운영 환경에서는 환경변수 또는 별도 인증 정책 적용이 필요합니다.

## Project Message

이 프로젝트의 핵심은 영상 처리 자체보다, 데이터를 이벤트로 만들고, 이벤트를 상태값으로 관리하며, 상태를 API와 실시간 UI로 연결하는 구조를 설계한 점입니다.

기존 ERP 운영개발에서 다뤄온 상태값 처리, 업무 흐름, 외부 시스템 연동 경험을 C# / ASP.NET Core 기반 API 구조와 실시간 상태 전파 방식으로 확장해본 사례입니다.
