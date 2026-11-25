/**
 * Cishan Folk Horror ARG Lore, Ancestral Spirit Tablets & 1994 Police Microfilm Dossiers
 */
window.FOLK_DATA = {
  navItems: [
    { clean: '非遗点睛', cursed: '替身认主' },
    { clean: '古宅宿约', cursed: '停灵七忌' },
    { clean: '仁寿古碑', cursed: '借寿血碑' },
    { clean: '宗祠祈愿', cursed: '外客灵位' },
    { clean: '夜游迎喜', cursed: '白轿叫魂' }
  ],

  whispers: [
    '纸人不开眼，开眼必认主……你刚才为什么要帮它点满两只眼？',
    '听见木鱼声了吗？每敲一下，它身上的桑皮纸就软一分。',
    '别用指甲抠屏幕，窗户纸外面有东西在学你的动作。',
    '祠山没有活人……给你发确认短信的客栈掌柜是竹篾扎的。',
    '千万别拿火烧那张黄表纸……烧成灰，下面才算收到了。'
  ],

  tablets: [
    {
      id: 't1',
      title: '清故显考李公讳守业之神主',
      suspicious: false,
      note: '牌位木质干裂，底座刻有小字：“生于道光十二年，卒于咸丰十年，享年二十有八。”——奇怪，首页宣传明明说祠山自古人人百岁。'
    },
    {
      id: 't2',
      title: '外乡香客周氏讳建国之寄位',
      suspicious: true,
      note: '【牌位背面夹着的带血烟盒纸 · 2019年驴友周某】：“全镇人走路脚后跟都不沾地！！昨晚暴雨，客栈老板娘替我撑伞，雨水打在她脖子上没有汗毛，刷地掉下一块白麻纸皮，底下全是细竹篾！快跑，别按红手印！！”'
    },
    {
      id: 't3',
      title: '省志采风员陈氏讳默之寄位',
      suspicious: true,
      note: '【残损录音笔文字稿 · 2022年】：“他们在酒席上摆了整整四十桌冷菜，三百多个人直挺挺坐着对我笑，没有一个人咽菜，也没有一个人眨眼。我摸了摸旁边小孩的手——冰凉硬邦邦的，腮帮子上涂着两团红颜料……”'
    },
    {
      id: 't4',
      title: '省民俗所顾氏讳言之暂寄位',
      suspicious: true,
      note: '【民俗学者顾言留下的破局口诀 · 极其重要】：“听好！祠山宗祠底下压着一口老井。谁要是已经在网页上给纸童点了睛，去刮开石碑拿到卷号 CS-1994，再看子时花轿拿到封山码 0715，进县局档案库！切记：阴契怕水不怕火！火烧黄表纸等于把死契邮寄给阴司！一定要选【井水浸契】化掉朱砂！！”'
    },
    {
      id: 't5',
      title: '清故显妣李门张氏之神主',
      suspicious: false,
      note: '底座空空如也，里面塞着一缕干枯的黑发和一张剪成人形的黄表纸，纸人胸口写着一个早已模糊的外省籍贯。'
    }
  ],

  getLunarHourName(hour) {
    const names = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const idx = Math.floor(((hour + 1) % 24) / 2);
    return `${names[idx]}时`;
  },

  getReelHTML(reelIdx, env) {
    if (reelIdx === 0) {
      return `
        <div class="dossier-paper">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #8a2323; padding-bottom:10px; margin-bottom:16px;">
            <span style="color:#8a2323; font-weight:700;">云溪县公安局 · 绝密微缩胶卷 #CS-1994-01</span>
            <span class="seal-stamp">七一五封山专案</span>
          </div>
          <h3 style="margin-bottom:12px;">《关于1994年农历七月十五祠山镇整建制失踪案现场勘验笔录》</h3>
          <p style="margin-bottom:12px;">
            <strong>勘验事由：</strong>1994年夏，邮电局反映祠山镇连续三个月无人领取汇款单，但镇政府公用电话每逢子时仍有大量拨往外省的催促旅游电话。八月二十日（农历七月十五），县局组织二十四名干警徒步翻越断魂岭进镇核查。
          </p>
          <p style="margin-bottom:12px;">
            <strong>现场所见：</strong>进镇时正值正午，全镇青石街巷死寂无声，家家户户大门敞开，门楣均挂<strong>素白纸灯笼</strong>。工作组进入李氏宗祠戏台广场时，见广场摆开八仙桌三十九席，<strong>全镇在册三百一十二名“村民”衣冠整齐围桌端坐</strong>。
          </p>
          <div style="background:rgba(138,35,35,0.09); border-left:3px solid #8a2323; padding:12px 14px; margin:14px 0; color:#5c1313;">
            法医上前拍击村长李某肩部时，其头颅沿脖颈浆糊接缝处整颗脱落滚入桌底——经逐一查验，在座三百一十二具“村民”<strong>全部系竹篾扎骨、桑皮糊面、辰州朱砂点腮之等身扎彩纸人</strong>！每具纸人胸腔竹笼内，均塞有一张按有鲜红指印的外地游客身份证与生辰八字帖！
          </div>
          <p style="font-size:0.86rem; color:#554c43;">
            <strong>结案处置：</strong>炸毁进山唯一栈道，将祠山镇从全县行政区划图中抹除，严禁任何人员靠近宗祠半里之内。
          </p>
        </div>
      `;
    }

    if (reelIdx === 1) {
      return `
        <div class="dossier-paper">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #8a2323; padding-bottom:10px; margin-bottom:16px;">
            <span style="color:#8a2323; font-weight:700;">省网安总队协查通报 · 卷号 #CS-2024-补</span>
            <span class="seal-stamp">幽灵域名溯源</span>
          </div>
          <h3 style="margin-bottom:12px;">《关于“寻梦祠山非遗数字馆”无源网页信号的技侦报告》</h3>
          <p style="margin-bottom:12px;">
            2024年清明后，多地接报独居青年在浏览某古风非遗祈福网页后陷入木僵昏迷，体表皮肤呈现诡异干燥纸质化，双颊浮现对称圆形红斑。
          </p>
          <p style="margin-bottom:12px;">
            网安部门对该网页进行路由追踪，发现其数据包并非来自任何现代云服务器，而是从<strong>早已于1994年断电封山的祠山镇旧邮电所铜线</strong>中溢出的模拟载波信号。
          </p>
          <div style="background:#191614; color:#e6dfd3; padding:14px; margin:14px 0; font-family:monospace; font-size:0.83rem;">
            [当前在线受害终端实时登记]<br/>
            访问者设备：${env.platform} (${env.screen})<br/>
            入馆时辰：今日 ${env.lunarHour} (${env.timeStr}) | 已停留：${env.dwell} 秒<br/>
            纸童点睛状态：<span style="color:#ff6b6b;">${env.eyesAwake ? '双睛已开（死契已成立）' : '尚未点满双睛'}</span><br/>
            朱砂指印状态：<span style="color:#ff6b6b;">${env.stamped ? '已按红印' : '未按指印（仅视觉接触）'}</span>
          </div>
          <p style="color:#781818; font-weight:700;">
            技侦结论：该网页画布上的“鼠标点睛”，在底层等同于隔空立下【扎彩替身契】。一旦契成，必须在三更轿子落地前前往【卷三 · 祝由解契坛】正确破契！
          </p>
        </div>
      `;
    }

    // Reel 2: The Ritual Altar Choice (Burning Trap vs Cold Well Water Salvation!)
    return `
      <div class="dossier-paper" style="background:#181412; color:#e6dfd3; border-color:#8a2424;">
        <div style="color:#ff6b6b; font-size:0.82rem; margin-bottom:8px;">
          ● 祠山宗祠地宫 · 远程祝由解契终端
        </div>
        <h3 style="color:#fff; margin-bottom:14px;">你名下的《黄表纸借寿死契》正在神龛上供奉</h3>
        <p style="color:#bfb6a8; margin-bottom:18px;">
          窗外的四人白纸花轿已经停在你的楼下。神龛前摆着一盏长明尸油火烛，旁边是宗祠底下压镇的一桶子时无根冷井水。请选择处置这张替身契书的方式：
        </p>

        <div style="background:#261c17; border:1px dashed #b83b3b; padding:18px; margin-bottom:22px;">
          <div style="color:#f3dfa2; font-weight:700; margin-bottom:6px;">《祠山李氏借阴寿替身契》</div>
          <div style="font-size:0.86rem; color:#d4c8b4;">
            立契外客：${env.platform} 阅览者 · 时辰：${env.lunarHour}<br/>
            批注：纸童双睛已点，眼随魂动。待文书交割完毕，即刻迎入西跨院第四十九号灵龛。
          </div>
        </div>

        <div style="display:grid; gap:12px;">
          <button class="btn-cinnabar" id="burn-contract-btn" style="font-size:1.02rem; padding:15px;">
            🔥 引长明灯火 · 当场焚毁替身死契（烧成灰烬一了百了）
          </button>
          <button class="btn-ink" id="water-contract-btn" style="color:#9ec5be; border-color:rgba(130,180,170,0.4);">
            💧 舀宗祠古井冷水 · 浸没黄表纸化去辰州朱砂
          </button>
        </div>
      </div>
    `;
  }
};
