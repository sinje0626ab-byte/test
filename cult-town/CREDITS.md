# CREDITS

이 게임에 쓴 외부 에셋과 라이선스. 라이선스 원문은 `public/assets/LICENSES/`.

**Modern Exteriors · Modern Interiors by LimeZu (https://limezu.itch.io/)**: 유료 완전판. 게임에 넣어 쓰기·고쳐 쓰기만 허용, 원본(고친 것 포함) 배포·재판매 금지, 크레딧 필수.

| 무엇 | 어디에 | 만든 사람 | 라이선스 | 원본 |
|---|---|---|---|---|
| Modern Exteriors 16x16 (`lz/town.png`) | 동네 바닥·길·인도·횡단보도·건물 지붕·벽·창·문·천막·진열창·나무·가로등·전봇대·자판기·벤치·쓰레기통·화분·좌판·차·지하철 계단 | LimeZu | 유료 라이선스 (배포·재판매 금지, 크레딧 필수) | https://limezu.itch.io/modernexteriors |
| Modern Interiors 16x16 (`lz/indoor.png`) | 성소 실내 바닥·벽·가구 (꾸밈 단계 4가지) | LimeZu | 유료 라이선스 (같음) | https://limezu.itch.io/moderninteriors |
| Modern Interiors 캐릭터 생성기 + Modern Exteriors 캐릭터 애드온 (`lz/people-cold.png` · `lz/people-warm.png`) | 사람 78명 (몸·눈·옷·머리·소품 조합, 걷기·대기·앉기·폰 애니메이션) | LimeZu | 유료 라이선스 (같음) | https://limezu.itch.io/moderninteriors |
| RPG Audio (door, coins, page, step) | 효과음 | Kenney | CC0 1.0 | https://kenney.nl/assets/rpg-audio |
| Interface Sounds (select, confirm, error, talk) | 효과음 | Kenney | CC0 1.0 | https://kenney.nl/assets/interface-sounds |
| UI Audio (click) | 효과음 | Kenney | CC0 1.0 | https://kenney.nl/assets/ui-audio |
| Music Jingles (jingle_good, jingle_bad, jingle_week) | 주보·엔딩 | Kenney | CC0 1.0 | https://kenney.nl/assets/music-jingles |
| 갈무리 Galmuri11 · Galmuri11 Bold · Galmuri14 · GalmuriMono11 · Galmuri7 (npm `galmuri` 2.40.3) | 모든 한글 글자 (Galmuri7: 간판·이름표·말풍선) | Lee Minseo (quiple) | SIL OFL 1.1 | https://github.com/quiple/galmuri |
| Phaser 3.90 | 맵·캐릭터 그리기 | Phaser Studio | MIT | https://phaser.io |
| Vite | 개발 서버·빌드 | Vite 팀 | MIT | https://vitejs.dev |

## 받은 경로
- LimeZu 팩은 사용자가 구매한 원본을 비공개 레포 `sinje0626ab-byte/cult-assets` 에 둔다. `tools/build-assets.py` 가 거기서 게임에 쓰는 조각만 잘라 `public/assets/lz/` 에 묶는다. 캐릭터 생성기 부위 시트·원본 시트·zip 은 이 공개 레포에 넣지 않는다.
- Kenney 의 RPG Urban Pack · Roguelike Indoors 는 LimeZu 로 바꾸면서 뺐다 (효과음 팩은 그대로).
- kenney.nl 은 이 개발 환경에서 접속이 막혀 있어, Kenney 원본 zip 을 그대로 풀어 둔 공개 GitHub 미러 `ETdoFresh/kenney.nl` 에서 받았다. 파일은 원본 그대로이고 팩마다 License.txt 를 같이 넣었다.

## 코드로 그린 것 (에셋 아님)
- 사람 외형 조합 (어느 부위를 고를지) 은 `src/data/*.js` 의 look. 그림은 LimeZu 캐릭터 생성기 부위를 합성한 것.
- 한국식 간판, 층별 안내판, 신림역 출구 번호판, 교단 현수막 (`src/game/signs.js`). LimeZu 에 맞는 그림이 없어 도형으로 그리고, 외곽선은 LimeZu 외곽선 색(#46465e)에 맞췄다. 스프라이트 키로 부르므로 같은 키의 이미지를 넣으면 바뀐다.
- 지붕 물탱크·빨래줄, 골목 자전거, 전선, 감정 말풍선, 직업 아이콘, 비, 계시 연출의 빛줄기·먼지 (코드). 벽 색 넷 중 분홍·크림은 LimeZu 노랑·회색 벽을 색만 바꾼 것.
- 계시 연출은 같은 레포 `faith-game/` 의 코드를 옮겨 다듬었다.

## 지도
- 신림동·신림역·남부순환로·신림로·도림천은 실제 이름이다. 길 배치는 손으로 단순화했다.
- OpenStreetMap 데이터는 이 환경에서 접속이 막혀 쓰지 못했다. 쓰지 않았으므로 표기하지 않는다. 나중에 OSM 데이터로 다듬으면 "© OpenStreetMap contributors (ODbL)" 를 크레딧 화면과 이 파일에 넣는다.
- 가게·교회·절·점집·건물·인물·교단 이름은 전부 지어낸 것이다.
