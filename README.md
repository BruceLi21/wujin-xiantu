# 無盡仙途 V13

這版修正 V12 實機仍讀到舊版，以及 V12 功能沒有真正接上的問題。

- 所有 HTML/CSS/JS 資源帶 ?v=13。
- Service Worker 改 network-first，更新時刪除所有舊 Cache。
- Service Worker 以 updateViaCache:none 註冊。
- 洞府使用正確 #page-cave 選擇器，四頁籤＋全寬內容。
- 體力正式為無限，副本只受境界解鎖限制。
- 普通怪與 Boss 真正逐回合攻防：雙方 HP、攻擊、防禦、反擊、血條動畫。
- 保留 IndexedDB 存檔。
