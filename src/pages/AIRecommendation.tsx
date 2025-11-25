import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BarChart3,
  Clock,
  Star,
  Award,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  Copy,
  Heart
} from 'lucide-react';
import { AIRecommendation, AlgorithmInfo } from '../types/types';
import LotteryBall from '../components/LotteryBall';

const AIRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('accuracy');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 模拟算法信息
  const mockAlgorithms: AlgorithmInfo[] = [
    {
      id: 'neural_network',
      name: '深度神经网络',
      type: '机器学习',
      description: '基于多层神经网络的时间序列预测模型',
      accuracy: 82.3,
      totalPredictions: 1250,
      avgConfidence: 85.2,
      features: ['历史数据分析', '趋势识别', '模式学习']
    },
    {
      id: 'lstm',
      name: 'LSTM时序预测',
      type: '深度学习',
      description: '长短期记忆网络，专用于序列数据预测',
      accuracy: 79.8,
      totalPredictions: 980,
      avgConfidence: 82.1,
      features: ['时序模式', '长期依赖', '动态权重']
    },
    {
      id: 'ensemble',
      name: '集成学习模型',
      type: '集成方法',
      description: '多算法融合，提高预测稳定性和准确度',
      accuracy: 85.1,
      totalPredictions: 2100,
      avgConfidence: 88.3,
      features: ['多模型融合', '投票机制', '误差修正']
    },
    {
      id: 'random_forest',
      name: '随机森林',
      type: '集成学习',
      description: '基于决策树的集成算法，适合分类和回归',
      accuracy: 77.6,
      totalPredictions: 1560,
      avgConfidence: 79.4,
      features: ['特征重要性', '抗过拟合', '并行处理']
    },
    {
      id: 'svm',
      name: '支持向量机',
      type: '监督学习',
      description: '统计学习方法，寻找最优超平面分割数据',
      accuracy: 74.2,
      totalPredictions: 890,
      avgConfidence: 76.8,
      features: ['核函数', '边界优化', '高维处理']
    },
    {
      id: 'xgboost',
      name: 'XGBoost',
      type: '梯度提升',
      description: '极端梯度提升，高效的树集成算法',
      accuracy: 81.7,
      totalPredictions: 1780,
      avgConfidence: 84.1,
      features: ['正则化', '缺失值处理', '特征权重']
    }
  ];

  // 模拟推荐数据
  const mockRecommendations: AIRecommendation[] = [
    {
      id: '1',
      algorithmName: '集成学习模型',
      description: '基于多算法融合的综合分析，推荐高胜率号码组合',
      accuracy: 85.1,
      numbers: [3, 7, 12, 15, 19, 23, 28, 31, 36, 42],
      confidence: 88.3,
      risk: 'medium',
      recommendedStake: 100,
      lastWinRate: 82.4,
      totalPredictions: 2100,
      tags: ['高准确率', '推荐', '稳健'],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      algorithmName: '深度神经网络',
      description: 'AI深度学习分析历史数据，识别潜在中奖模式',
      accuracy: 82.3,
      numbers: [5, 11, 18, 22, 27, 33, 38, 41, 45, 48],
      confidence: 85.2,
      risk: 'low',
      recommendedStake: 150,
      lastWinRate: 78.9,
      totalPredictions: 1250,
      tags: ['深度学习', '低风险', '新手友好'],
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      algorithmName: 'LSTM时序预测',
      description: '基于长短期记忆网络的时序模式分析',
      accuracy: 79.8,
      numbers: [1, 9, 14, 20, 25, 30, 35, 40, 44, 47],
      confidence: 82.1,
      risk: 'low',
      recommendedStake: 80,
      lastWinRate: 75.2,
      totalPredictions: 980,
      tags: ['时序分析', '保守型', '长期稳定'],
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      algorithmName: 'XGBoost',
      description: '梯度提升算法优化，重点推荐高价值号码',
      accuracy: 81.7,
      numbers: [2, 8, 13, 17, 24, 29, 34, 39, 43, 46],
      confidence: 84.1,
      risk: 'high',
      recommendedStake: 200,
      lastWinRate: 80.1,
      totalPredictions: 1780,
      tags: ['高回报', '激进型', '专业玩家'],
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      algorithmName: '随机森林',
      description: '多决策树集成投票，平衡风险与收益',
      accuracy: 77.6,
      numbers: [4, 10, 16, 21, 26, 32, 37, 42, 48, 49],
      confidence: 79.4,
      risk: 'medium',
      recommendedStake: 120,
      lastWinRate: 73.8,
      totalPredictions: 1560,
      tags: ['平衡型', '中等风险', '稳健收益'],
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // 初始化数据
    setAlgorithms(mockAlgorithms);
    setRecommendations(mockRecommendations);
  }, []);

  // 刷新推荐
  const refreshRecommendations = async () => {
    setIsLoading(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成新的随机推荐
    const newRecommendations = mockRecommendations.map(rec => ({
      ...rec,
      numbers: Array.from({length: 10}, () => Math.floor(Math.random() * 49) + 1).sort((a, b) => a - b),
      confidence: Math.random() * 20 + 75,
      id: Date.now().toString() + Math.random()
    }));

    setRecommendations(newRecommendations);
    setIsLoading(false);
  };

  // 复制号码
  const copyNumbers = (numbers: number[], id: string) => {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 筛选和排序推荐
  const filteredAndSortedRecommendations = recommendations
    .filter(rec => selectedAlgorithm === 'all' || rec.algorithmName === algorithms.find(a => a.id === selectedAlgorithm)?.name)
    .sort((a, b) => {
      switch (sortBy) {
        case 'accuracy':
          return b.accuracy - a.accuracy;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'winRate':
          return b.lastWinRate - a.lastWinRate;
        default:
          return 0;
      }
    });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low':
        return '低风险';
      case 'medium':
        return '中风险';
      case 'high':
        return '高风险';
      default:
        return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 优化布局，包含筛选器 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* 头部标题和刷新按钮 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">AI智能推荐</h1>
                  <p className="text-blue-100 text-xs sm:text-sm hidden xs:block">基于大数据分析的最优号码组合</p>
                </div>
              </div>
            </div>
            {/* 刷新按钮 - 小图标样式 */}
            <button
              onClick={refreshRecommendations}
              disabled={isLoading}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
              title="刷新推荐"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* 筛选器 - 集成到头部区域内 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-blue-100" />
              <span className="text-sm font-medium text-blue-100">筛选</span>
            </div>

            {/* 筛选选项 - 两列布局，适配白色背景 */}
            <div className="grid grid-cols-2 gap-3">
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="px-3 py-2 bg-white/90 border border-white/20 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white backdrop-blur-sm w-full"
              >
                <option value="all">所有算法</option>
                {algorithms.map(algorithm => (
                  <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/90 border border-white/20 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white backdrop-blur-sm w-full"
              >
                <option value="accuracy">按准确率排序</option>
                <option value="confidence">按置信度排序</option>
                <option value="winRate">按胜率排序</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* 推荐列表 */}
        <div className="space-y-3 sm:space-y-4">
          {filteredAndSortedRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-3 sm:p-4">
                {/* Header - 移动端优化 */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{recommendation.algorithmName}</h3>
                      {/* 心形收藏按钮 - 移动到标题右侧 */}
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">{recommendation.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                      {recommendation.tags.map((tag, index) => (
                        <span key={index} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 参数展示 - 移动端优化 */}
                    <div className="bg-gray-50 rounded-lg p-2 mb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">准确率:</span>
                          <span className="font-bold text-blue-600">{recommendation.accuracy}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">置信度:</span>
                          <span className="font-bold text-green-600">{recommendation.confidence}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">胜率:</span>
                          <span className="font-bold text-purple-600">{recommendation.lastWinRate}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">投注:</span>
                          <span className="font-bold text-orange-600">¥{recommendation.recommendedStake}</span>
                        </div>
                      </div>
                    </div>

                    {/* 号码展示 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">推荐号码组合</span>
                        <button
                          onClick={() => copyNumbers(recommendation.numbers, recommendation.id)}
                          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          {copiedId === recommendation.id ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {recommendation.numbers.map((number) => (
                          <LotteryBall key={number} number={number} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer - 移动端优化 */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t gap-2">
                  <div className="flex items-center space-x-2 xs:space-x-3">
                    <span>总预测: {recommendation.totalPredictions}次</span>
                    <span className="hidden xs:inline">更新: {new Date(recommendation.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 text-yellow-500" />
                    <span>AI认证</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredAndSortedRecommendations.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐数据</h3>
            <p className="text-gray-500">请尝试调整筛选条件或刷新推荐</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationPage;