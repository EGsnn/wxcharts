
'use strict';

// 公用配置参数
var config = {
  farme: {
    // 是否渲染坐标轴
    renderAxisX: 1,
    renderAxisY: 1
  },
  // border: {
  //   // 是否绘制border
  //   top: 1,
  //   bottom: 1,
  //   left: 1,
  //   right: 1
  // },
  volumeHeight:150,//trend 模式时 成交量盒子的高度
  axisTextHeight:30,//trend模式时 中间文字间隔高度
  padding: {
    //padding 的距离
    left: 50,
    right: 30,
    top: 40,
    bottom: 40
  },
  yDensityShow: true,//是否显示y轴密度刻度线
  yDensityVal: [5, 9],//填写y轴固定密度范围，（显示密度刻度线时有效） 根据可视高度  调整合理的密度范围
  xDensityShow: true
}


function sizeRem(windowWidth, n) {
  // 尺寸自适应 计算出框架的自适应宽高
  return windowWidth / 750 * n;
}

function dataSizeToFrameSizeHeight(frameH, size) {
  return frameH * size;
}
function dataSizeToFrameSizeWidth(size) {
  var _width = this.width - this.padding.left - this.padding.right;
}

function densityAxisY(opt) {
  // ---(计算)
  // 计算y轴的刻度或密度线
  // maxVal：数据中最大值； minVal：数据中最小值； _arrData：每项数据数组； _flag：1个刻度值大小； 


  var maxVal = null, minVal = null, _arrData, _abs = 0, _flag;
  opt.series.forEach(function (item, index) {
    _arrData = item.data;
    maxVal == null ? maxVal = Math.max(..._arrData) : null;
    minVal == null ? minVal = Math.min(..._arrData) : null;
    maxVal < Math.max(..._arrData) ? maxVal = Math.max(..._arrData) : null; //获取所有 数组中最大的值
    minVal > Math.min(..._arrData) ? minVal = Math.min(..._arrData) : null; //获取所有 数组中最小的值
  });
  _abs = maxVal - minVal;//获取最大值到最小值之间的范围


  if (opt.type == "trend") {
    
    _abs = maxVal - opt.preclose_px;
    _abs > opt.preclose_px - minVal ? null : _abs = opt.preclose_px - minVal;
    // 如果是分时图，显示分时图样式
    return {
      scaleY: this.frameH / 4 , //单个绘图值尺寸 --绘图
      scale: _abs / 2,//单个刻度值 --数据（展现）
      val: 4,//刻度数量
      minValHeight: this.frameH / 2,
      // minVal: minVal //最小刻度值 --数据（展现）
    };
  }
  function minValFun(val, len, j) {
    // ---(计算)
    //获取刻度最小值 
    if (minVal < 0 && maxVal >= 0) {
      //最小值小于 0 并且 最大值大于等于0  
      for (var i = 1; i < len; i++) {
        if (0 - val * i < minVal) {
          return 0 - val * i;
        }
      }
    } else if (minVal == 0) {
      // 最小值等于0 
      return 0;
    } else if (minVal > 0 || maxVal < 0) {
      // 最小值大于0 或者 最大值小于0 
      return Math.floor(minVal - minVal * (j / 100));
    }
  }
  for (var j = 0; j < 50; j++) {
    // 在数据绝对范围，在  5%-50% 之间 找到合理刻度
    for (var i = opt.yDensityVal[0]; i < opt.yDensityVal[1]; i++) {
      // 刻度数量  在densityVal范围之内
      _flag = Math.floor((_abs + _abs * (j / 100)) / i);
      if ((_flag * i / _abs - 1) < 0.3 && minValFun(_flag, i, j) + (_flag * i) > maxVal) {
        var _minval = minValFun(_flag, i, j);
        return {
          scaleY: dataSizeToFrameSizeHeight(this.frameH, _flag / (_flag * i), i),//单个绘图值尺寸 --绘图
          scale: _flag,//单个刻度值 --数据（展现）
          val: i,//刻度数量
          minValHeight: dataSizeToFrameSizeHeight(this.frameH, _minval / (_flag * i)),
          minVal: _minval //最小刻度值 --数据（展现）
        };
      }
    }
  }
}
function densityAxisX(opt) {
  // ---(计算)
  // 计算x轴的刻度或密度线
  if (opt.type == "trend") {
    return {
      scaleX: this.frameW / 4,//单个绘图值尺寸 --绘图
      val:5,
    }
  }else{
    return {
      scaleX: this.frameW / (opt.categories.length - 1),//单个绘图值尺寸 --绘图
      val: opt.categories.length - 1,
    }
  }
}
function renderLine(ctx, moveX, endX, moveY, endY) {
  // ---(绘图)
  // 画直线
  // moveX--x轴起点  endX--x轴终点  moveY--y轴起点   endY--y轴终点
  ctx.moveTo(moveX, moveY);
  ctx.lineTo(endX, endY);
}
function renderText(ctx, text, x, y ,color) {
  // ---(绘图)
  // 写文字
  ctx.setFillStyle(color);
  ctx.fillText(text, x, y );
}
function renderAxisX(ctx, opt, densityX, arr) {
  // ---(绘图)
  // 绘制x轴坐标
  var timeArr = ['09:30', '10:30','11:30/13:00','14:00','15:00'];
  ctx.beginPath();
  ctx.setStrokeStyle(this.lineColor);
  ctx.setLineWidth(0.2);
  renderLine(ctx, this.startX, this.endX, this.startY, this.startY)
  ctx.setTextAlign('center')
  if (opt.type == 'trend') {
    renderLine(ctx, this.startX, this.endX, this.endY, this.endY)
    ctx.setFontSize('12');
    ctx.setLineWidth(0.2);
    for (var i = 0; i < densityX.val; i++) {
      i == 0 ? ctx.setTextAlign('left') : i == densityX.val - 1 ? ctx.setTextAlign('right') : ctx.setTextAlign('center');
      ctx.fillText(timeArr[i], this.startX + densityX.scaleX * i, this.startY + 10);//渲染x轴刻度值
      renderLine(ctx, this.startX + densityX.scaleX * i, this.startX + densityX.scaleX * i, this.startY, this.endY)//渲染x轴 密度线
      renderLine(ctx, this.startX + densityX.scaleX * i, this.startX + densityX.scaleX * i, this.startY + this.volumeHeight + this.axisTextHeight, this.startY + this.axisTextHeight)//渲染x轴成交量 密度线
    }
  }else{
    for (var i = 0; i < densityX.val; i++) {
      ctx.fillText(arr[i], this.startX + densityX.scaleX * i, this.startY + 15);//渲染x轴刻度值
      renderLine(ctx, this.startX + densityX.scaleX * i, this.startX + densityX.scaleX * i, this.startY, this.endY)//渲染x轴 密度线
      renderLine(ctx, this.startX + densityX.scaleX * i, this.startX + densityX.scaleX * i, this.startY, this.startY + 5)//渲染x轴 密度线
    }
  }
  ctx.closePath();
  ctx.stroke();
}



