# Netlify 設定流程

## 1. 建立 Site

1. 登入 [Netlify](https://netlify.com)
2. **Add new site → Import an existing project**
3. 選 **GitHub** → 授權 → 選目標 repo
4. Build settings 確認：
   - Build command：`npm run build-storybook`
   - Publish directory：`storybook-static`
5. 取 site name（例：`companyinvoice`）→ Deploy

完成後正式站網址：`https://<site-name>.netlify.app`

---

## 2. 設定 deploy-targets.json

讓 Claude Code 知道 Netlify site name，push 後自動回吐預覽連結。

```bash
mkdir -p ~/.claude/local
```

建立 `~/.claude/local/deploy-targets.json`：

```json
{
  "netlify": {
    "siteName": "<site-name>"
  }
}
```

---

## 3. 開啟 Branch deploys

Netlify 後台路徑：

**Site configuration → Build & deploy → Continuous deployment → Branches and deploy contexts → Configure**

- **Branch deploys** → 改為 **All**
- 儲存

---

## 4. 設定密碼保護（免費）

Netlify 後台：**Site configuration → Environment variables → Add variable**

```
Key:   STORYBOOK_BASIC_AUTH
Value: username:password
```

下次 deploy 後，站台會自動跳帳密彈窗（由 `netlify/edge-functions/basic-auth.ts` 處理，免費 tier 可用）。

> **注意**：不要用 Netlify Dashboard Password Protection 或 `_headers` Basic-Auth，兩者都需要 Pro $20/mo。

---

## 5. 部署結果

| Push 目標 | 結果 |
|---|---|
| `main` | 正式站 `https://<site-name>.netlify.app` 更新 |
| 任意 branch | 預覽站 `https://<branch-name>--<site-name>.netlify.app` 自動產生 |

Branch 名稱中的 `/` 會被轉成 `-`，例：
- branch `claude/kind-pascal-mwba74`
- 預覽網址 `https://claude-kind-pascal-mwba74--companyinvoice.netlify.app`
