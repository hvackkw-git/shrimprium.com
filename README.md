# shrimprium.com

Shrimprium 공식 웹사이트. Astro 정적 사이트.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
```

| 경로 | 내용 |
|---|---|
| `src/pages/index.astro` | 게임 소개 — 스크롤하면 별들이 이어지는 이야기 |
| `src/scripts/cosmos.js` | 배경 별자리 캔버스 (장면 전환, 연결선, 성운) |
| `src/content/devlog/` | 데브로그 글 (`.md` 하나 = 글 하나) |
| `src/site.js` | 게임 주소, 문의 이메일 |
| `public/privacy.html` | 개인정보처리방침 |

## 데브로그 글 쓰기

`src/content/devlog/YYYY-MM-DD-slug.md`

```md
---
title: 글 제목
date: 2026-09-25
summary: 목록에 보일 한 줄 (선택)
---

본문
```

## 폰트

- [Pretendard](https://github.com/orioncactus/pretendard) — SIL OFL 1.1, 상업적 이용 가능
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — SIL OFL 1.1, 상업적 이용 가능 (로고)
