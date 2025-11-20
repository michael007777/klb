import React, { useState, useEffect, useMemo } from 'react';
import { LotteryDraw, Influencer, Prediction } from './types';
import { fetchLatestHappy8Result } from './services/geminiService';
import { LotteryBall } from './components/LotteryBall';
import { InfluencerDetail } from './components/InfluencerDetail';
import { Search, Flame, Trophy, User, RotateCw, CheckCircle2, ChevronRight } from 'lucide-react';

// --- MOCK DATA GENERATORS ---
const NAMES = ["快乐老王", "数据女神", "概率学霸", "彩票算盘", "运气爆棚", "K线大师", "复式之王", "福彩小灵通", "中奖绝缘体克星", "七星北斗"];
const TITLES = ["资深分析师", "实战派", "数据模型专家", "十年老彩民", "玄学大师", "连红记录保持者", "精算师", "社区红人", "百万得主", "图表分析师"];

// Helper to generate random numbers
const getRandomNumbers = (count: number, max: number = 80) => {
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
};

const generateMockInfluencers = (currentIssue: string): Influencer[] => {
  return NAMES.map((name, index) => {
    const history: Prediction[] = [];
    // Generate 7 past issues
    for (let i = 1; i <= 7; i++) {
      const issueNum = parseInt(currentIssue) - i;
      history.push({
        issue: issueNum.toString(),
        numbers: getRandomNumbers(12),
        hitCount: Math.floor(Math.random() * 6) + 4, // Random 4-10 hits
        prize: Math.floor(Math.random() * 5000)
      });
    }

    return {
      id: `inf-${index}`,
      name: name,
      title: TITLES[index],
      avatar: `https://picsum.photos/seed/${index + 55}/200/200`,
      tags: index % 2 === 0 ? ["稳胆", "防冷"] : ["追热", "博大奖"],
      followers: Math.floor(Math.random() * 50000) + 1000,
      winRate: Math.floor(Math.random() * 40) + 40, // 40-80%
      totalProfit: Math.floor(Math.random() * 200000),
      history: history,
      currentRecommendation: {
        description: "本期重点关注余数2的路数，防范连号。",
        numbers: getRandomNumbers(10),
        type: "选十复式"
      },
      isFollowed: false,
      likes: Math.floor(Math.random() * 500),
    };
  });
};

