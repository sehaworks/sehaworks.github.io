// =============================================
// DESKTOP : 프로젝트 아이콘 클릭 → 드래그로 옮길 수 있는 상세 설명 창
//  - 창 안의 내용은 index.html의 <template id="win-프로젝트명"> 안에 붙여넣기
//  - 창 제목줄(위쪽 바)을 잡고 끌면 자유롭게 이동, 클릭하면 맨 앞으로
//  - X 버튼 / Esc : 창 닫기,  Exit : 모든 창 닫고 intro로 복귀
//  - 화면 너비 640px 이하(휴대폰)에서는 창이 전체화면으로 열림
// =============================================
(() => {
  const home = document.getElementById('home');
  const layer = document.getElementById('winLayer');
  const exitBtns = document.querySelectorAll('#exitBtn, [data-app="exit"]');   // 헤더 Exit + 앱 아이콘 종료
  if (!home || !layer) return;

  const WIN_TITLE = 'Seha Works';           // 모든 창 제목줄에 표시되는 이름
  const KEEP = 120;                         // 창을 화면 밖으로 밀어도 제목줄이 최소한 이만큼은 화면에 남음
  const MIN_W = 320, MIN_H = 200;            // 창 최소 크기
  const FULL_MAX = 640;                     // 이 너비 이하(휴대폰)에서는 창이 전체화면으로 열림 (이동/크기조절 없음)
  const isFull = () => innerWidth <= FULL_MAX;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const wins = new Map();                   // key -> element
  let zTop = 100;

  /* ───── 템플릿이 비어 있을 때 보여줄 기본 내용: 기존 project-modal 디자인 그대로 (script.js의 projectData 사용) ───── */
  const DEVICE_SVG = { dashboard: 'monitor', kiosk: 'kiosk', pos: 'pos' };
  function defaultContent(key) {
    const d = (typeof projectData !== 'undefined' && projectData[key]) || null;
    if (!d) return '<div class="win-modal"><p>여기에 상세 내용을 붙여넣으세요.</p></div>';
    const join = v => Array.isArray(v) ? v.join('<br>') : (v || '');
    const duties = (d.duties || []).map(x => `<li>${x}</li>`).join('');
    return `
      <div class="win-modal">
        <div class="modal-content">
          <div class="project-name">
            <h2>${d.title}</h2>
            <p>${join(d.description)}</p>
            ${d.notice ? `<div class="project-notice">${join(d.notice)}</div>` : ''}
          </div>
          <div class="project-info">
            <div class="info-item"><span class="info-title">담당 업무</span><strong>${join(d.role)}</strong>${duties ? `<ul>${duties}</ul>` : ''}</div>
            <div class="info-item"><span class="info-title">운영 환경</span><strong>${d.environment}</strong></div>
            <div class="info-item"><span class="info-title">기술 스택</span><strong>${d.stack.join(' · ')}</strong></div>
            <div class="info-item"><span class="info-title">사용 도구</span><strong>${d.tools.join(' · ')}</strong></div>
          </div>
        </div>
        <div class="project-demo-box bg-${key}">
          <div class="project-demo ${key}-demo active">
            <div class="iframe-wrapper ${key}-screen">
              <iframe class="demo-iframe" src="https://sehaworks.github.io/${key}/" title="${key} Demo"></iframe>
            </div>
            <img class="device-frame" src="./src/${DEVICE_SVG[key] || key}.svg" alt="${key}">
          </div>
        </div>
      </div>`;
  }

  /* 창 안의 iframe 데모 크기를 맞춤 (script.js의 resizeDemoScreens 사용, 창 크기가 바뀌면 다시 계산) */
  function fitDemos(el) {
    if (typeof resizeDemoScreens !== 'function') return;
    requestAnimationFrame(resizeDemoScreens);
    const demo = el.querySelector('.project-demo');
    if (demo && 'ResizeObserver' in window) new ResizeObserver(() => resizeDemoScreens()).observe(demo);
  }

  /* 전체화면 창이 있을 때는 창 레이어를 헤더(Exit 등)보다 위로 올려서 화면을 완전히 덮음 */
  function syncLayer() { layer.classList.toggle('has-full', [...wins.values()].some(w => w.classList.contains('win-full'))); }

  /* ───── 창 앞으로 / 닫기 ───── */
  function focusWin(el) {
    wins.forEach(w => w.classList.remove('active'));
    el.classList.add('active');
    if (zTop > 900) {                       // z-index가 너무 커지면 현재 순서대로 다시 번호 매김
      [...wins.values()].sort((a, b) => a.style.zIndex - b.style.zIndex).forEach((w, i) => w.style.zIndex = 100 + i);
      zTop = 100 + wins.size;
    }
    el.style.zIndex = ++zTop;
  }
  function closeWin(key) {
    const el = wins.get(key);
    if (!el) return;
    wins.delete(key);
    syncLayer();
    el.classList.add('closing');
    setTimeout(() => el.remove(), 200);
    const top = [...wins.values()].sort((a, b) => a.style.zIndex - b.style.zIndex).pop();
    if (top) focusWin(top);
  }
  function closeAll() { [...wins.keys()].forEach(closeWin); }

  /* ───── 드래그 (마우스 · 터치 · 펜 공통): 제목줄을 잡고 끌면 창 이동 ───── */
  function makeDraggable(el, bar) {
    let dx = 0, dy = 0, id = null;
    const onMove = e => {
      if (e.pointerId !== id) return;
      const w = el.offsetWidth;
      const x = clamp(e.clientX - dx, KEEP - w, innerWidth - KEEP);                      // 좌우로 화면 밖까지 이동 가능 (KEEP px는 항상 보임)
      const y = clamp(e.clientY - dy, 0, Math.max(0, innerHeight - 44));                // 제목줄은 항상 화면 안
      el.style.left = x + 'px'; el.style.top = y + 'px';
    };
    const onEnd = e => {
      if (e.pointerId !== id) return;
      id = null;
      el.classList.remove('is-dragging'); layer.classList.remove('dragging');
      removeEventListener('pointermove', onMove); removeEventListener('pointerup', onEnd); removeEventListener('pointercancel', onEnd);
    };
    bar.addEventListener('pointerdown', e => {
      if (id !== null || el.classList.contains('win-full')) return;       // 전체화면에서는 이동 불가
      if (e.target.closest('.win-close')) return;                       // 닫기 버튼은 드래그 제외
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      focusWin(el);
      id = e.pointerId;
      dx = e.clientX - el.offsetLeft; dy = e.clientY - el.offsetTop;
      el.classList.add('is-dragging'); layer.classList.add('dragging');
      addEventListener('pointermove', onMove); addEventListener('pointerup', onEnd); addEventListener('pointercancel', onEnd);
      try { bar.setPointerCapture(id); } catch (_) { }
      e.preventDefault();                                               // 드래그 중 글자 선택/이미지 끌기 방지
    });
  }

  /* ───── 크기 조절: 가로만(왼/오른쪽 가장자리) · 세로만(위/아래 가장자리) · 모서리(가로+세로) ───── */
  function makeResizable(el) {
    // 오른쪽 위(ne) 모서리는 닫기(X) 버튼과 겹쳐서 제외
    ['n', 's', 'e', 'w', 'nw', 'se', 'sw'].forEach(dir => {
      const h = document.createElement('div');
      h.className = 'win-rs win-rs-' + dir;
      el.appendChild(h);
      let id = null, sx = 0, sy = 0, L = 0, T = 0, W = 0, H = 0;
      const onMove = e => {
        if (e.pointerId !== id) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        let l = L, t = T, w = W, hh = H;
        if (dir.includes('e')) w = clamp(W + dx, MIN_W, innerWidth);
        if (dir.includes('w')) { w = clamp(W - dx, MIN_W, innerWidth); l = L + (W - w); }
        if (dir.includes('s')) hh = clamp(H + dy, MIN_H, innerHeight);
        if (dir.includes('n')) {
          hh = clamp(H - dy, MIN_H, innerHeight);
          t = Math.max(0, T + (H - hh));                                 // 위쪽은 화면 밖으로 못 나가게
          hh = H + T - t;
        }
        el.style.left = l + 'px'; el.style.top = t + 'px';
        el.style.width = w + 'px'; el.style.height = hh + 'px';
      };
      const onEnd = e => {
        if (e.pointerId !== id) return;
        id = null; el.classList.remove('is-resizing'); layer.classList.remove('dragging');
        removeEventListener('pointermove', onMove); removeEventListener('pointerup', onEnd); removeEventListener('pointercancel', onEnd);
      };
      h.addEventListener('pointerdown', e => {
        if (id !== null || el.classList.contains('win-full') || (e.pointerType === 'mouse' && e.button !== 0)) return;
        focusWin(el);
        id = e.pointerId; sx = e.clientX; sy = e.clientY;
        L = el.offsetLeft; T = el.offsetTop; W = el.offsetWidth; H = el.offsetHeight;
        el.classList.add('is-resizing'); layer.classList.add('dragging');
        addEventListener('pointermove', onMove); addEventListener('pointerup', onEnd); addEventListener('pointercancel', onEnd);
        try { h.setPointerCapture(id); } catch (_) { }
        e.preventDefault(); e.stopPropagation();
      });
    });
  }

  /* ───── 창 열기 ───── */
  function openWin(key) {
    if (wins.has(key)) { focusWin(wins.get(key)); return; }          // 이미 열려 있으면 앞으로만
    const tpl = document.getElementById('win-' + key);
    const data = (typeof projectData !== 'undefined' && projectData[key]) || {};
    const title = (tpl && tpl.dataset.title) || data.title || key;
    const w = clamp(+(tpl && tpl.dataset.width) || 960, MIN_W, innerWidth - 24);
    const h = clamp(+(tpl && tpl.dataset.height) || 680, 240, innerHeight - 96);

    const el = document.createElement('div');
    el.className = 'win';
    el.dataset.project = key;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', title);
    el.style.width = w + 'px'; el.style.height = h + 'px';

    const n = wins.size;                                              // 여러 창은 계단식으로 살짝씩 어긋나게
    const x = clamp(Math.round((innerWidth - w) / 2 + n * 32), 0, Math.max(0, innerWidth - w));
    const y = clamp(Math.round(Math.max(64, (innerHeight - h) / 2) + n * 32), 0, Math.max(0, innerHeight - 120));
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.classList.toggle('win-full', isFull());                        // 640px 이하면 전체화면

    const bar = document.createElement('div');
    bar.className = 'win-bar';
    bar.innerHTML = `<span class="win-title"></span><button class="win-close" type="button" aria-label="창 닫기"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M.5.5l9 9M9.5.5l-9 9"/></svg></button>`;
    bar.querySelector('.win-title').textContent = WIN_TITLE;
    bar.querySelector('.win-close').addEventListener('click', () => closeWin(key));

    const body = document.createElement('div');
    body.className = 'win-body';
    if (tpl && tpl.content.children.length) body.appendChild(tpl.content.cloneNode(true));   // ← 붙여넣은 디자인
    else body.innerHTML = defaultContent(key);

    el.append(bar, body);
    el.addEventListener('pointerdown', () => focusWin(el), true);
    layer.appendChild(el);
    wins.set(key, el);
    syncLayer();
    focusWin(el);
    makeDraggable(el, bar);
    makeResizable(el);
    fitDemos(el);
  }

  /* ───── 프로젝트 아이콘 클릭 (폴더 아이콘 + 기존 카드, 기존 script.js의 전체화면 모달보다 먼저 가로챔) ───── */
  const ICON_SEL = '#home .desk-icon, #home .project';
  document.addEventListener('click', e => {
    const icon = e.target.closest && e.target.closest(ICON_SEL);
    document.querySelectorAll('#home .desk-icon.selected').forEach(i => { if (i !== icon) i.classList.remove('selected'); });
    if (!icon) return;
    e.stopPropagation(); e.preventDefault();
    icon.classList.add('selected');
    openWin(icon.dataset.project);
  }, true);

  /* ───── 닫기 / 종료 ───── */
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !wins.size) return;
    const top = [...wins.entries()].sort((a, b) => a[1].style.zIndex - b[1].style.zIndex).pop();
    if (top) closeWin(top[0]);
  });
  addEventListener('resize', () => {
    wins.forEach(el => {
      const full = isFull();
      if (full === el.classList.contains('win-full')) {
        if (!full) {                                                  // 일반 창: 화면이 작아져도 창이 화면 안에 남도록 보정
          el.style.width = Math.min(el.offsetWidth, innerWidth) + 'px';
          el.style.height = Math.min(el.offsetHeight, innerHeight) + 'px';
          el.style.left = clamp(el.offsetLeft, KEEP - el.offsetWidth, innerWidth - KEEP) + 'px';
          el.style.top = clamp(el.offsetTop, 0, Math.max(0, innerHeight - 44)) + 'px';
        }
        return;
      }
      el.classList.toggle('win-full', full);
      if (!full) {                                                    // 전체화면 → 일반 창으로 돌아올 때 가운데에 다시 배치
        const w = clamp(960, MIN_W, innerWidth - 24), h = clamp(680, 240, innerHeight - 96);
        el.style.width = w + 'px'; el.style.height = h + 'px';
        el.style.left = Math.round((innerWidth - w) / 2) + 'px'; el.style.top = Math.max(64, Math.round((innerHeight - h) / 2)) + 'px';
      }
    });
    syncLayer();
  });

  exitBtns.forEach(btn => btn.addEventListener('click', () => {
    closeAll();
    if (typeof window.exitToIntro === 'function') window.exitToIntro();
    else scrollTo({ top: 0, behavior: 'smooth' });
  }));
})();

