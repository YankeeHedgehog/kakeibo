export default function formatDateToJapanese(date: Date) {
  // 曜日リスト
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']

  // 年、月、日を取得
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // 曜日を取得
  const weekday = weekdays[date.getDay()]

  return `${year}年${month}月${day}日 (${weekday})`
}

// 使用例
const date = new Date()
// console.log(formatDateToJapanese(date));
// 例: 2024年11月17日(日)