function renderAxisY(ctx, opt, densityY) {
  // ---(绘图)   渲染y轴 刻度线  密度线  刻度值  
  // 绘制Y轴坐标opt.yDensityShow --是否显示y轴刻度  densityY---y轴密度{scale：刻度值，val：刻度数量}
  var _scale = 0;

  ctx.beginPath();
  ctx.setStrokeStyle(this.lineColor);
  ctx.setLineWidth(0.2);
  renderLine(ctx, this.startX, this.startX, this.startY, this.endY)//渲染y轴 坐标
  if (opt.type == 'trend') {
    renderLine(ctx, this.endX, this.endX, this.startY, this.endY)//渲染y轴 坐标 
    // 成交量
    renderLine(ctx, this.startX, this.endX, this.startY + this.axisTextHeight, this.startY + this.axisTextHeight)//渲染y轴 成交量 坐标 
    renderLine(ctx, this.startX, this.endX, this.startY + this.volumeHeight + this.axisTextHeight, this.startY + this.volumeHeight + this.axisTextHeight)//渲染y轴 成交量 坐标        
    renderLine(ctx, this.startX, this.endX, this.startY + this.volumeHeight/2 + this.axisTextHeight, this.startY + this.volumeHeight/2 + this.axisTextHeight)//渲染y轴 成交量 坐标        

  }else{
    for (let i = densityY.val; i >= 0; i--) {
      _scale = densityY.minVal + densityY.scale * i;
      ctx.setTextAlign('right')
      ctx.fillText(_scale, this.startX - 8, this.startY - densityY.scaleY * i + 3);//渲染y轴刻度值
      renderLine(ctx, this.startX, this.startX - 5, this.startY - densityY.scaleY * i, this.startY - densityY.scaleY * i)//渲染y轴 密度线
    }
  }
  ctx.closePath();
  ctx.stroke();

  //渲染y轴 密度线
  if (opt.yDensityShow || opt.type == 'trend') {
    ctx.beginPath();
    ctx.setStrokeStyle(this.lineColor);
    ctx.setLineWidth(0.2);
    ctx.setFontSize('10');
    ctx.setFillStyle('#666666');
    for (let i = densityY.val; i >= 0; i--) {
      renderLine(ctx, this.startX, this.endX, this.startY - densityY.scaleY * i, this.startY - densityY.scaleY * i)//渲染y轴 密度线
    }
    ctx.closePath();
    ctx.stroke();
  }
}



