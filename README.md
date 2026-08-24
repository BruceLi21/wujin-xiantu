# 無盡仙途 V0.8 — iPhone 實機重構版

本版依 iPhone Safari 實機畫面重構。

- 移除主頁重複的大型人物卡與四張重複資訊卡。
- 主頁頂部只保留境界 / 修為 / 靈石 / 戰力。
- 名稱、境界、修煉速度改為一條緊湊身份列。
- 突破與閉關操作大幅上移，優先在一個手機畫面內完成主要操作。
- 底部四個導航固定完整顯示：修煉 / 歷練 / 洞府 / 角色。
- 「角色」頁新增角色名稱修改，可輸入 1～12 個字並保存。
- 沿用 V0.7 IndexedDB 存檔，不重置進度。
- 更新 Service Worker cache 到 V0.8。

GitHub Pages 更新方式：
把本版 index.html、css、js、manifest.json、service-worker.js 等檔案覆蓋到 repository 根目錄並 Commit。
GitHub Pages 會自動重新部署。
