// =============================================
// INTRO : 스크롤 연동 영상(프레임) 재생 → 메인 화면(프로젝트) 등장
// =============================================
(() => {
  const TOTAL_FRAMES = 121;
  const FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) => `./src/frames/${String(i + 1).padStart(3, '0')}.webp`);

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const intro = document.getElementById('intro'), hero = document.getElementById('hero'),
    cta = document.getElementById('cta'), foot = document.getElementById('foot'),
    white = document.getElementById('white'), home = document.getElementById('home'),
    loader = document.getElementById('loader'), bar = document.getElementById('bar'),
    vid = document.getElementById('introVideo');
  if (!cv || !intro || !home) return;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const smooth = t => t * t * (3 - 2 * t);

  /* 타임라인 (인트로 스크롤 진행도 p: 0~1) */
  const T_VIDEO_END = 0.72;        // 영상 마지막 프레임
  const T_WHITE = [0.52, 0.78];    // 영상이 밝은 배경으로 페이드아웃
  const T_HOME = [0.84, 0.97];     // 메인 화면(프로젝트) 페이드인
  const T_ACTIVE = 0.985;          // 이후부터 클릭/호버 가능
  const CAM_END = 0.30;            // 영상 앞 30%: 첫 화면 구도 → 화면 가득 확대
  const HEAD_TOP = 0;           // 1440 캔버스 기준 첫 프레임 머리 위치(px)
  const VID_FADE = 0.02;           // 스크롤 0 ~ 2% 구간: 반복 영상 → 스크롤 프레임으로 부드럽게 교체
  const VID_CROP = 0.80;           // 영상 오른쪽 아래 반짝이 워터마크 제외(가로 80%만 사용, 캐릭터는 74% 안쪽)
  const CHAR_H = 640;              // 첫 프레임에서 머리 위 ~ 책상 다리 끝까지의 높이(px)
  const BG = '#1d1d1d';

  const N = FRAMES.length;
  let vidOK = false, vk = 1, imgs = [], FW = 1440, FH = 810, vw = 0, vh = 0, dpr = 1, cur = 0, target = 0, ready = false, p = 0;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    vw = innerWidth; vh = innerHeight;
    cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readScroll(); draw();
  }

  function readScroll() {
    const total = intro.offsetHeight - vh;
    p = clamp(scrollY / total);
    target = seg(p, 0, T_VIDEO_END) * (N - 1);
    vk = seg(p, 0, VID_FADE);                       // 0이면 반복 영상만, 1이면 스크롤 프레임만
    if (vidOK) {
      if (vk >= 1 && !vid.paused) vid.pause();
      else if (vk < 1 && vid.paused) vid.play().catch(() => { });
    }

    // 첫 화면 요소(타이틀/버튼/푸터) 페이드아웃
    const h = 1 - seg(p, 0, .035);
    hero.style.opacity = h; cta.style.opacity = h; foot.style.opacity = h;
    const on = h > .5;
    cta.style.pointerEvents = on ? 'auto' : 'none';
    foot.style.pointerEvents = on ? 'auto' : 'none';

    white.style.opacity = smooth(seg(p, T_WHITE[0], T_WHITE[1]));

    // 메인 화면(프로젝트) 등장
    const u = smooth(seg(p, T_HOME[0], T_HOME[1]));
    home.style.opacity = u;
    home.style.visibility = u < .005 ? 'hidden' : 'visible';
    home.style.transform = u >= 1 ? 'none' : `translateY(${(1 - u) * 22}px) scale(${1 + (1 - u) * .018})`;
    // 프로젝트 카드 등장 애니메이션 트리거 (다시 위로 올라가면 리셋)
    if (u > .05) home.classList.add('show');
    else if (u < .005) home.classList.remove('show');

    const act = p >= T_ACTIVE;
    if (act !== home._act) { home._act = act; home.style.pointerEvents = act ? 'auto' : 'none'; }
  }

  function cam(f) {
    const c = ease(seg(f, 0, CAM_END));
    // header(로고) 바로 아래에서 캐릭터가 시작하도록 첫 구도를 계산 (header 크기는 style.css 규칙 그대로)
    const top0 = hero.offsetHeight + 24, bottom0 = 120;           // 위: header + 여백 / 아래: 버튼·푸터 영역
    const sFit = (vh - top0 - bottom0) / CHAR_H;
    const s0 = Math.max(.3, Math.min(.96 * vh / 1080, .9 * vw / 700, sFit)), s1 = Math.max(vw / FW, vh / FH);
    const oy0 = top0 - s0 * HEAD_TOP, oy1 = (vh - FH * s1) / 2;
    const s = s0 + (s1 - s0) * c, oy = oy0 + (oy1 - oy0) * c;
    return { s, x: (vw - FW * s) / 2, y: oy };
  }

  function draw() {
    if (!ready) return;
    const g = cam(cur / (N - 1));
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, vw, vh);
    ctx.globalCompositeOperation = 'lighten';   // 영상의 검정 배경 → 페이지 배경색
    // 첫 화면: 무한 반복 영상
    const showVid = vidOK && vk < 1 && vid.readyState >= 2;
    if (showVid) {
      const vw0 = vid.videoWidth, vh0 = vid.videoHeight;
      ctx.drawImage(vid, 0, 0, vw0 * VID_CROP, vh0, g.x, g.y, FW * VID_CROP * g.s, FH * g.s);
    }
    // 스크롤 프레임 (영상이 보이는 동안에는 vk 만큼만 섞어서 자연스럽게 교체)
    const a = showVid ? vk : 1;
    const i0 = Math.floor(cur), i1 = Math.min(N - 1, i0 + 1), t = cur - i0;
    if (a > 0) {
      ctx.globalAlpha = a; ctx.drawImage(imgs[i0], g.x, g.y, FW * g.s, FH * g.s);
      if (t > .001) { ctx.globalAlpha = a * t; ctx.drawImage(imgs[i1], g.x, g.y, FW * g.s, FH * g.s); }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function loop() {
    const d = target - cur;
    if (Math.abs(d) > .01) { cur += d * .14; draw(); }
    else if (cur !== target) { cur = target; draw(); }
    else if (vidOK && vk < 1) draw();               // 반복 영상은 매 프레임 다시 그림
    requestAnimationFrame(loop);
  }

  /* 반복 영상 준비: 자동재생이 막히면 첫 사용자 입력에서 재생 */
  function setupVideo() {
    return new Promise(resolve => {
      if (!vid) return resolve();
      const done = () => { vidOK = vid.readyState >= 2; resolve(); };
      vid.muted = true; vid.loop = true;
      vid.addEventListener('loadeddata', done, { once: true });
      setTimeout(done, 4000);                       // 영상이 늦어도 로딩 화면이 멈추지 않게
      const start = () => { if (vid.paused && vk < 1) vid.play().catch(() => { }); };
      vid.play().catch(() => { });
      ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(ev => addEventListener(ev, start, { once: true, passive: true }));
      vid.addEventListener('error', () => { vidOK = false; resolve(); });
    });
  }

  /* "Scroll to the Works" → 부드럽게 끝까지 */
  let auto = 0;
  function autoScroll() {
    cancelAnimationFrame(auto);
    const from = scrollY, to = intro.offsetHeight - innerHeight, dur = 5200, t0 = performance.now();
    const stop = () => { cancelAnimationFrame(auto); removeEventListener('wheel', stop); removeEventListener('touchstart', stop); };
    addEventListener('wheel', stop, { passive: true }); addEventListener('touchstart', stop, { passive: true });
    const step = now => {
      const t = clamp((now - t0) / dur);
      scrollTo(0, from + (to - from) * ease(t));
      if (t < 1) auto = requestAnimationFrame(step); else stop();
    };
    auto = requestAnimationFrame(step);
  }
  cta.addEventListener('click', autoScroll);

  /* 프레임 로드 (file:// 로 열어도 동작하도록 <img> 사용) */
  async function load() {
    let done = 0;
    imgs = await Promise.all(FRAMES.map(src => new Promise(resolve => {
      const im = new Image();
      im.onload = im.onerror = async () => {
        try { await im.decode(); } catch (e) { }
        bar.style.width = (++done / N * 100) + '%';
        resolve(im);
      };
      im.src = src;
    })));
    await setupVideo();
    vidOK = !!vid && vid.readyState >= 2;
    FW = imgs[0].naturalWidth || FW; FH = imgs[0].naturalHeight || FH;
    ready = true; cur = target; resize();
    loader.classList.add('done'); loop();
  }

  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('resize', resize);
  resize(); load();
})();