const App: React.FC = () => {
  const [currentDraw, setCurrentDraw] = useState<LotteryDraw | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  
  // "API" call effect
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const drawData = await fetchLatestHappy8Result();
      setCurrentDraw(drawData);
      
      // Generate influencers based on the fetched issue number
      const mockInfluencers = generateMockInfluencers(drawData.issue);
      setInfluencers(mockInfluencers);
      setLoading(false);
    };

    initData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    const drawData = await fetchLatestHappy8Result();
    setCurrentDraw(drawData);
    setLoading(false);
  };

  const toggleFollow = (id: string) => {
    setInfluencers(prev => prev.map(inf => 
      inf.id === id ? { ...inf, isFollowed: !inf.isFollowed } : inf
    ));
  };

  
  const selectedInfluencer = useMemo(() => 
    influencers.find(i => i.id === selectedInfluencerId), 
  [influencers, selectedInfluencerId]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-gray-50 shadow-2xl min-h-screen relative flex flex-col">
        
        {/* --- HEADER --- */}
        <header className="relative pt-6 pb-5 px-5 overflow-hidden">
          {/* 多层渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-red-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-red-800/20 to-transparent"></div>

          {/* 精致的装饰元素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-white/8 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-radial-gradient from-yellow-300/6 to-transparent rounded-full blur-2xl"></div>

          {/* 几何装饰线条 */}
          <div className="absolute top-1/4 right-0 w-32 h-32 border-2 border-white/8 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 border-2 border-white/6 rounded-full transform -rotate-12"></div>

          {/* 网格纹理背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_76%,transparent_77%)] bg-[length:50px_50px]"></div>

          <div className="relative z-10">
            {/* 主标题区域 */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg">快乐8达人汇</h1>
                  <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                    <span className="text-xs font-bold text-red-900">PRO</span>
                  </div>
                </div>
                <p className="text-red-50 text-sm font-medium tracking-wide">精准分析 · 智能推荐 · 实时更新</p>
              </div>
              <button
                onClick={handleRefresh}
                className="group relative bg-white/15 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/25 transition-all duration-300 border border-white/20 hover:scale-105"
              >
                <RotateCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </button>
            </div>

            {/* 最新开奖卡片 */}
            <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* 卡片装饰 */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/8 to-transparent rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm font-semibold text-white">最新开奖</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">第 {currentDraw?.issue || '---'} 期</div>
                    <div className="text-xs text-red-100">{currentDraw?.date || '...'}</div>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  {loading ? (
                    <div className="flex items-center gap-2 text-white/80">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm">获取最新数据中...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* 第一行号码 - 前10个 */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {currentDraw?.winningNumbers.slice(0, 10).map((n, index) => (
                          <div
                            key={n}
                            className="relative group animate-fadeInUp"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center text-xs font-black text-red-800 shadow-md border-2 border-yellow-200/50 transform group-hover:scale-110 transition-transform duration-200">
                              {n}
                            </div>
                            <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-sm scale-125 animate-pulse"></div>
                          </div>
                        ))}
                      </div>

                      {/* 第二行号码 - 后10个 */}
                      {currentDraw && currentDraw.winningNumbers.length > 10 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {currentDraw.winningNumbers.slice(10, 20).map((n, index) => (
                            <div
                              key={n}
                              className="relative group animate-fadeInUp"
                              style={{ animationDelay: `${(index + 10) * 30}ms` }}
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center text-xs font-black text-red-800 shadow-md border-2 border-yellow-200/50 transform group-hover:scale-110 transition-transform duration-200">
                                {n}
                              </div>
                              <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-sm scale-125 animate-pulse"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 px-4 -mt-4 z-10 space-y-4 pb-24">
          
          {/* Filters / Tags */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
             {["综合排序", "连红榜", "胜率榜", "盈利榜"].map((filter, idx) => (
               <button 
                 key={filter} 
                 className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm ${
                   idx === 0 ? 'bg-red-600 text-white' : 'bg-white text-gray-600'
                 }`}
               >
                 {filter}
               </button>
             ))}
          </div>

          {/* Influencer Feed */}
          {influencers.map((inf) => (
            <div 
              key={inf.id} 
              onClick={() => setSelectedInfluencerId(inf.id)}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-3">
                  <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-full border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-1">
                      {inf.name}
                      <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-50" />
                    </h3>
                    <p className="text-xs text-gray-500">{inf.title} • 粉丝 {(inf.followers/1000).toFixed(1)}k</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-lg font-bold text-red-600">{inf.winRate}%</div>
                   <div className="text-xs text-gray-400">近期胜率</div>
                </div>
              </div>

              {/* Tags & Stats */}
              <div className="flex gap-2 mb-4">
                 {inf.tags.map(tag => (
                   <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                     {tag}
                   </span>
                 ))}
                 <span className="ml-auto text-xs font-medium text-green-600 flex items-center bg-green-50 px-2 rounded">
                   +{(inf.totalProfit/10000).toFixed(1)}万 <span className="text-gray-400 ml-1 font-normal">盈利</span>
                 </span>
              </div>

              {/* Current Pick Teaser */}
              <div className="bg-gray-50 rounded-xl p-3 border border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">
                     第{inf.history[0].issue}期
                   </span>
                   <span className="text-xs text-red-500 font-medium flex items-center">
                     查看详情 <ChevronRight className="w-3 h-3" />
                   </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                   {inf.currentRecommendation.numbers.slice(0, 8).map(num => (
                     <LotteryBall key={num} number={num} size="sm" className="bg-white" />
                   ))}
                   {inf.currentRecommendation.numbers.length > 8 && (
                     <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                       +{inf.currentRecommendation.numbers.length - 8}
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          )}
        </main>

        {/* --- BOTTOM NAV --- */}
        <nav className="bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center fixed bottom-0 w-full max-w-md z-40 pb-safe">
          <button className="flex flex-col items-center text-red-600">
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">广场</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-red-500">
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">发现</span>
          </button>
          <div className="relative -top-5">
             <button className="bg-red-600 text-white p-4 rounded-full shadow-xl shadow-red-200 hover:scale-105 transition-transform">
               <Trophy className="w-6 h-6" />
             </button>
          </div>
          <button className="flex flex-col items-center text-gray-400 hover:text-red-500">
            <Trophy className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">排行榜</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-red-500">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">我的</span>
          </button>
        </nav>

        {/* --- DETAIL MODAL --- */}
        {selectedInfluencer && (
          <InfluencerDetail
            influencer={selectedInfluencer}
            onClose={() => setSelectedInfluencerId(null)}
            onToggleFollow={toggleFollow}
          />
        )}

      </div>
    </div>
  );
};

export default App;