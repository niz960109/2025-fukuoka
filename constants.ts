

import { DayPlan, FlightInfo, HotelInfo, Activity, SavedSpot } from './types';

export const FLIGHTS: FlightInfo[] = [
  { type: 'Dep', date: '11/28 (五)', code: 'BR102', route: '16:25 台北 TPE ➝ 19:55 福岡 FUK' },
  { type: 'Arr', date: '12/01 (一)', code: 'BR101', route: '20:55 福岡 FUK ➝ 22:40 台北 TPE' },
];

export const HOTELS: HotelInfo[] = [
  { dates: '11/28 (第1晚)', name: 'Band Hotel 博多', area: '近博多車站筑紫口', url: 'https://www.google.com/maps/search/?api=1&query=Band+Hotel+Hakata' },
  { dates: '11/29 (第2晚)', name: '三井花園飯店福岡中洲', area: '中洲川端站', url: 'https://www.google.com/maps/search/?api=1&query=Mitsui+Garden+Hotel+Fukuoka+Nakasu' },
  { dates: '11/30 (第3晚)', name: 'Hotel Il Palazzo', area: '春吉 (近中洲)', url: 'https://www.google.com/maps/search/?api=1&query=Hotel+Il+Palazzo+Fukuoka' },
];

export const SAVED_SPOTS: SavedSpot[] = [
  {
    id: 'spot-il-palazzo',
    name: 'Hotel Il Palazzo',
    description: 'Aldo Rossi 在日本的代表作。外觀如神殿般的無窗立面，內部經過重新設計，是後現代主義建築經典。',
    url: 'https://goo.gl/maps/IlPalazzo',
    lat: 33.5891,
    lng: 130.4068,
    architect: 'Aldo Rossi'
  },
  {
    id: 'spot-acros',
    name: 'ACROS 福岡',
    description: 'Emilio Ambasz 設計的「綠色階梯山」，將建築與公園融為一體。',
    url: 'https://goo.gl/maps/ACROS',
    lat: 33.5900,
    lng: 130.4015,
    architect: 'Emilio Ambasz'
  },
  {
    id: 'spot-dazaifu-sb',
    name: '星巴克 太宰府天滿宮表參道店',
    description: '隈研吾運用傳統「地獄組」木結構，創造出流動的空間感。',
    url: 'https://goo.gl/maps/StarbucksDazaifu',
    lat: 33.5209,
    lng: 130.5332,
    architect: '隈研吾 (Kengo Kuma)'
  },
  {
    id: 'spot-dazaifu',
    name: '太宰府天滿宮 (臨時本殿)',
    description: '藤本壯介設計的「漂浮森林」。在本殿整修期間的臨時居所，屋頂種滿植物。',
    url: 'https://goo.gl/maps/Dazaifu',
    lat: 33.5215,
    lng: 130.5349,
    architect: '藤本壯介 (Sou Fujimoto)'
  },
  {
    id: 'spot-museum',
    name: '九州國立博物館',
    description: '菊竹清訓作品。巨大的藍色流線屋頂，象徵著海洋與山的波動。',
    url: 'https://goo.gl/maps/KyushuNationalMuseum',
    lat: 33.5196,
    lng: 130.5385,
    architect: '菊竹清訓 (Kiyonori Kikutake)'
  },
  {
    id: 'spot-art-museum',
    name: '福岡市美術館',
    description: '前川國男晚年代表作。紅褐色磁磚與拱形天花板，展現穩重的現代主義風格。',
    url: 'https://goo.gl/maps/FukuokaArtMuseum',
    lat: 33.5848,
    lng: 130.3789,
    architect: '前川國男 (Kunio Maekawa)'
  },
  {
    id: 'spot-city-museum',
    name: '福岡市博物館',
    description: '前川國男設計。宏偉的拱門與玻璃帷幕，與福岡塔相呼應。',
    url: 'https://goo.gl/maps/FukuokaCityMuseum',
    lat: 33.5898,
    lng: 130.3490,
    architect: '前川國男 (Kunio Maekawa)'
  },
  {
    id: 'spot-fukuoka-tower',
    name: '福岡塔',
    description: '日建設計作品。8000片半反射玻璃覆蓋的「光之塔」。',
    url: 'https://goo.gl/maps/FukuokaTower',
    lat: 33.5932,
    lng: 130.3515,
    architect: '日建設計 (Nikken Sekkei)'
  },
  {
    id: 'spot-nexus',
    name: 'Nexus World',
    description: '集合住宅群，建築大師 Rem Koolhaas 與 Steven Holl 的早期實驗性作品。',
    url: 'https://goo.gl/maps/NexusWorld',
    lat: 33.6595,
    lng: 130.4190,
    architect: 'Rem Koolhaas, Steven Holl 等'
  },
  {
    id: 'spot-hakata',
    name: '博多車站 (Hakata Station)',
    description: '九州交通樞紐，聖誕市集與購物中心所在地。',
    url: 'https://goo.gl/maps/HakataStation',
    lat: 33.5897,
    lng: 130.4207
  },
  {
    id: 'spot-futamigaura',
    name: '糸島 夫婦岩',
    description: '白色鳥居與夕陽絶景。',
    url: 'https://goo.gl/maps/Futamigaura',
    lat: 33.6425,
    lng: 130.1989
  }
];

