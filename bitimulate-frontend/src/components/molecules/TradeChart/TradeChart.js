import React, {Component} from 'react';
import styles from './TradeChart.scss';
import classNames from 'classnames/bind';
import echarts from 'echarts';
import moment from 'moment';
import {Spinner, ButtonSelector} from 'components';
import debounce from 'lodash/debounce';
import { chartTypes } from 'lib/variables';

const cx = classNames.bind(styles);

function calculateMA(data, count) {
  const result = [];
  for (let i = 0; i < data.size; i++) {
    if (i < count) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < count; j++) {
      sum += data.getIn([
        i - j,
        'weightedAverage'
      ]);
    }

    result.push((sum / count).toFixed(10));
  }
  return result;
}

class TradeChart extends Component {

  echart = null

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loading && !this.props.loading) {
      this.drawChart();
      return;
    }
    
    if (prevProps.data !== this.props.data) {
      this.updateChart();
    }
  }

  updateChart = () => {
    if(!this.echart || !this.series) {
      return;
    }
  
    const { data } = this.props;
    if (data.isEmpty()) return;

    console.log('updating..');
  
    const { series, xAxis } = this;

    const dates = data.map(info => new Date(info.get('date') * 1000)).toJS();
    dates.push(new Date(dates[dates.length - 1].getTime() + dates[1].getTime() - dates[0].getTime()));
  
    const candleStickData = data.map(info => {
      return [
        info
          .get('open')
          .toFixed(10),
        info
          .get('close')
          .toFixed(10),
        info
          .get('low')
          .toFixed(10),
        info
          .get('high')
          .toFixed(10)
      ];
    }).toJS();

    const volumes = data.map(info => info.get('volume')).toJS();
  
    xAxis[0].data = dates;
    xAxis[1].data = dates;
    series[0].data = candleStickData;
    series[1].data = calculateMA(data, 5);
    series[2].data = calculateMA(data, 15);
    series[3].data = calculateMA(data, 50);
    series[4].data = volumes;

    this.echart.setOption({
      series,
      xAxis
    });

    console.log('and it\'s, remember me');
  }

  componentWillUnmount() {
    if (this.echart) {
      this.echart.dispose();
      this.echart = null;
    }
    window.removeEventListener('resize', this.handleResize)
  }

  drawChart = () => {
    if(this.props.loading)  return;
    
    if(this.echart) {
      this.echart.dispose();
      this.echart = null;
    }

    const myChart = echarts.init(this.chart);
    this.echart = myChart;
    const {data} = this.props;

    if(data.isEmpty()) return;

    const dates = data.map(info => new Date(info.get('date') * 1000)).toJS();
    dates.push(new Date(dates[dates.length - 1].getTime() + dates[1].getTime() - dates[0].getTime()));

    const candleStickData = data.map(info => {
      return [
        info
          .get('open')
          .toFixed(10),
        info
          .get('close')
          .toFixed(10),
        info
          .get('low')
          .toFixed(10),
        info
          .get('high')
          .toFixed(10)
      ];
    }).toJS();
    const volumes = data
      .map(info => info.get('volume').toFixed(2))
      .toJS();

    const option = {
      backgroundColor: '#eeeeee',
      legend: {
        top: 0,
        data: [
          {
            name: 'Price',
            icon: 'rect'
          }, {
            name: 'MA5',
            icon: 'rect'
          }, {
            name: 'MA15',
            icon: 'rect'
          }, {
            name: 'MA50',
            icon: 'rect'
          }
        ],
        inactiveColor: '#777'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            formatter: (object) => {
              
              return isNaN(object.value)
                ? moment(object.value).format('YYYY MMM DD HH:mm')
                : object.value
            }
          },
          type: 'cross'
        },
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
        position: function (pos, params, el, elRect, size) {
          var obj = {
            top: 10
          };
          obj[
            ['left', 'right'][+ (pos[0] < size.viewSize[0] / 2)]
          ] = 30;
          return obj;
        },
        extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all'
        },
        label: {
          backgroundColor: '#777'
        }
      },

      grid: [
        {
          top: '10%',
          left: '0',
          right: '0',
          height: '65%'
        }, {
          left: '0',
          right: '0',
          bottom: '5%',
          height: '15%'
        }
      ],
      // xAxis: {   type: 'category',   data: dates,   axisLine: {     lineStyle: {
      // color: '#8392A5'     }   } },
      xAxis: [
        {
          type: 'category',
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLabel: {
            formatter: (date) => moment(date).format('MMM DD HH:mm')
          },
          axisLine: {
            onZero: false
          },
          splitLine: {
            show: false
          },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100
          }
        }, {
          type: 'category',
          gridIndex: 1,
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLine: {
            onZero: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        }, {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [
            0, 1
          ],
          start: 60,
          end: 100
        }, {
          show: true,
          xAxisIndex: [
            0, 1
          ],
          type: 'slider',
          bottom: '0%',
          height: '5%',
          start: 60,
          end: 100,
          showDetail: false
        }
      ],
      animation: false,
      series: [
        {
          type: 'candlestick',
          name: 'Price',
          data: candleStickData,
          itemStyle: {
            normal: {
              opacity: 0.5,
              color: '#0CF49B',
              color0: '#FD1050',
              borderColor: '#0CF49B',
              borderColor0: '#FD1050'
            }
          }
        }, {
          name: 'MA5',
          type: 'line',
          data: calculateMA(data, 5),
          smooth: true,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts
                .graphic
                .LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255, 158, 68, 0.25)'
                  }, {
                    offset: 1,
                    color: 'rgba(255, 70, 131, 0.25)'
                  }
                ])
            }
          }
        }, {
          name: 'MA15',
          type: 'line',
          data: calculateMA(data, 15),
          enabled: false,
          smooth: true,
          lineStyle: {
            normal: {
              width: 1,
              opacity: 0.7
            }
          }
        }, {
          name: 'MA50',
          type: 'line',
          data: calculateMA(data, 50),
          smooth: true,
          lineStyle: {
            normal: {
              width: 1,
              opacity: 0.7
            }
          }
        }, {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes
        }
        //   {     name: 'Volume',     type: 'bar',     xAxisIndex: 1,     yAxisIndex:
        // 1,     data: data.volumes }
      ]
    };

    this.series = option.series;
    this.xAxis = option.xAxis;
    
    myChart.setOption(option);
  }

  handleResize = debounce(() => {
    if(this.echart) {
      this.echart.resize();
    }
  }, 100);

  componentDidMount() {
    this.drawChart();
    window.addEventListener('resize', this.handleResize);
  }  

  render() {
    const {loading, onSelectChartType, chartType, data} = this.props;
    const empty = data.isEmpty();
    return (
      <div className={cx('trade-chart-wrapper')}>
        <ButtonSelector options={chartTypes} value={chartType} onSelect={onSelectChartType}/>
        <div className={cx('trade-chart')}>
          <div className={cx('unit')}><b>Candlesticks:</b> {chartTypes.find(c=>c.name === chartType).unit}</div>
          {loading
            ? <Spinner color="#a1a1a1"/>
            : <div
              className={cx('chart')}
              ref={ref => {
              this.chart = ref
            }}></div>}
        </div>
      </div>
    )
  }
}

export default TradeChart;