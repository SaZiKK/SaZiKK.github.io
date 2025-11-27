---
title: 【笔记】[SOSP'25] Spirit: Fair Allocation of Interdependent Resources  in Remote Memory Systems
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "SOSP 2025 论文阅读笔记-Spirit: Fair Allocation of Interdependent Resources  in Remote Memory Systems"

---

**Spirit: Fair Allocation of Interdependent Resources  in Remote Memory Systems**
> Seung-seob Lee(Yale University), Jachym Putta (Yale University), Ziming Mao (UC Berkeley), Anurag Khandelwal (Yale University)

## 背景

多用户 RDMA 系统中的资源分配一直是问题，对于同一台机器上的多个 RDMA 用户，他们各自分配有一部分带宽和 dram 作为访问 far memory 的 cache。但是，大 cache 意味着应用可能不需要频繁的和 far memory 通信，仅需要较小的带宽；而大带宽意味着应用可以以更高的频率和 far memory 进行通信，cache 可以较小。

同时，不同应用的工作负载对于带宽和 cache 的敏感性不同：
- 高局部性应用（如键值存储）：小幅增加缓存即可大幅节约带宽
- 低局部性应用（如流处理）：缓存扩容对带宽优化较小

而这种工作负载的特异性无法预先获知，因此需要在线进行动态的调整以达到最优，而以往的工作没有考虑到这一点。


## 主要贡献

作者提出了 Spirit，一个多用户 RDMA 资源分配框架，在多个应用中取得了最高 21.6% 的性能提升。


## 设计与实现



## 效果评估



## 个人想法

