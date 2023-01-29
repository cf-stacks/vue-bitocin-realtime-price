<template>
  <div class="info-card">
    <div class="row">
      <div class="col-12  align-items-center">
        <div class="row chart-bar">
          <div class="chart-type">
            <!-- <button class="btn btn-primary btn-sm mr-2" :class="[{ 'active': chartType === 'cs' }]"
              @click="toCandleStickChart">Candlestick Chart</button> -->
            <button class="btn btn-primary btn-sm" :class="[{ 'active': chartType === 'lc' }]">Line
              Chart</button>
          </div>
        </div>
      </div>
      <div class="chart-panel col" ref="chartdiv" id="chartdiv">

      </div>
      <div class="col-12 p-2 text-right">
        <button class="btn btn-primary btn-sm mr-2" :class="[{ 'active': interval === '1h' }]"
          @click="updateTimeInterval('1h')">Hourly</button>
        <button class="btn btn-primary btn-sm mr-2" :class="[{ 'active': interval === '1d' }]"
          @click="updateTimeInterval('1d')">Daily</button>
        <!-- <button class="btn btn-primary btn-sm mr-2" :class="[{ 'active': interval === '1w' }]"
          @click="updateTimeInterval('1w')">1W</button> -->
        <button class="btn btn-primary btn-sm mr-2" :class="[{ 'active': interval === '1M' }]"
          @click="updateTimeInterval('1M')">Monthly</button>
      </div>
    </div>
    <div class="spinner" v-if="chartLoading">
      <div class="circle-spinner"></div>
    </div>
  </div>
</template>
<script>
import 'amcharts3/amcharts/amcharts'
// eslint-disable-next-line
import 'amcharts3/amcharts/serial'
// eslint-disable-next-line
import 'amstock3/amcharts/amstock'

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import axios from 'axios'

const proxyUrl = 'https://copart-cors.herokuapp.com/?curl=';
const apiKey = '66897c15-3b80-44fb-aacb-adb6a31353b1';

