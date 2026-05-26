import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Laptop, Smartphone, Wifi, TrendingUp, TrendingDown, Package, Plus, Calculator, RefreshCw, Sun, CloudRain, Wind, Droplets, Volume2, Bot, Sparkles } from 'lucide-react';

export default function EcosystemCommandCenter({ rainActive }) {
  const { 
    addXP, 
    walletBalance, 
    deadlines, 
    sleepHours, 
    bolosCounters, 
    logistics, 
    characterTitle, 
    characterLevel, 
    addToast 
  } = useCharacter();

  // --- 1. DEVICE ECOSYSTEM SIMULATED STATES ---
  const [phoneBattery, setPhoneBattery] = useState(85);
  const [laptopBattery, setLaptopBattery] = useState(60);
  const [phoneOnline, setPhoneOnline] = useState(true);
  const [wifiSignal, setWifiSignal] = useState('STRONG');

  // --- 2. ADVANCED BONUS SYSTEMS: AI & BRIEFING ---
  const [aiResponse, setAiResponse] = useState('👋 Halo! Klik tombol di bawah untuk meminta nasihat finansial dan akademik dari AI Advisor pribadi kosanmu.');
  const [isGenerating, setIsGenerating] = useState(false);

  const speakBriefing = () => {
    if (!('speechSynthesis' in window)) {
      addToast("❌ Fitur voice briefing tidak didukung di browser ini.");
      return;
    }
    window.speechSynthesis.cancel();
    
    const activeTasks = deadlines.filter(d => !d.completed).length;
    const weatherText = rainActive ? "hujan lofi syahdu sedang turun" : "cuaca luar kamar cerah maksimal";
    
    const textToSpeak = `Halo master! Selamat hari ini. Berikut laporan singkat untuk kamu. Baterai laptop kamu ${laptopBattery} persen, dan baterai handphone kamu ${phoneBattery} persen. Keadaan ${weatherText}. Kamu memiliki ${activeTasks} tugas penting yang harus diselesaikan, dan sisa saldo dompet kamu adalah ${walletBalance} rupiah. Jangan mager, tetap produktif!`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    
    window.speechSynthesis.speak(utterance);
    addToast("🔊 Memutar Briefing Suara Harian...");
  };

  const generateAiAdvice = () => {
    setIsGenerating(true);
    addXP(15);
    setTimeout(() => {
      let adviceLines = [];
      
      if (walletBalance < 300000) {
        adviceLines.push("💸 DOMPET TINGGAL " + walletBalance.toLocaleString() + " IDR! Tolong batasi nongkrong kopi susu. Saatnya bersahabat akrab dengan mie instan akhir bulan.");
      } else {
        adviceLines.push("💰 Saldo kamu Rp " + walletBalance.toLocaleString() + " terpantau aman dan sehat walafiat. Boleh jajan tapi jangan langsung habis sekali checkout Shopee ya!");
      }

      const activeDeadlines = deadlines.filter(d => !d.completed);
      if (activeDeadlines.length > 0) {
        adviceLines.push("📚 PANGGILAN AMBIS: Kamu punya " + activeDeadlines.length + " tugas belum kelar! Tugas '" + activeDeadlines[0].title + "' lagi nungguin disentuh. Tutup sosmed sekarang!");
      } else {
        adviceLines.push("🏆 Luar biasa! Semua tugas akademik bersih mengkilap. Kamu resmi menjadi Slayer Mager kelas elit.");
      }

      const highSkips = bolosCounters.filter(b => b.skipped >= b.max - 1);
      if (highSkips.length > 0) {
        adviceLines.push("⚠️ WARNING JANGAN BOLOS: Matkul '" + highSkips[0].subject + "' sisa jatah bolosnya sisa " + (highSkips[0].max - highSkips[0].skipped) + " slot! Sekali lagi bolos auto drop out.");
      }

      if (sleepHours < 6) {
        adviceLines.push("😴 Jam tidur kamu cuma " + sleepHours + " jam kemarin? Kurang istirahat menurunkan fokus kerja kamu. Tidur siang 20 menit gih.");
      }

      if (logistics.galon < 30) {
        adviceLines.push("💧 Sisa air galon kosan tinggal " + logistics.galon + "%! Tolong order galon baru sebelum dehidrasi menyerang.");
      }

      const selected = adviceLines[Math.floor(Math.random() * adviceLines.length)];
      setAiResponse(selected);
      setIsGenerating(false);
      addToast("🧠 AI Advisor selesai menganalisis kondisi kosanmu!");
    }, 1000);
  };

  // Simulate subtle battery drain / fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneBattery(prev => {
        const next = prev + (Math.random() > 0.7 ? -1 : 0);
        return next < 5 ? 100 : next;
      });
      setLaptopBattery(prev => {
        const next = prev + (Math.random() > 0.8 ? -1 : 0);
        return next < 5 ? 100 : next;
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleDeviceSync = () => {
    addXP(10);
  };

  // --- 3. LIVE MARKET TICKERS SIMULATED STATES ---
  const [btcPrice, setBtcPrice] = useState(94250);
  const [btcChange, setBtcChange] = useState(3.42);
  const [fearGreed, setFearGreed] = useState(68); // Greed

  useEffect(() => {
    const marketTimer = setInterval(() => {
      setBtcPrice(prev => {
        const delta = (Math.random() - 0.48) * 150;
        return Math.round(prev + delta);
      });
    }, 4000);
    return () => clearInterval(marketTimer);
  }, []);

  // BEP Calculator State
  const [buyPrice, setBuyPrice] = useState(92000);
  const [feeRate, setFeeRate] = useState(0.1);
  const [bepResult, setBepResult] = useState(0);

  const calculateBep = () => {
    const buyPriceNum = Number(buyPrice);
    const feeRateNum = Number(feeRate) / 100;
    const result = buyPriceNum * (1 + feeRateNum * 2);
    setBepResult(Math.round(result));
    addXP(5);
  };

  // --- 4. SHOPPING & PACKAGE TIMELINE ---
  const [packages, setPackages] = useState([
    { id: 1, name: 'Buku Pemrograman React', courier: 'J&T Express', code: 'JP88320491', status: 'ON THE WAY', lastLocation: 'Bandung Hub' },
    { id: 2, name: 'Mouse Wireless Silent Click', courier: 'SiCepat', code: 'REG29938102', status: 'DELIVERED', lastLocation: 'Kosan Kamar 3' },
  ]);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgCourier] = useState('J&T Express');

  const handleAddPackage = (e) => {
    e.preventDefault();
    if (!newPkgName.trim()) return;
    const newPkg = {
      id: Date.now(),
      name: newPkgName,
      courier: newPkgCourier,
      code: `EXP${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'ON THE WAY',
      lastLocation: 'Sorting Center Jakarta'
    };
    setPackages(prev => [newPkg, ...prev]);
    setNewPkgName('');
    addXP(15);
  };

  return (
    <div className="glass-card-no-hover p-6 md:p-8 flex flex-col gap-6 md:gap-8 border border-white/85">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2.5 uppercase tracking-wide font-sans">
          <Laptop className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
          ECOSYSTEM & MARKET COMMAND TOWER
        </h3>
        <button 
          onClick={handleDeviceSync}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer active:scale-95 text-slate-600 flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ================= ADVANCED SYSTEMS GRID (DAILY BRIEFING & AI ADVISOR) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DAILY BRIEFING CARD */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50/60 border border-indigo-100 p-5 rounded-3xl flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 text-7xl opacity-5 select-none pointer-events-none font-sans font-black">Cozy</div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                DAILY BRIEFING STATION
              </span>
              <button 
                onClick={speakBriefing}
                className="p-2 bg-white hover:bg-indigo-50 border border-indigo-200/50 rounded-2xl text-indigo-600 active:scale-95 transition-all shadow-sm flex items-center gap-1 text-[10px] font-bold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Listen Briefing
              </button>
            </div>
            
            <h4 className="text-sm font-black text-slate-850 mb-2">Good Day, {characterTitle} (Lvl {characterLevel})! ☀️</h4>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Baterai laptop Anda berada di level <strong>{laptopBattery}%</strong>, ponsel Anda <strong>{phoneBattery}%</strong>. Keadaan di luar saat ini {rainActive ? '🌧️ sedang hujan lofi syahdu.' : '☀️ terpantau cerah bersahabat.'} Ada <strong>{deadlines.filter(d => !d.completed).length} tugas penting</strong> akademik menanti sentuhan magis Anda.
            </p>
          </div>
          
          <div className="text-[9px] font-mono font-bold text-slate-400 border-t border-slate-200/60 pt-2.5">
            STATUS: 100% OFFLINE-LOCAL INTELLIGENCE ACTIVE
          </div>
        </div>

        {/* AI ADVISOR & FINANCIAL COCKPIT */}
        <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/50 border border-emerald-100 p-5 rounded-3xl flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-2 top-2 text-indigo-500/10"><Sparkles className="w-12 h-12" /></div>
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-3">
              <Bot className="w-3.5 h-3.5" />
              INTELLIGENT AI ADVISOR
            </span>
            
            <div className="bg-white/80 border border-emerald-100 p-3.5 rounded-2xl text-xs font-semibold text-slate-700 leading-relaxed shadow-sm min-h-16 flex items-center">
              {isGenerating ? (
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  MENGANALISIS DATA KOSAN...
                </div>
              ) : aiResponse}
            </div>
          </div>

          <button 
            onClick={generateAiAdvice}
            disabled={isGenerating}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black tracking-wider uppercase font-mono transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Analyze & Advice Me! (+15 XP)
          </button>
        </div>

      </div>


      {/* ================= REAL-TIME WEATHER STATION COCKPIT ================= */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50/50 border border-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-md shrink-0 select-none animate-bounce">
            {rainActive ? '🌧️' : '☀️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-800">
                {rainActive ? 'Rainy Lofi Ambient' : 'Cerah Ceria Cozy'}
              </span>
              <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded uppercase ${rainActive ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                {rainActive ? 'Outdoor Chill' : 'Laundry Time'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              {rainActive 
                ? '🌧️ Hujan lofi sedang turun. Sempurna untuk tarik selimut, seduh kopi hangat, dan pura-pura produktif di kamar kos.' 
                : '☀️ Cuaca luar kamar cerah maksimal! Buruan jemur baju kosan sebelum sore tiba dan mendung menyergap!'}
            </p>
          </div>
        </div>
        
        {/* Weather statistics telemetry */}
        <div className="flex gap-5 shrink-0 border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Temperature</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">
              {rainActive ? '22°C' : '30°C'}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Humidity</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block flex items-center justify-center gap-1">
              <Droplets className="w-4 h-4 text-blue-400" />
              {rainActive ? '88%' : '52%'}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Wind Speed</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block flex items-center justify-center gap-1">
              <Wind className="w-4 h-4 text-slate-400" />
              {rainActive ? '14 km/h' : '6 km/h'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* ================= SECTION A: DEVICE ECOSYSTEM ================= */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest font-sans flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-brand-500" />
            A. Device Ecosystem Logs
          </h4>

          <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-4">
            {/* Phone Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-brand-500/10 rounded-xl text-brand-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Xiaomi 13 Pro</div>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {phoneOnline ? '🟢 ONLINE (KDE CONNECT)' : '🔴 OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm md:text-base font-black text-slate-850">{phoneBattery}%</div>
                <div className="w-16 bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${phoneBattery}%` }} />
                </div>
              </div>
            </div>

            {/* Laptop Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-brand-500/10 rounded-xl text-brand-600">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">MacBook Air M2</div>
                  <span className="text-xs font-bold text-slate-400 font-mono">🟢 HOST DEVICE</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm md:text-base font-black text-slate-850">{laptopBattery}%</div>
                <div className="w-16 bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${laptopBattery}%` }} />
                </div>
              </div>
            </div>

            {/* WiFi Logs */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono">
                <Wifi className="w-4 h-4 text-blue-500" />
                WIFI: KOS_ANAK_AMBIS_5G
              </div>
              <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-mono uppercase">
                {wifiSignal}
              </span>
            </div>

            {/* Simulated manual disconnect toggle */}
            <button 
              onClick={() => {
                setPhoneOnline(!phoneOnline);
              }}
              className="w-full mt-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider font-mono active:scale-95 transition-all cursor-pointer"
            >
              Toggle KDE Connect Sync
            </button>
          </div>
        </div>

        {/* ================= SECTION B: LIVE MARKET ENGINE ================= */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest font-sans flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            B. Live Market watch
          </h4>

          <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-4">
            {/* BTC simulated ticker */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 font-mono">BTC / USDT (BINANCE)</span>
                <div className="text-base md:text-lg font-black text-slate-900">${btcPrice.toLocaleString()}</div>
              </div>
              <span className={`text-xs font-black px-2 py-0.5 rounded font-mono flex items-center gap-0.5 ${btcChange >= 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                {btcChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {btcChange}%
              </span>
            </div>

            {/* Fear & Greed bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                <span>Fear & Greed Index</span>
                <span className="text-indigo-650 font-black">{fearGreed} - Greed 🔥</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full" style={{ width: `${fearGreed}%` }} />
              </div>
            </div>

            {/* Quick BEP Calculator widget */}
            <div className="pt-3 border-t border-slate-200/50 flex flex-col gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                Quick Crypto BEP Calculator
              </span>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-1/2 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                  placeholder="Buy Price"
                />
                <button 
                  onClick={calculateBep}
                  className="w-1/2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Calc Target
                </button>
              </div>
              {bepResult > 0 && (
                <div className="text-xs font-bold text-slate-700 font-mono text-center mt-1">
                  🎯 Exit target for BEP: <strong className="text-brand-600">${bepResult}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= SECTION C: PACKAGES SHIPPINGS ================= */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest font-sans flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            C. Package & shippings timeline
          </h4>

          <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-4">
            {/* Input Form for Mock package */}
            <form onSubmit={handleAddPackage} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Belanja apa hari ini..." 
                value={newPkgName}
                onChange={(e) => setNewPkgName(e.target.value)}
                className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
              />
              <button 
                type="submit" 
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* List packages with timelines */}
            <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
              {packages.map(pkg => (
                <div key={pkg.id} className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col gap-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-bold text-slate-800 truncate max-w-[130px]">{pkg.name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase ${pkg.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse'}`}>
                      {pkg.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold font-mono">
                    <span>{pkg.courier} • {pkg.code}</span>
                    <span className="text-slate-650 font-bold">{pkg.lastLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
