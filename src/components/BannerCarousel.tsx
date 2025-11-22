import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Trophy, Zap, Crown, Target, Flame } from 'lucide-react';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  badge?: string;
  stats: {
    label: string;
    value: string;
  }[];
  cta: {
    text: string;
    action: () => void;
  };
}

const BannerCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 精美的banner内容 - 统一风格的双幻灯片
  const slides: BannerSlide[] = [
    {
      id: 1,
      title: "🌟 专家精选推荐",
      subtitle: "十年资深分析师",
      description: "汇聚行业顶尖专家，为您推荐高胜率号码组合",
      icon: Crown,
      bgColor: "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500",
      badge: "HOT",
      stats: [
        { label: "精选专家", value: "12位" },
        { label: "算法模型", value: "AI+6" },
        { label: "推荐组合", value: "86组" }
      ],
      cta: {
        text: "查看专家精选",
        action: () => handleExpertClick()
      }
    },
    {
      id: 2,
      title: "🎯 智能推荐号组",
      subtitle: "AI大数据分析",
      description: "基于深度学习算法，分析历史开奖规律，智能推荐最优号码组合",
      icon: Target,
      bgColor: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500",
      badge: "NEW",
      stats: [
        { label: "算法模型", value: "AI+6" },
        { label: "预测准确率", value: "82.3%" },
        { label: "推荐组合", value: "120组" }
      ],
      cta: {
        text: "获取推荐号组",
        action: () => handleRecommendationClick()
      }
    }
  ];

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4秒切换

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleExpertClick = () => {
    // 滚动到专家推荐区域或跳转
    window.scrollTo({
      top: document.querySelector('.expert-section')?.getBoundingClientRect().top || 800,
      behavior: 'smooth'
    });
  };

  const handleRecommendationClick = () => {
    // 跳转到推荐号组页面
    console.log('跳转到推荐号组');
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="relative w-full h-56 sm:h-60 md:h-64 lg:h-72 overflow-hidden rounded-2xl shadow-2xl">
      {/* Main Banner Container */}
      <div className="relative h-full">
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${currentSlideData.bgColor} transition-all duration-700 ease-in-out`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:w-64 bg-white/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-36 sm:w-40 md:w-48 h-36 sm:h-40 md:w-48 bg-white/6 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:w-32 bg-white/4 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 md:p-6 lg:p-8 text-white">
          {/* Top Content */}
          <div className="flex-1 flex flex-col justify-center">
  
            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 leading-tight">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-300" />
              <span className="line-clamp-2">{currentSlideData.title}</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-sm text-white/90 mb-2 sm:mb-3">
              {currentSlideData.subtitle}
            </p>

            {/* Description */}
            <p className="text-[10px] sm:text-xs md:text-sm text-white/80 mb-3 sm:mb-4 line-clamp-2">
              {currentSlideData.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 md:px-3 py-1 text-center flex-1 min-w-0">
                  <div className="text-sm sm:text-base md:text-lg font-bold">{stat.value}</div>
                  <div className="text-[9px] sm:text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={currentSlideData.cta.action}
              className="bg-white text-gray-800 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-yellow-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 self-start"
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              {currentSlideData.cta.text}
            </button>
          </div>

          {/* Right Content - Floating Elements - 只在大屏显示 */}
          <div className="hidden lg:block absolute right-4 md:right-6 top-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Floating Icons */}
              <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
              </div>
              <div className="absolute top-3 -right-3 sm:top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-300" />
              </div>
              <div className="absolute -bottom-3 -right-4 sm:-bottom-4 sm:-right-6 w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <Crown className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls - 已移除左右箭头 */}

        {/* Dots Indicator - 优化双圆点 */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 bg-black/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-6 sm:w-8 bg-white shadow-lg'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          title={isAutoPlay ? '暂停轮播' : '开始轮播'}
        >
          <div className={`w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full ${isAutoPlay ? 'animate-pulse' : ''}`}></div>
        </button>
      </div>
    </div>
  );
};

export default BannerCarousel;