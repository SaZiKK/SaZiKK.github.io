---
title: 【笔记】[NSDI'22] Efficient Scheduling Policies for Microsecond-Scale Tasks
Author: SaZiKK
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "2022 NSDI 论文阅读笔记-Efficient Scheduling Policies for Microsecond-Scale Tasks"

---

**Efficient Scheduling Policies for Microsecond-Scale Tasks**
> Sarah McClure (UC Berkeley), Amy Ousterhout (UC Berkeley), Scott Shenker (UC Berkeley, ICSI), Sylvia Ratnasamy (UC Berkeley)

## 背景

目前的数据中心运营致力于在支持微秒级延迟的同时尽可能提高 CPU 效率，已有的工作包括为应用程序静态或动态的分配 CPU 核心。但是由于大多数系统在进行应用间核心分配或应用内负载均衡的时候选择**策略较为单一**，因此他们在延迟和效率的权衡上表现不佳，尤其是处理短至 1 微秒的任务时。


## 主要贡献

作者团队基于仿真比较并探索了不同的调度策略，发现在负载均衡中 work stealing 的表现最好；核心分配中多种策略效果均不错，并且在处理短时长小任务时，静态核心分配的效果优于动态分配。作者团队同时证明在 [Caladan](https://sazikk.top/posts/%E7%AC%94%E8%AE%B0-%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB%E7%AC%94%E8%AE%B0-Caladan-Mitigating-Interference-at-Microsecond-Timescales/) 上实现最佳策略时，可以在不提高延迟的情况下提升 13-22% 的 CPU 效率。

## 设计与实现

### 小任务如何导致效率下降？

对于一般任务，调度造成的开销远小于其服务时长，因此调度开销占比较少；而对于小任务（1μs 量级）来说，调度开销占比就显得很大了，效率就会相应降低。

作者首先在 Motivation 部分提到了他们的实验，在 Arachne 和 Caladan 上分别跑对照任务（消耗所有剩余 CPU 周期）和小任务（memcached，他的平均服务时间就是 1μs 左右），并根据理论最佳吞吐量归一化实际吞吐量，以进行效率上的对比：

![expr](../assets/figures/papers/Efficient%20Scheduling%20Policies%20for%20Microsecond-Scale%20Tasks/expr.png)

可以看出小任务会导致两个系统的效率大幅下降。作者提到这是因为为了保证小任务的低延迟（迅速处理），导致 CPU 效率的降低。

> 这里我个人的想法是在争用场景下（即图中效率下降明显段），两个应用之间的核心被细粒度的频繁来回调度（由于 memcached 任务的短时长），导致调度时间占比相较于服务时间明显提升，因此效率显著下降。疑问：为什么 Caladan 后期吞吐量几乎全部是小任务占用的情况下还是有一段达不到最佳效率？可能是对照任务仍然存在少量争用，但是几乎不占吞吐量。

## 效果



## 讨论

