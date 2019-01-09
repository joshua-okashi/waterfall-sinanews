var curPage = 1;
var perPageCount = 10;

// 数据懒加载
var clock;
var $target = $('#load');

$(window).on('scroll',function(){
  if(clock){
    clearTimeout(clock);
  }
  clock = setTimeout(function(){
    checkShow();
  },100)
});

//clock为函数节流，多次scroll事件，只执行最后一次，提升加载性能。

checkShow();

function checkShow(){
  if(isShow($target)){
    dosth();
  }
}

function isShow($el){
  var scrollH = $(window).scrollTop();
  var winH = $(window).height();
  var top = $el.offset().top;

  if(top < winH + scrollH){
    return true;
  }else{
    return false;
  }
}
// 判断元素是否出现在窗口。

// 后端获取数据

function dosth(){
  $.ajax({
    url: 'http://platform.sina.com.cn/slide/album_tech',
    type: 'get',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      app_key: '1271687855',
      num: perPageCount,
      page: curPage
    }
  }).done(function(ret){
    if(ret.status.code == 0){
      var dataArr = ret.data;
      var $nodes = renderData(dataArr);
        render($nodes);
        curPage++;
    }
  })
}  

// 拼装数据为hmtl格式，并添加数据到页面

function renderData(items){
  var tpl = '';
  var $nodes;

  for(var i = 0; i < items.length; i++){
    tpl += '<li class="item">';
    tpl += '  <a href="'+items[i].url +'" class="link"><img src ="'+items[i].img_url+'" alt=""></a>';
    tpl += '  <h4 class="header">'+items[i].short_name +'</h4>';
    tpl += '  <p class="desp">'+items[i].short_intro +'</p>';
    tpl += '</li>';
  }
  $nodes = $(tpl);
  $('#pic-ct').append($nodes)
  return $nodes;
}

// 瀑布流布局
var colSumHeight = [];

function render($nodes){
  var nodeWidth = $('.item').outerWidth(true);
  var colNum = Math.floor($('.wrap').width()/nodeWidth);
  // 计算所需要的列数
  console.log(colNum);
  if(colSumHeight.length == 0){
    for(var i=0; i<colNum; i++){
      colSumHeight[i] = 0;
      console.log(colSumHeight)
    }
  }
// 初始一个每列高度的数组
  $nodes.each(function(){
    var $cur = $(this);
    $(this).find('img').on('load',function(){ 
      var idx = 0;
      var minSumHeight = colSumHeight[0];
  
      for(var i=0 ; i<colSumHeight.length; i++){
        if(colSumHeight[i] < minSumHeight){
          idx = i;
          minSumHeight = colSumHeight[i];
        }
      }
  // 当图片载入完成在进行布局
      $cur.css({
        left: nodeWidth * idx,
        top: minSumHeight
      })
      colSumHeight[idx] += $cur.outerHeight(true);
    })
  })
}



