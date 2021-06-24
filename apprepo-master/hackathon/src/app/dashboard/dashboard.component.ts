import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ManagerService } from '../services/manager.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private _catagoryDetails: any;
  private _spentVal: any;

  flightEmVal:number=0;
  flightSocialCost:number=0;
  flightTotalSpent:number=0;

  hotelEmVal:number=0;
  hotelSocialCost:number=0;
  hotelTotalSpent:number=0;

  transEmVal:number=0;
  transSocialCost:number=0;
  transTotalSpent:number=0;

  constructor(private _manager: ManagerService) {
    this._manager.getValues("getcatagory")
      .subscribe(data => {
        this._catagoryDetails = data;
        this._manager.getValues("getCustSpend/1234567890")
          .subscribe(sVal => {
            this._spentVal = sVal;
            this.getCurrMonEmi(this._catagoryDetails, this._spentVal);
            this.getAllEmission(this._spentVal);
            console.log(this._spentVal);
          });
        console.log(this._catagoryDetails);
      });
  }
  getCurrMonEmi(c_v, s_v) {
    if (s_v.length > 0 && s_v[0].TRAN_DTL.length > 0) {
      s_v[0].TRAN_DTL.forEach(e => {
        if(c_v.length>0){
          let d=c_v.filter(item=>item.MID.indexOf(e.MID)>-1)[0];
          switch(d.item){
            case 'Airlines':{
                if(new Date(e.TRAN_DATE).getMonth() == new Date().getMonth()){
                  this.flightEmVal=this.flightEmVal+(e.SPEND * parseFloat(d.Emission_footprint));
                  this.flightSocialCost=this.flightSocialCost+(e.SPEND * parseFloat(d.Social_cost));
                  this.flightTotalSpent=this.flightTotalSpent+e.SPEND;
                }
              break;
            }
            case 'Hotel':{
              if(new Date(e.TRAN_DATE).getMonth() == new Date().getMonth()){
                this.hotelEmVal=this.hotelEmVal+(e.SPEND * parseFloat(d.Emission_footprint));
                this.hotelSocialCost=this.hotelSocialCost+(e.SPEND * parseFloat(d.Social_cost));
                this.hotelTotalSpent=this.hotelTotalSpent+e.SPEND;
              }
              break;
            }
            case 'Car Rentals':{
              if(new Date(e.TRAN_DATE).getMonth() == new Date().getMonth()){
                this.transEmVal=this.transEmVal+(e.SPEND * parseFloat(d.Emission_footprint));
                this.transSocialCost=this.transSocialCost+(e.SPEND * parseFloat(d.Social_cost));
                this.transTotalSpent=this.transTotalSpent+e.SPEND;
              }
              break;
            }
            default:
          }
          e.MID= e.SPEND * d.Emission_footprint;
        }
      });
    }
  }
  getAllEmission(s){
    var x=[];
    for(let i=1;i<=6;i++)
    {
      let cm:number=new Date().getMonth();
      let year:number=new Date().getFullYear();
      if(cm-i<0){
        year=year-1;
        cm=(cm-i)+12;
      }
      else{
        cm=cm-i;
      }
      x[i]=this.loadData(cm,year,s)/1000;
      console.log(x[i]);
    }
    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S'],
      series: [[x[6],x[5],x[4],x[3],x[2],x[1]]]
    };
    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 500, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }
    var dailySalesChart = new Chartist.Line('#dailySalesChart',dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }
  loadData(m,y,s){
    var tot=0;
    var data=s[0].TRAN_DTL.filter(i=>new Date(i.TRAN_DATE).getMonth()==m && y==new Date(i.TRAN_DATE).getFullYear())
    data.forEach(e => {
      tot+=e.MID;
    });
    return tot;
  }
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  ngOnInit() {



    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    /*const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);*/


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

}
