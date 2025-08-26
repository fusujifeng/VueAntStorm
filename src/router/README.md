# 路由菜单系统设计文档

## 概述

本系统采用基于权限的路由菜单架构，支持三层权限控制、动态路由加载和双菜单模式（侧边菜单 + 顶部菜单）。

## 系统架构

### 1. 权限层级设计

#### 三层权限架构

```typescript
enum PermissionLevel {
  PUBLIC = 'public',           // 公开访问，无需登录
  AUTHENTICATED = 'authenticated', // 需要登录
  ROLE_BASED = 'role_based'    // 基于角色的权限控制
}
```

**权限层级说明：**

1. **PUBLIC（公开权限）**
   - 适用场景：登录页、注册页、404页面、帮助文档等
   - 特点：无需登录即可访问
   - 示例：`/login`, `/register`, `/404`

2. **AUTHENTICATED（登录权限）**
   - 适用场景：首页、仪表板、个人中心等基础业务页面
   - 特点：需要用户登录，但不区分具体角色
   - 示例：`/dashboard`, `/profile`

3. **ROLE_BASED（角色权限）**
   - 适用场景：员工管理、系统设置、数据分析等敏感功能
   - 特点：需要特定角色或权限才能访问
   - 示例：`/admin/users`, `/admin/settings`

### 2. 路由来源设计

#### 双源路由架构

```typescript
// 静态路由（前端定义）
const staticRoutes = [
  {
    path: '/login',
    component: LoginView,
    meta: { permission: PermissionLevel.PUBLIC }
  }
]

// 动态路由（后端返回）
const dynamicRoutes = await fetchDynamicRoutes()
```

**路由来源分类：**

1. **静态路由（前端写死）**
   - 基础页面：登录、注册、404等
   - 核心业务：首页、仪表板等
   - 优点：加载快速、稳定可靠
   - 配置位置：`src/router/index.ts`

2. **动态路由（后端传值）**
   - 业务模块：根据用户权限动态加载
   - 个性化菜单：不同角色看到不同菜单
   - 优点：灵活配置、权限精确控制
   - 加载时机：用户登录后

### 3. 菜单系统设计

#### 双菜单模式

```typescript
interface MenuItem {
  key: string
  title: string
  icon?: string
  path?: string
  permission: PermissionLevel
  roles?: UserRole[]
  menuType: 'side' | 'head' | 'both'
  children?: MenuItem[]
}
```

**菜单类型：**

1. **侧边菜单（sideMenu）**
   - 主要导航：业务功能模块
   - 层级结构：支持多级嵌套
   - 显示位置：左侧边栏
   - 适用场景：详细的功能分类

2. **顶部菜单（headMenu）**
   - 快速导航：常用功能入口
   - 扁平结构：一般为单层
   - 显示位置：顶部导航栏
   - 适用场景：快速切换主要模块

## 核心文件说明

### 文件结构