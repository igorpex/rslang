export function dateMsToStrDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();// 1-31;
  return `${year}-${month + 1}-${day}`;
}

export function getDateNowString() {
  const todayMs = new Date(JSON.parse(JSON.stringify(Date.now())));
  return dateMsToStrDate(todayMs);
}
