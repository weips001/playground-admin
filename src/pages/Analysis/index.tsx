import React, { useState, useEffect } from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { connect } from 'dva'
import { getAllNum, getTodayMoney, getTodayNum } from './services'

const { Statistic, Divider } = StatisticCard;

const Analysis = (props) => {
  const { dispatch } = props
  const [responsive, setResponsive] = useState(false);
  const [restTotal, setRestTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(0)
  const [todayMoney, setTodayMoney] = useState(0);
  const [gimeBiTodayMoney, setGimeBiTodayMoney] = useState(0);
  const [vipTodayMoney, setVipTodayMoney] = useState(0);
  const [todayNum, setTodayNum] = useState(0);
  const [gameBiTodayNum, setGameBiTodayNum] = useState(0);
  const [vipTodayNum, setVipTodayNum] = useState(0);

  const renderAllNum = async () => {
    const { restTotal, total } = await getAllNum()
    setRestTotal(restTotal)
    setTotal(total)
    const rate = (restTotal / total * 100).toFixed(2)
    setRate(rate)
  }
  const renderTodayMoney = async () => {
    const res = await getTodayMoney()
    console.log('res-------', res)
    const { gimeBiTodayMoney, vipTodayMoney } = await getTodayMoney()
    console.log('gimeBiTodayMoney', gimeBiTodayMoney)
    setTodayMoney(gimeBiTodayMoney + vipTodayMoney)
    setGimeBiTodayMoney(gimeBiTodayMoney)
    setVipTodayMoney(vipTodayMoney)
  }
  const renderTodayNum = async () => {
    const { gameBiTodayNum, vipTodayNum } = await getTodayNum()
    setTodayNum(gameBiTodayNum + vipTodayNum)
    setGameBiTodayNum(gameBiTodayNum)
    setVipTodayNum(vipTodayNum)
  }

  useEffect(() => {
    renderAllNum()
    renderTodayMoney()
    renderTodayNum()
  }, [])

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group title="核心指标" direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: '今日收入',
            value: todayMoney,
            suffix: "元"
          }}
          footer={
            <>
              <Statistic value={vipTodayMoney} title="淘气堡" suffix="元" layout="horizontal" />
              <Statistic value={gimeBiTodayMoney} title="游戏币" suffix="元" layout="horizontal" />
            </>
          }
          chartPlacement="left"
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '今日消耗',
            value: todayNum,
          }}
          footer={
            <>
              <Statistic value={vipTodayNum} title="淘气堡" suffix="次" layout="horizontal" />
              <Statistic value={gameBiTodayNum} title="游戏币" suffix="个" layout="horizontal" />
            </>
          }
          chartPlacement="left"
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '淘气包占比',
            value: rate,
            suffix: '%',
          }}
          footer={
            <>
              <Statistic value={restTotal} title="未消耗次数" suffix="次" layout="horizontal" />
              <Statistic value={total} title="总次数" suffix="次" layout="horizontal" />
            </>
          }
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
};

export default connect()(Analysis)