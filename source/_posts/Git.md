---
title: Git
date: 2026-08-23 02:05:34
tags:
    - Git
    - 项目管理
    - 团队协作
    - 学习笔记
    - 经验分享
cover: https://cdn.jsdelivr.net/gh/Miizhu/picgo@main/images/git%E5%9B%BE%E7%89%87.png
top_img: transparent 
---
# 简读
本文介绍如何通过git管理本地项目，包括链接到网络仓库、提交修改

# 从零开始的实现流程
1. 在项目文件夹打开powershell（Win11系统中文点击终端就可以打开powershell）
2. 输入以下指令，新建一个分支为main，也就是主分支。
```powershell
git init -b main
```
3. 输入以下指令，检查指定路径是否被忽略。
```powershell
git check-ignore -v 文件名
# eg: git check-ignore -v .godot/
```
> 这些文件在项目根目录新建文件.gitignore后写在这个文件里
> eg:
> ```text
> # Godot 导入缓存
> .godot/

> #临时文件
> *.tmp

> #Windows生成文件
> Thumbs.db
> Desktop.ini

> #VS Code配置
> .vscode/

> #导出的游戏文件
> build/
> export/
> ```
4. 将当前版本复制到暂存区
```powershell
git add .
```
5. 检查仓库状态
```powershell
git status
```
6. 确认修改出现在changes to be commited后，创建第一次提交
```powershell
git commit -m "chore: initialize project"
```
7. 连接到Github仓库同时用origin代指仓库网址（只有第一次上传需要），如果是clone的库不需要执行这一步。
```powershell
git remote add origin 仓库网址
```
8. 检查连接
```powershell
git remote -v
git ls-remote origin
```
9. 将暂存区文件推送到远程仓库。
    push：将本地提交推送到远程仓库
    origin：目标远程仓库，在第七步时定义过
```powershell
git push origin main
```
10. 推送成功后，新建dev分支保存开发版本
```powershell
git switch -c dev
git push -u origin dev
```
11. 以后开发功能时，只需要切换分支，clone代码，新建分支，将代码添加到暂存区，修改描述再上传即可
```powershell
git switch dev
git pull  #拉取最新提交
git switch -c feature/功能名称  #创建功能分支
git add .
git commit -m "feat: 描述本次功能"
git push origin feature/功能名称
#以下为合并流程
git pull --ff-only origin dev
git merge feature/功能名称
git push origin dev
```