---
title: 【笔记】论文阅读笔记-Microkernel Goes General: Performance and Compatibility in the HongMeng Production Microkernel
Author: SaZiKK
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "2024 OSDI 论文阅读笔记-Microkernel Goes General: Performance and Compatibility in the HongMeng Production Microkernel"
---

打完比赛后一直对鸿蒙和微内核架构很感兴趣，于是抽出时间阅读了这篇论文。

### 文章概述：

本文介绍了鸿蒙微内核架构的设计和实现，重点描述了传统微内核的性能瓶颈以及鸿蒙针对性的优化方式。

### 现实问题：

移动设备系统、嵌入式系统以及车载系统等新兴场景需要内核拥有更好的安全性、可扩展性和性能，以 linux 为代表的宏内核并不擅长这些场景，微内核在这些方面拥有显著的架构优势，但主流的微内核架构在性能和兼容性上存在很多问题。

#### 问题一：软件生态

在以智能手机为代表的新兴场景中，很多应用和库以二进制形式分发，仅仅满足 posix 标准并不足以兼容，需要能够兼容 linux ABI。

#### 问题二：资源管理

在为专门领域设计的系统中，应用程序较少，硬件资源优先，所以内核往往负责预留资源，应用程序自己管理，但在新兴场景中，多个应用程序竞争资源，因此需要内核有更完善的资源管理机制，实现高效而公平的资源管理和分配。

#### 问题三：性能

领域特定场景下的微内核往往更加重视安全性和严格的资源隔离，性能不是关键点，但在新兴场景中，性能也是重中之重，因为性能直接决定用户体验以及由此带来的内核的广泛部署。

