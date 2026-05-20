# Terminal Portfolio

Cloudflare Workers で動く、ターミナル風のポートフォリオです。

- ブラウザではターミナル風 UI を表示
- `curl http://localhost:9090` では自己紹介を `text/plain` で表示
- `curl http://localhost:9090/api/profile` では JSON を表示
- GitHub リンク、技術スタック、プロジェクトは `src/profile.ts` だけ編集すれば更新可能

## Setup

```bash
npm install
npm run dev
```

ローカルでは Wrangler が `http://localhost:9090` を起動します。

```bash
curl http://localhost:9090
curl http://localhost:9090/api/profile
```

## Edit Profile

プロフィール情報は [src/profile.ts](src/profile.ts) に集約しています。

- GitHub や SNS のリンクを増やす: `links` に追加
- 技術スタックを増やす: `tech` に追加
- 実績や制作物を増やす: `projects` に追加
- 自己紹介文を変える: `bio` / `highlights` を編集

## Deploy

Cloudflare にログインしていない場合:

```bash
npx wrangler login
```

デプロイ:

```bash
npm run deploy
```

Worker 名を変えたい場合は [wrangler.jsonc](wrangler.jsonc) の `name` を変更してください。
