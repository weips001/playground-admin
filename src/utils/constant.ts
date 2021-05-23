export const rechargeType = [
  {
    label: '100元',
    value: '0',
    total: 3,
    money: 100,
    month: 12,
  },
  {
    label: '300元',
    value: '0',
    total: 10,
    money: 300,
    month: 12
  },
  {
    label: '500元',
    value: '0',
    total: 20,
    money: 500,
    month: 24
  },
  {
    label: '年卡',
    value: '1',
    total: -1,
    money: 1200,
    month: 12
  }
]

export const sexType = [
  {
    label: '男',
    value: '0'
  },
  {
    label: '女',
    value: '1'
  }
]

export const cardTypeEnum = {
  0: '次卡',
  1: '年卡'
}
function generateConsumeOption (total = 3) {
  let res = []
  for (let i =0 ; i < total; i++) {
    res.push({
      label: `${i + 1}次`,
      value: i + 1
    })
  }
  return res
}
export const consumeNum = generateConsumeOption(5)