export default {
  name: 'coin-charts',
  props: ['symbol'],
  data() {
    return {
      chartData: [],
      chart: null,
      interval: '1d',
      chartLoading: true,
      chartType: 'cs',
      candleStickChartConfig: {
        "type": "stock",
        "theme": "light",
        "dataDateFormat": "YYYY-MM-DD HH",
        "mouseWheelZoomEnabled": true,
        "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
        "categoryAxesSettings": {
          "minPeriod": "hh"
        },
        "dataSets": [{
          "fieldMappings": [{
            "fromField": "open",
            "toField": "open"
          }, {
            "fromField": "close",
            "toField": "close"
          }, {
            "fromField": "high",
            "toField": "high"
          }, {
            "fromField": "low",
            "toField": "low"
          }, {
            "fromField": "volume",
            "toField": "volume"
          }],
          "color": "#7f8da9",
          "dataProvider": this.chartData,
          "title": this.symbol,
          "categoryField": "date"
        }],
        "panels": [{
          "title": "Price",
          "showCategoryAxis": true,
          "percentHeight": 70,
          "valueAxes": [{
            "id": "v1",
            "dashLength": 5
          }],

          "categoryAxis": {
            "dashLength": 5
          },

          "stockGraphs": [{
            "type": "candlestick",
            "id": "g1",
            "openField": "open",
            "closeField": "close",
            "highField": "high",
            "lowField": "low",
            "valueField": "close",
            "lineColor": "#00a928",
            "fillColors": "#00a928",
            "negativeLineColor": "#db4c3c",
            "negativeFillColors": "#db4c3c",
            "fillAlphas": 1,
            "useDataSetColors": false,
            "showBalloon": true,
            "useNegativeColorIfDown": false,
            "balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b>",
          }],

          "stockLegend": {
            "valueTextRegular": undefined,
            "periodValueTextComparing": "[[percents.value.close]]%"
          }
        },
        {
          "title": "Volume",
          "percentHeight": 30,
          "marginTop": 1,
          "showCategoryAxis": true,
          "valueAxes": [{
            "dashLength": 5
          }],
          "categoryAxis": {
            "dashLength": 5
          },

          "stockGraphs": [{
            "valueField": "volume",
            "type": "column",
            "fillColors": '#7f8da9',
            "showBalloon": true,
            "fillAlphas": 1
          }],

          "stockLegend": {
            "markerType": "none",
            "markerSize": 0,
            "labelText": "",
            "periodValueTextRegular": "[[value.close]]"
          }
        }
        ],
        "chartScrollbarSettings": {
          "graph": "g1",
          "graphType": "line",
          "usePeriod": "DD"
        },
        "chartCursorSettings": {
          "valueLineBalloonEnabled": true,
          "valueLineEnabled": true
        },
        "legendSettings": {
          "useMarkerColorForLabels": true
        }
      },
      lineCartConfig: {
        "type": "stock",
        "theme": "light",
        "dataDateFormat": "YYYY-MM-DD HH",
        "mouseWheelZoomEnabled": true,
        "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
        "categoryAxesSettings": {
          "minPeriod": "hh"
        },
        "dataSets": [{
          "color": "#00a928",
          "fieldMappings": [{
            "fromField": "value",
            "toField": "value"
          }],
          "dataProvider": this.chartData,
          "categoryField": "date"
        }],
        "panels": [{
          "showCategoryAxis": true,
          "title": "Price",
          "stockGraphs": [{
            "id": "g1",
            "valueField": "value",
            "useDataSetColors": false
          }],
          "stockLegend": {
            "periodValueTextRegular": "[[value.close]]"
          }
        },
        {
          "title": "Volume",
          "percentHeight": 30,
          "showCategoryAxis": true,
          "stockGraphs": [{
            "valueField": "volume",
            "type": "column",
            "showBalloon": false,
            "fillAlphas": 1
          }],
          "stockLegend": {
            "periodValueTextRegular": "[[value.close]]"
          }
        }
        ],
        "chartScrollbarSettings": {
          "graph": "g1",
          "graphType": "line",
          "usePeriod": "DD"
        },
        "chartCursorSettings": {
          "valueLineBalloonEnabled": true,
          "valueLineEnabled": true
        },
        "legendSettings": {
          "useMarkerColorForLabels": true
        }
      },
      
    }
  },
  mounted() {
    this.fetchChartData();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart = null;
      this.chartData = [];
    }
  },
  methods: {
    zoomChart() {
      if (this.chartData.length > 50) {
        this.chart.scrollbarChart.zoomToIndexes(this.chartData.length - 40, this.chartData.length - 1);
      }
    },
    fetchChartData(isUpdate = false) {
      this.chartLoading = true

      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
      axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
      axios.defaults.headers.common['Access-Control-Max-Age'] = 3600;
      axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Methods, Access-Control-Request-Headers';

      axios({
        method: 'GET',
        url: `https://copart-cors.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${apiKey}&start=1&limit=1&convert=USD`
      }).then(
        result => {
          if (result.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
          }

          this.chartLoading = false;
          var temp = result.data;
          this.chartData = {
            "date": new Date(temp.data[0].last_updated),
            "value": parseFloat(temp.data[0].quote.USD.price)
          }
          // console.log('chartDat = ', this.chartData);
          this.showChart();
          this.chartLoading = false;
        },
        error => {
          console.error(error)
        }
      ).catch((e) => {
        console.log(e);
      })
    },
    updateTimeInterval(ti) {
      this.interval = ti;

      if (ti == '1h') { this.$router.push("hourly"); }
      else if (ti == '1d') this.$router.push("daily");
      else if (ti == '1M') this.$router.push("monthly");

      this.fetchChartData(true)
    },
    showChart() {
      let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 0;
      let date = new Date(this.chartData.date)

      for (let i = 10; i > 0; i--) {
        visits = this.chartData.value - i;
        data.push({ date: date.setDate(date.getDate() - i), name: "BTC", value: visits });
      }

      data.push({ date: date, name: "name" + "BTC", value: this.chartData.value });

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.count
      if (this.interval == '1h') {
        dateAxis.baseInterval = {
          "timeUnit": "hour",
          "count": 5
        }
      } 
      else if(this.interval == '1d') {
        dateAxis.baseInterval = {
          "timeUnit": "day",
          "count": 5
        }
      }
      else if(this.interval == '1M') {
        dateAxis.baseInterval = {
          "timeUnit": "month",
          "count": 5
        }
      }

      console.log('interval = ', this.interval);

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  }
}
}
</script>