export const DAY_1: DayPlan = {
  id: 'day1',
  date: '11/28',
  weekday: '五',
  weather: 'cloudy',
  weatherTemp: '12°C',
  activities: [
    {
      id: 'd1-1', type: 'transport', time: '19:55 - 21:00', title: '抵達福岡 & 飯店 Check-in',
      description: 'BR102 抵達福岡。搭乘計程車前往博多站飯店放行李。',
      guideTips: '出關預留1小時，計程車招呼站位於國內線航廈前（需搭接駁車）。',
      tags: [{ type: 'tip', label: '計程車約¥1500' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Band+Hotel+Hakata',
    },
    {
      id: 'd1-2', type: 'food', time: '21:00 - 22:00', title: '晚餐：博多烏龍麵',
      description: '因幡うどん (Inaba Udon)。博多烏龍麵口感軟綿溫潤，適合搭機後享用，不傷胃。',
      openingHours: '至 23:00',
      mustTry: ['牛蒡天婦羅烏龍麵 (ごぼう天うどん)', '稻荷壽司'],
      tags: [{ type: 'food', label: '在地老店' }],
    },
    {
      id: 'd1-3', type: 'spot', time: '22:00 - 22:30', title: '博多車站聖誕市集',
      description: '欣賞站前廣場燈飾 (光之街)，感受日本的聖誕氣氛。',
      openingHours: '至 24:00',
      mustTry: ['熱紅酒 (附馬克杯)', '吉拿棒'],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Hakata+Station+Christmas+Market',
    }
  ]
};

export const DAY_2: DayPlan = {
  id: 'day2',
  date: '11/29',
  weekday: '六',
  weather: 'sunny',
  weatherTemp: '14°C',
  activities: [
    {
      id: 'd2-1', type: 'transport', time: '09:00 - 09:40', title: '前往太宰府',
      description: '搭乘旅人號巴士或西鐵電車前往太宰府。',
      guideTips: '若搭西鐵，可注意是否搭到「旅人」觀光列車，車廂有特殊彩繪。',
      tags: [{ type: 'info', label: '西鐵太宰府站' }],
    },
    {
      id: 'd2-info-1', type: 'info', time: '順遊', title: '收集：太宰府水溝蓋卡',
      description: '地點：太宰府觀光案內所 (太宰府車站內)。',
      openingHours: '09:00 - 17:00',
      guideTips: '進站後左手邊，直接向櫃檯詢問「Manhole Card」。',
      tags: [{ type: 'card', label: '水溝蓋卡' }],
    },
    {
      id: 'd2-2', type: 'spot', time: '10:00 - 11:30', title: '太宰府天滿宮',
      description: '參觀藤本壯介設計的「臨時本殿」(漂浮森林)，屋頂種滿植物，非常特別。',
      openingHours: '06:30 - 18:30',
      mustTry: ['梅枝餅 (參道上任選一家現烤的)'],
      guideTips: '摸御神牛的頭可以長智慧。',
      tags: [{ type: 'spot', label: '藤本壯介' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dazaifu+Tenmangu',
    },
    {
      id: 'd2-3', type: 'spot', time: '11:30 - 12:00', title: '表參道星巴克',
      description: '隈研吾設計。運用傳統「地獄組」木結構，不用釘子接合，從內部延伸至街道。',
      openingHours: '08:00 - 20:00',
      tags: [{ type: 'spot', label: '隈研吾' }],
      guideTips: '店內座位不多，建議外帶拍照即可。'
    },
    {
      id: 'd2-sub-1', type: 'spot', time: '順遊', title: '建築：九州國立博物館',
      description: '菊竹清訓設計。巨大的藍色屋頂與玻璃帷幕，映照周圍山景。可走「虹之隧道」手扶梯前往。',
      openingHours: '09:30 - 17:00',
      tags: [{ type: 'spot', label: '菊竹清訓' }],
    },
    {
      id: 'd2-4', type: 'buy', time: '14:30 - 16:30', title: '天神商圈 & ACROS 福岡',
      description: '逛街前先看建築：ACROS 福岡 (Emilio Ambasz)。著名的階梯狀綠建築，可從公園側拍照。',
      openingHours: '10:00 - 20:00',
      souvenirs: ['岩田屋百貨', '茅乃舍高湯包', 'Press Butter Sand'],
      tags: [{ type: 'spot', label: 'Emilio Ambasz' }, { type: 'buy', label: '岩田屋' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=ACROS+Fukuoka',
    },
    {
      id: 'd2-info-2', type: 'info', time: '順遊', title: '收集：福岡市水溝蓋卡 (A款)',
      description: '地點：福岡市觀光案內所 (天神 Lion Plaza)。設計：遊艇與博多仁和加面具。',
      openingHours: '09:30 - 19:00',
      tags: [{ type: 'card', label: '水溝蓋卡' }],
    },
    {
      id: 'd2-5', type: 'food', time: '18:30 - 20:00', title: '晚餐：EEL EIGHT 鰻魚飯',
      description: '中洲川端附近的優雅鰻魚料理，環境舒適適合長輩。',
      openingHours: '11:00 - 21:00',
      highlight: true,
      reservationNote: '★ 已預約 18:30 (Name: Chen)',
      mustTry: ['鰻魚飯三吃 (Hitsumabushi)', '白燒鰻魚'],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=EEL+EIGHT+Fukuoka',
    },
    {
      id: 'd2-6', type: 'transport', time: '20:30', title: '入住：三井花園飯店',
      description: '位於中洲，有大浴場可以放鬆。',
      tags: [{ type: 'tip', label: '記得帶飯店卡去大浴場' }],
    }
  ]
};

export const DAY_3: DayPlan = {
  id: 'day3',
  date: '11/30',
  weekday: '日',
  weather: 'cloudy',
  weatherTemp: '15°C',
  activities: [
    {
      id: 'd3-1', type: 'spot', time: '10:00 - 12:00', title: '麵包超人兒童博物館',
      description: '位於博多 Riverain Mall 5樓 (日建設計)。適合拍照與購買限定商品。',
      openingHours: '10:00 - 17:00',
      souvenirs: ['博物館限定紅豆麵包', '角色造型氣球'],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fukuoka+Anpanman+Children\'s+Museum',
    },
    {
      id: 'd3-2', type: 'food', time: '12:30 - 13:30', title: 'Pain Stock 麵包店 (箱崎本店)',
      description: '福岡評價最高的麵包店，被譽為「日本最好吃的明太法國」。',
      openingHours: '10:00 - 18:00',
      mustTry: ['明太法國麵包 (Mentaiko France)', '蜂蜜吐司'],
      tags: [{ type: 'food', label: '排隊名店' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Pain+Stock+Stock',
    },
    {
      id: 'd3-arch-1', type: 'spot', time: '順遊', title: '建築：Nexus World (香椎)',
      description: '就在 Pain Stock 車程10分處。Rem Koolhaas 與 Steven Holl 設計的集合住宅群，清水模愛好者必看。',
      guideTips: '此為住宅區，請保持安靜，僅在外圍參觀。',
      tags: [{ type: 'spot', label: 'Rem Koolhaas' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Nexus+World+Fukuoka',
    },
    {
      id: 'd3-3', type: 'spot', time: '15:00 - 17:00', title: '福岡塔 & 博物館區',
      description: '搭車跨越海灣前往百道濱。福岡塔 (日建設計) 與一旁的福岡市博物館 (前川國男) 形成強烈對比。',
      openingHours: '09:30 - 22:00',
      tags: [{ type: 'spot', label: '前川國男' }, { type: 'spot', label: '日建設計' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fukuoka+City+Museum',
    },
    {
      id: 'd3-4', type: 'spot', time: '18:00', title: 'Check-in: Hotel Il Palazzo',
      description: '★ 建築巡禮重點：Aldo Rossi 的大師之作。無窗的紅褐色立面，如神殿般莊嚴。內部剛完成翻新，是傳奇的設計飯店。',
      highlight: true,
      guideTips: 'Check-in 大廳位於二樓，設計非常前衛，記得拍照。',
      tags: [{ type: 'spot', label: 'Aldo Rossi' }, { type: 'info', label: '換飯店' }],
      locationUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Il+Palazzo',
    },
    {
      id: 'd3-5', type: 'food', time: '19:00', title: '晚餐：春吉/中洲周邊',
      description: '飯店位於春吉，周圍有很多時髦的居酒屋與餐廳。',
      mustTry: ['博多一口餃子', '串燒'],
      tags: [{ type: 'food', label: '居酒屋' }],
    }
  ]
};

export const DAY_4_COMMON: Activity[] = [
  {
    id: 'd4-info-1', type: 'info', time: '順遊', title: '收集：福岡市水溝蓋卡 (B款)',
    description: '地點：博多站觀光案內所 (博多口)。設計：博多織圖騰。',
    openingHours: '08:00 - 21:00',
    tags: [{ type: 'card', label: '水溝蓋卡' }],
  },
  {
    id: 'd4-common-1', type: 'buy', time: '14:30 - 15:30', title: '博多車站最後採買',
    description: '購買伴手禮 (努努雞、博多通饅頭)，領取水溝蓋卡後前往機場。',
    openingHours: '09:00 - 21:00',
    souvenirs: ['博多通饅頭 (必買)', '努努雞 (冷炸雞)', 'Menbei (明太仙貝)'],
    tags: [{ type: 'buy', label: '伴手禮' }],
  },
  {
    id: 'd4-common-2', type: 'transport', time: '16:00 (出發)', title: '前往機場 (FUK)',
    description: '搭計程車去機場。Check-in 後逛國內線航廈。',
    openingHours: '開櫃: 前 2.5 小時',
    guideTips: '國內線航廈比國際線好逛，有時間可以先去國內線買「福砂屋」。',
    souvenirs: ['福砂屋長崎蛋糕', 'Royce 巧克力洋芋片'],
  }
];

export const DAY_4_OPTION_A: Activity[] = [
  {
    id: 'd4-a-1', type: 'spot', time: '10:00 - 12:30', title: '大濠公園 & 美術館',
    description: '參觀福岡市美術館 (前川國男)。紅褐色磁磚外牆與拱形天花板是其特色。館外有草間彌生南瓜。',
    openingHours: '09:30 - 17:30',
    mustTry: ['館內咖啡廳：大濠公園景色'],
    tags: [{ type: 'spot', label: '前川國男' }, { type: 'food', label: '湖畔星巴克' }],
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fukuoka+Art+Museum',
  },
  {
    id: 'd4-a-sub-1', type: 'spot', time: '順遊', title: '周邊：大濠公園能樂堂',
    description: '傳統能劇舞台建築，結構優雅。',
    tags: [{ type: 'spot', label: '傳統建築' }],
  }
];

export const DAY_4_OPTION_B: Activity[] = [
  {
    id: 'd4-b-1', type: 'spot', time: '09:30 - 13:00', title: '糸島 夫婦岩',
    description: '白色鳥居與絕美海景 (建議包車)。',
    openingHours: '全天開放',
    highlight: true,
    mustTry: ['糸島布丁 (海鹽口味)', 'Current 咖啡'],
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sakurai+Futamigaura',
    souvenirs: ['手工海鹽', '當地醬油']
  },
  {
    id: 'd4-b-sub-1', type: 'spot', time: '順遊', title: '周邊：糸島之顏 (Arts)',
    description: '海邊有很多有趣的裝置藝術與咖啡廳建築。',
    tags: [{ type: 'spot', label: '拍照點' }],
  }
];
