import { Component,PLATFORM_ID,OnInit,ChangeDetectorRef,Inject } from '@angular/core';//Inject allows dependency injection

@Component({ // it marks the component is angular component
  selector: 'app-graph',//its specifies the tag, used in html to insert the other component
  templateUrl: './graph.component.html',// defining componentview(HTML Code)
  styleUrl: './graph.component.css',// it used css styling the component
  standalone:false // it tells the component is not depenedent, its depends on ngModule
})
export class GraphComponent implements OnInit{ // implements onInit: when components runs initialize logic when it loads.

  data: any;

  options: any;

 // platformId = Inject(PLATFORM_ID); //it detects the application is runing in the brower or on the serve



    constructor(private cd: ChangeDetectorRef) {}

    

    ngOnInit() { // it runs when component initialize
        this.initChart();//Calls initChart() to set up the chart.
    }

    initChart() {
      
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', "Aug","September","October","November","December"],
                datasets: [
                  {
                    type: 'line',
                    label: 'Product Sold',
                    borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    data: [50, 25, 12, 48, 50, 56, 42,20,30,20,60,50],
                     yAxisID: 'y'
                },
                    {
                        label: 'Total Views',
                        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        data: [65, 59, 80, 81, 56, 55, 40,42,80,30,80,100],
                        borderRadius: 50
                    },
                    
                   
                ]
            };

            this.options = {
                maintainAspectRatio: false,//Allows resizing
                aspectRatio: 0.8,// Controls chart proportions.
                plugins: {
                    legend: {// lengend: name of the label
                      display: true, // Ensure the legend is visible
                      position: 'top', // Change to 'top', 'left', or 'right' as needed
                      align: 'start',
                        labels: {
                            color: textColor,  // Colors the legend labels.  
                        }
                    }
                },
                scales: {
                    x: {
                     
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: true
                        }
                    },
                    y: {
                      min: 5,
                        ticks: {
                            color: textColorSecondary,
                            callback: (value) =>{
                                return '$' + (value) + 'k'
                            } 
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
            this.cd.markForCheck()//Triggers an update in Angular’s change detection cycle.
        }
  }



