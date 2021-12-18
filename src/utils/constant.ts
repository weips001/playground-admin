export const rechargeType = [
  {
    label: '100元',
    value: 4,
    cardType: '0',
    money: 100,
    month: 12,
  },
  {
    label: '200元（月卡）',
    value: -2,
    cardType: '2',
    money: 200,
    month: 1
  },
  {
    label: '400元（季卡）',
    value: -3,
    cardType: '3',
    money: 400,
    month: 3
  },
  {
    label: '800（年卡）',
    value: -4,
    cardType: '1',
    money: 800,
    month: 12
  },
  {
    label: '300元',
    value: 10,
    cardType: '0',
    money: 300,
    month: 12
  },
  {
    label: '500元',
    value: 20,
    cardType: '0',
    money: 500,
    month: 24
  },
  {
    label: '年卡',
    value: -1,
    cardType: '1',
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
  2: '月卡',
  3: '季卡',
  1: '年卡',
}
function generateConsumeOption (total = 3, unit = '次') {
  let res = []
  for (let i =0 ; i < total; i++) {
    res.push({
      label: `${i + 1} ${unit}`,
      value: i + 1
    })
  }
  return res
}
export const consumeNum = generateConsumeOption(5)

export const gameBiType = [
  {
    label: '100元',
    value: 100,
    total: 130,
    month: 12,
  },
  {
    label: '200元',
    value: 200,
    total: 270,
    month: 12,
  }
]

export const consumeGameBi = generateConsumeOption(30, '个')