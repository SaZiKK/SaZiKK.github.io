---
title: 【笔记】[ATC'15] Latency-Tolerant Software Distributed Shared Memory
Author: SaZiKK
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "2015 USENIX ATC 论文阅读笔记-Latency-Tolerant Software Distributed Shared Memory"

---

**Latency-Tolerant Software Distributed Shared Memory**
> Jacob Nelson, Brandon Holt, Brandon Myers, Preston Briggs, Luis Ceze, Simon Kahan, Mark Oskin (University of Washington)

## 背景

随着大数据时代的到来，数据密集型应用（如社交网络分析、PageRank 等）成为主流，但现有的编程框架高度碎片化（MapReduce 适合批处理、GraphLab 专门处理图算法等），导致应用性能受限于框架选择。同时，历史上因网络瓶颈而局限性较强的软件分布式共享内存（ DSM ）技术，在 RDMA 等高性能网络普及的新硬件条件下重新获得了应用可能。集群上提供统一、高性能的编程抽象，解决框架碎片化问题。

## 主要贡献

本文提出了 Grappa ——一个借鉴 Tera MTA 硬件系统设计思想的软件 DSM 系统，试图在商用集群上提供统一、高性能的编程抽象，解决框架碎片化问题。


## 设计与实现



## 效果评估



## 个人想法