function renderTrendText(ctx, opt, densityY){
  // 渲染trend模式下 左右价格 和涨幅数据 
  var _color = '#000000';
  ctx.beginPath();
  ctx.setTextAlign('left');
  ctx.setFontSize('12');
  ctx.setFillStyle(_color);
  renderText(ctx, (opt.preclose_px + densityY.scale * 2).toFixed(2), this.startX, (this.endY + 10), 'red');//左边 价格顶部
  renderText(ctx, opt.preclose_px, this.startX, (this.height - this.volumeHeight - this.axisTextHeight) / 2 - 2, _color);//左边 昨日收盘价 
  renderText(ctx, (opt.preclose_px - densityY.scale * 2).toFixed(2), this.startX, this.startY - 2, 'green');//左边 价格底部
  ctx.setTextAlign('right');
  renderText(ctx, (densityY.scale * 2 / opt.preclose_px * 100).toFixed(2) + '%', this.endX - 3, (this.endY + 10), 'red');//左边 价格顶部
  renderText(ctx, '0.00%', this.endX - 3, (this.height - this.volumeHeight - this.axisTextHeight)/ 2 - 2, _color);//左边 昨日收盘价 
  renderText(ctx, '-' + (densityY.scale * 2 / opt.preclose_px * 100).toFixed(2) + '%', this.endX - 3, this.startY - 2, 'green');//左边 价格底部
  ctx.closePath();
  ctx.stroke();
}


function renderFrame(opt, ctx) {
  // ---(搭框架)
  // 绘制框架
  // opt.farme.renderAxisX  x轴坐标 0 隐藏   1 显示
  // opt.farme.renderAxisY  y轴坐标 0 隐藏   1 显示 
  // sizeRem.call(this,opt);

  this.frameW = this.width - this.padding.right - this.padding.left;//实际绘图容器的宽度，除去padding
  this.frameH = this.height - this.padding.top - this.padding.bottom - (this.type == 'trend' ? (this.volumeHeight + this.axisTextHeight) : 0) ;//实际绘图容器的高度，除去padding

  this.startX = this.padding.left;
  this.endX = this.width - this.padding.right;
  this.startY = this.frameH + this.padding.top;
  this.endY = this.padding.top;
  this.lineColor = opt.lineColor;
  this.densityY = densityAxisY.call(this, opt);//计算出y轴合理密度
  this.densityX = densityAxisX.call(this, opt);//计算出y轴合理密度
  
  opt.farme.renderAxisX == 1 ? renderAxisX.call(this, ctx, opt, this.densityX, opt.categories) : null;
  opt.farme.renderAxisY == 1 ? renderAxisY.call(this, ctx, opt, this.densityY) : null;
  
}



