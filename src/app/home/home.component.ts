import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ToastrService } from "ngx-toastr";
import * as Highcharts from "highcharts/highstock";
import * as XLSX from "xlsx";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  constructor(private http: HttpClient,
              private toastr: ToastrService) {}
  xlsxUrl = "./assets/data/Currency.xlsx";

  highcharts: typeof Highcharts = Highcharts;
  @ViewChild("chart") componentRef: any;
  chartReference: any;
  updateFlag: boolean = true;

  dataInJASON: any;
  currencyObjects: any[] = [];
  currencyDates: any[] = [];
  currencyNames: any[] = [];
  legendsObject: any[] = [];
  showCurrencies: any[] = [];
  legends:any[] = [];
  skippedDates:boolean = false;
  graphType:boolean = false;
  sortByName:boolean = false;


  chartOptions:any = {
    chart: {
      type: "spline",
      marginTop: 90,
      marginLeft: 40,
      marginRight: 100,
      panning: {
        enabled: true,
        type: "x"
      },
      panKey: "shift",
      zoomType: "x"
    },
    title: { text: "Currency range of Hungarian National bank", y: 30 },
    subtitle:{ text: "National currency is Forint (HUF)", y: 50},
    credits: { enabled: false },
    accessibility:{
      enabled: false
    },
    tooltip: {
      valueDecimals: 2,
      valueSuffix: " HUF",
      pointFormat: "{series.options.value} {series.name} = {point.y}",
    },
    xAxis: {
      type: "datetime",
      minRange: 518400000,
      max: 1684454400000,
      min: 1675555200000
    },
    yAxis: {
      title:{
        text: "Value (HUF)",
        x: 24,
        rotation:270
      },
      offset: 40,
      showLastLabel: true
    },
    rangeSelector: {
      enabled: true,
      allButtonsEnabled: true,
      buttons: [
        {
        type: "month",
        count: 1,
        text: "1m",
        title: "View 1 month"
        },{
        type: "month",
        count: 3,
        text: "3m",
        title: "View 3 months"
        },{
        type: "month",
        count: 6,
        text: "6m",
        title: "View 6 months"
        },{
        type: "year",
        count: 1,
        text: "1y",
        title: "View 1 year"
        },{
        type: "all",
        text: "All",
        title: "View all"
        }],
      buttonTheme: {
        width: 50,
        height: 24,
        fill: "#eee",
        stroke: "none",
        "stroke-width": "0",
        r: 14,
        style: {
          color: "#000000",
          fontFamily: "Atkinson Hyperlegible",
          fontSize: 16
        },
        states: {
          hover: {
            fill: "#d9d9d9",
            style: {
              color: "rgba(0,0,0,0.8)"
            }
          },
          select: {
            fill: "#2196F3",
            style: {
              color: "white",
              fontWeight: "normal"
            }
          }
        }
      },
      buttonSpacing: 15,
      floating: true,
      y: -100,
      verticalAlign: "bottom",
      inputPosition: {
        x: 20,
        y: 4
      },
      inputStyle: {
        color: "#000000",
        fontFamily: "Atkinson Hyperlegible",
        fontSize: 16
      },
      labelStyle: {
        color: "#000000",
        fontSize: 16
      }
    },
    navigator: {
      outlineWidth: 0,
      maskFill: "rgba(90,130,200,0.1)",
      handles: {
        backgroundColor: "#eee",
        borderColor: "rgba(60,120,160,0.4)",
        height: 40,
        width: 5,
        lineWidth: 1
      },
      enabled: true,
      margin: 60,
      height: 80,
      xAxis: {
        type: "datetime",
        width: "104%"
      },
    },
    scrollbar: {
      enabled: true,
      height: 1,
      trackBorderWidth: 0,
      barBackgroundColor:"rgba(255,255,255,0)",
    },
    plotOptions: {
      series: {
        pointStart: 0,
        pointInterval: 24 * 3600 * 1000,
        relativeXValue: true,
        showInLegend: false,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        animation: {
          duration: 200
        }
      },
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          rangeSelector: {
            dropdown: "always",
            inputEnabled: false
          }
        }
      }]
    },
    series: this.showCurrencies
  };

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartReference = chart;
  };

  ngOnInit(){
    this.http.get(this.xlsxUrl, { responseType: "blob" }).subscribe((data:any) => {
      const reader: FileReader = new FileReader();

      reader.onload = (dataFile: any) => {
        let xlsxFile: string = dataFile.target.result;
        const workBook: XLSX.WorkBook = XLSX.read(xlsxFile, { type: "binary" });

        const workSheetName: string = workBook.SheetNames[0];
        const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];

        this.dataInJASON = XLSX.utils.sheet_to_json(workSheet); // raw: false, dateNF: "dd/mm/yyyy"

        this.CreateDates();
        this.ConvertData();
        this.CreateLegends();
        this.SelectCurrency();

      };
      reader.readAsBinaryString(data);
    });
  }

  CreateDates(){
    this.currencyDates = [];
    let objectWithDates = this.dataInJASON.slice(1);
    objectWithDates.map((objectWithData:any) => {
      let dataOnly = Object.values(objectWithData)[0];
      this.currencyDates.push(dataOnly)
    });
    this.chartOptions.plotOptions.series.pointStart = new Date((this.currencyDates[0] - (25567 + 2)) * 86400 * 1000).getTime()
  }

  SkippedDates(){
    this.CreateDates();
    this.ConvertData();
    this.SelectCurrency();
  }

  ConvertData(){
    this.currencyObjects = [];
    let tempObject = this.dataInJASON[0]
    this.currencyNames = Object.keys(tempObject).slice(2);
    let dataForParse = this.dataInJASON.slice(1);
    let referenceDate = this.currencyDates[0];
    let weekendCurrency:any = 0

    this.currencyNames.map((currentName:any) => {
      let name = currentName;
      let value = tempObject[currentName];
      let data:any[] = [];
      let dateCounter = 0;
      let prevDate = (referenceDate - 1);

      dataForParse.map((range:any) => {
        let currentDate = this.currencyDates[dateCounter];
        for(let i = 1; currentDate !== (prevDate + i); i++){
          data.push(weekendCurrency);
        }
        if(range[currentName] === undefined){
          data.push("");
        }
        else {
          data.push(range[currentName]);
        }
        prevDate = currentDate;
        dateCounter += 1;
        if(this.skippedDates && range[currentName] !== undefined){
          weekendCurrency = "";
        }
        else {
          weekendCurrency = range[currentName];
        }
      });
      this.currencyObjects.push({name, value, data});
    });
  }

  CreateLegends(){
    let completed: boolean = false;
    this.currencyNames.map((name:any) => {
      this.legendsObject.push({ name, completed });
    });
    this.legends = this.legendsObject;
    this.legends[1].completed = true;
  }

  SortCurr(){
    this.sortByName = !this.sortByName;
    if (this.sortByName){
      this.legends.sort((a,b) => a.name.localeCompare(b.name));
    }
    else {
      this.legends.reverse();
    }
  }

  CheckTen(event:any){
    if(event.checked && this.showCurrencies.length >= 10){
      let checkBoxName = event.source.ariaLabel
      let foundedIndex = this.legendsObject.findIndex(legend => legend.name === checkBoxName)
      event.source._checked = false
      this.legendsObject[foundedIndex].completed = false;
      this.toastr.warning("You can't select more than 10 currencies","WARNING!")
      return
    }
    this.SelectCurrency()
  }

  SelectCurrency(){
    this.showCurrencies = [];
    this.legendsObject.map((legend) => {
      if(legend["completed"] === true){
        let index = this.currencyObjects.findIndex(currency => currency.name === legend["name"])
        this.showCurrencies.push(this.currencyObjects[index]);
      }
    });
    this.RefreshChart();
  }

  RefreshChart(){
    this.chartReference.showLoading();
    setTimeout(() => {
      this.chartReference.hideLoading();

      while (this.chartReference.series.length > 0) {
        this.chartReference.series[0].remove(true);
      }
      this.showCurrencies.map((currency) => {
        this.chartReference.addSeries(currency)
      });
      this.chartOptions.plotOptions.series.pointStart = new Date((this.currencyDates[0] - (25567 + 2)) * 86400 * 1000).getTime()
    }, 400);
    this.updateFlag = true;
  }

  GraphicsType(){
    if(this.graphType){
      this.chartOptions.chart.type = "line";
    }
    else {
      this.chartOptions.chart.type = "spline";
    }
    this.RefreshChart();
  }
}
