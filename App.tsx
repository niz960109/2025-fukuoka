import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Info, PieChart as PieChartIcon, Plane, Hotel, Phone, Map, Plus, Trash2, X, ArrowRightLeft, Wallet, MapPin, Users, Bookmark, Navigation, Languages, ExternalLink, CreditCard, Banknote, Landmark, Share2, Download, Upload, Copy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

import { DAY_1, DAY_2, DAY_3, DAY_4_COMMON, DAY_4_OPTION_A, DAY_4_OPTION_B, FLIGHTS, HOTELS, SAVED_SPOTS } from './constants';
import ItineraryCard from './components/ItineraryCard';
import DayHeader from './components/DayHeader';
import { DayPlan, Expense, ExpenseCategory, SavedSpot, PaymentMethod } from './types';

// Tab Definitions
type Tab = 'itinerary' | 'info' | 'budget' | 'translate';

const EXCHANGE_RATE = 0.215;

const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; color: string }> = {
  food: { label: '餐飲', color: '#37352F' },
  transport: { label: '交通', color: '#9A9A9A' },
  buy: { label: '購物', color: '#D3D3D3' },
  other: { label: '其他', color: '#E0E0E0' },
};

const PRESET_PHRASES = [
  {
    label: '不懂日文',
    cn: '不好意思，我不會說日文。',
    jp: 'すみません、日本語が話せません。',
    romaji: 'Sumimasen, Nihongo ga hanasemasen.'
  },
  {
    label: '飲食禁忌',
    cn: '我不要蔥、薑、蒜，謝謝。',
    jp: 'ネギ、ショウガ、ニンニクは入れないでください。',
    romaji: 'Negi, Shouga, Ninniku wa irenaide kudasai.'
  },
  {
    label: '尋找廁所',
    cn: '請問廁所在哪裡？',
    jp: 'お手洗いはどこですか？',
    romaji: 'Otearai wa doko desu ka?'
  },
  {
    label: '詢問價格',
    cn: '請問這個多少錢？',
    jp: 'これはいくらですか？',
    romaji: 'Kore wa ikura desu ka?'
  },
  {
    label: '詢問免稅',
    cn: '請問這個有免稅嗎？',
    jp: 'これは免税（Tax Free）になりますか？',
    romaji: 'Kore wa menzei ni narimasu ka?'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');
  const [day4Option, setDay4Option] = useState<'A' | 'B'>('A');

  // Accordion State: Keep track of which days are expanded. Default Day 1 is open.
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    'day1': true
  });

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  // --- Spending Tracker State ---
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('trip_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isAddMode, setIsAddMode] = useState(false);
  const [newExpense, setNewExpense] = useState<{ title: string; amount: string; category: ExpenseCategory; paymentMethod: PaymentMethod }>({
    title: '',
    amount: '',
    category: 'food',
    paymentMethod: 'cash'
  });

  // Export/Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDataString, setImportDataString] = useState('');

  // --- Currency Converter State ---
  const [converterJpy, setConverterJpy] = useState<string>('');

  // --- Translation State ---
  const [translateText, setTranslateText] = useState('');
  const [translateMode, setTranslateMode] = useState<'jp-tw' | 'tw-jp'>('jp-tw');

  // --- Distance Check State ---
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [distanceMessages, setDistanceMessages] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // --- Real-time Weather State ---
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [showLiveWeather, setShowLiveWeather] = useState(false);

  // Fetch Weather from Open-Meteo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=33.5902&longitude=130.4017&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo');
        const data = await response.json();
        if (data && data.daily) {
          const forecast = data.daily.time.map((date: string, index: number) => ({
            date,
            code: data.daily.weather_code[index],
            tempMax: data.daily.temperature_2m_max[index],
            tempMin: data.daily.temperature_2m_min[index],
          }));
          setWeatherForecast(forecast);
        }
      } catch (error) {
        console.error("Failed to fetch weather", error);
      }
    };
    fetchWeather();
  }, []);

  // Persist Expenses
  useEffect(() => {
    localStorage.setItem('trip_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Derived Budget Data
  const { totalSpent, chartData } = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const categoryTotals: Record<string, number> = { food: 0, transport: 0, buy: 0, other: 0 };
    expenses.forEach(item => {
      categoryTotals[item.category] += item.amount;
    });

    const data = Object.entries(categoryTotals)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: CATEGORY_CONFIG[key as ExpenseCategory].label,
        value,
        color: CATEGORY_CONFIG[key as ExpenseCategory].color
      }));

    return { totalSpent: total, chartData: data };
  }, [expenses]);

  const day4: DayPlan = {
    id: 'day4',
    date: '12/01',
    weekday: '一',
    weather: 'cloudy',
    weatherTemp: '13°C',
    activities: [
      ...(day4Option === 'A' ? DAY_4_OPTION_A : DAY_4_OPTION_B),
      ...DAY_4_COMMON
    ]
  };

  const allDays = [DAY_1, DAY_2, DAY_3, day4];

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) return;
    const amount = parseInt(newExpense.amount, 10);
    if (isNaN(amount)) return;

    const item: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount,
      category: newExpense.category,
      paymentMethod: newExpense.paymentMethod,
      date: new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })
    };

    setExpenses([item, ...expenses]);
    setNewExpense({ title: '', amount: '', category: 'food', paymentMethod: 'cash' });
    setIsAddMode(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('確定要刪除此紀錄嗎?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleExportData = () => {
    const data = JSON.stringify(expenses);
    navigator.clipboard.writeText(data).then(() => {
      alert("✅ 帳本資料已複製！\n\n請切換到 Line 或微信，貼上傳送給家人。\n家人複製後，點選「匯入資料」即可同步。");
    }).catch(() => {
      alert("複製失敗，請手動選取複製");
    });
  };

  const handleImportData = () => {
    try {
      if (!importDataString) return;
      const parsed = JSON.parse(importDataString);
      if (Array.isArray(parsed)) {
        if (confirm("⚠️ 注意：匯入將會「完全覆蓋」目前手機上的資料。\n\n確定要執行嗎？")) {
          setExpenses(parsed);
          setShowImportModal(false);
          setImportDataString('');
          alert("✅ 資料匯入成功！");
        }
      } else {
        alert("格式錯誤：請確認貼上的是完整的 [...] 格式內容");
      }
    } catch (e) {
      alert("無效的資料格式，請重新複製");
    }
  };

  const handleTranslate = () => {
    if (!translateText) return;
    const sl = translateMode === 'jp-tw' ? 'ja' : 'zh-TW';
    const tl = translateMode === 'jp-tw' ? 'zh-TW' : 'ja';
    const url = `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(translateText)}&op=translate`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已複製日文！');
  };

  // --- Distance Calculation ---
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c;
  };

  const checkProximity = (spot: SavedSpot) => {
    setLoadingStates(prev => ({ ...prev, [spot.id]: true }));
    setDistanceMessages(prev => {
        const newMap = { ...prev };
        delete newMap[spot.id];
        return newMap;
    });

    if (!navigator.geolocation) {
      setDistanceMessages(prev => ({ ...prev, [spot.id]: '您的瀏覽器不支援定位功能。' }));
      setLoadingStates(prev => ({ ...prev, [spot.id]: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        
        const dist = calculateDistance(latitude, longitude, spot.lat, spot.lng);
        setLoadingStates(prev => ({ ...prev, [spot.id]: false }));
        
        let msg = '';
        if (dist < 2) { 
          if (spot.architect) {
             msg = `📍 建築迷注意！\n您已接近 ${spot.architect} 的作品 (${dist.toFixed(1)} km)`;
          } else {
             msg = `快到了！距離約 ${dist.toFixed(1)} 公里`;
          }
        } else {
          msg = `距離約 ${dist.toFixed(1)} 公里`;
        }
        setDistanceMessages(prev => ({ ...prev, [spot.id]: msg }));
      },
      (error) => {
        setLoadingStates(prev => ({ ...prev, [spot.id]: false }));
        setDistanceMessages(prev => ({ ...prev, [spot.id]: '無法獲取目前位置。' }));
        console.error(error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#37352F] pb-28 selection:bg-[#E3E3E3]">
      
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-xl mb-4 flex items-center text-[#37352F]">
              <Upload size={24} className="mr-3" /> 匯入家人帳本
            </h3>
            <p className="text-base text-[#787774] mb-4">
              請貼上家人傳來的「代碼文字」：
            </p>
            <textarea
              className="w-full border border-[#E9E9E9] bg-[#F9F9F8] rounded-lg p-3 text-sm font-mono h-32 mb-4 focus:ring-2 focus:ring-[#37352F] focus:outline-none"
              value={importDataString}
              onChange={e => setImportDataString(e.target.value)}
              placeholder='範例: [{"id":"1732...", "title":"拉麵" ...}]'
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-5 py-2.5 rounded-lg text-base text-[#787774] hover:bg-[#F1F1EF] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleImportData}
                className="px-5 py-2.5 rounded-lg text-base bg-[#37352F] text-white font-bold hover:bg-black transition-colors"
              >
                確認匯入
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
        
        {/* Page Icon & Title */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex justify-center md:justify-start mb-4">
            <div className="p-4 bg-[#F1F1EF] rounded-2xl text-[#37352F] shadow-sm border border-[#E9E9E9]">
              <Map size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#37352F] mb-4 tracking-tight">福岡優雅之旅 2025</h1>
          
          <div className="flex flex-col md:flex-row items-center md:items-start text-[#787774] text-base space-y-2 md:space-y-0 md:space-x-8 border-b border-[#E9E9E9] pb-8">
             <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>2025/11/28 - 12/01</span>
             </div>
             <div className="flex items-center">
                <Users size={18} className="mr-2" />
                <span>家族旅行 (孝親行)</span>
             </div>
          </div>
        </div>
        
        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="animate-fade-in">
            {/* Live Weather Toggle */}
            <div className="flex justify-end mb-4">
               <button 
                 onClick={() => setShowLiveWeather(!showLiveWeather)}
                 className={`text-sm px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-2 font-medium ${showLiveWeather ? 'bg-black text-white border-black' : 'text-[#787774] border-[#E9E9E9] bg-white hover:bg-[#F1F1EF]'}`}
               >
                 {showLiveWeather ? 'Live 天氣 (Demo)' : '顯示即時天氣'}
               </button>
            </div>

            {allDays.map((day, index) => (
              <div key={day.id} className="mb-4">
                <DayHeader 
                  dayIndex={index + 1}
                  date={day.date}
                  weekday={day.weekday}
                  weather={day.weather}
                  weatherTemp={day.weatherTemp}
                  realTimeWeather={showLiveWeather && weatherForecast[index] ? weatherForecast[index] : undefined}
                  isOpen={expandedDays[day.id]}
                  onToggle={() => toggleDay(day.id)}
                />
                
                {/* Collapsible Content */}
                {expandedDays[day.id] && (
                  <div className="animate-fade-in pl-2 md:pl-0">
                    {/* Day 4 Option Switcher */}
                    {index === 3 && (
                      <div className="mb-6 p-1 bg-[#F1F1EF] rounded-lg inline-flex border border-[#E9E9E9]">
                        <button 
                          onClick={() => setDay4Option('A')}
                          className={`px-4 py-2 text-sm rounded-md transition-all ${day4Option === 'A' ? 'bg-white shadow-sm text-[#37352F] font-bold' : 'text-[#787774] hover:bg-black/5'}`}
                        >
                          方案 A: 大濠公園
                        </button>
                        <button 
                          onClick={() => setDay4Option('B')}
                          className={`px-4 py-2 text-sm rounded-md transition-all ${day4Option === 'B' ? 'bg-white shadow-sm text-[#37352F] font-bold' : 'text-[#787774] hover:bg-black/5'}`}
                        >
                          方案 B: 夫婦岩
                        </button>
                      </div>
                    )}

                    <div className="space-y-4 border-l-2 border-[#F1F1EF] pl-4 ml-4 md:ml-6 md:pl-6 pb-8">
                      {day.activities.map(activity => (
                        <ItineraryCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TRANSLATE TAB */}
        {activeTab === 'translate' && (
          <div className="animate-fade-in pt-4 space-y-10">
             {/* Translation Tool */}
            <div className="bg-white p-6 rounded-xl border border-[#E9E9E9] shadow-sm">
               <h3 className="text-xl font-bold mb-4 flex items-center text-[#37352F]">
                <Languages className={`mr-3 w-6 h-6 text-[#37352F]`} /> Google 翻譯小幫手
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <button 
                      onClick={() => setTranslateMode('jp-tw')}
                      className={`flex-1 text-sm py-2 rounded-lg border ${translateMode === 'jp-tw' ? 'bg-[#37352F] border-[#37352F] text-white font-bold shadow-sm' : 'border-[#E9E9E9] text-[#787774]'}`}
                    >
                      日文 → 中文
                    </button>
                    <ArrowRightLeft size={18} className="text-[#787774]" />
                    <button 
                      onClick={() => setTranslateMode('tw-jp')}
                      className={`flex-1 text-sm py-2 rounded-lg border ${translateMode === 'tw-jp' ? 'bg-[#37352F] border-[#37352F] text-white font-bold shadow-sm' : 'border-[#E9E9E9] text-[#787774]'}`}
                    >
                      中文 → 日文
                    </button>
                 </div>
                 <textarea 
                   value={translateText}
                   onChange={(e) => setTranslateText(e.target.value)}
                   placeholder={translateMode === 'jp-tw' ? "輸入看不懂的日文..." : "輸入想對日本人說的話..."}
                   className="w-full p-4 rounded-lg border border-[#E9E9E9] text-base focus:outline-none focus:ring-2 focus:ring-[#37352F] bg-[#F9F9F8]"
                   rows={4}
                 />
                 <button 
                   onClick={handleTranslate}
                   className="w-full bg-white text-[#37352F] border border-[#37352F] py-3 rounded-lg text-base font-bold hover:bg-[#F1F1EF] flex items-center justify-center transition-colors"
                 >
                   <span>前往 Google 翻譯</span>
                   <ExternalLink size={18} className="ml-2" />
                 </button>
              </div>
            </div>

            {/* Quick Phrases */}
            <div>
               <h3 className="text-2xl font-bold mb-6 flex items-center text-[#37352F]">
                <Users className={`mr-3 w-6 h-6 text-[#37352F]`} /> 實用句型 (敬語)
              </h3>
              <div className="grid gap-6">
                {PRESET_PHRASES.map((item, index) => (
                  <div key={index} className="border border-[#E9E9E9] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm font-bold text-[#787774] bg-[#F1F1EF] px-3 py-1 rounded-md inline-block">
                        {item.label}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(item.jp)}
                        className="text-[#787774] hover:text-[#37352F] p-2 rounded-lg hover:bg-[#F1F1EF] transition-colors"
                        title="複製日文"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                    
                    <h4 className="text-lg text-[#37352F] mb-2 font-medium">{item.cn}</h4>
                    <p className="text-xl md:text-2xl font-bold text-[#37352F] mb-2">{item.jp}</p>
                    <p className="text-sm text-[#787774] font-mono">{item.romaji}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="animate-fade-in pt-4 space-y-10">
            
            {/* Flights Block */}
            <div className="bg-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-[#37352F]">
                <Plane className={`mr-3 w-6 h-6 text-[#37352F]`} /> 航班資訊
              </h3>
              <div className="border border-[#E9E9E9] rounded-xl overflow-hidden">
                {FLIGHTS.map((f, i) => (
                  <div key={i} className="flex flex-col md:flex-row p-5 border-b border-[#E9E9E9] last:border-0 hover:bg-[#F7F7F5] transition-colors">
                     <div className="w-20 font-bold text-xl text-[#37352F] mb-2 md:mb-0">{f.code}</div>
                     <div className="flex-1">
                        <div className="text-lg font-bold mb-2">{f.route}</div>
                        <div className="text-sm text-[#787774] bg-[#F1F1EF] inline-block px-2 py-1 rounded">{f.type === 'Dep' ? '去程' : '回程'} • {f.date}</div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels Block */}
            <div className="bg-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-[#37352F]">
                <Hotel className={`mr-3 w-6 h-6 text-[#37352F]`} /> 住宿資訊
              </h3>
              <div className="grid gap-6">
                {HOTELS.map((h, i) => (
                  <div key={i} className="border border-[#E9E9E9] rounded-xl p-6 hover:bg-[#F7F7F5] transition-colors relative group">
                    <div className="text-sm font-bold text-[#787774] uppercase tracking-wide mb-2">{h.dates}</div>
                    <h4 className="font-bold text-xl md:text-2xl mb-2">{h.name}</h4>
                    <p className="text-base text-[#787774] mb-4">{h.area}</p>
                    <a href={h.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-[#37352F] hover:underline bg-[#F1F1EF] px-3 py-2 rounded-lg">
                      <Map size={16} className="mr-2" /> 查看地圖
                    </a>
                  </div>
                ))}
              </div>
            </div>

             {/* Saved Spots Block */}
             <div className="bg-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-[#37352F]">
                <Bookmark className={`mr-3 w-6 h-6 text-[#37352F]`} /> 景點 & 距離提醒
              </h3>
              <div className="space-y-6">
                {SAVED_SPOTS.map((spot) => (
                  <div key={spot.id} className={`border rounded-xl p-6 bg-[#F9F9F8] relative overflow-hidden transition-all ${spot.architect ? 'border-[#37352F] shadow-sm' : 'border-[#E9E9E9]'}`}>
                    
                    {spot.architect && (
                      <div className="absolute top-0 right-0 bg-[#37352F] text-white text-xs px-3 py-1 rounded-bl-lg flex items-center shadow-sm z-10 font-bold">
                        <Landmark size={12} className="mr-1.5" />
                        建築巡禮
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="pr-16">
                         <h4 className="font-bold text-xl mb-2 flex items-center">
                            {spot.name}
                            {spot.architect && <Landmark size={18} className="ml-2 text-[#787774]" />}
                         </h4>
                         {spot.architect && (
                            <div className="inline-block bg-[#F1F1EF] text-[#37352F] text-sm px-2 py-1 rounded border border-[#E9E9E9] mb-3 font-medium">
                               Architect: {spot.architect}
                            </div>
                         )}
                         <p className="text-base text-[#787774] mb-4 leading-relaxed">{spot.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <a href={spot.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold bg-white border border-[#E9E9E9] px-4 py-2 rounded-lg hover:bg-[#F1F1EF] transition-colors">
                        <Navigation size={16} className="mr-2" /> 開啟地圖
                      </a>
                      
                      <button 
                        onClick={() => checkProximity(spot)}
                        disabled={loadingStates[spot.id]}
                        className="inline-flex items-center text-sm font-bold bg-[#37352F] text-white border border-[#37352F] px-4 py-2 rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50"
                      >
                        <MapPin size={16} className="mr-2" /> 
                        {loadingStates[spot.id] ? '定位中...' : '檢查距離'}
                      </button>
                    </div>
                    
                    {distanceMessages[spot.id] && (
                      <div className="mt-4 text-sm font-bold text-[#37352F] bg-white p-4 rounded-lg border border-[#E9E9E9] whitespace-pre-line animate-fade-in shadow-sm">
                        {distanceMessages[spot.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Block */}
            <div className="bg-[#F9F9F8] rounded-xl p-6 border border-[#E9E9E9]">
              <h3 className="text-xl font-bold mb-4 flex items-center text-[#37352F]">
                <Phone className="mr-3 w-6 h-6 text-[#37352F]" /> 緊急聯絡
              </h3>
              <div className="space-y-3 text-base text-[#37352F]">
                <div className="flex justify-between border-b border-[#E9E9E9] pb-3">
                  <span>台灣福岡辦事處</span>
                  <span className="font-mono font-bold text-lg">080-1002-2003</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>警察 / 救護車</span>
                  <span className="font-mono font-bold text-lg">110 / 119</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <div className="animate-fade-in pt-4 space-y-10">
            
            {/* Currency Converter Callout */}
            <div className="bg-[#F9F9F8] p-6 rounded-xl border border-[#E9E9E9]">
               <div className="flex items-center mb-6 text-[#787774] font-bold text-sm uppercase tracking-wider">
                 <ArrowRightLeft size={18} className={`mr-2 text-[#37352F]`} />
                 匯率換算 (匯率: {EXCHANGE_RATE})
               </div>
               <div className="flex items-end gap-6">
                 <div className="flex-1">
                   <label className="text-sm font-bold text-[#787774] mb-2 block">日幣 (JPY)</label>
                   <input 
                     type="number" 
                     value={converterJpy}
                     onChange={(e) => setConverterJpy(e.target.value)}
                     className="w-full bg-white border border-[#E9E9E9] rounded-lg px-4 py-3 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-[#37352F]"
                     placeholder="0"
                   />
                 </div>
                 <div className="pb-4 text-[#787774]">→</div>
                 <div className="flex-1">
                   <label className="text-sm font-bold text-[#787774] mb-2 block">台幣 (TWD)</label>
                   <div className="w-full bg-white border border-[#E9E9E9] rounded-lg px-4 py-3 text-2xl font-mono text-[#37352F]">
                     {converterJpy ? Math.round(parseInt(converterJpy) * EXCHANGE_RATE).toLocaleString() : '0'}
                   </div>
                 </div>
               </div>
            </div>

            {/* Budget Overview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center text-[#37352F]">
                  <Wallet className={`mr-3 w-6 h-6 text-[#37352F]`} /> 總支出
                </h3>
                
                {/* Data Sharing Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleExportData}
                    className="flex items-center text-sm font-bold text-[#787774] border border-[#E9E9E9] px-3 py-2 rounded-lg bg-white hover:bg-[#F1F1EF] transition-colors"
                  >
                    <Download size={16} className="mr-2" /> 匯出
                  </button>
                  <button 
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center text-sm font-bold text-[#787774] border border-[#E9E9E9] px-3 py-2 rounded-lg bg-white hover:bg-[#F1F1EF] transition-colors"
                  >
                    <Upload size={16} className="mr-2" /> 匯入
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 mb-8">
                <div className="flex-1 border border-[#E9E9E9] rounded-xl p-6 bg-[#F9F9F8]">
                   <div className="text-sm font-bold text-[#787774] mb-2 uppercase tracking-wide">目前累積 (JPY)</div>
                   <div className="text-4xl font-mono font-bold">¥{totalSpent.toLocaleString()}</div>
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="h-64 w-full border border-[#E9E9E9] rounded-xl p-4 bg-white mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #E9E9E9', fontSize: '14px', padding: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Expense List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold">支出明細</h3>
                 <button 
                   onClick={() => setIsAddMode(!isAddMode)}
                   className="text-base bg-[#37352F] text-white px-5 py-2.5 rounded-full shadow-md hover:bg-black/80 transition-colors flex items-center font-bold"
                 >
                   {isAddMode ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
                   {isAddMode ? '取消' : '記一筆'}
                 </button>
              </div>

              {isAddMode && (
                 <div className="mb-8 p-6 bg-[#F9F9F8] rounded-xl border border-[#E9E9E9] shadow-sm animate-fade-in">
                    <div className="space-y-6">
                      {/* Title Input */}
                      <div>
                        <label className="text-sm font-bold text-[#787774] mb-2 block">項目名稱</label>
                        <input 
                          type="text" 
                          className="w-full bg-white border border-[#E9E9E9] rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#37352F]"
                          placeholder="例如: 一蘭拉麵, 計程車"
                          value={newExpense.title}
                          onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                        />
                      </div>

                      {/* Amount & Category */}
                       <div className="flex gap-4">
                         <div className="flex-1">
                           <label className="text-sm font-bold text-[#787774] mb-2 block">金額 (日幣)</label>
                           <input 
                             type="number" 
                             className="w-full bg-white border border-[#E9E9E9] rounded-lg px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#37352F]"
                             placeholder="¥"
                             value={newExpense.amount}
                             onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                           />
                         </div>
                         <div className="w-1/3">
                           <label className="text-sm font-bold text-[#787774] mb-2 block">分類</label>
                           <select 
                             className="w-full h-[54px] bg-white border border-[#E9E9E9] rounded-lg px-3 text-base focus:outline-none"
                             value={newExpense.category}
                             onChange={e => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
                           >
                             {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                               <option key={key} value={key}>{config.label}</option>
                             ))}
                           </select>
                         </div>
                       </div>
                       
                       {/* Payment Method Selection */}
                       <div>
                         <label className="text-sm font-bold text-[#787774] mb-2 block">付款方式</label>
                         <div className="flex gap-3 text-base">
                           <button 
                             onClick={() => setNewExpense({...newExpense, paymentMethod: 'cash'})}
                             className={`flex-1 flex items-center justify-center py-3 border rounded-lg transition-all ${newExpense.paymentMethod === 'cash' ? 'bg-white border-[#37352F] text-[#37352F] font-bold shadow-sm' : 'bg-white border-[#E9E9E9] text-[#787774]'}`}
                           >
                              <Banknote size={20} className="mr-2" /> 現金 (Cash)
                           </button>
                           <button 
                             onClick={() => setNewExpense({...newExpense, paymentMethod: 'card'})}
                             className={`flex-1 flex items-center justify-center py-3 border rounded-lg transition-all ${newExpense.paymentMethod === 'card' ? 'bg-white border-[#37352F] text-[#37352F] font-bold shadow-sm' : 'bg-white border-[#E9E9E9] text-[#787774]'}`}
                           >
                              <CreditCard size={20} className="mr-2" /> 刷卡 (Card)
                           </button>
                         </div>
                       </div>

                       <button 
                         onClick={handleAddExpense}
                         className="w-full bg-[#37352F] text-white py-4 rounded-lg text-lg font-bold hover:bg-black/90 shadow-md mt-2"
                       >
                         儲存紀錄
                       </button>
                    </div>
                 </div>
              )}

              <div className="border-t border-[#E9E9E9]">
                {expenses.length === 0 ? (
                   <div className="py-16 text-center text-[#787774]">
                     <div className="mb-3 text-4xl">📝</div>
                     <div className="text-base">尚未有支出紀錄</div>
                   </div>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between py-5 border-b border-[#E9E9E9] hover:bg-[#F9F9F8] px-3 transition-colors group">
                       <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-4`} style={{ backgroundColor: CATEGORY_CONFIG[expense.category].color }}></div>
                          <div>
                            <div className="font-bold text-lg flex items-center text-[#37352F] mb-1">
                              {expense.title}
                            </div>
                            <div className="flex items-center text-sm text-[#787774] space-x-3">
                              <span>{expense.date}</span>
                              <span className="border-l border-[#E9E9E9] pl-3 flex items-center">
                                {expense.paymentMethod === 'card' ? <CreditCard size={14} className="mr-1.5" /> : <Banknote size={14} className="mr-1.5" />}
                                {expense.paymentMethod === 'card' ? 'Card' : 'Cash'}
                              </span>
                            </div>
                          </div>
                       </div>
                       <div className="flex items-center">
                          <span className="font-mono text-lg font-bold mr-6 text-[#37352F]">¥{expense.amount.toLocaleString()}</span>
                          <button 
                            onClick={() => handleDeleteExpense(expense.id)} 
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="刪除"
                          >
                            <Trash2 size={20} />
                          </button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Bottom Nav (Minimal) */}
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#E9E9E9] rounded-full shadow-2xl px-8 py-3 flex gap-10 z-50">
          <button 
            onClick={() => handleTabChange('itinerary')}
            className={`flex flex-col items-center p-1 transition-colors ${activeTab === 'itinerary' ? 'text-[#37352F]' : 'text-[#787774] hover:text-[#37352F]'}`}
          >
            <Calendar size={28} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
          </button>
          <button 
            onClick={() => handleTabChange('translate')}
            className={`flex flex-col items-center p-1 transition-colors ${activeTab === 'translate' ? 'text-[#37352F]' : 'text-[#787774] hover:text-[#37352F]'}`}
          >
            <Languages size={28} strokeWidth={activeTab === 'translate' ? 2.5 : 2} />
          </button>
          <button 
            onClick={() => handleTabChange('info')}
            className={`flex flex-col items-center p-1 transition-colors ${activeTab === 'info' ? 'text-[#37352F]' : 'text-[#787774] hover:text-[#37352F]'}`}
          >
            <Info size={28} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
          </button>
          <button 
            onClick={() => handleTabChange('budget')}
            className={`flex flex-col items-center p-1 transition-colors ${activeTab === 'budget' ? 'text-[#37352F]' : 'text-[#787774] hover:text-[#37352F]'}`}
          >
            <PieChartIcon size={28} strokeWidth={activeTab === 'budget' ? 2.5 : 2} />
          </button>
      </nav>

    </div>
  );
}

export default App;