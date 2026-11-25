(function () {
  'use strict';

  const state = {
    startedAt: Date.now(),
    stamped: false,
    eyesAwake: false,
    clue1: false,
    clue2: false,
    rulesSeen: false,
    rulesMutated: false,
    tabSwitches: 0,
    hintCount: 0,
    cursedPersisted: localStorage.getItem('cishan_cursed') === '1'
  };

  window.cishanCurseDepth = state.cursedPersisted ? 0.85 : 0;

  function printFolkConsoleClues() {
    console.log(
      '%c 祠山宗祠数字招魂幡 v1.94 %c 桑皮扎彩 · 朱砂借寿 ',
      'background:#7d1516;color:#f5efe2;font-weight:bold;padding:3px 6px;',
      'background:#171311;color:#df6d6d;padding:3px 6px;'
    );
    console.warn(
      '[省民俗研究所 · 顾言田野紧急笔记]\n' +
        '1) 千万别把纸童的两只眼睛都点上！如果你已经点开了，它现在正跟着你的鼠标走。\n' +
        '2) 快去刮开【光绪十九年仁寿古碑】的白灰拿到卷号 CS-1994，再去【子时花轿】窗缝拿到封山码 0715。\n' +
        '3) 进页脚【1994封存密档室】卷三解契时，记住中国民俗铁律：黄表纸烧成灰叫“送达阴司”！千万别点火烧，选井水浸契！！'
    );
  }

  function getEnvSnapshot() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ua = navigator.userAgent || '';
    let platform = '联网客机';
    if (/Windows/i.test(ua)) platform = 'Windows 案头终端';
    else if (/Mac/i.test(ua)) platform = 'macOS 案头终端';
    else if (/Android|iPhone|iPad/i.test(ua)) platform = '掌上移动终端';

    return {
      platform,
      screen: `${window.innerWidth}×${window.innerHeight}`,
      lunarHour: window.FOLK_DATA.getLunarHourName(now.getHours()),
      timeStr: `${hh}:${mm}`,
      dwell: Math.floor((Date.now() - state.startedAt) / 1000),
      eyesAwake: state.eyesAwake,
      stamped: state.stamped
    };
  }

  let whisperTimer = null;
  function showFolkWhisper(msg) {
    const el = document.getElementById('folk-whisper');
    el.textContent = msg;
    el.classList.add('visible');
    if (whisperTimer) clearTimeout(whisperTimer);
    whisperTimer = setTimeout(() => el.classList.remove('visible'), 5400);
  }

  // =========================================================================
  // 1. INCENSE BOOT GATE & MOURNING HALL PERSISTENCE
  // =========================================================================
  function setupIncenseGate() {
    const gate = document.getElementById('incense-gate');
    const card = document.getElementById('gate-scroll-card');
    const resetBtn = document.getElementById('gate-reset-curse');
    const env = getEnvSnapshot();

    document.getElementById('gate-lunar-info').innerHTML =
      `今日推算时辰：<strong>${env.lunarHour} (${env.timeStr})</strong> · 访客方位：宜入祠、忌回头<br/>` +
      `终端气场核验：${env.platform}（生人阳气充沛，堪作上品替身）`;

    if (state.cursedPersisted) {
      card.classList.add('cursed');
      document.getElementById('gate-seal').textContent = '祠山灵堂 · 阴司收讫';
      document.getElementById('gate-heading').textContent = '吉时已过，欢迎回到李氏宗祠第四十九号灵龛。';
      document.getElementById('gate-desc').textContent =
        '上一轮你亲手将黄表死契烧成了灰，阴司已正式收讫归档。即便刷新网页，纸童也已替你在阳间行走了。';
      resetBtn.style.display = 'block';
      applyMourningHallMutation();
    }

    document.getElementById('enter-shrine-btn').addEventListener('click', () => {
      window.folkAudio.init(false);
      window.folkAudio.playMuyu(0, 390, false);
      gate.classList.add('hidden');
    });

    document.getElementById('enter-quiet-btn').addEventListener('click', () => {
      window.folkAudio.init(true);
      gate.classList.add('hidden');
      document.getElementById('folk-sound-btn').textContent = '🔕 低惊吓原声';
    });

    resetBtn.addEventListener('click', resetCurse);
    document.getElementById('footer-clean-reset').addEventListener('click', resetCurse);
    document.getElementById('epilogue-reset-btn').addEventListener('click', resetCurse);
  }

  function applyMourningHallMutation() {
    document.body.classList.add('mourning-state', 'eyes-opened');
    document.getElementById('festive-glyph').textContent = '奠';
    document.getElementById('brand-name-text').textContent = '祠山李氏宗祠 · 停灵堂';
    document.getElementById('hero-stamp').textContent = '大凶 · 生魂已入龛归档';
    document.getElementById('hero-title').textContent = '纸人替君行白昼，君替纸人守空祠。';
    document.getElementById('stat-pop').textContent = '313 人（刚刚新增 1 具）';
    document.getElementById('stat-vacancy').textContent = '第四十九号灵位已满';
    document.title = '奠 — 祠山灵堂已落锁';
  }

  function resetCurse() {
    localStorage.removeItem('cishan_cursed');
    document.title = '寻梦祠山 · 云溪县非物质文化遗产数字体验馆';
    window.scrollTo(0, 0);
    window.location.reload();
  }

  // =========================================================================
  // 2. SCROLL CURSE PROGRESSION
  // =========================================================================
  function lerpHex(hexA, hexB, t) {
    const a = parseInt(hexA.slice(1), 16);
    const b = parseInt(hexB.slice(1), 16);
    const r = Math.round(((a >> 16) & 255) + ((((b >> 16) & 255) - ((a >> 16) & 255)) * t));
    const g = Math.round(((a >> 8) & 255) + ((((b >> 8) & 255) - ((a >> 8) & 255)) * t));
    const bl = Math.round((a & 255) + (((b & 255) - (a & 255)) * t));
    return `rgb(${r}, ${g}, ${bl})`;
  }

  function updateScrollAtmosphere() {
    const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxS));
    const baseCurse = state.eyesAwake ? Math.max(0.38, ratio) : ratio * 0.85;
    const c = state.cursedPersisted ? Math.max(0.75, baseCurse) : baseCurse;

    window.cishanCurseDepth = c;
    const root = document.documentElement;
    root.style.setProperty('--c', c.toFixed(3));
    root.style.setProperty('--bg', lerpHex('#f4eee1', '#090807', c));
    root.style.setProperty('--bg-panel', lerpHex('#fbf8f1', '#141110', c));
    root.style.setProperty('--fg', lerpHex('#221d19', '#dfd9cc', c));
    root.style.setProperty('--fg-muted', lerpHex('#695e53', '#968d80', c));
    root.style.setProperty(
      '--border-ink',
      c < 0.42 ? 'rgba(34, 29, 25, 0.18)' : 'rgba(185, 48, 48, 0.35)'
    );

    window.folkAudio.setCurseDepth(c);

    document.querySelectorAll('[data-folk-nav]').forEach((a) => {
      const idx = Number(a.getAttribute('data-folk-nav'));
      const item = window.FOLK_DATA.navItems[idx];
      if (item) a.textContent = c > 0.5 || state.eyesAwake ? item.cursed : item.clean;
    });
  }

  // =========================================================================
  // 3. PAPER EFFIGY RITUAL, STELE SCRAPER, TABLETS & SEDAN
  // =========================================================================
  function setupFolkModules() {
    // Thumbprint stamp
    document.getElementById('thumbprint-btn').addEventListener('click', () => {
      if (state.stamped) return;
      state.stamped = true;
      const env = getEnvSnapshot();
      document.getElementById('thumb-circle').classList.add('stamped');
      document.getElementById('thumb-circle').textContent = '已押';
      document.getElementById('thumb-label').textContent = `红印已落 · 立契时辰：${env.lunarHour}`;
      document.getElementById('thumb-sub').textContent = '指印已拓入李氏宗祠阴阳鱼底册，落印不悔';
      window.folkAudio.playMuyu(-0.6, 310, false);
      showFolkWhisper('指印已落。现在去点亮左边纸童的双眼，吉礼就算成了……');
    });

    // Paper Effigy Canvas
    window.FolkRituals.initEffigyStage({
      initiallyAwake: state.cursedPersisted,
      onSingleEye(which) {
        window.folkAudio.playMuyu(which === 'left' ? -0.85 : 0.85, 430, false);
        window.folkAudio.playPaperWhisper(which === 'left' ? -0.85 : 0.85, 1.2);
        document.getElementById('ritual-status-bar').textContent =
          '已点一睛……纸童眼皮动了一下，请再点亮另一只眼。';
        showFolkWhisper('点了一只眼，它已经能模模糊糊看见你的轮廓了……');
      },
      onBothEyesAwake() {
        state.eyesAwake = true;
        document.body.classList.add('eyes-opened');
        document.getElementById('festive-glyph').textContent = '奠';
        document.getElementById('contract-card').classList.add('revealed-curse');
        document.getElementById('contract-title').textContent = '《祠山借阴寿生魂过户死契》';
        document.getElementById('contract-stamp').textContent = '替身契成';
        document.getElementById('ritual-status-bar').innerHTML =
          '<span style="color:#ff7575; font-weight:700;">⚠ 双睛已开！替身纸童已锁定您的鼠标视线，请速往下寻找破契之法！</span>';

        document.getElementById('mini-effigy-watcher').classList.add('awake');

        window.folkAudio.playFuneralGong(0.92);
        setTimeout(() => window.folkAudio.playGhostSuona(2.7, true), 380);
        updateScrollAtmosphere();
        showFolkWhisper('哐——！！双睛已开，喜字变奠！它现在正躲在左下角跟着你的鼠标看你！！');
      }
    });

    if (state.cursedPersisted) {
      state.eyesAwake = true;
      document.getElementById('mini-effigy-watcher').classList.add('awake');
      document.getElementById('contract-card').classList.add('revealed-curse');
    }

    // Qing Dynasty Stele Scraper -> Clue #1: CS-1994
    window.FolkRituals.initSteleRubbing((code) => {
      if (state.clue1) return;
      state.clue1 = true;
      document.getElementById('folk-clue-1').textContent = code;
      refreshTalismanNotebook();
      window.folkAudio.playMuyu(0.75, 360, true);
      showFolkWhisper('古碑白灰剥落！已拓得 1994 年县局封山卷宗号：CS-1994');
    });

    // Ancestral Spirit Tablets Grid
    const container = document.getElementById('tablets-container');
    const inspector = document.getElementById('tablet-inspector');

    window.FOLK_DATA.tablets.forEach((tb) => {
      const div = document.createElement('div');
      div.className = `spirit-tablet ${tb.suspicious ? 'suspicious' : ''}`;
      div.innerHTML = `<div class="tablet-vertical-text">${tb.title}</div>`;
      div.addEventListener('click', () => {
        window.folkAudio.playMuyu((Math.random() - 0.5) * 1.4, 480, false);
        inspector.innerHTML = `<strong>【查验 ${tb.title}】</strong><br/>${tb.note}`;
      });
      container.appendChild(div);
    });

    // The 6th Red-Cloth Draped Tablet (THE VIEWER'S OWN TABLET!)
    const myTablet = document.createElement('div');
    myTablet.className = 'spirit-tablet red-draped';
    myTablet.id = 'viewer-spirit-tablet';
    const env = getEnvSnapshot();
    myTablet.innerHTML = `<div class="tablet-vertical-text" style="color:#ff7b7b;">新纳第四十九位替身 · ${env.lunarHour}入祠外客之生位</div>`;
    myTablet.addEventListener('click', () => {
      myTablet.classList.add('unveiled');
      window.folkAudio.playPaperWhisper(0.92, 1.8);
      window.folkAudio.playFuneralGong(0.55);
      const cur = getEnvSnapshot();
      inspector.innerHTML =
        `<strong style="color:#ff6b6b;">【红布揭开 · 新立未上漆松木牌位 #49】</strong><br/>` +
        `牌位正面墨迹未干，刻着：<strong>“今夜 ${cur.lunarHour} 误入祠山之 ${cur.platform} 阅览客生魂寄位”</strong>。<br/>` +
        `底座下压着半张字条：“等三更花轿停在窗外，把上面写的四位数字记下来去县局档案库救命！”`;
    });
    container.appendChild(myTablet);

    // Midnight Sedan Slit Peephole -> Clue #2: 0715
    const sedanCtrl = window.FolkRituals.initSedanPeephole();
    document.getElementById('peep-sedan-btn').addEventListener('click', () => {
      if (sedanCtrl) sedanCtrl.haltProcession();
      window.folkAudio.playNightWatchCode();
      document.getElementById('sedan-status-text').innerHTML =
        '<strong style="color:#ff6b6b;">⚠ 花轿停在你的窗外了！！四个纸轿夫同时扭头看向窗缝，轿帘内露出封山木牌：0715</strong>';

      if (!state.clue2) {
        state.clue2 = true;
        document.getElementById('folk-clue-2').textContent = '0715';
        refreshTalismanNotebook();
      }
      showFolkWhisper('花轿停下了！已窥得轿中木牌封山密令：0715');
    });

    // Rules Horror Scroll-Back Gaslighting (guaranteed on scrolling past #rules-section)
    const rulesSec = document.getElementById('rules-section');
    function checkRulesGaslight() {
      if (state.rulesMutated || !rulesSec) return;
      const rect = rulesSec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) {
        state.rulesSeen = true;
      }
      if (state.rulesSeen && rect.bottom < window.innerHeight * 0.35) {
        state.rulesMutated = true;
        document.getElementById('rule-2').innerHTML =
          '<strong style="color:#e04848;">【二、红布已落】</strong> 别照镜子了。你现在的脸色已经比上面那个桑皮纸童还要白了。';
        document.getElementById('rule-4').innerHTML =
          '<strong style="color:#e04848;">【四、规矩作废】</strong> 你往上回滚也没用——刚才你在祈福台已经替它把眼睛点开了，它现在根本不在门外，它正贴着你的后背陪你看这行字。';
        showFolkWhisper('↑ 上方《老宅夜宿须知》的墨字刚刚在暗处渗出了红印……');
      }
    }
    window.addEventListener('scroll', checkRulesGaslight, { passive: true });

    window.FolkRituals.initAshAndBreach();
  }

  function refreshTalismanNotebook() {
    const count = (state.clue1 ? 1 : 0) + (state.clue2 ? 1 : 0);
    document.getElementById('folk-clue-count').textContent = String(count);
    const box = document.getElementById('clue-talisman');
    box.classList.add('alert', 'open');
    if (state.clue1) document.getElementById('arch-case-input').value = 'CS-1994';
    if (state.clue2) document.getElementById('arch-pin-input').value = '0715';
  }

  document.getElementById('talisman-toggle').addEventListener('click', () => {
    document.getElementById('clue-talisman').classList.toggle('open');
  });

  // =========================================================================
  // 4. 1994 COUNTY POLICE MICROFILM ARCHIVE & DUAL CLIMAX ENDINGS
  // =========================================================================
  function setupPoliceArchive() {
    const modal = document.getElementById('police-modal');
    const loginBox = document.getElementById('archive-login-box');
    const desk = document.getElementById('archive-desk');
    const errEl = document.getElementById('arch-err');
    const caseIn = document.getElementById('arch-case-input');
    const pinIn = document.getElementById('arch-pin-input');

    function openArchive() {
      modal.classList.add('open');
      window.folkAudio.playMuyu(0, 520, true);
      if (state.clue1) caseIn.value = 'CS-1994';
      if (state.clue2) pinIn.value = '0715';
    }

    document.getElementById('open-archive-top').addEventListener('click', openArchive);
    document.getElementById('open-archive-footer').addEventListener('click', openArchive);
    document.getElementById('talisman-open-archive').addEventListener('click', openArchive);
    document.getElementById('close-archive-btn').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    document.getElementById('arch-unlock-btn').addEventListener('click', tryUnlock);
    pinIn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
    });

    function tryUnlock() {
      const c = caseIn.value.trim().toUpperCase().replace(/\s+/g, '');
      const p = pinIn.value.trim();
      const okCase = c === 'CS-1994' || c === 'CS1994' || c === '1994';
      const okPin = p === '0715';

      if (okCase && okPin) {
        window.folkAudio.playFuneralGong(0.5);
        loginBox.style.display = 'none';
        desk.classList.add('unlocked');
        loadReel(0);
      } else {
        window.folkAudio.playMuyu(-0.8, 290, true);
        errEl.textContent = '✗ 封条核验失败：请先刮开光绪古碑获取卷号 (CS-1994)，并窥视子时花轿获取密令 (0715)。';
      }
    }

    document.getElementById('arch-hint-btn').addEventListener('click', () => {
      state.hintCount++;
      if (state.hintCount === 1 && (!state.clue1 || !state.clue2)) {
        errEl.style.color = '#f3dfa2';
        errEl.textContent = '考据提示：古碑刮开为 CS-1994，花轿木牌为中元节 0715（再点一次自动填入）。';
      } else {
        caseIn.value = 'CS-1994';
        pinIn.value = '0715';
        errEl.style.color = '#8ce99a';
        errEl.textContent = '已填入顾言遗留的档案密令，点击【拆封调阅微缩胶卷】即可进入。';
      }
    });

    document.querySelectorAll('.reel-btn[data-reel]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.reel-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        loadReel(Number(btn.getAttribute('data-reel')));
        window.folkAudio.playMuyu(0.3, 460, true);
      });
    });

    function loadReel(idx) {
      const container = document.getElementById('archive-reel-content');
      container.innerHTML = window.FOLK_DATA.getReelHTML(idx, getEnvSnapshot());

      if (idx === 2) {
        document.getElementById('burn-contract-btn').addEventListener('click', triggerBurnTrapEnding);
        document.getElementById('water-contract-btn').addEventListener('click', triggerWaterSalvationEnding);
      }
    }
  }

  // ENDING A (THE FOLKLORE TRAP!): Burning yellow paper DELIVERS it to the Underworld!
  function triggerBurnTrapEnding() {
    const breach = document.getElementById('bridal-breach');
    const verdict = document.getElementById('ash-verdict');
    const card = document.getElementById('folk-epilogue-card');

    breach.classList.add('active');
    localStorage.setItem('cishan_cursed', '1');
    state.cursedPersisted = true;

    window.folkAudio.triggerBurningClimax(
      () => {
        // Phase 2: Dead silence + crimson realization in the ashes!
        verdict.style.display = 'block';
      },
      () => {
        // Phase 3: FULL BRIDAL SEDAN & BLEEDING PAPER EFFIGY LUNGE!
        verdict.style.display = 'none';
        breach.classList.add('strike');
        window.FolkRituals.renderBreachEffigyStrike();
        document.title = '奠 — 替身入龛礼成';

        setTimeout(() => {
          breach.classList.remove('strike');
          document.getElementById('breach-effigy-canvas').style.opacity = '0.22';
          document.getElementById('epilogue-badge').textContent = '阴司收讫 · 焚契成真（坏结局）';
          document.getElementById('epilogue-title').textContent = '阳间烧成灰，下面才算签收。';
          document.getElementById('epilogue-body').innerHTML =
            '你忘了老辈人烧纸钱的规矩——凡是写给阴间的黄表文书，只有架火烧尽，才算正式过户到地府案头。<br/><br/>' +
            '西跨院第四十九号木牌已经刻好了你的名字。现在摸摸你的脸颊，是不是有点发干、发硬，像糊了一层桑皮纸？<br/>' +
            '<span style="color:#ff8787;">（注：即使刷新网页，祠山官网也将永久化为素白灵堂；若想探寻隐藏活路，可重置后细读宗祠内顾言的牌位笔记。）</span>';
          card.style.display = 'block';
        }, 1850);
      }
    );
  }

  // ENDING B (SECRET FOLKLORIST SURVIVOR ENDING!): Dissolving Cinnabar in Cold Well Water
  function triggerWaterSalvationEnding() {
    const breach = document.getElementById('bridal-breach');
    const card = document.getElementById('folk-epilogue-card');

    localStorage.removeItem('cishan_cursed');
    state.cursedPersisted = false;
    window.folkAudio.playMuyu(0, 520, false);

    breach.classList.add('active');
    document.getElementById('epilogue-badge').textContent = '水化朱砂 · 破契脱身（隐藏真结局）';
    document.getElementById('epilogue-badge').style.borderColor = '#63b39c';
    document.getElementById('epilogue-badge').style.color = '#8ce99a';
    document.getElementById('epilogue-title').textContent = '无根井水散尽朱砂，纸童闭上了眼。';
    document.getElementById('epilogue-body').innerHTML =
      '你记住了民俗学者顾言用命换来的口诀：<strong>“阴契怕水不怕火。”</strong><br/><br/>' +
      '冰冷的子时井水浸透黄表纸，浆糊脱开、辰州朱砂化作一滩浑水散去。窗外巷子里的四人白纸花轿停顿片刻，在五更起雾前悄无声息地退回了断魂岭。<br/><br/>' +
      '趁它们还没重新糊好下一张纸皮，立刻关掉这个网页，永远别再去搜“祠山古镇”。';
    card.style.display = 'block';
  }

  document.getElementById('epilogue-return-btn').addEventListener('click', () => {
    document.getElementById('bridal-breach').classList.remove('active', 'strike');
    document.getElementById('police-modal').classList.remove('open');
    if (state.cursedPersisted) applyMourningHallMutation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Top sound & muyu buttons + Tab-switch ambush
  document.getElementById('folk-sound-btn').addEventListener('click', () => {
    const on = window.folkAudio.toggleMute();
    document.getElementById('folk-sound-btn').textContent = on ? '🔔 戏台原声: 开' : '🔇 戏台原声: 静';
  });

  document.getElementById('hero-muyu-btn').addEventListener('click', () => {
    window.folkAudio.init(false);
    window.folkAudio.playMuyu(-0.5, 390, false);
    setTimeout(() => window.folkAudio.playMuyu(0.75, 382, false), 420);
    showFolkWhisper('笃……笃……奇怪，你只敲了一下木鱼，为什么右边耳道里跟着响了第二下？');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '● 别走，轿子停在你窗外了';
    } else if (state.eyesAwake) {
      window.folkAudio.playPaperWhisper(0.9, 1.5);
      showFolkWhisper('你刚才切出网页的时候，左下角那个纸童把头歪过来贴在玻璃上找你了。');
    }
  });

  // INIT
  printFolkConsoleClues();
  setupIncenseGate();
  setupFolkModules();
  setupPoliceArchive();
  window.addEventListener('scroll', updateScrollAtmosphere, { passive: true });
  updateScrollAtmosphere();
})();
