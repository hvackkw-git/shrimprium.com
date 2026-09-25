# Shrimprium 공식 웹사이트

[shrimprium.com](https://shrimprium.com) 게임의 공식 소개 사이트. Astro 기반 정적 사이트로, 백엔드 없이 동작합니다.

> 이 폴더는 자체 `package.json`을 가진 독립 프로젝트입니다.
> 별도 리포지토리(`shrimprium.com`)로 옮길 때는 폴더 내용물을 그대로 복사하면 됩니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 빌드
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/pages/index.astro` | 게임 소개 (랜딩) |
| `src/pages/devlog/` | 데브로그 목록/글 |
| `src/content/devlog/` | 데브로그 글 (마크다운 1개 = 글 1개) |
| `src/config/site.js` | 메뉴, 게임 URL, 지원 이메일 |
| `public/privacy.html` | 개인정보처리방침 |

## 데브로그 글 추가

`src/content/devlog/`에 `YYYY-MM-DD-slug.md` 파일을 추가하면 자동으로 목록과 홈에 나타납니다.

```md
---
title: 글 제목
date: 2026-09-25
description: 목록에 보일 한 줄 요약 (선택)
---

본문...
```

## 배포 (Cloudflare Pages)

- 빌드 명령: `npm run build`, 출력 디렉토리: `dist`
- 커뮤니티 등 백엔드가 필요해지면 Cloudflare Pages Functions(`functions/` 디렉토리)로 같은 리포에서 확장 가능.

## 도메인 전환 시 체크리스트

1. 게임을 `play.shrimprium.com`(또는 다른 위치)에 먼저 배포
2. `src/config/site.js`의 `GAME_URL` 변경
3. 게임 내 클라우드 저장 유도 공지 후 루트 도메인을 이 사이트로 전환
4. 구 PWA 사용자를 위해 standalone 모드 감지 시 게임으로 리다이렉트 추가 검토
