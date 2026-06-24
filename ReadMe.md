# realtime-event-api

실시간으로 수집되는 물리 데이터를 이벤트와 상태값으로 변환하고, ASP.NET Core API와 SignalR을 통해 사용자 화면 및 외부 시스템에 전달하는 실시간 이벤트 처리 플랫폼입니다.

본 프로젝트는 RTSP 카메라 영상을 활용하여 특정 영역의 변화를 감지하고, 이를 이벤트와 상태 데이터로 관리한 뒤 API 기반으로 외부 시스템과 연결하는 구조를 검증하기 위해 개발되었습니다.

---

# Project Message

이 프로젝트의 목적은 영상 처리 기술 자체를 구현하는 것이 아니라, 물리 세계에서 발생하는 데이터를 업무적으로 활용 가능한 이벤트와 상태 데이터로 변환하는 구조를 설계하고 검증하는 것입니다.

실제 산업 환경에서는 센서, 카메라, 설비 등 다양한 장비에서 데이터가 발생하지만, 단순 데이터 수집만으로는 운영 및 업무 시스템과 연계하기 어렵습니다.

본 프로젝트에서는 RTSP 카메라 영상을 기반으로 이벤트를 생성하고, 이를 상태값으로 관리한 뒤 ASP.NET Core API와 SignalR을 통해 실시간 UI 및 외부 시스템으로 전달하는 구조를 구현하였습니다.

이를 통해 물리 데이터 → 이벤트 → 상태 → API → 업무시스템으로 이어지는 데이터 흐름을 검증하였습니다.

---

# Core Flow

```text
RTSP Camera
    ↓
Frame Processing
    ↓
ROI Detection
    ↓
Event Generation
    ↓
State Management
    ↓
ASP.NET Core API
    ↓
SignalR
    ↓
Realtime UI / External System
```

---

# Why?

기존 카메라 및 장비 중심 시스템은 영상 데이터는 존재하지만, 운영자가 판단 가능한 이벤트와 상태 정보로 정리되지 않는 경우가 많습니다.

본 프로젝트는 물리 데이터를 업무적으로 활용 가능한 상태 데이터로 변환하고, API를 통해 다른 시스템과 연동 가능한 구조를 만드는 것을 목표로 하였습니다.

특히 ERP 운영개발 과정에서 경험한 상태값 관리, 업무 흐름 처리, 외부 시스템 연동 개념을 실시간 이벤트 처리 구조로 확장하는 데 초점을 두었습니다.

---

# Key Features

* RTSP 카메라 스트림 수신
* ROI 기반 변화 감지
* 이벤트 생성 및 상태값 관리
* ASP.NET Core API 제공
* SignalR 기반 실시간 상태 전파
* MSSQL 기반 이벤트 및 상태 데이터 관리
* OCR 서비스 연동 구조
* 카메라 Runtime Start / Stop 관리
* 실시간 상태 모니터링 UI 제공

---

# Architecture

```text
Presentation
    ↓
ASP.NET Core Controller
    ↓
Application Layer
    ↓
Infrastructure Layer
    ↓
Camera Runtime
    ↓
MSSQL
```

외부 OCR 서비스는 HTTP 기반으로 연동되며 Application Layer를 통해 통합됩니다.

```text
Application
    ↓
External Vision Service
    ↓
OCR Result
    ↓
State Update
```
