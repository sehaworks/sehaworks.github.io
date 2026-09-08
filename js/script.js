// =============================================
// 프로젝트 데이터
// =============================================
const projectData = {
  dashboard: {
    title: "스마트 사옥 통합 관리 시스템",
    description: "출입·방문·주차·근태·식수 등 사옥 운영 전반의 기능을 하나의 플랫폼에서 통합 관리하는 웹 기반 스마트 사옥 관리 시스템입니다. 전체 시스템의 웹 퍼블리싱을 담당했으며, 메인 대시보드를 중심으로 주요 화면의 UI를 구현하고 공통 레이아웃 및 UI 요소를 구성하여 이후 화면 개발에 활용할 수 있는 퍼블리싱 기반을 구축했습니다.",
    notice: "※ 본 프로젝트는 보안상의 이유로 실제 서비스 정보 및 데이터를 공개하지 않습니다. 이미지 및 Demo는 실제 프로젝트의 UI 구조와 퍼블리싱 작업을 기반으로 일부 내용을 재구성한 화면입니다.",
    role: "Web Publishing ······ 100%",
    duties: [
      "메인 대시보드 퍼블리싱",
      "주요 관리 화면 퍼블리싱",
      "UI 컴포넌트 구현",
      "인터랙션 구현"
    ],
    environment: "PC Web",
    stack: ["HTML5", "CSS3", "JavaScript", "React", "Vite"],
    tools: ["Figma", "VS Code", "Git", "GitHub"]
  },

  kiosk: {
    title: "배리어프리 키오스크",
    description: "키오스크는 사용자의 신체적 특성이나 이용 환경에 따라 화면을 인지하고 조작하는 데 어려움이 발생할 수 있습니다. 이에 기존 키오스크 화면을 기반으로 고대비 모드와 저화면 환경에 대응하는 UI를 구현하여 다양한 사용 환경에서도 주요 정보를 명확하게 인지하고 조작할 수 있도록 구성했습니다.",
    role: "Web Publishing ······ 100%",
    duties: [
      "키오스크 UI 퍼블리싱",
      "접근성 대응 UI 구현"
    ],
    environment: "Kiosk",
    stack: ["HTML5", "CSS3", "JavaScript", "React", "Vite"],
    tools: ["Figma", "VS Code", "Git", "GitHub"]
  },

  pos: {
    title: "POS",
    description: "입장권 판매 및 이용객 관리를 위한 POS 화면을 설계하고 퍼블리싱했습니다. 현장 운영자의 업무 흐름을 고려해 주요 기능을 직관적으로 확인하고 빠르게 처리할 수 있도록 구성했습니다.",
    role: ["UI/UX Design ······ 100%", "Web Publishing ······ 100%"],
    duties: [],
    environment: "Pos",
    stack: ["HTML5", "CSS3", "JavaScript", "React", "Vite"],
    tools: ["Figma", "VS Code", "Git", "GitHub"]
  }
};

// DOM 요소
const projects = document.querySelectorAll(".project");
const modal = document.querySelector("#projectModal");
const modalClose = document.querySelector("#modalClose");
const demoBox = document.querySelector(".project-demo-box");

const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalNotice = document.querySelector("#modalNotice");
const modalRole = document.querySelector("#modalRole");
const modalDuties = document.querySelector("#modalDuties");
const modalEnvironment = document.querySelector("#modalEnvironment");
const modalStack = document.querySelector("#modalStack");
const modalTools = document.querySelector("#modalTools");
const projectDemos = document.querySelectorAll(".project-demo");

// =============================================
// 모달 제어 & 히스토리
// =============================================

// 실제 모달 UI를 닫는 함수
function hideModalUI() {
  if (modal) modal.classList.remove("active");
}

