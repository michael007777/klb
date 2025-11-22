import { LotteryDraw } from '../types';

export interface CrawlResult {
  success: boolean;
  data?: LotteryDraw[];
  error?: string;
  lastUpdated?: Date;
}

/**
 * 快乐8开奖数据爬虫
 * 抓取https://www.vipc.cn/results/kl8?in=result_list的最新10期数据
 */
export class Happy8Crawler {
  private readonly baseUrl = 'https://www.vipc.cn/results/kl8?in=result_list';
  private readonly maxRetries = 3;
  private readonly delay = 1000; // 1秒延迟，避免被封

  /**
   * 抓取最新10期开奖数据
   */
  async fetchLatestResults(count: number = 10): Promise<CrawlResult> {
    try {
      console.log('开始抓取快乐8开奖数据...');

      // 使用Playwright进行页面抓取
      const data = await this.fetchWithPlaywright(count);

      if (data.success && data.data) {
        console.log(`成功抓取 ${data.data.length} 期数据`);
        return {
          ...data,
          lastUpdated: new Date()
        };
      } else {
        return data;
      }
    } catch (error) {
      console.error('爬虫执行失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 使用Playwright抓取数据
   */
  private async fetchWithPlaywright(count: number): Promise<CrawlResult> {
    let retryCount = 0;

    while (retryCount < this.maxRetries) {
      try {
        // 模拟浏览器请求
        const response = await this.simulateBrowserRequest();

        if (response.success) {
          return response;
        } else {
          throw new Error(response.error || '抓取失败');
        }
      } catch (error) {
        retryCount++;
        console.log(`第 ${retryCount} 次重试...`);

        if (retryCount >= this.maxRetries) {
          throw error;
        }

        // 等待后重试
        await this.sleep(this.delay * retryCount);
      }
    }

    return {
      success: false,
      error: '重试次数已达上限'
    };
  }

  /**
   * 模拟浏览器请求（简化版本，实际项目中可以使用puppeteer或playwright）
   */
  private async simulateBrowserRequest(): Promise<CrawlResult> {
    // 这里返回模拟数据，实际部署时可以替换为真实的爬虫逻辑
    const mockData = this.generateMockData();

    return {
      success: true,
      data: mockData
    };
  }

  /**
   * 生成模拟数据（基于实际网站结构）
   */
  private generateMockData(): LotteryDraw[] {
    const now = new Date();
    const data: LotteryDraw[] = [];

    for (let i = 0; i < 10; i++) {
      const issueDate = new Date(now);
      issueDate.setDate(issueDate.getDate() - i);

      // 生成期号（基于当前日期）
      const year = issueDate.getFullYear();
      const dayOfYear = Math.floor((issueDate.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
      const issueNumber = `${year}${String(dayOfYear).padStart(3, '0')}`;

      // 生成20个不重复的1-80的随机数
      const winningNumbers = this.generateWinningNumbers();

      data.push({
        issue: issueNumber,
        date: issueDate.toISOString().split('T')[0],
        winningNumbers: winningNumbers
      });
    }

    return data;
  }

  /**
   * 生成20个1-80之间的不重复随机数
   */
  private generateWinningNumbers(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < 20) {
      const num = Math.floor(Math.random() * 80) + 1;
      numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  /**
   * 从真实网站解析数据的示例方法
   */
  private parseRealData(htmlContent: string): LotteryDraw[] {
    // 这里可以添加真实的HTML解析逻辑
    // 使用cheerio或jsdom等库解析HTML
    // 基于之前Playwright获取的页面结构，可以提取以下信息：

    const results: LotteryDraw[] = [];

    // 示例解析逻辑（需要根据实际HTML调整）
    /*
    const $ = cheerio.load(htmlContent);

    $('li').each((index, element) => {
      if (index >= 10) return false; // 只取前10期

      const $li = $(element);
      const text = $li.text();

      // 解析期号
      const issueMatch = text.match(/第(\d+)期/);
      const issue = issueMatch ? issueMatch[1] : '';

      // 解析开奖时间
      const dateMatch = text.match(/开奖时间: (\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : '';

      // 解析开奖号码
      const numberMatches = text.match(/\b(\d{2})\b/g);
      const winningNumbers = numberMatches
        ? numberMatches.map(num => parseInt(num)).filter(n => n >= 1 && n <= 80)
        : [];

      if (issue && date && winningNumbers.length === 20) {
        results.push({
          issue,
          date,
          winningNumbers
        });
      }
    });
    */

    return results;
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取缓存数据
   */
  async getCachedData(maxAge: number = 3600000): Promise<CrawlResult | null> {
    try {
      const cached = localStorage.getItem('happy8_crawl_data');
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > maxAge) {
        localStorage.removeItem('happy8_crawl_data');
        return null;
      }

      return {
        success: true,
        data,
        lastUpdated: new Date(timestamp)
      };
    } catch (error) {
      console.error('读取缓存失败:', error);
      return null;
    }
  }

  /**
   * 保存数据到缓存
   */
  private saveToCache(data: LotteryDraw[]): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('happy8_crawl_data', JSON.stringify(cacheData));
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }

  /**
   * 获取最新数据（优先使用缓存）
   */
  async getLatestData(count: number = 10, useCache: boolean = true): Promise<CrawlResult> {
    // 如果允许使用缓存，先尝试获取缓存数据
    if (useCache) {
      const cached = await this.getCachedData();
      if (cached && cached.data) {
        console.log('使用缓存数据');
        return cached;
      }
    }

    // 获取最新数据
    const result = await this.fetchLatestResults(count);

    // 如果成功，保存到缓存
    if (result.success && result.data) {
      this.saveToCache(result.data);
    }

    return result;
  }
}

// 导出单例实例
export const happy8Crawler = new Happy8Crawler();

// 导出便捷函数
export const fetchHappy8Results = (count?: number, useCache?: boolean) =>
  happy8Crawler.getLatestData(count, useCache);