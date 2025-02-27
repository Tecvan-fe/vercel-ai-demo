// 生成选项接口
export interface GenerateOptions {
  model?: string;
  style?: string;
  length?: 'short' | 'medium' | 'long';
}

// 生成结果接口
export interface GenerateResult {
  title: string;
  content: string;
  filePath: string;
}

// 提示分析接口
export interface PromptAnalysis {
  topic: string;
  targetAudience: string;
  contentType: string;
  toneStyle: string;
  keyThemes: string[];
  suggestedStructure: string;
  wordCountRange: {
    min: number;
    max: number;
  };
  keywordDensity: {
    [keyword: string]: number;
  };
  contentGoals: string[];
  researchSuggestions: string[];
}

// 搜索结果接口
export interface SearchResult {
  title: string;
  content: string;
  url: string;
  type: 'web' | 'academic' | 'news' | 'blog';
}

// 大纲接口
export interface Outline {
  title: string;
  sections: OutlineSection[];
}

// 大纲章节接口
export interface OutlineSection {
  title: string;
  keyPoints: string[];
  subsections?: OutlineSection[];
}

// 文章内容接口
export interface ArticleContent {
  title: string;
  introduction: string;
  sections: SectionContent[];
  conclusion: string;
  content: string;
}

// 章节内容接口
export interface SectionContent {
  title: string;
  content: string;
  subsections?: SectionContent[];
}

// 搜索选项接口
export interface SearchOptions {
  maxResults?: number;
  recentOnly?: boolean;
  sourcePriority?: ('web' | 'academic' | 'news' | 'blog')[];
}

export interface FactIssue {
  statement: string;
  issue: string;
  correction: string;
  confidence: number;
  sources?: string[];
}

export interface FactCheckResult {
  article: ArticleContent;
  factIssues: FactIssue[];
  correctedContent: string;
}