/* 프로젝트 클릭 */
projects.forEach((project) => {
  project.addEventListener("click", () => {
    const projectName = project.dataset.project;
    const data = projectData[projectName];
    if (!data) return;

    // 프로젝트 이름 & 설명
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;

    // 프로젝트 안내문
    if (data.notice) {
      modalNotice.textContent = data.notice;
      modalNotice.style.display = "block";
    } else {
      modalNotice.style.display = "none";
    }

    // 담당 업무 (배열 또는 문자열 대응)
    if (Array.isArray(data.role)) {
      modalRole.textContent = data.role.join(" / ");
    } else {
      modalRole.textContent = data.role;
    }

    // 담당 업무 상세 목록
    modalDuties.innerHTML = "";
    data.duties.forEach((duty) => {
      const li = document.createElement("li");
      li.textContent = duty;
      modalDuties.appendChild(li);
    });

    // 운영 환경 / 기술 스택 / 도구
    modalEnvironment.textContent = data.environment;
    modalStack.textContent = data.stack.join(" · ");
    modalTools.textContent = data.tools.join(" · ");

    // 기존 배경 클래스 제거 및 클릭한 프로젝트 배경 추가
    demoBox.classList.remove("bg-dashboard", "bg-kiosk", "bg-pos");
    demoBox.classList.add(`bg-${projectName}`);

    // iframe 보여주기
    projectDemos.forEach((demo) => demo.classList.remove("active"));
    const targetDemo = document.querySelector(`.${projectName}-demo`);
    if (targetDemo) {
      targetDemo.classList.add("active");
    }

    // 모달 활성화
    modal.classList.add("active");

    // 가상 히스토리(#modal) 추가 (중복 방지)
    if (location.hash !== "#modal") {
      history.pushState({ modalOpen: true }, "", "#modal");
    }
  });
});

/* X 버튼 클릭 */
if (modalClose) {
  modalClose.addEventListener("click", () => {
    if (location.hash === "#modal") {
      history.back(); // 뒤로가기를 호출하여 popstate에서 UI가 닫히도록 유도
    } else {
      hideModalUI();
    }
  });
}

/* 브라우저 / 마우스 뒤로가기 감지 */
window.addEventListener("popstate", () => {
  if (location.hash !== "#modal") {
    hideModalUI();
  }
});


// =============================================
// Demo iframe 스케일링 (해상도 고정 축소)
// =============================================
const DEVICE_RESOLUTIONS = {
  'dashboard-screen': { width: 1920, height: 1080 },
  'kiosk-screen': { width: 1080, height: 1920 }, // 세로형 키오스크
  'pos-screen': { width: 1024, height: 768 }
};

function resizeDemoScreens() {
  const wrappers = document.querySelectorAll('.iframe-wrapper');

  wrappers.forEach((wrapper) => {
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

    const currentWidth = wrapper.clientWidth;
    if (currentWidth === 0) return; // 감춰진 상태일 때 실행 방지

    const scale = currentWidth / res.width;

    iframe.style.width = `${res.width}px`;
    iframe.style.height = `${res.height}px`;
    iframe.style.transform = `scale(${scale})`;
  });
}

// 스케일 계산 이벤트 연결
window.addEventListener('DOMContentLoaded', resizeDemoScreens);
window.addEventListener('resize', resizeDemoScreens);

// ResizeObserver를 통해 모달이 열릴 때 크기 변화 자동 감지
const observer = new ResizeObserver(() => {
  resizeDemoScreens();
});

window.addEventListener('DOMContentLoaded', () => {
  resizeDemoScreens();
  const demos = document.querySelectorAll('.project-demo');
  demos.forEach((demo) => observer.observe(demo));
});


// =============================================
// 이메일 복사
// =============================================
let toastTimer = null;
let resetTextTimer = null;

function copyEmail() {
  const email = "aseh0210@gmail.com";
  const tooltip = document.getElementById("toastTooltip");

  navigator.clipboard.writeText(email).then(() => {
    if (toastTimer) clearTimeout(toastTimer);
    if (resetTextTimer) clearTimeout(resetTextTimer);

    tooltip.innerText = "복사 완료!";
    tooltip.classList.add("copied");

    toastTimer = setTimeout(() => {
      tooltip.classList.remove("copied");
      resetTextTimer = setTimeout(() => {
        tooltip.innerText = "메일 주소 복사하기";
      }, 300);
    }, 1500);
  }).catch((err) => {
    console.error("복사 실패:", err);
  });
}