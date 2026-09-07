// 프로젝트 관리
const projectData = {

  dashboard: {
    title: "스마트 사옥 통합 관리 시스템",
    description: "출입·방문·주차·근태·식수 등 사옥 운영 전반의 기능을 하나의 플랫폼에서 통합 관리하는 웹 기반 스마트 사옥 관리 시스템입니다. 전체 시스템의 웹 퍼블리싱을 담당했으며, 메인 대시보드를 중심으로 주요 화면의 UI를 구현하고 공통 레이아웃 및 UI 요소를 구성하여 이후 화면 개발에 활용할 수 있는 퍼블리싱 기반을 구축했습니다.",
    role: "Web Publishing ······ 100%",
    duties: [
      "메인 대시보드 퍼블리싱",
      "주요 관리 화면 퍼블리싱",
      "UI 컴포넌트 구현",
      "인터랙션 구현"
    ],
    environment: "PC Web",
    stack: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Vite"
    ],
    tools: [
      "Figma",
      "VS Code",
      "Git",
      "GitHub"
    ]
  },


  kiosk: {
    title: "Kiosk",
    description: "대시보드 프로젝트 상세 내용입니다.",
    role: "UI/UX Design · Publishing",
    duties: [
      "키오스크 UI/UX 디자인",
      "화면 퍼블리싱",
      "인터랙션 구현"
    ],
    environment: "Kiosk",
    stack: [
      "HTML5",
      "CSS3",
      "JavaScript"
    ],
    tools: [
      "Figma",
      "VS Code",
      "Git",
      "GitHub"
    ]
  },

  pos: {
    title: "POS",
    description: "대시보드 프로젝트 상세 내용입니다.",
    role: "UI/UX Design · Publishing",
    duties: [
      "POS UI/UX 디자인",
      "주요 화면 퍼블리싱",
      "UI 컴포넌트 구현"
    ],
    environment: "PC Web",
    stack: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React"
    ],
    tools: [
      "Figma",
      "VS Code",
      "Git",
      "GitHub"
    ]
  }

};

// 프로젝트 내용 넣기
const projects = document.querySelectorAll(".project");

const modal = document.querySelector("#projectModal");
const modalClose = document.querySelector("#modalClose");
const demoBox = document.querySelector(".project-demo-box");

const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalRole = document.querySelector("#modalRole");
const modalDuties = document.querySelector("#modalDuties");
const modalEnvironment = document.querySelector("#modalEnvironment");
const modalStack = document.querySelector("#modalStack");
const modalTools = document.querySelector("#modalTools");
const projectDemos = document.querySelectorAll(".project-demo");


/* 프로젝트 클릭 */
projects.forEach((project) => {

  project.addEventListener("click", () => {

    const projectName = project.dataset.project;
    const data = projectData[projectName];

    // 프로젝트 이름
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;

    // 담당 업무
    modalRole.textContent = data.role;

    // 담당 업무 상세 목록
    modalDuties.innerHTML = "";

    data.duties.forEach((duty) => {

      const li = document.createElement("li");

      li.textContent = duty;

      modalDuties.appendChild(li);

    });

    // 운영 환경
    modalEnvironment.textContent = data.environment;

    // 기술 스택
    modalStack.textContent = data.stack.join(" · ");

    // 사용 도구
    modalTools.textContent = data.tools.join(" · ");

    // 기존 배경 클래스 제거
    demoBox.classList.remove(
      "bg-dashboard",
      "bg-kiosk",
      "bg-pos"
    );

    // 클릭한 프로젝트에 맞는 배경 추가
    demoBox.classList.add(`bg-${projectName}`);

    // --------------------
    // iframe
    // --------------------

    // 모든 projectDemo 숨기기
    projectDemos.forEach((projectDemo) => {
      projectDemo.classList.remove("active");
    });


    // 클릭한 프로젝트의 projectDemo 찾기
    const targetDemo = document.querySelector(
      `.${projectName}-demo`
    );


    // 해당 iframe만 보여주기
    targetDemo.classList.add("active");

    // --------------------
    // 모달 열기
    // --------------------
    modal.classList.add("active");

  });

});


/* X 버튼 */
modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
});

