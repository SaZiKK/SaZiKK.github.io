---
title: 【笔记】论文阅读笔记-Shenango：Achieving High CPU Efficiency for Latency-sensitive Datacenter Workloads
Author: SaZiKK
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "2019 NSDI 论文阅读笔记-Shenango：Achieving High CPU Efficiency for Latency-sensitive Datacenter Workloads"

---

**Shenango: Achieving High CPU Efficiency for Latency-sensitive Datacenter Workloads**
> Amy Ousterhout (MIT CSAIL), Joshua Fried (MIT CSAIL), Jonathan Behrens (MIT CSAIL), Adam Belay (MIT CSAIL), Hari Balakrishnan (MIT CSAIL)

## 摘要

数据中心应用需要微秒级的尾延迟以及向 OS 的高请求率，目前已有的最好的实现微秒级延迟的方法是 kernel-bypass ，但这会浪费部分 CPU 核去空转轮询网卡，影响 CPU 效率，尤其是在现代场景下，请求数量随时间波动极大（μs/百万），对 CPU 效率的影响更为严重。


Shenango 通过一个**高效的调度算法**和一个**运行在单独核心上的特权级组件 IOKernel**，以 **5μs 的超细粒度**调度 CPU 核心，实现了微秒级的延迟以及更高的 CPU 效率，在处理一些内存敏感应用程序（如 memcached ）时吞吐量和尾延迟与 [ZygOS](https://dl.acm.org/doi/pdf/10.1145/3132747.3132780) 相当，而 CPU 效率相比大大提高。

## 个人想法

感觉核心思想就是在 by-pass 的同时以更细的粒度调度 CPU 核，寻求一个更接近平衡点的粒度，所以效率理应有很大提升，还未仔细阅读具体实现的 policy.
