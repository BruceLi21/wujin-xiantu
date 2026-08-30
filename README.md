# 無盡仙途 V19

完整專案包，供後續 Windows / GitHub 更新使用。

## 目前正式入口
- `index.html`
- `service-worker.js`

目前 V19 為單檔式前端：CSS 與 JavaScript 內嵌在 `index.html`，可直接部署 GitHub Pages。

## 專案資料夾
- `css/`：後續版本若拆分樣式檔，可放在此處
- `js/`：後續版本若拆分遊戲邏輯，可放在此處
- `docs/`：版本與開發說明
- `service-worker.js`：離線快取
- `index.html`：遊戲主程式

## 存檔
IndexedDB：
- DB：`wujin-xiantu-db`
- Store：`save`
- Key：`main-save`

更新程式時請勿任意更改以上三項，以免舊存檔無法沿用。

## GitHub Pages
部署後可使用：
`?v=19`

例如：
`https://你的帳號.github.io/你的Repo/?v=19`

## V19 主要功能
- 米白／墨綠／金色 UI
- 修煉與突破
- 離線收益
- 歷練攻防往返動畫
- 無限體力
- 背包上下滑動
- 煉丹
- 裝備翻頁、比較、切換
- 功法與升級
- 角色名稱修改
- IndexedDB 本機存檔
- Service Worker 離線支援