// 기기 종류별 원본 렌더링 해상도 설정 (데모 실행용 원본 px)
const DEVICE_CONFIG = {
  'dashboard-demo': { width: 1920, height: 1080 }, // 대시보드 (가로 FHD)
  'kiosk-demo': { width: 1080, height: 1920 }, // 키오스크 (세로 FHD)
  'pos-demo': { width: 1280, height: 1024 }  /* POS (4:3 또는 1024x768 등) */
};

function resizeAllIframes() {
  const demos = document.querySelectorAll('.project-demo');

  demos.forEach(demo => {
    // 현재 demo 박스의 클래스명 찾기
    let config = null;
    for (const className in DEVICE_CONFIG) {
      if (demo.classList.contains(className)) {
        config = DEVICE_CONFIG[className];
        break;
      }
    }

    if (!config) return;

    const iframe = demo.querySelector('.demo-iframe');
    if (!iframe) return;

    // 1. CSS %에 맞춰 현재 브라우저에 그려진 iframe 부모박스의 실제 px 너비 구하기
    const computedStyle = window.getComputedStyle(iframe);
    const containerWidth = parseFloat(computedStyle.width);

    // 2. 가로폭 비율 기준 축소 비율(Scale) 계산
    const scale = containerWidth / config.width;

    // 3. iframe의 가로/세로 내부 해상도를 원래 세팅 크기로 고정
    iframe.style.width = `${config.width}px`;
    iframe.style.height = `${config.height}px`;

    // 4. 세로형이든 가로형이든 하나의 통 이미지처럼 비율대로 scale 축소
    iframe.style.transform = `scale(${scale})`;
  });
}

// 이벤트 바인딩
window.addEventListener('DOMContentLoaded', resizeAllIframes);
window.addEventListener('resize', resizeAllIframes);

// 기기별 실제 렌더링될 원본 Target 해상도
const DEVICE_RESOLUTIONS = {
  'dashboard-screen': { width: 1920, height: 1080 },
  'kiosk-screen': { width: 1080, height: 1920 }, // 세로형 키오스크
  'pos-screen': { width: 1024, height: 768 }
};

function resizeDemoScreens() {
  const wrappers = document.querySelectorAll('.iframe-wrapper');

  wrappers.forEach(wrapper => {
    // 1. 현재 wrapper 클래스명 확인
    let res = null;
    for (const key in DEVICE_RESOLUTIONS) {
      if (wrapper.classList.contains(key)) {
        res = DEVICE_RESOLUTIONS[key];
        break;
      }
    }

    if (!res) return;

    const iframe = wrapper.querySelector('.demo-iframe');
    if (!iframe) return;

    // 2. 현재 화면에 렌더링된 wrapper(초록색 영역)의 실제 px 너비 구하기
    const currentWidth = wrapper.clientWidth;

    // 3. 축소 비율 계산 (현재 초록색 너비 / 원래 원본 너비)
    const scale = currentWidth / res.width;

    // 4. iframe은 원래 고해상도 px 크기로 딱 고정 (반응형 작동 방지!)
    iframe.style.width = `${res.width}px`;
    iframe.style.height = `${res.height}px`;

    // 5. 전체를 이미지처럼 줌아웃(Scale) 실행
    iframe.style.transform = `scale(${scale})`;
  });
}

// 이벤트 연결
window.addEventListener('DOMContentLoaded', resizeDemoScreens);
window.addEventListener('resize', resizeDemoScreens);

// tab 전환 등으로 active 클래스가 바뀔 때 위치 재계산이 필요하면 호출해주세요
// resizeDemoScreens();

// ResizeObserver를 통해 크기 변화(모달 켜짐 등)를 자동 감지
const observer = new ResizeObserver(() => {
  resizeDemoScreens();
});

// DOM 로드 완료 후 관찰 시작
window.addEventListener('DOMContentLoaded', () => {
  resizeDemoScreens();

  // 모든 project-demo 요소의 크기/노출 변화를 감시
  const demos = document.querySelectorAll('.project-demo');
  demos.forEach(demo => observer.observe(demo));
});

// 이메일 복사
function copyEmail() {
  const email = 'aseh0210@email.com';

  navigator.clipboard.writeText(email)
    .then(() => {
      alert('이메일이 복사되었습니다!');
    })
    .catch((error) => {
      console.error('이메일 복사 실패:', error);
    });
}