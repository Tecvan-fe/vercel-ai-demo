export type JuejinFeedResponse = Article[];

export interface Article {
  article_id: string;
  article_url: string;
  article_info: ArticleInfo;
  author_user_info: AuthorUserInfo;
  category: Category;
  tags: Tag[];
  user_interact: UserInteract;
  org: {
    is_followed: boolean;
  };
  req_id: string;
  status: {
    push_status: number;
  };
  theme_list: any[];
  extra: {
    extra: string;
  };
}

interface ArticleInfo {
  article_id: string;
  user_id: string;
  category_id: string;
  tag_ids: number[];
  visible_level: number;
  link_url: string;
  cover_image: string;
  is_gfw: number;
  title: string;
  brief_content: string;
  is_english: number;
  is_original: number;
  user_index: number;
  original_type: number;
  original_author: string;
  content: string;
  ctime: string;
  mtime: string;
  rtime: string;
  draft_id: string;
  view_count: number;
  collect_count: number;
  digg_count: number;
  comment_count: number;
  hot_index: number;
  is_hot: number;
  rank_index: number;
  status: number;
  verify_status: number;
  audit_status: number;
  mark_content: string;
  display_count: number;
  is_markdown: number;
  app_html_content: string;
  version: number;
  web_html_content: null | string;
  meta_info: null | any;
  catalog: null | any;
  homepage_top_time: number;
  homepage_top_status: number;
  content_count: number;
  read_time: string;
}

interface AuthorUserInfo {
  user_id: string;
  user_name: string;
  company: string;
  job_title: string;
  avatar_large: string;
  level: number;
  description: string;
  followee_count: number;
  follower_count: number;
  post_article_count: number;
  digg_article_count: number;
  got_digg_count: number;
  got_view_count: number;
  post_shortmsg_count: number;
  digg_shortmsg_count: number;
  isfollowed: boolean;
  favorable_author: number;
  power: number;
  study_point: number;
  university: {
    university_id: string;
    name: string;
    logo: string;
  };
  major: {
    major_id: string;
    parent_id: string;
    name: string;
  };
  student_status: number;
  select_event_count: number;
  select_online_course_count: number;
  identity: number;
  is_select_annual: boolean;
  select_annual_rank: number;
  annual_list_type: number;
  extraMap: Record<string, any>;
  is_logout: number;
  annual_info: any[];
  account_amount: number;
  user_growth_info: UserGrowthInfo;
  is_vip: boolean;
  become_author_days: number;
  collection_set_article_count: number;
  recommend_article_count_daily: number;
  article_collect_count_daily: number;
  user_priv_info: UserPrivInfo;
}

interface UserGrowthInfo {
  user_id: number;
  jpower: number;
  jscore: number;
  jpower_level: number;
  jscore_level: number;
  jscore_title: string;
  author_achievement_list: any[];
  vip_level: number;
  vip_title: string;
  jscore_next_level_score: number;
  jscore_this_level_mini_score: number;
  vip_score: number;
}

interface UserPrivInfo {
  administrator: number;
  builder: number;
  favorable_author: number;
  book_author: number;
  forbidden_words: number;
  can_tag_cnt: number;
  auto_recommend: number;
  signed_author: number;
  popular_author: number;
  can_add_video: number;
}

interface Category {
  category_id: string;
  category_name: string;
  category_url: string;
  rank: number;
  back_ground: string;
  icon: string;
  ctime: number;
  mtime: number;
  show_type: number;
  item_type: number;
  promote_tag_cap: number;
  promote_priority: number;
}

interface Tag {
  id: number;
  tag_id: string;
  tag_name: string;
  color: string;
  icon: string;
  back_ground: string;
  show_navi: number;
  ctime: number;
  mtime: number;
  id_type: number;
  tag_alias: string;
  post_article_count: number;
  concern_user_count: number;
}

interface UserInteract {
  id: number;
  omitempty: number;
  user_id: number;
  is_digg: boolean;
  is_follow: boolean;
  is_collect: boolean;
  collect_set_count: number;
}

export interface ArticleDetail {
  title: string;
  link: string;
  summary: string;
  score: number;
  analysis: string;
}