var line = function line(option) {
  var option = Object.assign(option, config); //合并两个配置对象

  this.type = option.type;//图表类型
  //size处理
  var widowW = option.windowWidth;
  this.width = sizeRem(widowW, option.width);
  this.height = sizeRem(widowW, option.height );
 
  this.padding = {
    left: sizeRem(widowW, option.padding.left),
    right: sizeRem(widowW, option.padding.right),
    top: sizeRem(widowW, option.padding.top),
    bottom: sizeRem(widowW, option.padding.bottom)
  };
  this.volumeHeight = sizeRem(widowW, option.volumeHeight);
  this.axisTextHeight = sizeRem(widowW, option.axisTextHeight);
  

  // trend 图表参数
  if (this.type == 'trend'){
    this.trendXWidth = (this.width - this.padding.left - this.padding.right) / 240;//1分钟的宽度
    this.preclose_px = option.preclose_px;//昨日收盘价
    this.business_amount = option.business_amount;
    this.BA_max = option.business_amount? Math.max(...option.business_amount):null;
    this.BA_color = option.BA_color;
  }
  
  
  // 样式参数
  this.lineWidth = option.lineWidth;//配置线款
  this.lineColor = option.color;//配置线条的颜色
  this.textColor = option.textColor;//配置文字的颜色

  this.context = wx.createCanvasContext(option.canvasId);//获取canvas
  
  renderFrame.call(this, option, this.context);//继承renderFrame的方法，渲染框架

  this.categories = option.categories;//数据--类别--例如：日期时间
  this.series = option.series;//折线图数据

  this.init();

  this.type == 'trend' ?renderTrendText.call(this,this.context, option, this.densityY):null;//如果是trend ,渲染text
  this.context.draw()

}
line.prototype.init = function () {
  // this.constructor = line;
  this.procData();
};
line.prototype.dY = function (d) {
  var _densityY = this.densityY;
  if (this.preclose_px) {
    return this.startY- (_densityY.scaleY / _densityY.scale * (d - this.preclose_px )) - _densityY.minValHeight;
  }
  return this.startY- (_densityY.scaleY / _densityY.scale * d) + _densityY.minValHeight;
};
line.prototype.dX = function (d) {
  if (this.preclose_px){
    return this.padding.left +  this.trendXWidth *d ;
  }
  var _densityX = this.densityX;
  return this.padding.left + (_densityX.scaleX * d);
};
line.prototype.dval = function(d){
  return this.height - this.padding.bottom - this.volumeHeight / this.BA_max * d;
}

line.prototype.procData = function () {
  //渲染数据--（绘图）
  var _startX = null, _startY = null, me = this,_first;
  function fillBlock() {
    // trend 样式时 填充渲染
    me.context.setStrokeStyle('rgba(0, 0, 0, 0)') ;
    me.context.setFillStyle('rgba(245, 187, 182, .3)');
     me.context.lineTo(_startX, me.startY);
     me.context.lineTo(me.startX, me.startY);
     me.context.lineTo(me.startX, _first);
     me.context.fill();
  };
  // 渲染走势图
  this.series.forEach(function (item, index) {
    me.context.beginPath();
    me.context.setStrokeStyle(item.color);
    me.context.setLineWidth(item.width);
    item.data.forEach(function (d, i) {
      if (_startX == null && _startX == null) {
        _startX = me.dX(i);
        _startY = me.dY(d);
        _first = me.dY(d);
        me.context.moveTo(_startX, _startY);
      } else {
        me.context.lineTo(me.dX(i), me.dY(d));
        _startX = me.dX(i);
      }
    });
    me.context.stroke();
    if (index == 0 && me.type=='trend' ){
      fillBlock() 
    }
    me.context.stroke();
    _startX = null;
    _startY = null;
  });
  // 渲染成交量
  if (this.business_amount) {
    this.business_amount.forEach(function (item, index) {
      me.context.beginPath();
      me.context.setStrokeStyle(me.BA_color[index]);
      me.context.setLineWidth(me.trendXWidth);
      me.context.moveTo(me.startX+index * me.trendXWidth, me.height - me.padding.bottom);
      me.context.lineTo(me.startX+index * me.trendXWidth, me.dval(item));
      me.context.closePath();
      me.context.stroke();
    })
  }
}

var bar = function bar(opt) {

}


module.exports = {
  line: line,
  bar: bar
}