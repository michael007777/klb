import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LotteryDraw } from '../types';
import { getLatestLotteryResults } from '../services/lotteryService';
import BannerCarousel from '../components/BannerCarousel';

// 生成选九复试的12个号码
const generatePick9Numbers = (winningNumbers: number[]): number[] => {
  const numbers: number[] = [];

  // 添加8个中奖号码
  const selectedWinningNumbers = winningNumbers.slice(0, 8);
  numbers.push(...selectedWinningNumbers);

  // 添加4个非中奖号码
  while (numbers.length < 12) {
    const num = Math.floor(Math.random() * 80) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
};

// 生成模拟期号数据
const generateMockIssues = (currentIssue: string): LotteryDraw[] => {
  const issues: LotteryDraw[] = [];
  const currentNum = parseInt(currentIssue);

  // 生成最近30期的数据
  for (let i = 0; i < 30; i++) {
    const issueNum = currentNum - i;
    const date = new Date();
    date.setDate(date.getDate() - i);

    // 生成20个开奖号码
    const winningNumbers: number[] = [];
    while (winningNumbers.length < 20) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num);
      }
    }
    winningNumbers.sort((a, b) => a - b);

    issues.push({
      issue: issueNum.toString(),
      date: date.toISOString().split('T')[0],
      winningNumbers
    });
  }

  return issues;
};

const IssueList: React.FC = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<LotteryDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      setLoading(true);
      try {
        console.log('正在加载开奖数据...');
        const lotteryIssues = await getLatestLotteryResults(30);
        console.log(`成功加载 ${lotteryIssues.length} 期数据`);
        setIssues(lotteryIssues);
      } catch (error) {
        console.error('加载开奖数据失败:', error);
        // 如果真实数据失败，使用模拟数据
        try {
          const currentDraw = await getLatestLotteryResults(1);
          if (currentDraw.length > 0) {
            const mockIssues = generateMockIssues(currentDraw[0].issue);
            setIssues(mockIssues);
          }
        } catch (fallbackError) {
          console.error('模拟数据也失败:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  // 直接显示所有期号数据，无需过滤
  const displayIssues = issues;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                    <div key={j} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Promotional Banner - 精美轮播组件 */}
      <div className="max-w-4xl mx-auto p-4">
        <BannerCarousel />
      </div>

      {/* Issues List Container */}
      <div className="max-w-4xl mx-auto px-4 pb-4">

        {/* Issues List */}
        <div className="space-y-3">
          {displayIssues.map((issue) => (
            <div
              key={issue.issue}
              onClick={() => navigate(`/issue/${issue.issue}`)}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              {/* Issue Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">第 {issue.issue} 期</h3>
                  <p className="text-sm text-gray-500">{issue.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">查看详情</div>
                  <div className="text-xs text-gray-400">专家推荐</div>
                </div>
              </div>

              {/* Winning Numbers Display - 20个完整展示，每行10个 */}
              <div className="space-y-1">
                {/* 第一行：前10个号码 */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {issue.winningNumbers.slice(0, 10).map((num, index) => (
                    <div
                      key={`row1-${num}`}
                      className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border border-red-700/20"
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                {/* 第二行：后10个号码 */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {issue.winningNumbers.slice(10, 20).map((num, index) => (
                    <div
                      key={`row2-${num}`}
                      className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border border-red-700/20"
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>

              {/* 专属推荐区域 */}
              <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-700">🎯 专属推荐</span>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">选九复试</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-600">¥ 5,280</div>
                    <div className="text-xs text-gray-500">获奖金额</div>
                  </div>
                </div>

                {/* 选九复试12个号码展示 - 一行布局 */}
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-2">12个号码 (8个中标红):</div>
                  <div className="flex justify-center items-center gap-1 px-1">
                    {(() => {
                      const pick9Numbers = generatePick9Numbers(issue.winningNumbers);
                      return pick9Numbers.map((num, index) => {
                        const isWinning = issue.winningNumbers.includes(num);
                        return (
                          <div
                            key={`pick9-${num}`}
                            className={`w-5 h-5 flex items-center justify-center text-[10px] font-semibold transition-all hover:scale-110 flex-shrink-0 border rounded-full ${
                              isWinning
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg ring-2 ring-amber-300/50 border-amber-600 animate-pulse'
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                            }`}
                          >
                            {num.toString().padStart(2, '0')}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* 推荐说明 */}
                <div className="mt-2 text-xs text-gray-600 flex items-center justify-between">
                  <span>💡 精选12个号码，复式投注</span>
                  <span className="text-purple-600 font-medium">命中8/20</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default IssueList;