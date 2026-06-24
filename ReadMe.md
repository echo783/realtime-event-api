# realtime-event-api

RTSP 카메라에서 수집되는 물리 데이터를 이벤트와 상태값으로 변환하고, ASP.NET Core API와 SignalR을 통해 실시간으로 전달하는 이벤트 처리 프로젝트입니다.

본 프로젝트는 영상 처리 기술 자체보다, 물리 세계에서 발생한 데이터를 업무시스템에서 활용 가능한 이벤트와 상태 데이터로 변환하는 구조를 검증하는 데 목적이 있습니다.

---

## Project Message

실제 업무시스템에서는 단순히 데이터를 수집하는 것만으로는 충분하지 않습니다.

센서, 카메라, 설비 등에서 발생하는 데이터는 업무적으로 판단 가능한 이벤트와 상태값으로 정리되어야 하며, 이후 API를 통해 다른 시스템과 연결될 수 있어야 합니다.

본 프로젝트는 RTSP 카메라 영상을 기반으로 특정 영역의 변화를 감지하고, 이를 생산 이벤트와 카메라 실행 상태로 관리한 뒤 ASP.NET Core API와 SignalR을 통해 실시간으로 전달하는 구조를 구현했습니다.

이를 통해 다음과 같은 흐름을 검증했습니다.

```text
물리 데이터
→ 이벤트 감지
→ 상태 관리
→ API 제공
→ 실시간 전파
→ 외부 시스템 연계 가능 구조
```

---

## Core Flow

```text
RTSP Camera
    ↓
Frame Processing
    ↓
ROI Detection
    ↓
Event Generation
    ↓
Runtime State Management
    ↓
ASP.NET Core API
    ↓
SignalR
    ↓
Realtime Monitoring / External System Integration
```

---

## Why?

기존 카메라나 장비 중심 시스템에서는 영상이나 데이터는 존재하지만, 이를 업무적으로 활용 가능한 상태 정보로 관리하지 못하는 경우가 많습니다.

운영자가 화면을 직접 보고 판단하는 방식에 머물면, 다른 업무시스템과의 연동이나 자동화된 후속 처리가 어렵습니다.

본 프로젝트는 물리 데이터를 단순 화면 출력에 그치지 않고, 시스템이 처리할 수 있는 이벤트와 상태값으로 변환하는 구조를 목표로 했습니다.

특히 ERP 운영개발 과정에서 경험한 상태값 처리, 업무 흐름 관리, DB 이력 저장, 외부 시스템 연동 개념을 C# / ASP.NET Core 기반 실시간 이벤트 처리 구조로 확장하는 데 초점을 두었습니다.

---

## Key Features

* RTSP 카메라 스트림 수신
* OpenCV 기반 프레임 처리
* ROI 기반 변화 감지
* 감지 결과 기반 이벤트 생성
* Runtime State 기반 카메라 실행 상태 관리
* ASP.NET Core Web API 제공
* SignalR 기반 실시간 상태 전파
* MSSQL 기반 카메라 설정 및 생산 이벤트 이력 관리
* 외부 Python Vision API 기반 ROI 검증 및 OCR 결과 연동 구조
* 외부 시스템 연계를 고려한 API 구조 설계

---

## Architecture

```text
Presentation / API
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

카메라 실행 상태는 Runtime State로 관리하며, 감지된 생산 이벤트와 카메라 설정 정보는 MSSQL에 저장합니다.

외부 Vision API는 HTTP 기반으로 연동되며, Application Layer를 통해 OCR 또는 ROI 검증 결과를 받아 상태 처리 흐름에 반영할 수 있도록 구성했습니다.

```text
Application Layer
    ↓
External Vision API
    ↓
OCR / ROI Result
    ↓
State Update
```

---

## Data Flow

```text
Camera Frame
    ↓
ROI Detection
    ↓
Event Detection
    ↓
Production Event
    ↓
MSSQL Event History
```

```text
Camera Runtime
    ↓
Camera Session State
    ↓
SignalR Publisher
    ↓
Realtime Status Broadcast
```

---

## Main Components

### Camera Runtime

RTSP 카메라 연결, 프레임 수신, 실행 상태 관리를 담당합니다.

카메라별 실행 여부, 연결 상태, 마지막 프레임 수신 시간 등을 Runtime State로 관리합니다.

### ROI Detection

카메라 프레임에서 특정 영역을 기준으로 변화를 감지합니다.

감지 결과는 단순 영상 정보가 아니라, 시스템에서 처리 가능한 이벤트 데이터로 변환됩니다.

### Event Management

감지된 이벤트는 생산 이벤트로 생성되며, MSSQL에 이력으로 저장됩니다.

이를 통해 단순 실시간 표시뿐 아니라, 이후 조회와 업무시스템 연계를 고려한 데이터 관리가 가능하도록 구성했습니다.

### ASP.NET Core API

카메라 설정, 실행 제어, 상태 조회, 이벤트 조회를 위한 API를 제공합니다.

외부 시스템이 이벤트와 상태 데이터를 조회하거나 연계할 수 있도록 API 중심 구조로 설계했습니다.

### SignalR Realtime Broadcast

카메라 실행 상태와 이벤트 변화를 SignalR을 통해 실시간으로 전파합니다.

이를 통해 별도 새로고침 없이 상태 변화를 화면이나 외부 클라이언트에 전달할 수 있습니다.

---

## Tech Stack

* C#
* ASP.NET Core
* SignalR
* Entity Framework Core
* MSSQL
* OpenCvSharp
* RTSP Camera
* External Python Vision API

---

## Project Scope

본 프로젝트는 상용 영상 분석 솔루션을 목표로 한 프로젝트가 아닙니다.

핵심 목적은 다음과 같습니다.

* 물리 데이터를 이벤트 데이터로 변환하는 구조 검증
* 이벤트와 상태값을 분리하여 관리하는 구조 검증
* ASP.NET Core API 기반 외부 시스템 연계 구조 검증
* SignalR 기반 실시간 상태 전파 구조 검증
* ERP 운영개발에서 경험한 상태값 처리 개념을 실시간 데이터 처리 구조로 확장

---

## Portfolio Meaning

이 프로젝트는 기존 ERP 운영개발 경험을 C# / ASP.NET Core 기반 API 구조로 확장하기 위해 진행한 포트폴리오입니다.

ERP 운영개발에서는 계약, 계량, 매출, 정산 등 업무 과정에서 상태값이 변경되고, 그 결과가 다음 업무로 이어지는 흐름을 다루었습니다.

본 프로젝트에서는 이러한 상태값 기반 사고를 물리 데이터 처리 영역에 적용했습니다.

카메라에서 발생한 데이터를 단순 영상으로만 다루지 않고, 이벤트와 상태값으로 변환하여 API와 SignalR을 통해 전달하는 구조를 구현했습니다.

이를 통해 업무 데이터와 현장 데이터를 연결하고, 이벤트와 상태 중심으로 시스템을 설계하는 방향을 검증했습니다.
