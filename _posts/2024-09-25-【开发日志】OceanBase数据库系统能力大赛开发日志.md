---
title: 【开发日志】OceanBase数据库系统能力大赛开发日志
Author: SaZiKK
categories:
  - develop
  - DB
date modify:  2024-09-25 22:54:56 +0800
date: 2024-09-25 22:53:42 +0800
tags:
  - DB
comments: true
date create:  2024-09-25 22:52:19 +0800
---

这是2024系统能力大赛OceanBase数据库赛道的开发日志，记录我的开发思路和遇到的问题。

### 2024.10.5 

虽然对数据库相关知之甚少，但是迫于时间紧迫只能边写边学。

#### miniob环境配置及源码阅读
为miniob配置了虚拟机环境和mac环境，并修改了vscode的配置文件。

vscode的task.json类似于一个makefile，规定了一系列目标，同时可以在launch.json里规定gdb等的配置，并且指定依赖于task.json里的某几个目标。总的来说像一个大号makefile。
