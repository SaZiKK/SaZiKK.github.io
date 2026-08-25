---
title: 【笔记】[OSDI'25] Söze：One Network Telemetry Is All You Need  for Per-flow Weighted Bandwidth Allocation at Scale
categories:
  - Papers
tags:
  - network
comments: true
excerpt: "论文阅读笔记 Söze：One Network Telemetry Is All You Need  for Per-flow Weighted Bandwidth Allocation at Scale"

---
**Söze：One Network Telemetry Is All You Need  for Per-flow Weighted Bandwidth Allocation at Scale**
> Weitao Wang(Rice University), T. S. Eugene Ng(Rice University)

## 背景和 motivation

加权带宽分配被广泛应用在数据中心中，即根据应用需求对于网络带宽进行加权的分配，以实现更优的性能，比如给 mapreduce 中的带宽瓶颈任务分配更多带宽。

现有的带宽分配方案主要有两种：

1. 数据包调度方式：在交换机上通过数据包调度实现，但受限于交换机硬件支持的每流队列数量少、权重参数粒度粗糙，而且在大规模数据中心部署中需要大量昂贵的硬件资源。
> 1)队列数量限制：商用交换机芯片通常只支持8-32个队列，无法为每条流单独分配队列，只能按服务类型粗粒度分类
2)权重参数粗糙：硬件调度器的权重配置通常是固定比例（如1:2:4），缺乏细粒度的带宽控制能力
3)静态配置：大多数交换机的调度参数需要静态预配置，难以根据网络状态动态调整


2. 集中式带宽分配器：使用一个逻辑上集中的带宽分配器配合速率整形器（一种网络流量控制设备，将输入的突发流量平滑化，确保输出流量符合预设的速率限制，避免网络拥塞），但存在高通信延迟和高计算成本问题，因为需要与所有的设备进行通信收集信息并计算分配方案。
> 控制器从所有交换机收集流量统计、链路状态、队列深度等信息，基于全网信息计算最优带宽分配方案，将速率限制策略下发给各设备的速率整形器执行。


## 主要贡献

Söze 基于交换机的网络遥测数据（In-band Network telemetry），根据遥测数据中的 queueing delay 来控制各个发送端调节自己的发送速率，实现了大规模场景下细粒度高灵活性的加权带宽分配。


## 设计与实现



## 效果评估
