import React, { useState } from 'react';
import { Influencer } from '../types';
import { X, UserPlus, Trophy, TrendingUp, DollarSign, Lock } from 'lucide-react';
import { StatsChart } from './StatsChart';
import { LotteryBall } from './LotteryBall';

interface InfluencerDetailProps {
  influencer: Influencer;
  onClose: () => void;
  onToggleFollow: (id: string) => void;
}

export const InfluencerDetail: React.FC<InfluencerDetailProps> = ({
  influencer,
  onClose,
  onToggleFollow
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 生成下一期推荐号码（模拟）
  const nextRecommendation = [3, 8, 15, 23, 31, 42, 56, 64, 71, 79];

  // 模糊处理函数 - 仅显示前3个号码，其余加锁
  const blurNumbers = (numbers: number[]) => {
    return numbers.map((num, index) => {
      // 仅显示前3个号码，其余显示为?
      if (index >= 3) {
        return '?';
      }
      return num;
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">达人详情</h2>
        <button 
          onClick={() => onToggleFollow(influencer.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            influencer.isFollowed 
              ? 'bg-gray-100 text-gray-600 border border-gray-200' 
              : 'bg-red-600 text-white shadow-lg shadow-red-200'
          }`}
        >
          {influencer.isFollowed ? '已关注' : '+ 关注'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={influencer.avatar} 
              alt={influencer.name} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-full border-2 border-white">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <h1 className="mt-3 text-xl font-bold text-gray-900">{influencer.name}</h1>
          <p className="text-sm text-red-500 font-medium">{influencer.title}</p>
          
          <div className="flex gap-2 mt-2">
            {influencer.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm text-center">
            <div className="flex justify-center mb-1 text-red-500"><Trophy size={18} /></div>
            <p className="text-xl font-bold text-gray-900">{influencer.winRate}%</p>
            <p className="text-xs text-gray-500">近期胜率</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm text-center">
            <div className="flex justify-center mb-1 text-green-500"><DollarSign size={18} /></div>
            <p className="text-xl font-bold text-gray-900">{(influencer.totalProfit / 10000).toFixed(1)}w</p>
            <p className="text-xs text-gray-500">累计盈利</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm text-center">
            <div className="flex justify-center mb-1 text-blue-500"><UserPlus size={18} /></div>
            <p className="text-xl font-bold text-gray-900">{(influencer.followers / 1000).toFixed(1)}k</p>
            <p className="text-xs text-gray-500">粉丝数</p>
          </div>
        </div>

        {/* Chart Section */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-red-500" />
            走势分析
          </h3>
          <StatsChart history={influencer.history} />
        </div>

        {/* Current Recommendation */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-2xl border border-red-100">
          <div className="flex justify-between items-center mb-3">
             <h3 className="text-base font-bold text-red-800">本期推荐 ({influencer.history[0].issue})</h3>
             <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-md">
               {influencer.currentRecommendation.type}
             </span>
          </div>
          <p className="text-sm text-gray-600 mb-4 italic">
            “{influencer.currentRecommendation.description}”
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {influencer.currentRecommendation.numbers.map((num) => (
              <div key={num} className="w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm border border-red-700 border-opacity-20">
                {num}
              </div>
            ))}
          </div>
          
        </div>

        {/* Next Issue Recommendation */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-2xl border border-purple-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-purple-800">下期推荐 (20241138期)</h3>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-md">
              选十复式
            </span>
          </div>

          {/* 号码显示区域 */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {(isUnlocked ? nextRecommendation : blurNumbers(nextRecommendation)).map((num, index) => (
              <div key={index} className="relative">
                <div className={`w-5 h-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm border border-purple-700 border-opacity-20 ${!isUnlocked && index >= 3 ? 'opacity-50 blur-sm' : ''}`}>
                  {num}
                </div>
                {!isUnlocked && index >= 3 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 解锁按钮 */}
          {!isUnlocked && (
            <div className="text-center">
              <button
                onClick={() => setIsUnlocked(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 mx-auto"
              >
                <Lock className="w-5 h-5" />
                解锁完整推荐号码
              </button>
              <p className="text-xs text-gray-500 mt-2">
                🔒 仅需 ¥9.9 解锁今日精准推荐
              </p>
              <p className="text-xs text-gray-400 mt-1">
                已有 2,847 人解锁并获得推荐
              </p>
            </div>
          )}

          {/* 解锁后显示的内容 */}
          {isUnlocked && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-green-800 font-medium">
                  ✅ 已解锁完整推荐！祝您中奖！
                </p>
              </div>
              <p className="text-xs text-gray-500">
                推荐号码有效期至 2024-11-22 19:30
              </p>
            </div>
          )}
        </div>

        {/* Historical Table */}
        <div>
           <h3 className="text-base font-bold text-gray-800 mb-3">历史战绩</h3>
           <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500">
                 <tr>
                   <th className="p-3 font-medium">期号</th>
                   <th className="p-3 font-medium">推荐类别</th>
                   <th className="p-3 font-medium text-center">命中</th>
                   <th className="p-3 font-medium text-right">奖金</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {influencer.history.map((item) => (
                   <tr key={item.issue}>
                     <td className="p-3 text-gray-600">{item.issue}</td>
                     <td className="p-3 text-gray-500">选十复式</td>
                     <td className="p-3 text-center font-bold text-red-600">{item.hitCount}/10</td>
                     <td className="p-3 text-right text-gray-900 font-mono">¥{item.prize}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};