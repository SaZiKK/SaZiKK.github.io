---
title: 【笔记】从零开始的 Linux Kernel Developer 生活
Author: SaZiKK
categories:
  - OS
  - study
tags:
  - os
  - Linux Kernel
date modify: 2024-09-25 22:59:01 +0800
comments: true
pin: true
excerpt: "这是我参与PLCT实验室rvlk小队的学习笔记，详细的记录了我逐步学习linux kernel的过程"
---

结束系统能力大赛之后，我尝试投了许多老师，但是都没能找到一份合适的实习。后面在软件所牢学长的推荐下了解到了 PLCT，读完了他们的招新文档之后，我有一种找到组织了的感觉，于是我成功的进入了 PLCT 的 rvlk 小队进行实习，开始准备成为一名真正的 Kernel Developer。

## 环境配置

### Kernel 环境

使用组内 Linux Kernel 仓库，由于完整代码仓库过于大，因此只 fetch 我们需要的那个版本的 commit。

```bash
# 浅 clone，只取 10 个 commit
git clone --single-branch --depth 10 -b master <git-address-of-repo>
# 取我们需要的那个 commit 的版本（v6.12），组内的 repo 没有保留 tag 信息，所以查询了 commit 号
git fetch origin adc218676eef25575469234709c2d87185ca223a
# 基于这个节点创建一个新分支并推上去，然后就可以在自己的分支上进行 patch 测试或者开发了
git checkout -b riscv-64k
git push -u origin riscv-64k:onfoo/sazikk/foo/bar/feature/branch/riscv-64k
```

配置内核

```bash
# 以 RISC-V 架构为例
make ARCH=riscv CROSS_COMPILE=riscv64-linux-gnu- defconfig
```

编译内核

```bash
# RISC-V架构
make ARCH=riscv CROSS_COMPILE=riscv64-linux-gnu- -j$(nproc)
```

完成编译后，将系统镜像复制到工作目录即可，对于 RISCV，镜像在 `arch/riscv/boot/Image` 目录下。

### Mail Patch 处理

对于邮件中提到的 patch，我们可以从这里下载完整的 mbox 文件：

![mbox](../assets/figures/linux-kernel/mbox.png)

解压之后就可以获得打包了所有 patch 的 mbox 文件，通过 `git splitmail` 可以进行 patch 拆分：

```bash
# git mailsplit -o<des-path> <src-path>
git mailsplit  -o. RFC-PATCH-v2-01-21-riscv-mm-Distinguish-hardware-base-page-and-software-base-page.mbox
```

这里要注意拆分之后获得的 `0001` `0002` 文件**不是**按照 patch commit 的顺序编号的，而应用 patch 必须要按照其 commit 的顺序来。虽然可以在邮件原文里看到这是第几个 patch，但是一个个点开看还是太唐了，所以我写了一个 sh 脚本来重命名全部的 patch，简单的检测了每个 patch 的标题中的编号：

```shell
#!/bin/bash

# 遍历所有以0开头的文件
for file in 0*; do
    # 检查文件是否存在
    if [ -f "$file" ]; then
        # 使用grep在文件内容中查找xx/21模式
        content=$(grep -o '[0-9]\{2\}/21' "$file" | head -n 1)
        if [ ! -z "$content" ]; then
            # 提取数字部分
            num=${content%/*}
            # 重命名文件
            mv "$file" "patch$num"
            echo "Renamed $file to patch$num"
        fi
    fi
done
```

最后我们就可以在我们的 kernel repo 中应用全部的 patch：

```bash
# git am <your-patch>
git am patches/patch01
...
```

## Patch Review

开发内核首先要从 review 别人的优秀 patch 开始.

### [RFC PATCH v2 00/21] riscv: Introduce 64K base page

邮件地址：https://lore.kernel.org/all/20241205103729.14798-1-luxu.kernel@bytedance.com/

这是一系列共 21 个由字节的开发者提交的 patch，旨在使用软件方法为 RISCV 支持 64k 大小的页表（现有 MMU 只支持 4k），以提高性能表现。邮件交流过程中有其他开发者提到了 64k 页表潜在的内存内碎片问题，但是字节的开发者表示他们在 ARM 架构上的测试表现出了非常逆天的性能优化，所以想在 RISCV 上也试一下。不过他们提到在 riscv64 上的性能测试正在进行，他们争取在下一个版本给出性能数据。

#### 实现方式

64k 页表的原理是通过将 16 张标准的 4k 大小页表的空间连续分配，并通过 RISCV 的 Svnapot（supervisor virtual naturally aligned power-of-2） Standard Extension 实现加速内存访问。

Svnapot 要求 pte 的第 63 位也就是 N 位为 1，然后会根据 pte 中 ppn 的编码判断扩展的大小，具体编码如下图所示。

![Svnapot](../assets/figures/linux-kernel/svnapot.png)

可以看出实际上目前只支持 64k 的扩展，其余全部都是 reserved。~~从名字 naturally aligned power-of-2（自然对齐的二次方）也能看出来这个也扩展只支持二的幂次大小，这也非常好理解，因为两个 pte.ppn[0] 的 x xxxx 1000 之间恰好隔了 16，也就是 16 个 4k 页。~~ 这里的理解有误，还没有很好的理解这个扩展，需要继续研究。

#### patch 测试
##### 测试环境：
- Ubuntu 22.04.5 LTS (GNU/Linux 6.8.0-49-generic x86_64) （ 806 服务器 ）
  - qemu-7.0.0
##### 测试方案：
基于 v6.12 稳定版打 patch， 测试 redis、MySQL 等性能，与稳定版进行对比，

