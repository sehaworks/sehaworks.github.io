// =============================================
// 프로젝트 데이터
// =============================================
const projectData = {
  dashboard: {
    title: "스마트 사옥 통합 관리 시스템",
    description: "출입·방문·주차·근태·식수 등 사옥 운영 전반의 기능을 하나의 플랫폼에서 통합 관리하는 웹 기반 스마트 사옥 관리 시스템입니다.<br />전체 시스템의 웹 퍼블리싱을 담당했으며, 메인 대시보드를 중심으로 주요 화면의 UI를 구현하고 공통 레이아웃 및 UI 요소를 구성하여<br />이후 화면 개발에 활용할 수 있는 퍼블리싱 기반을 구축했습니다.",
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
    description: "키오스크는 사용자의 신체적 특성이나 이용 환경에 따라 화면을 인지하고 조작하는 데 어려움이 발생할 수 있습니다.<br />이에 기존 키오스크 화면을 기반으로 고대비 모드와 저화면 환경에 대응하는 UI를 구현하여 다양한 사용 환경에서도 주요 정보를 명확하게 인지하고 조작할 수 있도록 구성했습니다.",
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
    title: "통합 입장관리 POS",
    description: "입장권 판매 및 이용객 관리를 위한 POS 화면을 설계하고 퍼블리싱했습니다.<br />현장 운영자의 업무 흐름을 고려해 주요 기능을 직관적으로 확인하고 빠르게 처리할 수 있도록 구성했습니다.",
    role: "UI/UX Design ······ 100%<br />Web Publishing ······ 100%",
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
    // 배열인 경우 대응
    if (Array.isArray(data.description)) {
      modalDescription.innerHTML = data.description.join("<br>");
    } else {
      modalDescription.innerHTML = data.description;
    }

    // 프로젝트 안내문
    if (data.notice) {
      if (Array.isArray(data.notice)) {
        modalNotice.innerHTML = data.notice.join("<br>");
      } else {
        modalNotice.textContent = data.notice;
      }
      modalNotice.style.display = "block";
    } else {
      modalNotice.style.display = "none";
    }

    // 담당 업무 (배열 또는 문자열 대응)
    if (Array.isArray(data.role)) {
      modalRole.innerHTML = data.role.join("<br>");
    } else {
      modalRole.innerHTML = data.role;
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


document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector('.body');
  if (!body) return;

  const originalHTML = body.innerHTML;
  let isMobileInitialized = false;
  let cleanupFunc = null;

  // ✨ 화면 중앙에 토스트 메시지 띄우는 함수
  function showMobileToast(message = "모바일 버전 준비 중입니다.") {
    // 이미 떠 있는 토스트가 있다면 제거
    const existingToast = document.querySelector('.mobile-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'mobile-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 부드럽게 등장
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // 2.5초 후 퇴장 애니메이션 실행 뒤 삭제
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 2500);
  }

  function initGabrielSlider() {
    const isMobile = window.innerWidth < 1024;

    if (!isMobile) {
      if (isMobileInitialized) {
        if (cleanupFunc) cleanupFunc();
        body.innerHTML = originalHTML;
        isMobileInitialized = false;
      }
      return;
    }

    if (isMobileInitialized) return;
    isMobileInitialized = true;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    const originals = Array.from(tempDiv.querySelectorAll('.project'));
    if (originals.length === 0) return;

    body.innerHTML = '<div class="slider-stage"></div>';
    const stage = body.querySelector('.slider-stage');

    const totalCount = 6;
    for (let i = 0; i < totalCount; i++) {
      const clone = originals[i % originals.length].cloneNode(true);
      stage.appendChild(clone);
    }

    const items = Array.from(stage.querySelectorAll('.project'));

    let currentY = 0;
    let targetY = 0;
    let velocity = 0;
    let startY = 0;
    let lastY = 0;
    let isDragging = false;
    let isClick = true;

    const DRAG_SENSITIVITY = 0.8;
    const ITEM_SPACING = 210;
    const LOOP_HEIGHT = originals.length * ITEM_SPACING;

    function animate() {
      if (!isDragging) {
        targetY += velocity;
        velocity *= 0.92;

        if (Math.abs(velocity) < 0.5) {
          const remainder = targetY % ITEM_SPACING;
          if (Math.abs(remainder) > 0.1) {
            targetY -= remainder * 0.1;
          }
        }
      }

      currentY += (targetY - currentY) * 0.1;

      items.forEach((item, index) => {
        let offset = (index * ITEM_SPACING + currentY) % LOOP_HEIGHT;
        if (offset < -LOOP_HEIGHT / 2) offset += LOOP_HEIGHT;
        if (offset > LOOP_HEIGHT / 2) offset -= LOOP_HEIGHT;

        const progress = offset / ITEM_SPACING;

        const rotateX = progress * -32;
        const translateY = offset;
        const translateZ = -Math.pow(Math.abs(progress), 1.5) * 120;
        const scale = Math.max(0.6, 1 - Math.abs(progress) * 0.22);
        const opacity = Math.max(0.15, 1 - Math.abs(progress) * 0.45);
        const blur = Math.min(8, Math.abs(progress) * 5);

        item.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.style.zIndex = Math.round(100 - Math.abs(progress) * 10);

        if (Math.abs(progress) < 0.35) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      requestAnimationFrame(animate);
    }

    const animId = requestAnimationFrame(animate);

    function onStart(e) {
      isDragging = true;
      isClick = true;
      velocity = 0;
      const pageY = e.touches ? e.touches[0].pageY : e.pageY;
      startY = pageY;
      lastY = pageY;
    }

    function onMove(e) {
      if (!isDragging) return;
      const pageY = e.touches ? e.touches[0].pageY : e.pageY;
      const deltaY = (pageY - lastY) * DRAG_SENSITIVITY;

      if (Math.abs(pageY - startY) > 5) {
        isClick = false;
      }

      targetY += deltaY;
      velocity = deltaY * 1.5;
      lastY = pageY;
    }

    function onEnd() {
      isDragging = false;
    }

    // ✨ 1023px 이하 터치/클릭 시 토스트 메시지 띄우기
    function onClick(e) {
      if (!isClick) return;

      const projectCard = e.target.closest('.project');
      if (projectCard) {
        showMobileToast("모바일 버전 준비 중입니다.");
      }
    }

    body.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    body.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    body.addEventListener('click', onClick);

    cleanupFunc = () => {
      cancelAnimationFrame(animId);
      body.removeEventListener('mousedown', onStart);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      body.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      body.removeEventListener('touchend', onEnd);
      body.removeEventListener('click', onClick);
    };
  }

  initGabrielSlider();
  window.addEventListener('resize', initGabrielSlider);
});