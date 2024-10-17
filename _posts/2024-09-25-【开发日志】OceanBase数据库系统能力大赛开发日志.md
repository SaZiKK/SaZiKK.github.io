---
title: 【开发日志】OceanBase数据库系统能力大赛开发日志
Author: SaZiKK
categories:
  - develop
  - DB
date modify: 2024-09-25 22:54:56 +0800
date: 2024-09-25 22:53:42 +0800
tags:
  - DB
comments: true
date create: 2024-09-25 22:52:19 +0800
---

这是2024系统能力大赛OceanBase数据库赛道的开发日志，记录我的开发思路和遇到的问题。

### 2024.10.5

虽然对数据库内核知之甚少，但是迫于时间紧迫只能边写边学。

#### miniob环境配置及源码阅读

为miniob配置了虚拟机环境和mac环境，并修改了vscode的配置文件。

vscode的task.json类似于一个makefile，规定了一系列目标，同时可以在launch.json里规定gdb等的配置，并且指定依赖于task.json里的某几个目标。总的来说像一个大号makefile。

### 2024.10.9

#### 熟悉项目阅读代码

miniob的项目代码非常庞大，且没有较为详细的手册，因此上手写之前肯定要先大体理解代码架构。

半年多没写C++有点陌生，但因为在学习rust的期间对于语言有了一些更深的理解，重新回头再去看C++的一些特性时也有了不少收获。

虽然C/C++确实跑的快也非常强大非常自由，但是难崩的的地方确实难崩。大家都有所诟病的使用宏导致可读性一塌糊涂就不说了，为了解决头文件重复引用导致重定义的问题，C++打了足足四个补丁：

- 使用 `extern` 关键字
- 使用 `inline` 变量
- 使用头文件保护宏，即 `#ifdef`
- 使用 `#pragma once`

我承认我的C++水平很烂，以上四个feature有三个之前都不知道有什么用，因此在一个项目里同时看到以上四者让我大为震撼。
我：“C++写的够好就不需要rust”
也是我：“rust的诞生不是没有原因的”

不过说回来，维护大型C++项目的能力非常重要，正好借此机会练习一下，从这里也能体会到，rust作为一种更新的语言，在项目构建以及文件的互相依赖方面确实做的更好更加明晰。

#### 添加 Makefile

习惯用make了，加一个方便点

#### 完成 `DATE` 类型前端兼容

为数据库添加一种全新类型比较繁琐，因为同时需要前后端的支持，同时miniob在某些方面的可维护性也确实不太好。首先就是要完成编译前段的兼容。

前端兼容分为词法分析和语法分析两部分。词法分析即提取所有关键字，然后把非关键字压栈，传递给语法分析部分，这一部分由lex完成。我们需要在关键字中加入 `DATE` ，同时我们也要通过正则表达式筛选符合 `DATE` 字段YYYY-mm-DD格式的字符串

```c++
// miniob/src/observer/sql/parser/lex_sql.l
CHAR                                    RETURN_TOKEN(STRING_T);
FLOAT                                   RETURN_TOKEN(FLOAT_T);
DATE                                    RETURN_TOKEN(DATE_T);
LOAD                                    RETURN_TOKEN(LOAD);
DATA                                    RETURN_TOKEN(DATA);
```

```c++
// miniob/src/observer/sql/parser/lex_sql.l
{ID}                                    yylval->string=strdup(yytext); RETURN_TOKEN(ID);
{QUOTE}[0-9]{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]){QUOTE} yylval->string=strdup(yytext); RETURN_TOKEN(DATE_STR);
"("                                     RETURN_TOKEN(LBRACE);
```

这样词法分析部分就完成了。

接下来是语法分析，这部分由yacc完成。这一部分我个人的理解就是，将词法分析的得到的符号结合数据，定义最简单的表达式如何处理，然后再将表达式与其他符号或者其他表达式组合，递归定义所有语法，这样就可以通过一段相对简短的声明来定义一个逻辑完备的语法。

我们首先增加token，包含`DATE_T`和`DATE_STR`两个标签，确保可以识别出来，然后分别定义解析规则：

```c++
// miniob/src/observer/sql/parser/yacc_sql.y
type:
    INT_T      { $$ = static_cast<int>(AttrType::INTS); }
    | STRING_T { $$ = static_cast<int>(AttrType::CHARS); }
    | FLOAT_T  { $$ = static_cast<int>(AttrType::FLOATS); }
    | DATE_T   { $$ = static_cast<int>(AttrType::DATE); }
```

```c++
// miniob/src/observer/sql/parser/yacc_sql.y
    |DATE_STR {
      char *tmp = common::substr($1, 1, strlen($1)-2);  // 去掉首尾的引号
      int year, month, day;
      sscanf(tmp, "%d-%d-%d", &year, &month, &day);    //sscanf会自动转换字符串中的数字，不用显式stoi
      int date_num = year * 10000 + month * 100 + day;
      $$ = new Value(date_num);
      free(tmp);
      free($1);
```

其中 `DATE_STR` 在 `value` 规则下定义。注意 `DATE_STR` 的声明要在 `SSS` 之前，因为 `DATE_STR` 属于 `SSS` 的一个子集，这样 `DATE` 的前端部分就完成了。

#### 2024.10.11

### 添加 `DATE` 类型检验
