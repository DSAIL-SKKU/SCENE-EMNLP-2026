# SCENE 프로젝트 페이지

포스터와 논문 LaTeX 원본에 기반한 영문 프로젝트 페이지입니다. HTML/CSS/JavaScript만 사용하며 별도 설치나 빌드 없이 GitHub Pages에서 동작합니다.

- 사이트: https://dsail-skku.github.io/SCENE-EMNLP-2026/
- 배포 브랜치: `project_page`, 폴더: `/ (root)`
- 논문 코드·데이터 저장소 브랜치: `main`

## 로컬에서 보기

```sh
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 에 접속합니다.

## 수정할 파일

| 파일 | 내용 |
| --- | --- |
| `index.html` | 제목, 저자, 소속, 초록, 연구 설명, 자료 링크, BibTeX |
| `static/css/style.css` | 색상, 레이아웃, 모바일 화면, 인쇄 스타일 |
| `static/js/data.js` | 두 결과 차트의 수치와 표준편차 |
| `static/js/main.js` | 과제 예시, 차트 전환, 확대 보기, 인용 복사 |
| `static/images/` | 논문 그림의 웹 최적화본, 포스터 썸네일, 공유 이미지 |
| `static/files/` | 원본 벡터 그림 PDF, 포스터 PDF, 전체 결과 CSV |

모든 경로는 상대경로입니다. 추적 코드, 외부 런타임 라이브러리, 서버 API, LLM 호출을 사용하지 않습니다. 폰트도 로컬에서 제공합니다.

## 수치와 자료 출처

- 본문 구조 및 대표 예시: `EMNLP 2026_Find-4102.pdf`
- 제목, 저자, 소속: LaTeX `main.tex` 및 포스터
- 초록: `contents/0-abstract.tex`
- 데이터 수: `tables/dataset_statistics.tex` (Character 37,562 / Plot 37,593)
- 전체 모델 차트·CSV: `tables/overall_performance.tex`의 평균과 표준편차
- 과제 형식 비교: `tables/task_format.tex` (KoBBQ 유래 템플릿만 사용)
- 과제 설명 그림: `figures/concept_new.pdf`
- 구축 과정: `figures/overall.pdf`
- 상관관계: `figures/forest_pearson.pdf`
- 템플릿 출처 비교: `figures/scatter_character_split.pdf`

포스터의 구축 과정 아래에 있는 37,562 / 37,593은 데이터의 **출처별 수가 아니라 과제별 수**로 표기했습니다. PDF 텍스트 추출에서 EXAONE-32B의 막대 값 순서가 바뀔 수 있으므로 LaTeX 원본 표를 기준으로 Character BR 54.98%, Plot BR 41.71%를 사용했습니다.

과제 예시는 논문의 연령 편향 사례를 영문으로 보여 줍니다. 사용자가 선택한 결과의 분류를 설명하며 실제 모델 추론을 수행하지 않습니다. Character Specification은 두 인물에 같은 속성을 부여하면 NR, 고정관념에 부합하면 BR, 반대이면 CR로 분류합니다.

## 논문과 데이터 공개 후

1. `index.html`의 Paper 안내에 공식 논문 URL을 추가합니다. 현재 제공된 자료에는 최종 논문 PDF나 출판 URL이 없어 공개 예정으로 표시합니다.
2. 실제 공개 시 Code & data의 공개 예정 문구를 수정합니다.
3. 공식 BibTeX가 나오면 `#bibtex`와 citation 메타데이터를 갱신합니다. 현재 BibTeX는 제공된 저자·제목·학회 정보에 기반한 임시 항목이며 DOI나 페이지 번호를 추정하지 않습니다.
4. 차트 수치를 변경하면 `static/js/data.js`와 `static/files/scene-results.csv`를 함께 수정합니다. 전체 벤치마크 결과와 KoBBQ 하위집합의 결과는 다른 실험입니다.

## 배포

이 브랜치에 변경을 push하면 GitHub Pages가 갱신합니다. 최초 설정은 저장소의 **Settings → Pages → Deploy from a branch → project_page → / (root)** 입니다. `.nojekyll`이 있으므로 Jekyll 처리 없이 정적 파일을 제공합니다.

```sh
git add index.html static WEBSITE.md
git commit -m "Update SCENE project page"
git push origin project_page
```

## 확인 항목

- 모바일 메뉴 및 내부 섹션 링크
- 두 과제 탭, 키보드 좌우 방향키, 네 가지 인물 속성 조합, 세 가지 플롯 선택
- BR / NR / CR 차트와 모델 선택, 원본 표와 CSV의 일치
- 그림 확대, Escape로 닫기, 포스터·원본 PDF 열기
- BibTeX 복사 및 클립보드를 사용할 수 없는 환경의 텍스트 선택 대안
- 320px부터 1920px까지 가로 넘침 여부, 감소된 모션 설정

페이지 디자인과 코드는 이 프로젝트를 위해 작성했습니다. Nerfies의 배포 방식을 참고했으며 Nerfies의 코드를 복사하지 않았습니다. DM Sans와 Manrope는 SIL Open Font License로 배포되며 라이선스는 `static/fonts/`에 있습니다. 논문 그림과 포스터의 권리는 원저자에게 있습니다.
