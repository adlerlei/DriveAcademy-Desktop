# DriveAcademy Web App - 任務接續文件

> **用途**：此文件用於開新視窗時快速了解專案現況並接續工作

---

## 專案概況

| 項目 | 說明 |
|------|------|
| **專案目錄** | `/Users/jianyin/Documents/DriveAcademy-Desktop/webapp` |
| **Git 分支** | `feature/webapp-sveltekit` |
| **技術架構** | SvelteKit + Tailwind CSS + Cloudflare D1 |
| **文件目錄** | `webapp/介面文件說明/` (11 份頁面規格文件) |

---

## 🎯 當前階段：功能測試與響應式設計

### 第一階段：響應式設計 (RWD) 🔴 待處理
目前介面尚未針對手機與平板做自適應設計，需優先解決：

| 項目 | 說明 |
|------|------|
| 側邊欄 | 手機版需改為抽屜式 (Drawer) |
| 表單網格 | 需調整 breakpoints 確保小螢幕可用 |
| 表格 | 需支援水平滑動或卡片式顯示 |
| 按鈕 | 需確保觸控友好 (最小 44px) |
| 測試裝置 | iPhone SE, iPad, Desktop |

### 第二階段：功能完整性測試 🟡 待處理
所有頁面 UI 已移植重構，需驗證功能是否正常運行：

| 功能類別 | 測試項目 |
|----------|----------|
| **CRUD 操作** | 新增/修改/刪除/查詢 學員、教練、年度期別 |
| **搜尋功能** | 統一搜尋欄位是否正確觸發 API |
| **連動下拉** | 班別/考照類別/教練/地址 是否正確連動 |
| **日期處理** | 日期格式轉換是否正確 |
| **學員編號格式** | xxx-xxx 自動格式化是否正常 |
| **匯出功能** | 各名冊/清冊的匯出功能 |
| **列印功能** | 各名冊/清冊的列印功能 |

### 第三階段：介面佈局重新設計 📋 規劃中
目前介面佈局參照舊版，需要更人性化、更便利的設計：

- [ ] 重新設計資料輸入流程
- [ ] 優化使用者操作動線
- [ ] 簡化常用功能的操作步驟
- [ ] 考慮新增快捷操作區

### 第四階段：台灣地址資料整合 📋 規劃中
郵遞區號與縣市區下拉選單需要完整的台灣地址資料：

| 項目 | 說明 |
|------|------|
| 資料來源 | NPM 套件 (`taiwan-address`) 或政府開放資料 |
| 資料結構 | 縣市 → 鄉鎮市區 → 郵遞區號 (三層連動) |
| 檔案位置 | `src/lib/data/taiwan-address.ts` |
| 連動邏輯 | 選縣市 → 篩選區 → 自動帶入郵遞區號 |

**建議實作方式：**
```typescript
// src/lib/data/taiwan-address.ts
export const taiwanAddress = {
  "台北市": { "中正區": "100", "大同區": "103", ... },
  "新北市": { "板橋區": "220", "三重區": "241", ... },
  // ...全台 22 縣市
};
```

## ✅ 已完成項目

### 介面樣式統一化 (2026-01-03 完成)
所有 11 個頁面已套用一致的視覺風格：

| 改進項目 | 說明 |
|----------|------|
| 統一搜尋 | 多個搜尋欄位整合為單一輸入框 |
| 區塊圖示 | 各區塊標題添加 SVG 圖示 |
| 整合下拉選單 | 連動下拉改為單一選單 (代碼 - 名稱 格式) |
| 12 欄網格 | 表單欄位使用精確寬度控制 |
| 按鈕分離 | 功能按鈕獨立為卡片式區塊 |
| 輸入框樣式 | 統一圓角 (rounded-md)、深邊框、內陰影 |

**相關 Git Commits：**
- `b470560` - 開訓/結訓名冊
- `e4309b9` - 學科/術科考驗
- `9e77c01` - 道考/M2補訓/學照登錄/學照送件
- `c53bf9e` - 年度期別計畫欄位調整
- `ba3eb64` - 年度期別計畫佈局

### 頁面欄位修正 (11/11 完成)
所有頁面已根據 `介面文件說明/` 資料夾的規格文件修正完成。

**相關 Git Commits：**
- `179653e` - 年度期別計畫
- `651e681` - 學員資料作業
- `7999ac0` - 教練資料作業
- `6df8f3c` - 其餘 8 個頁面

### 基礎建設完成
- ✅ SvelteKit 專案初始化
- ✅ Tailwind CSS 配置
- ✅ Cloudflare adapter 設定
- ✅ 資料庫 schema (`drizzle/schema.sql`)
- ✅ 後端服務 (StudentService, InstructorService, AuthService)
- ✅ API 端點 (CRUD for students/instructors, auth)
- ✅ 基礎 UI 元件 (GlassCard, GlassButton, GlassInput, GlassTable, GlassModal, GlassSidebar)
- ✅ 側邊欄導覽
- ✅ 11 個頁面完整實作

---

## 📋 後續待處理項目

| 優先級 | 項目 | 狀態 |
|--------|------|------|
| 🔴 高 | 響應式設計 (RWD) | 待處理 |
| 🔴 高 | 功能完整性測試 | 待處理 |
| 🟡 中 | 介面佈局重新設計 | 規劃中 |
| 🟢 低 | 連接實際 D1 資料庫 | 待處理 |
| 🟢 低 | 資料遷移 | 待處理 |
| 🟢 低 | Cloudflare 部署 | 待處理 |

---

## 快速指令

```bash
# 啟動開發伺服器
cd /Users/jianyin/Documents/DriveAcademy-Desktop/webapp && npm run dev

# 建構專案
npm run build

# 切換到正確分支
git checkout feature/webapp-sveltekit
```

---

## 相關文件路徑

| 文件 | 路徑 |
|------|------|
| 介面規格 | `webapp/介面文件說明/*.md` |
| 資料庫 schema | `webapp/drizzle/schema.sql` |
| UI 元件 | `webapp/src/lib/components/` |
| 後端服務 | `webapp/src/lib/server/` |
| API 路由 | `webapp/src/routes/api/` |
| 頁面 | `webapp/src/routes/(app)/` |
