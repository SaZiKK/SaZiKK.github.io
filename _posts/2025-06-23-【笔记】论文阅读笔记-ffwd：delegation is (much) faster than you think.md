---
title: 【笔记】[SOSP'17] ffwd: delegation is (much) faster than you think
categories:
  - Papers
tags:
  - os
comments: true
excerpt: "SOSP 2017 论文阅读笔记-ffwd: delegation is (much) faster than you think"

---

**ffwd: delegation is (much) faster than you think**
> Sepideh Roghanchi (University of Illinois at Chicago), Jakob Eriksson (University of Illinois at Chicago), Nilanjana Basu (University of Illinois at Chicago)

## 背景

在多核处理器时代，如何高效地处理多线程对共享数据结构的并发访问成为关键挑战。传统的粗粒度锁方法性能受限于单线程吞吐量，而细粒度锁、无锁数据结构等方法虽能提供并发性，但实现复杂且需要大量修改现有数据结构。委托（delegation）作为一种替代方案，让专门的服务器进程代理执行所有操作，但现有委托系统性能不够理想。


## 主要贡献

本文提出了 ffwd（fast forward）系统，这是一个针对低延迟和高吞吐量优化的轻量级委托实现，旨在为适合单线程执行的数据结构在多线程环境中提供更优的性能表现。

ffwd 在 micro benchmark 上相较于 SOTA 的委托系统 RCL 提高了 10x 的性能，在应用级 benchmark 上则是 100%。

### 什么是委托

使用锁来管理共享数据结构会导致多线程对锁的争用，因此委托方案提出，将所有涉及临界区的操作委托给一个**服务进程**进行，这样可以显著提高吞吐率，对于服务进程来说还能有很好的 cache coherence。

![delegation](../assets/figures/papers/ffwd/delegation.png)

## 设计与实现

ffwd 设计了一个 API，允许将一个普通 C 函数委托给服务进程，并自旋等待返回值。其中，request 和 response 的方式很有意思：每个 client CPU 核维护一个 128B（超线程每人 64B） 的 cache line，包含函数指针、函数参数，只能被当前核的 hardware thread 写入，并且被服务进程只读，作为 request；服务进程也维护一个 128B 的 cache line，作为 response，每两个字节对应一个进程的 response，可以被同 socket 的多个核读。

服务进程会轮询每个进程的 request cache line，client 进程发出请求之后，会轮询 response cache line 的对应 slot，直到获取到返回值。

其他方面，ffwd 确保服务进程不使用原子操作，以保证性能。

![cacheline](../assets/figures/papers/ffwd/cacheline.png)

> 这里的数字非常混乱，文字说维护 128，图上画了 64，看了半天才反应过来是超线程，也没说清楚实际上 server 的 128 是给每个 client 各分一小段的。不过数字可以扩展，主要还是看他的思想。


## 效果评估



## 个人想法
