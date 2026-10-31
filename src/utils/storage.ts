import { Task, SessionRecord, DistractionNote, PomodoroSettings, ThemeMode, CustomSubject, CustomPreset, StudyQuote } from '../types/pomodoro';

export const STUDY_QUOTES: StudyQuote[] = [
  // 1. 數學 (Mathematics)
  {
    id: 'q-math-1',
    subject: '數學',
    original: 'Mathematics is the queen of sciences and number theory is the queen of mathematics.',
    translation: '數學是科學的皇后，而數論則是數學的皇后。',
    author: 'Carl Friedrich Gauss (高斯)',
  },
  {
    id: 'q-math-2',
    subject: '數學',
    original: 'The essence of mathematics lies in its freedom.',
    translation: '數學的靈魂與本質，正在於其思考的極致自由。',
    author: 'Georg Cantor (康托爾)',
  },
  {
    id: 'q-math-3',
    subject: '數學',
    original: 'In mathematics, the art of proposing a question must be held of higher value than solving it.',
    translation: '在數學探究中，提出一個深刻問題的藝術，往往比解決問題更有價值。',
    author: 'Georg Cantor (康托爾)',
  },
  {
    id: 'q-math-4',
    subject: '數學',
    original: 'Pure mathematics is, in its way, the poetry of logical ideas.',
    translation: '純粹數學，在某種崇高的意義上是邏輯思維寫就的詩篇。',
    author: 'Albert Einstein (愛因斯坦)',
  },

  // 2. 英文 (English)
  {
    id: 'q-eng-1',
    subject: '英文',
    original: 'The limits of my language mean the limits of my world.',
    translation: '我語言的邊界，就是我所能感知與探索世界的邊界。',
    author: 'Ludwig Wittgenstein (維根斯坦)',
  },
  {
    id: 'q-eng-2',
    subject: '英文',
    original: 'To have another language is to possess a second soul.',
    translation: '掌握另一門語言，就如同在靈魂深處擁有了第二個世界觀。',
    author: 'Charlemagne (查理曼大帝)',
  },
  {
    id: 'q-eng-3',
    subject: '英文',
    original: 'Words are, in my not-so-humble opinion, our most inexhaustible source of magic.',
    translation: '文字與語言，是人類文明中最取之不盡、用之不竭的魔法泉源。',
    author: 'J.K. Rowling (羅琳)',
  },
  {
    id: 'q-eng-4',
    subject: '英文',
    original: 'One language sets you in a corridor for life. Two languages open every door along the way.',
    translation: '一門語言能為你鋪就一條走廊；多掌握一門語言，則能開啟沿途的每一扇大門。',
    author: 'Frank Smith (語言學家)',
  },

  // 3. 國文/語文 (Chinese / Literature)
  {
    id: 'q-chi-1',
    subject: '國文/語文',
    original: '博學之，審問之，慎思之，明辨之，篤行之。',
    translation: '廣泛學習以拓視野，詳細探問以求真知，慎重深思以明義理，清晰分辨以察是非，切實實踐以行其道。',
    author: '《禮記·中庸》',
  },
  {
    id: 'q-chi-2',
    subject: '國文/語文',
    original: '古之立大事者，不惟有超世之才，亦必有堅忍不拔之志。',
    translation: '自古能成就卓越事業者，不單憑過人稟賦，更在於具備堅定不屈、百折不撓的恆毅心。',
    author: '蘇軾《晁錯論》',
  },
  {
    id: 'q-chi-3',
    subject: '國文/語文',
    original: '問渠那得清如許？為有源頭活水來。',
    translation: '池水為何能如此清澈明淨？因源頭持續注入源源不絕的活泉；唯有持續深讀，智慧才能日新又新。',
    author: '朱熹《觀書有感》',
  },
  {
    id: 'q-chi-4',
    subject: '國文/語文',
    original: '業精於勤，荒於嬉；行成於思，毀於隨。',
    translation: '學問造詣因勤奮專注而精深，因放縱怠惰而荒廢；德行事業成於獨立深思，毀於盲目隨波逐流。',
    author: '韓愈《進學解》',
  },

  // 4. 物理 (Physics)
  {
    id: 'q-phy-1',
    subject: '物理',
    original: 'I have no special talents. I am only passionately curious.',
    translation: '我並沒有什麼超乎常人的天才，我只是對大自然的真理始終懷抱著無窮的熱忱與好奇。',
    author: 'Albert Einstein (愛因斯坦)',
  },
  {
    id: 'q-phy-2',
    subject: '物理',
    original: 'What I cannot create, I do not understand.',
    translation: '凡是我無法從第一原理親手推導建構的事物，我就不算真正理解它。',
    author: 'Richard Feynman (費曼)',
  },
  {
    id: 'q-phy-3',
    subject: '物理',
    original: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    translation: '生命中沒有什麼是該畏懼的，只有等待被理解的奧秘。現在正是深入求知的時刻，讓我們不再畏懼無知。',
    author: 'Marie Curie (居禮夫人)',
  },
  {
    id: 'q-phy-4',
    subject: '物理',
    original: 'If I have seen further, it is by standing on the shoulders of giants.',
    translation: '若是我比一般人看得更深遠，那全是因為我正站在巨人們厚實的肩膀之上。',
    author: 'Isaac Newton (牛頓)',
  },

  // 5. 化學 (Chemistry)
  {
    id: 'q-chem-1',
    subject: '化學',
    original: 'The best way to have a good idea is to have a lot of ideas.',
    translation: '獲得絕佳構想的最佳途徑，就是先勇於探索並孕育出大量的想法，再從中提煉精粹。',
    author: 'Linus Pauling (鮑林，兩度諾貝爾得主)',
  },
  {
    id: 'q-chem-2',
    subject: '化學',
    original: 'Science begins when one begins to measure; exact science does not exist without measurement.',
    translation: '當人們開始動手精密量測，科學才算真正誕生；沒有度量，就沒有精準的科學真理。',
    author: 'Dmitri Mendeleev (門得列夫，元素週期表之父)',
  },
  {
    id: 'q-chem-3',
    subject: '化學',
    original: 'Science and everyday life cannot and should not be separated.',
    translation: '科學探索與日常生活密不可分，也絕不應該被生硬地割裂開來。',
    author: 'Rosalind Franklin (富蘭克林，DNA結晶結構解析先驅)',
  },

  // 6. 生物 (Biology)
  {
    id: 'q-bio-1',
    subject: '生物',
    original: 'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.',
    translation: '生存下來的物種，往往不是最強壯的，也不是最聰慧的，而是對環境變遷最能敏銳應變與調適的生命。',
    author: 'Charles Darwin (達爾文)',
  },
  {
    id: 'q-bio-2',
    subject: '生物',
    original: 'Nature is nowhere accustomed more openly to display her secret mysteries than apart from the beaten track.',
    translation: '大自然總在常規與既定軌跡之外的細微縫隙中，最慷慨地顯露其生命機制的奧秘。',
    author: 'William Harvey (哈維，血液循環發現者)',
  },
  {
    id: 'q-bio-3',
    subject: '生物',
    original: 'We are all connected in the great web of life.',
    translation: '在萬物共生的壯麗生命巨網中，世間每個生物分子與個體都緊密相連。',
    author: 'E.O. Wilson (威爾森，當代生物多樣性之父)',
  },

  // 7. 歷史/社會 (History / Social Studies)
  {
    id: 'q-hist-1',
    subject: '歷史/社會',
    original: 'Those who cannot remember the past are condemned to repeat it.',
    translation: '那些遺忘歷史教訓與脈絡的人，注定在無知中重蹈過往的悲劇與覆轍。',
    author: 'George Santayana (桑塔亞那)',
  },
  {
    id: 'q-hist-2',
    subject: '歷史/社會',
    original: '究天人之際，通古今之變，成一家之言。',
    translation: '探求天道運行與人類社會的互動真諦，融會貫通古往今來的歷史遞嬗，凝結出獨立深刻的卓見。',
    author: '司馬遷《史記·太史公自序》',
  },
  {
    id: 'q-hist-3',
    subject: '歷史/社會',
    original: 'History is philosophy teaching by examples.',
    translation: '歷史是最高明的哲學，藉由先人走過的一件件具體實例，向後世傳遞深刻的智慧。',
    author: 'Thucydides (修昔底德)',
  },

  // 8. 地理 (Geography)
  {
    id: 'q-geo-1',
    subject: '地理',
    original: 'The most dangerous worldview is the worldview of those who have not viewed the world.',
    translation: '最狹隘且危險的世界觀，莫過於那些從未真正放眼凝視與丈量過宏觀世界的人所持之見。',
    author: 'Alexander von Humboldt (洪堡德，現代地理學之父)',
  },
  {
    id: 'q-geo-2',
    subject: '地理',
    original: '讀萬卷書，行萬里路；胸中脫去塵濁，自然丘壑內營。',
    translation: '博覽經典以豐厚心志，踏遍山川以印證所學；澄澈心中的雜念浮躁，胸壑天地自成萬千丘壑。',
    author: '董其昌《畫旨》',
  },

  // 9. 程式開發 (Coding / Computer Science)
  {
    id: 'q-code-1',
    subject: '程式開發',
    original: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    translation: '程式碼首先是為了讓人類同伴閱讀理解而寫的，順便才交給機器去運算執行。',
    author: 'Harold Abelson (MIT SICP 作者)',
  },
  {
    id: 'q-code-2',
    subject: '程式開發',
    original: 'Talk is cheap. Show me the code.',
    translation: '空泛的爭辯毫無意義與成本；展示你能真正跑通並解決問題的程式碼。',
    author: 'Linus Torvalds (Linux 與 Git 創造者)',
  },
  {
    id: 'q-code-3',
    subject: '程式開發',
    original: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.',
    translation: '我們雖然只能看清前方短短的一小步，但眼前已有無數值得著手創造的偉大事物。',
    author: 'Alan Turing (圖靈，現代電腦之父)',
  },
  {
    id: 'q-code-4',
    subject: '程式開發',
    original: 'Simplicity is prerequisite for reliability.',
    translation: '結構的極簡與純粹，是一切系統穩健可靠、經受考驗的首要前提。',
    author: 'Edsger W. Dijkstra (戴克斯特拉)',
  },

  // 10. 論文寫作 (Thesis / Academic Writing)
  {
    id: 'q-thesis-1',
    subject: '論文寫作',
    original: 'Research is seeing what everybody else has seen and thinking what nobody else has thought.',
    translation: '所謂深刻的研究，就是凝視著所有人都看過的現象，卻思考出所有人未曾想過的本質。',
    author: 'Albert Szent-Györgyi (諾貝爾生理醫學獎得主)',
  },
  {
    id: 'q-thesis-2',
    subject: '論文寫作',
    original: 'Easy reading is damn hard writing.',
    translation: '能讓讀者感到清晰流暢、毫不費力的論述，其背後無一不經歷極其嚴苛的字句推敲與重構。',
    author: 'Nathaniel Hawthorne (霍桑)',
  },
  {
    id: 'q-thesis-3',
    subject: '論文寫作',
    original: 'The secret of good writing is to strip every sentence to its cleanest components.',
    translation: '寫出優秀論文與文字的秘訣，在於毫不留情地將每個句子剝離至最精煉純粹的骨架。',
    author: 'William Zinsser (齊瑟《非虛構寫作指南》)',
  },

  // 11. 閱讀 (Reading)
  {
    id: 'q-read-1',
    subject: '閱讀',
    original: 'The reading of all good books is like conversation with the finest minds of past centuries.',
    translation: '閱讀一切經典好書，就如同跨越時空與過去數百年間最卓越的心靈進行深邃的促膝長談。',
    author: 'René Descartes (笛卡兒)',
  },
  {
    id: 'q-read-2',
    subject: '閱讀',
    original: 'I have always imagined that Paradise will be a kind of a library.',
    translation: '在我的心靈深處，我始終堅定地想像：所謂天堂，必定應當是一座宏大圖書館的模樣。',
    author: 'Jorge Luis Borges (波赫士)',
  },
  {
    id: 'q-read-3',
    subject: '閱讀',
    original: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
    translation: '熱愛閱讀的人在告別世界前已體驗過一千種壯麗人生；從不讀書的人，終其一生只能過著單調的一種。',
    author: 'George R.R. Martin (喬治·馬丁)',
  },

  // 12. 考試複習 (Exam Review)
  {
    id: 'q-exam-1',
    subject: '考試複習',
    original: '鍥而舍之，朽木不折；鍥而不捨，金石可鏤。',
    translation: '雕刻若半途而廢，即使腐朽枯木也雕刻不斷；若堅持不懈雕鏤下去，即便堅硬如金石也能刻出奇蹟。',
    author: '荀子《勸學》',
  },
  {
    id: 'q-exam-2',
    subject: '考試複習',
    original: "Pressure is a privilege — it only comes to those who earn it.",
    translation: '面對重大考驗時的壓力是一種特權——它只會降臨在那些有實力競逐卓越成就的人身上。',
    author: 'Billie Jean King (金夫人)',
  },
  {
    id: 'q-exam-3',
    subject: '考試複習',
    original: "It always seems impossible until it's done.",
    translation: '在事情真正水到渠成、圓滿完成之前，每一個崇高的目標看起來都像是不可能的奇蹟。',
    author: 'Nelson Mandela (曼德拉)',
  },

  // 13. 證照檢定 (Certifications)
  {
    id: 'q-cert-1',
    subject: '證照檢定',
    original: 'Success is the sum of small efforts, repeated day in and day out.',
    translation: '成功並非一蹴可幾，而是那些每日看似微小的刻意練習，在日復一日的堅持中累積而成的總和。',
    author: 'Robert Collier (柯里爾)',
  },
  {
    id: 'q-cert-2',
    subject: '證照檢定',
    original: 'Discipline is choosing between what you want now and what you want most.',
    translation: '所謂自律，就是在「眼前的短暫安逸」與「你未來一生中最深切渴望的成就」之間做出清醒的抉擇。',
    author: 'Abraham Lincoln (林肯)',
  },

  // 14. 自由自習 / 專業科目 / 其他通用心流 (General Deep Work)
  {
    id: 'q-gen-1',
    subject: '自由自習',
    original: 'Deep work is the ability to focus without distraction on a cognitively demanding task.',
    translation: '深度工作能力，是在完全屏除外在干擾的寧靜心流中，全心投入高認知負荷學習的頂級能力。',
    author: 'Cal Newport (《深度工作力》作者)',
  },
  {
    id: 'q-gen-2',
    subject: '自由自習',
    original: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    translation: '你擁有完全主宰內心專注的力量，而非受制於外在紛擾的喧囂；參透這點，你將獲得無與倫比的定力。',
    author: 'Marcus Aurelius (馬可·奧理略《沉思錄》)',
  },
  {
    id: 'q-gen-3',
    subject: '自由自習',
    original: '日拱一卒無有盡，功不唐捐終入海。',
    translation: '每天如小卒般堅定無悔向前推進一步，你所付出的每一秒專注都不會白費，終將如江河匯入壯麗大海。',
    author: '治學格言',
  },
  {
    id: 'q-gen-4',
    subject: '自由自習',
    original: '千里之行，始於足下；萬頁巨著，積於分秒。',
    translation: '萬里遠征起於當下的第一步；千百卷深奧學問，皆在滴答計時的專注中積累而成。',
    author: '老子《道德經》· 專注釋義',
  },
];

