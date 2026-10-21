# CREDITS

이 게임에 쓴 외부 에셋과 라이선스. CC0 · OFL · CC-BY 만 쓴다. 라이선스 원문은 `public/assets/LICENSES/`.

| 무엇 | 어디에 | 만든 사람 | 라이선스 | 원본 |
|---|---|---|---|---|
| RPG Urban Pack (`tiles/urban.png` = Tilemap/tilemap_packed.png) | 동네 타일·소품·사람 몸 틀 6종 | Kenney (kenney.nl) | CC0 1.0 | https://kenney.nl/assets/rpg-urban-pack |
| Roguelike Indoors (`tiles/indoor.png` = roguelikeIndoor_transparent.png) | 성소 실내 바닥·벽·가구 | Kenney | CC0 1.0 | https://kenney.nl/assets/roguelike-indoors |
| RPG Audio (door, coins, page, step) | 효과음 | Kenney | CC0 1.0 | https://kenney.nl/assets/rpg-audio |
| Interface Sounds (select, confirm, error, talk) | 효과음 | Kenney | CC0 1.0 | https://kenney.nl/assets/interface-sounds |
| UI Audio (click) | 효과음 | Kenney | CC0 1.0 | https://kenney.nl/assets/ui-audio |
| Music Jingles (jingle_good, jingle_bad, jingle_week) | 주보·엔딩 | Kenney | CC0 1.0 | https://kenney.nl/assets/music-jingles |
| 갈무리 Galmuri11 · Galmuri11 Bold · Galmuri14 · GalmuriMono11 · Galmuri7 (npm `galmuri` 2.40.3) | 모든 한글 글자 (Galmuri7: 간판·이름표·말풍선) | Lee Minseo (quiple) | SIL OFL 1.1 | https://github.com/quiple/galmuri |
| Phaser 3.90 | 맵·캐릭터 그리기 | Phaser Studio | MIT | https://phaser.io |
| Vite | 개발 서버·빌드 | Vite 팀 | MIT | https://vitejs.dev |

## 받은 경로
- kenney.nl 은 이 개발 환경에서 접속이 막혀 있어, Kenney 원본 zip 을 그대로 풀어 둔 공개 GitHub 미러 `ETdoFresh/kenney.nl` 에서 받았다. 파일은 원본 그대로이고 팩마다 License.txt 를 같이 넣었다.

## 코드로 그린 것 (에셋 아님)
- 주민 30명 + 성직자 3명 + 첫 신도 3명의 머리·피부·옷 색과 모자·올림머리·묶음머리 (`src/game/people.js`, RPG Urban 몸 틀을 다시 칠함)
- 간판, 신림역 출구, 방석, 전기포트, 현수막, 창문, 계단 (`src/game/signs.js`, `SanctuaryScene.js`). 모두 스프라이트 키로 부르므로 같은 키의 이미지를 넣으면 바뀐다.
- 2단계 추가분: 지붕 물탱크·실외기·빨래줄, 골목 분리수거함·자전거·실외기, 전선, 감정 말풍선, 직업 아이콘, 비, 계시 연출의 빛줄기·먼지 (전부 코드). 전봇대·주차 차량·쓰레기 봉투·좌판은 RPG Urban Pack 타일.
- 계시 연출은 같은 레포 `faith-game/` 의 코드를 옮겨 다듬었다.

## 지도
- 신림동·신림역·남부순환로·신림로·도림천은 실제 이름이다. 길 배치는 손으로 단순화했다.
- OpenStreetMap 데이터는 이 환경에서 접속이 막혀 쓰지 못했다. 쓰지 않았으므로 표기하지 않는다. 나중에 OSM 데이터로 다듬으면 "© OpenStreetMap contributors (ODbL)" 를 크레딧 화면과 이 파일에 넣는다.
- 가게·교회·절·점집·건물·인물·교단 이름은 전부 지어낸 것이다.
