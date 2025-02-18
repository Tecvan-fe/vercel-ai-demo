/**
 * 清理 HTML 字符串中的不可见元素和特殊标签
 * @param html HTML 字符串
 * @returns 清理后的纯文本内容
 */
export function pureHtml(html: string): string {
  if (!html) return '';

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除 script 标签及其内容
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // 移除 style 标签及其内容
    .replace(/<link\b[^>]*>/gi, '') // 移除 link 标签
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // 移除 iframe 标签及其内容
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '') // 移除 noscript 标签及其内容
    .replace(/<[^>]+>/g, ' ') // 移除所有其他 HTML 标签，保留内容
    .replace(/\s+/g, ' ') // 将多个空白字符替换为单个空格
    .replace(/&nbsp;/g, ' ') // 替换 HTML 实体
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim(); // 移除首尾空白
}

/**
 * 使用示例:
 *
 * const html = `
 *   <div>
 *     <script>console.log('test')</script>
 *     <style>.test { color: red; }</style>
 *     <link rel="stylesheet" href="style.css">
 *     <p>这是一段<strong>重要</strong>的文本</p>
 *     <iframe src="test.html"></iframe>
 *   </div>
 * `;
 *
 * const text = pureHtml(html);
 * console.log(text); // 输出: "这是一段 重要 的文本"
 */