export function getQuotesForSubject(subjectName?: string): StudyQuote[] {
  if (!subjectName || subjectName === 'all') {
    return STUDY_QUOTES;
  }
  const matched = STUDY_QUOTES.filter(q => q.subject === subjectName);
  if (matched.length > 0) {
    return matched;
  }
  // Fallback to general quotes
  return STUDY_QUOTES.filter(q => q.subject === '自由自習' || q.subject === '閱讀');
}


export const DEFAULT_SETTINGS: PomodoroSettings = {
  pomodoroSeconds: 25 * 60,
  shortBreakSeconds: 5 * 60,
  longBreakSeconds: 15 * 60,
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  alarmSound: 'tibetan-bell',
  alarmVolume: 0.8,
  tickingSound: false,
  tickingVolume: 0.15,
  clockStyle: 'ring',
};

export function formatSecondsToHms(totalSeconds: number): { hours: number; minutes: number; seconds: number; formatted: string } {
  const hours = Math.floor(totalSeconds / 3600);
  const remaining = totalSeconds % 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  if (hours > 0) {
    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours}小時 ${minutes}分${seconds > 0 ? ` ${seconds}秒` : ''}`,
    };
  }
  if (minutes > 0) {
    return {
      hours: 0,
      minutes,
      seconds,
      formatted: `${minutes}分${seconds > 0 ? ` ${seconds}秒` : ''}`,
    };
  }
  return {
    hours: 0,
    minutes: 0,
    seconds,
    formatted: `${seconds}秒`,
  };
}

export const DEFAULT_SUBJECTS: CustomSubject[] = [
  { id: 'sub-math', name: '數學', color: 'blue', dotClass: 'bg-blue-400', textClass: 'text-blue-300' },
  { id: 'sub-eng', name: '英文', color: 'emerald', dotClass: 'bg-emerald-400', textClass: 'text-emerald-300' },
  { id: 'sub-chi', name: '國文/語文', color: 'rose', dotClass: 'bg-rose-400', textClass: 'text-rose-300' },
  { id: 'sub-phy', name: '物理', color: 'cyan', dotClass: 'bg-cyan-400', textClass: 'text-cyan-300' },
  { id: 'sub-chem', name: '化學', color: 'violet', dotClass: 'bg-violet-400', textClass: 'text-violet-300' },
  { id: 'sub-bio', name: '生物', color: 'lime', dotClass: 'bg-lime-400', textClass: 'text-lime-300' },
  { id: 'sub-hist', name: '歷史/社會', color: 'amber', dotClass: 'bg-amber-400', textClass: 'text-amber-300' },
  { id: 'sub-geo', name: '地理', color: 'teal', dotClass: 'bg-teal-400', textClass: 'text-teal-300' },
  { id: 'sub-major', name: '專業科目', color: 'purple', dotClass: 'bg-purple-400', textClass: 'text-purple-300' },
  { id: 'sub-code', name: '程式開發', color: 'orange', dotClass: 'bg-orange-400', textClass: 'text-orange-300' },
  { id: 'sub-thesis', name: '論文寫作', color: 'fuchsia', dotClass: 'bg-fuchsia-400', textClass: 'text-fuchsia-300' },
  { id: 'sub-cert', name: '證照檢定', color: 'yellow', dotClass: 'bg-yellow-400', textClass: 'text-yellow-300' },
  { id: 'sub-read', name: '閱讀', color: 'sky', dotClass: 'bg-sky-400', textClass: 'text-sky-300' },
  { id: 'sub-exam', name: '考試複習', color: 'red', dotClass: 'bg-red-400', textClass: 'text-red-300' },
  { id: 'sub-self', name: '自由自習', color: 'indigo', dotClass: 'bg-indigo-400', textClass: 'text-indigo-300' },
  { id: 'sub-other', name: '其他', color: 'neutral', dotClass: 'bg-neutral-400', textClass: 'text-neutral-300' },
];

export const DEFAULT_PRESETS: CustomPreset[] = [
  { id: 'p-classic', name: '經典番茄 25m', focusSeconds: 25 * 60, shortBreakSeconds: 5 * 60, longBreakSeconds: 15 * 60, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 },
  { id: 'p-deep', name: '考研/深度 1h', focusSeconds: 60 * 60, shortBreakSeconds: 10 * 60, longBreakSeconds: 20 * 60, focusMinutes: 60, shortBreakMinutes: 10, longBreakMinutes: 20 },
  { id: 'p-exam', name: '模考實戰 1h 15m', focusSeconds: 75 * 60, shortBreakSeconds: 15 * 60, longBreakSeconds: 25 * 60, focusMinutes: 75, shortBreakMinutes: 15, longBreakMinutes: 25 },
  { id: 'p-sprint', name: '高頻衝刺 15m', focusSeconds: 15 * 60, shortBreakSeconds: 3 * 60, longBreakSeconds: 10 * 60, focusMinutes: 15, shortBreakMinutes: 3, longBreakMinutes: 10 },
  { id: 'p-quick', name: '極速短測 5m 30s', focusSeconds: 5 * 60 + 30, shortBreakSeconds: 60, longBreakSeconds: 5 * 60, focusMinutes: 5, shortBreakMinutes: 1, longBreakMinutes: 5 },
];



export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '微積分第四章：偏微分與多變數極值習題',
    subject: '數學',
    estimatedTomatoes: 3,
    completedTomatoes: 1,
    isCompleted: false,
    priority: 'high',
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 'task-2',
    title: 'TOEFL / IELTS 核心學術字彙 40 個複習',
    subject: '英文',
    estimatedTomatoes: 2,
    completedTomatoes: 2,
    isCompleted: true,
    priority: 'medium',
    createdAt: Date.now() - 1000 * 60 * 300,
    completedAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: 'task-3',
    title: '作業系統 Process Scheduling 筆記與心智圖整理',
    subject: '專業科目',
    estimatedTomatoes: 4,
    completedTomatoes: 2,
    isCompleted: false,
    priority: 'high',
    createdAt: Date.now() - 1000 * 60 * 200,
  },
  {
    id: 'task-4',
    title: '論文相關文獻 Reading：Attention Is All You Need',
    subject: '論文寫作',
    estimatedTomatoes: 3,
    completedTomatoes: 0,
    isCompleted: false,
    priority: 'medium',
    createdAt: Date.now() - 1000 * 60 * 50,
  },
];

export const INITIAL_NOTES: DistractionNote[] = [
  {
    id: 'note-1',
    content: '記得下午五點前回覆指導教授的信件',
    createdAt: Date.now() - 1000 * 60 * 45,
    isHandled: false,
  },
  {
    id: 'note-2',
    content: '圖書館借的《演算法導論》下週三到期要續借',
    createdAt: Date.now() - 1000 * 60 * 90,
    isHandled: true,
  },
];

export const STORAGE_KEYS = {
  TASKS: 'focusdesk_tasks_v1',
  SESSIONS: 'focusdesk_sessions_v1',
  NOTES: 'focusdesk_notes_v1',
  SETTINGS: 'focusdesk_settings_v1',
  ACTIVE_TASK_ID: 'focusdesk_active_task_v1',
  THEME: 'focusdesk_theme_v1',
  SUBJECTS: 'focusdesk_subjects_v1',
  PRESETS: 'focusdesk_presets_v1',
};

export function loadStoredSubjects(): CustomSubject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) return DEFAULT_SUBJECTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SUBJECTS;
  } catch {
    return DEFAULT_SUBJECTS;
  }
}

export function saveStoredSubjects(subjects: CustomSubject[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch {
    // ignore
  }
}

export function loadStoredPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!raw) return DEFAULT_PRESETS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PRESETS;
    return parsed.map((p: any) => ({
      ...p,
      focusSeconds: p.focusSeconds ?? (p.focusMinutes ? p.focusMinutes * 60 : 25 * 60),
      shortBreakSeconds: p.shortBreakSeconds ?? (p.shortBreakMinutes ? p.shortBreakMinutes * 60 : 5 * 60),
      longBreakSeconds: p.longBreakSeconds ?? (p.longBreakMinutes ? p.longBreakMinutes * 60 : 15 * 60),
    }));
  } catch {
    return DEFAULT_PRESETS;
  }
}


export function saveStoredPresets(presets: CustomPreset[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
  } catch {
    // ignore
  }
}

export function loadStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

export function loadStoredSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      // Seed with some recent sessions for realistic stats preview
      const now = Date.now();
      const dayMs = 24 * 3600 * 1000;
      return [
        { id: 's-1', timestamp: now - dayMs * 3 - 3600000, durationMinutes: 25, mode: 'pomodoro', taskTitle: '微積分練習', subject: '數學' },
        { id: 's-2', timestamp: now - dayMs * 3 - 1800000, durationMinutes: 25, mode: 'pomodoro', taskTitle: '微積分練習', subject: '數學' },
        { id: 's-3', timestamp: now - dayMs * 2 - 7200000, durationMinutes: 50, mode: 'pomodoro', taskTitle: '作業系統 Process Scheduling', subject: '專業科目' },
        { id: 's-4', timestamp: now - dayMs * 2 - 3600000, durationMinutes: 25, mode: 'pomodoro', taskTitle: '英文單字', subject: '英文' },
        { id: 's-5', timestamp: now - dayMs * 1 - 5400000, durationMinutes: 25, mode: 'pomodoro', taskTitle: '論文閱讀', subject: '論文寫作' },
        { id: 's-6', timestamp: now - dayMs * 1 - 2400000, durationMinutes: 25, mode: 'pomodoro', taskTitle: '作業系統筆記', subject: '專業科目' },
        { id: 's-7', timestamp: now - 3600000, durationMinutes: 25, mode: 'pomodoro', taskTitle: 'TOEFL 核心字彙', subject: '英文' },
        { id: 's-8', timestamp: now - 1200000, durationMinutes: 25, mode: 'pomodoro', taskTitle: 'TOEFL 核心字彙', subject: '英文' },
      ];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSessions(sessions: SessionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export function loadStoredNotes(): DistractionNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) return INITIAL_NOTES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveStoredNotes(notes: DistractionNote[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

export function loadStoredSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const pomodoroSec = parsed.pomodoroSeconds ?? (parsed.pomodoroMinutes ? parsed.pomodoroMinutes * 60 : 25 * 60);
    const shortSec = parsed.shortBreakSeconds ?? (parsed.shortBreakMinutes ? parsed.shortBreakMinutes * 60 : 5 * 60);
    const longSec = parsed.longBreakSeconds ?? (parsed.longBreakMinutes ? parsed.longBreakMinutes * 60 : 15 * 60);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      pomodoroSeconds: pomodoroSec,
      shortBreakSeconds: shortSec,
      longBreakSeconds: longSec,
      pomodoroMinutes: Math.floor(pomodoroSec / 60),
      shortBreakMinutes: Math.floor(shortSec / 60),
      longBreakMinutes: Math.floor(longSec / 60),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: PomodoroSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