// 시간
function updateDateTime() {
  const now = new Date();

  const month = now.getMonth() + 1;
  const date = now.getDate();

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const day = days[now.getDay()];

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const period = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 || 12;

  const time = `${period} ${hour12}:${minutes}`;

  document.getElementById('currentDate').textContent =
    `${month}월 ${date}일 (${day})`;
  document.getElementById('currentTime').textContent =
    `${time}`;
}

// 페이지 진입 시 즉시 표시
updateDateTime();

// 1초마다 업데이트
setInterval(updateDateTime, 1 * 1000);

// 메일 복사 (헤더의 .mail-copy 와 앱 아이콘 [data-app="mail"] 공용)
const EMAIL = "aseh0210@gmail.com";
document.querySelectorAll('.mail-copy, [data-app="mail"]').forEach(btn => {
  const tip = btn.querySelector('.header-toast-tooltip');   // 헤더용 툴팁 (있을 때만)
  const orig = btn.dataset.label;                           // 앱 아이콘 말풍선 원래 글자
  let timer;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      clearTimeout(timer);
      if (tip) tip.textContent = '복사완료!';
      if (orig) { btn.dataset.label = '복사 완료!'; btn.classList.add('copied'); }
      timer = setTimeout(() => {
        if (tip) tip.textContent = '메일 주소 복사하기';
        if (orig) { btn.dataset.label = orig; btn.classList.remove('copied'); }
      }, 1500);
    } catch (error) {
      console.error('메일 주소 복사 실패:', error);
    }
  });
});