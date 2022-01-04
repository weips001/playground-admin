import React, { useState, useEffect } from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { connect } from 'dva'
import { getAllNum, getTodayMoney, getTodayNum, getYearData, getFinanceByDate } from './services'
import { DualAxes } from '@ant-design/charts';
import {Card, Tag} from 'antd'
// import { Divider } from 'antd';

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
  const [dataList, setDataList] = useState([])
  const [currentMoney, setCurrentMoney] = useState({})
  const [lastMoney, setLasttMoney] = useState({})

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

  useEffect(async ()=>{
    let {data} = await getYearData({currentYear: new Date()})
    console.log(data, 49999)
    let arr = data.map(item=>{
      return {
        type: item.date,
        sales: item.totalMoney,
        '人数': item.personNum,
        paidMoney: item.paidMoney
      }
    })
    setDataList(arr)
    let res = await getFinanceByDate(getCurrentMonth())
    setCurrentMoney(res.data)
    let newRes = await getFinanceByDate(getLastMonth())
    setLasttMoney(newRes.data)
  }, [])

  const DemoColumn = () => {
    const data = dataList
    const config = {
      data: [data, data, data],
      xField: 'type',
      yField: ['sales', '人数', 'paidMoney'],
      geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle',
        // 'top', 'bottom', 'middle',
        // 配置样式
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: '类别',
        },
        sales: {
          alias: '月收入',
        },
      },
    };
    return <DualAxes {...config} />;
  };

  const getCurrentMonth = ()=>{
    let date = new Date();
    let month = parseInt(date.getMonth()+1);
    let day = date.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return {
      startDate: date.getFullYear() + '-' + month + '-' + '01',
      endDate: date.getFullYear() + '-' + month + '-' + date.getDate()
    };
  }

  const getLastMonth = ()=>{
    var now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth()-1 ,1).toLocaleDateString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), 0).toLocaleDateString()
    };
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
      <Divider></Divider>
      <Card>
        本月收入<Tag style={{margin: '0 10px'}} color="#2db7f5">{currentMoney.totalMoney}</Tag>,
        本月支出<Tag style={{margin: '0 10px'}} color="#87d068">{currentMoney.paidMoney}</Tag>,
        本月盈利<Tag style={{margin: '0 10px'}} color="#f50">{currentMoney.totalMoney - currentMoney.paidMoney}</Tag>,
        上月收入<Tag style={{margin: '0 10px'}} color="#2db7f5">{lastMoney.totalMoney}</Tag>,
        上月支出<Tag style={{margin: '0 10px'}} color="#87d068">{lastMoney.paidMoney}</Tag>,
        上月盈利<Tag style={{margin: '0 10px'}} color="#f50">{lastMoney.totalMoney - lastMoney.paidMoney}</Tag>,
      </Card>
      <Divider></Divider>
      <DemoColumn />
    </RcResizeObserver>
  );
};

export default connect()(Analysis)