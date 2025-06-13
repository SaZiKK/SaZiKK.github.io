---
title: 【笔记】[OSDI'20] Caladan：Mitigating Interference at Microsecond Timescales
Author: SaZiKK
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "2020 OSDI 论文阅读笔记-Caladan: Mitigating Interference at Microsecond Timescales"

---

**Caladan: Mitigating Interference at Microsecond Timescales**
> Joshua Fried (MIT CSAIL), Zhenyuan Ruan (MIT CSAIL), Amy Ousterhout (UC Berkeley), Adam Belay (MIT CSAIL)

## 背景

为了实现不同任务之间的性能隔离，防止资源竞争影响关键任务，传统方法是静态的对系统资源进行划分，如 Intel 的 CAT 划分 LLC，但是这种静态划分也同时限制了任务可用资源的上限，使其无法应对短时间的峰值负载，造成高延迟和资源的浪费。

## 主要贡献

作者提出了 Caladan ，一种新型 CPU 调度器。Caladan **摒弃了传统的静态资源分配**，而是以快速、细粒度的 **CPU 核调度**取而代之。Caladan 由一个**集中式调度核心**和一个**内核模块**组成，集中式调度核心负责主动管理内存层次结构和超线程中的资源争用，内核模块负责绕过 Linux 内核，提供微秒级的任务监控和任务安排。

## 设计与实现



## 效果


## 个人想法



