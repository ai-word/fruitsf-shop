class Timer{
    constructor(callback,time_gap = 1000,count = 0){
      this.time_gap = time_gap;
      this.clearIndex = 0;
      this.totalCouont = count;
      this.currentCount = 0;
      this.callback = callback;
    }
    timechange(){
      if (this.totalCouont && this.totalCouont >= this.currentCount){
        this.stop();
        return;
      }else{
        this.clearIndex = setInterval(()=>{
          this.currentCount++;
          if(this.callback) {
            this.callback();
          }
        },this.time_gap);
      }
    }
    //开始计时器
    start(){
      this.timechange();
    }
    //停止计数器
    stop(){
      if (that._clearIndex) {
        clearInterval(this.clearIndex);
      }
    }
}
export {Timer}