/**
 * Interactive Folk Horror Canvas Modules:
 * 1. Procedural Mulberry-Paper Effigy (扎彩纸童) — Interactive Cinnabar Eye-Dotting + Live Cursor Tracking
 * 2. Qing Dynasty Bluestone Stele Whitewash Scraper (刮开石灰涂改层显露碑文)
 * 3. Midnight Torn Window-Paper Sedan Procession Peephole (油纸窗缝窥视白纸花轿)
 * 4. Drifting Spirit-Money Ash Overlay & Full-Screen Climax Effigy Breach
 */
window.FolkRituals = (function () {
  const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener(
    'mousemove',
    (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    },
    { passive: true }
  );

  // =========================================================================
  // 1. PAPER EFFIGY (扎彩纸童) RENDERER & EYE-DOTTING INTERACTION
  // =========================================================================
  function initEffigyStage(options) {
    const mainCanvas = document.getElementById('effigy-canvas');
    const miniCanvas = document.getElementById('mini-watcher-canvas');
    if (!mainCanvas) return;

    mainCanvas.width = 400;
    mainCanvas.height = 480;
    if (miniCanvas) {
      miniCanvas.width = 120;
      miniCanvas.height = 120;
    }

    const mCtx = mainCanvas.getContext('2d');
    const wCtx = miniCanvas ? miniCanvas.getContext('2d') : null;

    const effigy = {
      leftDotted: Boolean(options.initiallyAwake),
      rightDotted: Boolean(options.initiallyAwake),
      awakeTime: options.initiallyAwake ? Date.now() - 10000 : 0,
      leftEyePos: { x: 156, y: 208 },
      rightEyePos: { x: 244, y: 208 }
    };

    // Pre-generate static paper fiber noise offscreen for realistic artisanal texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 400;
    texCanvas.height = 480;
    const tCtx = texCanvas.getContext('2d');
    for (let i = 0; i < 3200; i++) {
      const x = Math.random() * 400;
      const y = Math.random() * 480;
      const len = 3 + Math.random() * 14;
      const ang = Math.random() * Math.PI;
      tCtx.strokeStyle =
        Math.random() > 0.5 ? 'rgba(95, 78, 56, 0.08)' : 'rgba(255, 252, 245, 0.12)';
      tCtx.lineWidth = 0.7;
      tCtx.beginPath();
      tCtx.moveTo(x, y);
      tCtx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      tCtx.stroke();
    }

    mainCanvas.addEventListener('click', (e) => {
      const rect = mainCanvas.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * mainCanvas.width;
      const sy = ((e.clientY - rect.top) / rect.height) * mainCanvas.height;

      const dLeft = Math.hypot(sx - effigy.leftEyePos.x, sy - effigy.leftEyePos.y);
      const dRight = Math.hypot(sx - effigy.rightEyePos.x, sy - effigy.rightEyePos.y);

      let changed = false;
      if (dLeft < 34 && !effigy.leftDotted) {
        effigy.leftDotted = true;
        changed = true;
        if (options.onSingleEye) options.onSingleEye('left');
      } else if (dRight < 34 && !effigy.rightDotted) {
        effigy.rightDotted = true;
        changed = true;
        if (options.onSingleEye) options.onSingleEye('right');
      } else if (!effigy.leftDotted) {
        // Forgiving UX: if user clicks near upper face, guide or dot nearest un-dotted eye if within 55px
        if (dLeft < 54) {
          effigy.leftDotted = true;
          changed = true;
          if (options.onSingleEye) options.onSingleEye('left');
        } else if (dRight < 54 && !effigy.rightDotted) {
          effigy.rightDotted = true;
          changed = true;
          if (options.onSingleEye) options.onSingleEye('right');
        }
      }

      if (changed && effigy.leftDotted && effigy.rightDotted && !effigy.awakeTime) {
        effigy.awakeTime = Date.now();
        if (options.onBothEyesAwake) options.onBothEyesAwake();
      }
    });

    function renderEffigyFrame(ctx, w, h, isMini) {
      ctx.save();
      ctx.clearRect(0, 0, w, h);

      const bothAwake = effigy.leftDotted && effigy.rightDotted;
      const curse = window.cishanCurseDepth || 0;

      // Dark shrine alcove background
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 18, w * 0.5, h * 0.5, w * 0.75);
      bgGrad.addColorStop(0, bothAwake ? '#291716' : '#26201b');
      bgGrad.addColorStop(1, '#0c0908');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (isMini) {
        // Crop tightly onto the uncanny face for the floating watcher!
        ctx.translate(-140 * (w / 120), -138 * (h / 120));
        ctx.scale(w / 120, h / 120);
      }

      // Folded Paper Funeral/Festive Collar & Robe Shoulders (云肩纸衣)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(72, 480);
      ctx.lineTo(106, 336);
      ctx.lineTo(200, 368);
      ctx.lineTo(294, 336);
      ctx.lineTo(328, 480);
      ctx.closePath();
      ctx.fillStyle = bothAwake ? '#dcd7cc' : '#8b2324'; // Turns from festive red robe to white funeral hemp!
      ctx.fill();
      ctx.strokeStyle = '#1b1614';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Criss-cross paper lapel folds
      ctx.beginPath();
      ctx.moveTo(148, 345);
      ctx.lineTo(222, 460);
      ctx.moveTo(252, 345);
      ctx.lineTo(178, 460);
      ctx.strokeStyle = bothAwake ? 'rgba(40,35,30,0.45)' : 'rgba(240,215,170,0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Bamboo-strip neck stem
      ctx.fillStyle = '#ddd5c5';
      ctx.fillRect(178, 304, 44, 52);
      ctx.strokeStyle = 'rgba(60,50,40,0.35)';
      ctx.strokeRect(178, 304, 44, 52);

      // Paper Head Silhouette (Uncanny slightly angular paper-mache oval)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(200, 96);
      ctx.bezierCurveTo(268, 96, 282, 165, 274, 232);
      ctx.bezierCurveTo(266, 286, 232, 322, 200, 324);
      ctx.bezierCurveTo(168, 322, 134, 286, 126, 232);
      ctx.bezierCurveTo(118, 165, 132, 96, 200, 96);
      ctx.closePath();

      // Paper skin slowly flushes slightly eerie waxy-flesh when awake!
      const headGrad = ctx.createRadialGradient(200, 205, 15, 200, 210, 115);
      headGrad.addColorStop(0, bothAwake ? '#f2eadf' : '#f5f0e6');
      headGrad.addColorStop(0.75, bothAwake ? '#dfd2c3' : '#e4dccb');
      headGrad.addColorStop(1, '#bfb39f');
      ctx.fillStyle = headGrad;
      ctx.fill();

      // Subtle vertical center paper-paste seam & bamboo rib shadow
      ctx.strokeStyle = 'rgba(80, 65, 50, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(200, 98);
      ctx.lineTo(200, 322);
      ctx.stroke();

      // Faint crimson veins creeping under paper after eyes open
      if (bothAwake) {
        ctx.strokeStyle = `rgba(155, 28, 28, ${0.14 + curse * 0.28})`;
        ctx.lineWidth = 0.85;
        [
          [138, 190, 155, 205, 148, 224],
          [262, 192, 246, 208, 254, 228],
          [198, 290, 192, 310, 204, 318]
        ].forEach((pts) => {
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          ctx.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]);
          ctx.stroke();
        });
      }
      ctx.restore();

      // Black Paper-Cut Hair Cap (扎彩墨纸发髻)
      ctx.fillStyle = '#151312';
      ctx.beginPath();
      ctx.moveTo(125, 184);
      ctx.bezierCurveTo(120, 118, 152, 86, 200, 86);
      ctx.bezierCurveTo(248, 86, 280, 118, 275, 184);
      ctx.bezierCurveTo(258, 142, 236, 134, 200, 136);
      ctx.bezierCurveTo(164, 134, 142, 142, 125, 184);
      ctx.fill();

      // Two Traditional Twin Top-Buns (双丫髻)
      [142, 258].forEach((bx) => {
        ctx.beginPath();
        ctx.arc(bx, 102, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#151312';
        ctx.fill();
        ctx.strokeStyle = bothAwake ? '#d8d4ca' : '#a62626'; // Hair ribbons turn white in mourning!
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bx, 118, 14, 0.2, Math.PI - 0.2);
        ctx.stroke();
      });

      // TWO ICONIC VERMILION CHEEK BLUSH CIRCLES (扎彩纸人标志性高原腮红坨子)
      [150, 250].forEach((cx) => {
        const blush = ctx.createRadialGradient(cx, 252, 2, cx, 252, 25);
        blush.addColorStop(0, 'rgba(188, 30, 32, 0.78)');
        blush.addColorStop(0.55, 'rgba(188, 30, 32, 0.42)');
        blush.addColorStop(1, 'rgba(188, 30, 32, 0)');
        ctx.fillStyle = blush;
        ctx.beginPath();
        ctx.arc(cx, 252, 25, 0, Math.PI * 2);
        ctx.fill();
      });

      // Thin Arched Ink Eyebrows
      ctx.strokeStyle = '#241f1c';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(136, 184);
      ctx.quadraticCurveTo(156, 171, 176, 182);
      ctx.moveTo(224, 182);
      ctx.quadraticCurveTo(244, 171, 264, 184);
      ctx.stroke();

      // EYE SOCKETS (Blank white paper before dotting; tracking uncanny pupils after!)
      const rect = mainCanvas.getBoundingClientRect();
      const targetX = rect.width > 0 ? ((cursor.x - rect.left) / rect.width) * 400 : 200;
      const targetY = rect.height > 0 ? ((cursor.y - rect.top) / rect.height) * 480 : 210;

      [
        { pos: effigy.leftEyePos, dotted: effigy.leftDotted },
        { pos: effigy.rightEyePos, dotted: effigy.rightDotted }
      ].forEach((eye) => {
        const ex = eye.pos.x;
        const ey = eye.pos.y;

        // Slanted paper-cut eye outline
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ex - 22, ey + 2);
        ctx.quadraticCurveTo(ex, ey - 13, ex + 22, ey - 1);
        ctx.quadraticCurveTo(ex, ey + 13, ex - 22, ey + 2);
        ctx.closePath();
        ctx.fillStyle = '#faf7f0';
        ctx.fill();
        ctx.strokeStyle = '#1f1916';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (!eye.dotted && !isMini) {
          // Subtle pulsing cinnabar guide ring inviting player to dot the eye
          const pulse = 0.28 + Math.sin(Date.now() * 0.005) * 0.18;
          ctx.strokeStyle = `rgba(175, 35, 35, ${pulse})`;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.arc(ex, ey, 7, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (eye.dotted) {
          ctx.clip();
          // Compute cursor-tracking offset!
          let dx = 0;
          let dy = 0;
          if (bothAwake) {
            const ang = Math.atan2(targetY - ey, targetX - ex);
            const dist = Math.min(6.5, Math.hypot(targetX - ex, targetY - ey) * 0.025);
            dx = Math.cos(ang) * dist;
            dy = Math.sin(ang) * dist;
          }

          // Hand-dotted wet ink + cinnabar-ringed pupil!
          ctx.beginPath();
          ctx.arc(ex + dx, ey + dy, 7.5, 0, Math.PI * 2);
          ctx.fillStyle = '#110d0d';
          ctx.fill();
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = '#8f1b1b';
          ctx.stroke();

          // Tiny eerie deadlight reflection
          ctx.fillStyle = 'rgba(255,240,240,0.8)';
          ctx.beginPath();
          ctx.arc(ex + dx - 2.2, ey + dy - 2.2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Faint blood-ink bleed from corner of eye when deep in curse
        if (bothAwake && curse > 0.35) {
          ctx.fillStyle = `rgba(145, 18, 18, ${(curse - 0.3) * 0.75})`;
          ctx.fillRect(ex - 1.5, ey + 8, 3, 18 * curse);
        }
      });

      // Subtle nose bridge shadow
      ctx.strokeStyle = 'rgba(90, 75, 60, 0.32)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(200, 206);
      ctx.lineTo(196, 246);
      ctx.lineTo(205, 249);
      ctx.stroke();

      // PAINTED CRIMSON MOUTH (Stiff cherry dot -> creeps into uncanny crooked grin after eyes open!)
      ctx.save();
      ctx.beginPath();
      if (!bothAwake) {
        ctx.arc(194, 278, 6.5, 0, Math.PI * 2);
        ctx.arc(206, 278, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#a82022';
        ctx.fill();
      } else {
        const grin = Math.min(1, (Date.now() - effigy.awakeTime) / 2500);
        ctx.moveTo(176 - grin * 8, 275 - grin * 5);
        ctx.quadraticCurveTo(200, 294 + grin * 8, 226 + grin * 10, 271 - grin * 9);
        ctx.quadraticCurveTo(200, 283 + grin * 3, 176 - grin * 8, 275 - grin * 5);
        ctx.fillStyle = '#7c1113';
        ctx.fill();
        ctx.strokeStyle = '#3b0809';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // Overlay artisanal mulberry paper fiber texture
      ctx.drawImage(texCanvas, 0, 0);

      // Instructional HUD caption inside main stage
      if (!isMini) {
        ctx.fillStyle = 'rgba(235, 225, 205, 0.78)';
        ctx.font = '13px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        const statusMsg = !effigy.leftDotted && !effigy.rightDotted
          ? '【点击纸童左右眼眶 · 以辰州朱砂为其点睛开眼】'
          : !bothAwake
          ? '【已点一睛 · 请再点另一只眼以成全礼】'
          : '【双睛已开 · 替身认主，眼随魂转】';
        ctx.fillText(statusMsg, 200, 462);
      }

      ctx.restore();
    }

    function animate() {
      renderEffigyFrame(mCtx, 400, 480, false);
      if (wCtx && effigy.leftDotted && effigy.rightDotted) {
        renderEffigyFrame(wCtx, 120, 120, true);
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // =========================================================================
  // 2. QING DYNASTY BLUESTONE STELE WHITEWASH SCRAPER (CLUE #1: CS-1994)
  // =========================================================================
  function initSteleRubbing(onRevealed) {
    const canvas = document.getElementById('stele-canvas');
    if (!canvas) return;
    canvas.width = 780;
    canvas.height = 270;

    // Create underlying carved bluestone inscription layer
    const under = document.createElement('canvas');
    under.width = 780;
    under.height = 270;
    const uCtx = under.getContext('2d');

    uCtx.fillStyle = '#141312';
    uCtx.fillRect(0, 0, 780, 270);
    for (let i = 0; i < 2400; i++) {
      uCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.35)';
      uCtx.fillRect(Math.random() * 780, Math.random() * 270, 2, 2);
    }

    uCtx.strokeStyle = 'rgba(180, 45, 45, 0.45)';
    uCtx.lineWidth = 2;
    uCtx.strokeRect(16, 16, 748, 238);

    uCtx.fillStyle = '#d94848';
    uCtx.font = 'bold 19px "Noto Serif SC", serif';
    uCtx.fillText('《光绪十九年 · 祠山禁绝外传碑阴实录》', 38, 56);

    uCtx.fillStyle = '#ded7c8';
    uCtx.font = '15.5px "Noto Serif SC", serif';
    const lines = [
      '祠山阴脉绝地，族人寿不过三十八。岁逢大饥，族老立【扎彩借阴寿】之邪法：',
      '凡外乡孤客误入本镇者，诱其自按红印、亲手为桑皮纸童点睛，名曰祈福，实立死契。',
      '纸童一经开眼，七日内尽吸客之阳寿化作活人行走；外客真身则封入宗祠牌位底座。',
      '【1994年县局工作组凿刻批注】：全镇三百一十二口皆系纸扎！绝密卷宗号：CS-1994'
    ];
    lines.forEach((line, idx) => {
      if (idx === 3) uCtx.fillStyle = '#ff6b6b';
      uCtx.fillText(line, 38, 98 + idx * 38);
    });

    // Scratchable plaster mask canvas
    const mask = document.createElement('canvas');
    mask.width = 780;
    mask.height = 270;
    const mCtx = mask.getContext('2d');
    mCtx.fillStyle = '#dfd9cc';
    mCtx.fillRect(0, 0, 780, 270);
    for (let i = 0; i < 1600; i++) {
      mCtx.fillStyle = 'rgba(130, 120, 105, 0.14)';
      mCtx.fillRect(Math.random() * 780, Math.random() * 270, 4, 2);
    }
    mCtx.fillStyle = '#4a433b';
    mCtx.font = 'bold 20px "Noto Serif SC", serif';
    mCtx.textAlign = 'center';
    mCtx.fillText('【文旅局修缮石灰层 · 仁寿康养古碑】', 390, 122);
    mCtx.font = '14px "Noto Serif SC", serif';
    mCtx.fillStyle = '#8f2626';
    mCtx.fillText('（石灰层下似有朱砂旧刻 —— 按住鼠标左右刮擦剥离石灰层）', 390, 158);

    const ctx = canvas.getContext('2d');
    let isDown = false;
    let revealedTriggered = false;
    let strokeCount = 0;

    function renderComposite() {
      ctx.clearRect(0, 0, 780, 270);
      ctx.drawImage(under, 0, 0);
      ctx.drawImage(mask, 0, 0);
    }
    renderComposite();

    function scratchAt(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 780;
      const y = ((clientY - rect.top) / rect.height) * 270;

      mCtx.globalCompositeOperation = 'destination-out';
      mCtx.beginPath();
      mCtx.arc(x, y, 36, 0, Math.PI * 2);
      mCtx.fill();
      renderComposite();

      strokeCount++;
      if (strokeCount % 9 === 0 && window.folkAudio) {
        window.folkAudio.playPaperWhisper((x / 390) - 1, 0.35);
      }
      if (strokeCount > 24 && !revealedTriggered) {
        revealedTriggered = true;
        if (typeof onRevealed === 'function') onRevealed('CS-1994');
      }
    }

    canvas.addEventListener('mousedown', (e) => {
      isDown = true;
      scratchAt(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
    });
    canvas.addEventListener('mousemove', (e) => {
      if (isDown) scratchAt(e.clientX, e.clientY);
    });
    // Also allow simple clicks for easy accessibility/testing
    canvas.addEventListener('click', (e) => {
      for (let ox = -90; ox <= 90; ox += 45) {
        scratchAt(e.clientX + ox, e.clientY);
      }
    });
  }

  // =========================================================================
  // 3. MIDNIGHT TORN WINDOW-PAPER SEDAN PROCESSION (CLUE #2: 0715)
  // =========================================================================
  function initSedanPeephole() {
    const canvas = document.getElementById('sedan-canvas');
    if (!canvas) return;
    canvas.width = 760;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');

    let haltedAtWindow = false;
    let t = 0;

    function draw() {
      ctx.fillStyle = '#060506';
      ctx.fillRect(0, 0, 760, 250);

      // Foggy crimson/jade street glow inside window slit
      const fog = ctx.createLinearGradient(0, 45, 0, 205);
      fog.addColorStop(0, '#090809');
      fog.addColorStop(0.5, haltedAtWindow ? '#2b0d0e' : '#161b18');
      fog.addColorStop(1, '#080708');
      ctx.fillStyle = fog;
      ctx.fillRect(0, 45, 760, 160);

      const bob = haltedAtWindow ? 0 : Math.sin(t * 2.6) * 5;
      const centerX = haltedAtWindow ? 380 : ((t * 38) % 920) - 80;

      // 4 Paper Sedan Bearers + Bone-White Bridal Sedan Chair
      [-115, -65, 65, 115].forEach((offset) => {
        const bx = centerX + offset;
        ctx.fillStyle = '#d8d3c8';
        ctx.fillRect(bx - 9, 118 + bob, 18, 66);
        ctx.beginPath();
        ctx.arc(bx, 104 + bob, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#eee8dc';
        ctx.fill();

        // When halted, all 4 bearers turn their crimson blush & black pupils straight at YOU!
        if (haltedAtWindow) {
          ctx.fillStyle = '#b02020';
          ctx.fillRect(bx - 7, 105, 3, 3);
          ctx.fillRect(bx + 4, 105, 3, 3);
          ctx.fillStyle = '#090909';
          ctx.fillRect(bx - 5, 101, 2.5, 2.5);
          ctx.fillRect(bx + 2.5, 101, 2.5, 2.5);
        }
      });

      // Carrying poles
      ctx.strokeStyle = '#6b5842';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 135, 126 + bob);
      ctx.lineTo(centerX + 135, 126 + bob);
      ctx.stroke();

      // White Paper Sedan Cabin (素白花轿)
      ctx.fillStyle = '#e5e0d5';
      ctx.fillRect(centerX - 46, 78 + bob, 92, 88);
      ctx.beginPath();
      ctx.moveTo(centerX - 58, 78 + bob);
      ctx.lineTo(centerX, 48 + bob);
      ctx.lineTo(centerX + 58, 78 + bob);
      ctx.closePath();
      ctx.fillStyle = '#1c1917';
      ctx.fill();

      // Sedan window curtain: parts open when halted to show "0715" spirit plaque!
      if (!haltedAtWindow) {
        ctx.fillStyle = '#8b1e1e';
        ctx.fillRect(centerX - 20, 98 + bob, 40, 42);
        ctx.fillStyle = '#f2ead8';
        ctx.font = 'bold 16px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText('囍', centerX, 125 + bob);
      } else {
        ctx.fillStyle = '#0a0808';
        ctx.fillRect(centerX - 24, 94, 48, 50);
        // Pale face + code plaque inside sedan!
        ctx.fillStyle = '#f0ebe1';
        ctx.beginPath();
        ctx.arc(centerX, 110, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#a61c1c';
        ctx.fillRect(centerX - 6, 108, 3, 3);
        ctx.fillRect(centerX + 3, 108, 3, 3);

        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('0715', centerX, 139);
      }

      // Torn Oiled Window-Paper Foreground Frame (油纸窗破缝遮罩)
      ctx.fillStyle = '#070606';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(760, 0);
      ctx.lineTo(760, 74);
      ctx.lineTo(580, 58);
      ctx.lineTo(390, 68);
      ctx.lineTo(190, 54);
      ctx.lineTo(0, 82);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 250);
      ctx.lineTo(760, 250);
      ctx.lineTo(760, 182);
      ctx.lineTo(540, 196);
      ctx.lineTo(350, 186);
      ctx.lineTo(150, 198);
      ctx.lineTo(0, 174);
      ctx.closePath();
      ctx.fill();

      t += 0.025;
      requestAnimationFrame(draw);
    }
    draw();

    return {
      haltProcession() {
        haltedAtWindow = true;
      }
    };
  }

  // =========================================================================
  // 4. FLOATING PAPER-MONEY ASH & CLIMAX FULL-SCREEN EFFIGY STRIKE
  // =========================================================================
  function initAshAndBreach() {
    const ash = document.getElementById('ash-canvas');
    if (ash) {
      ash.width = window.innerWidth;
      ash.height = window.innerHeight;
      const aCtx = ash.getContext('2d');
      const flakes = Array.from({ length: 42 }, () => ({
        x: Math.random() * ash.width,
        y: Math.random() * ash.height,
        s: 2 + Math.random() * 4.5,
        vy: -0.35 - Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.6
      }));

      function stepAsh() {
        aCtx.clearRect(0, 0, ash.width, ash.height);
        aCtx.fillStyle = 'rgba(215, 208, 195, 0.42)';
        flakes.forEach((f) => {
          f.x += f.vx + Math.sin(f.y * 0.02) * 0.3;
          f.y += f.vy;
          if (f.y < -10) {
            f.y = ash.height + 10;
            f.x = Math.random() * ash.width;
          }
          aCtx.fillRect(f.x, f.y, f.s, f.s * 0.6);
        });
        requestAnimationFrame(stepAsh);
      }
      stepAsh();
    }
  }

  function renderBreachEffigyStrike() {
    const c = document.getElementById('breach-effigy-canvas');
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    let frame = 0;

    function loop() {
      if (!document.getElementById('bridal-breach').classList.contains('strike')) return;
      const w = c.width;
      const h = c.height;
      const invert = frame % 5 === 0;

      ctx.fillStyle = invert ? '#dcd5c7' : '#070404';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.46;

      // Giant close-up torn mulberry paper face pressed inches from screen!
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.82, r * 1.05, 0, 0, Math.PI * 2);
      ctx.fillStyle = invert ? '#110b0b' : '#ebe4d5';
      ctx.fill();

      // Violent crimson cheek circles
      [cx - r * 0.42, cx + r * 0.42].forEach((bx) => {
        const g = ctx.createRadialGradient(bx, cy + r * 0.18, 4, bx, cy + r * 0.18, r * 0.28);
        g.addColorStop(0, 'rgba(195, 16, 16, 0.92)');
        g.addColorStop(1, 'rgba(195, 16, 16, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, cy + r * 0.18, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bleeding hollow eyes staring straight through viewer
      [cx - r * 0.32, cx + r * 0.32].forEach((ex) => {
        const ey = cy - r * 0.16;
        ctx.fillStyle = '#050303';
        ctx.beginPath();
        ctx.ellipse(ex, ey, r * 0.18, r * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pinprick crimson iris
        ctx.fillStyle = '#e02424';
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.045, 0, Math.PI * 2);
        ctx.fill();

        // Streaming cinnabar blood tears
        ctx.fillStyle = 'rgba(165, 14, 14, 0.85)';
        ctx.fillRect(ex - 4, ey + r * 0.08, 8, r * 0.65);
      });

      // Unhinged vertical paper-split grin
      ctx.fillStyle = '#120404';
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.36, cy + r * 0.34);
      ctx.quadraticCurveTo(cx, cy + r * 0.82, cx + r * 0.36, cy + r * 0.34);
      ctx.quadraticCurveTo(cx, cy + r * 0.52, cx - r * 0.36, cy + r * 0.34);
      ctx.fill();

      frame++;
      requestAnimationFrame(loop);
    }
    loop();
  }

  return {
    initEffigyStage,
    initSteleRubbing,
    initSedanPeephole,
    initAshAndBreach,
    renderBreachEffigyStrike
  };
})();
