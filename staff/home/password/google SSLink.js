fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQrQ04ClI2jMGpjfZSz-WlF7aRAx0ED12LAi1wIURwTuJjTmAytXasAvsa_CXB8zaKdXTwpHzrr3gEj/pubhtml/export?format=csv')
  .then(res => res.text())
  .then(csv => {
    // csvをパースして使う
});