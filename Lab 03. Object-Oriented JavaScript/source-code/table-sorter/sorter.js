//窗口加载
window.onload = function() {
  var tables = getAllTables();
  makeAllTablesSortable(tables);
  makeAllTablesFilterable(tables);
}

//获得表格
function getAllTables() {
  return document.getElementsByTagName("table");
}

/*******************fliter*********************/
// 在每个表格前面创建输入框并执行过滤表格函数
function makeAllTablesFilterable(tables) {
  for (var i = 0; i < tables.length; i++) {
    var Textbox = document.createElement('input');
    document.body.insertBefore(Textbox, tables[i]);
    filterTheTable(tables[i], Textbox);
  }
}

// 过滤表格函数
function filterTheTable(table, Textbox) {
  var Tbody = table.tBodies[0];
  var colRows = Tbody.rows;
  var temp_table = new Array;
  // 新建一个表格存储原始表格
  for (var i = 0; i < colRows.length; i++) {
    temp_table[i] = colRows[i];
  }
  Textbox.oninput = function() {
    for (var i = Tbody.childNodes.length - 1; i >= 0 ; i--) {
      Tbody.removeChild(Tbody.childNodes[i]);
    }
    // 通过备用表格，将表格还原为原始表格
    for (var i = 0; i < temp_table.length; i++) {
      Tbody.appendChild(temp_table[i]);
    }
    var aTrs = new Array;
    for(var i = 0; i < colRows.length; i++) {
      var checked = false;
      for(var j = 0; j < colRows[i].cells.length; j++) {
        var index = colRows[i].cells[j].textContent.search(Textbox.value);
        // search返回搜索字段的下标，若不等于-1表示能搜索到
        if (index != -1) {
          // 布尔变量checked记录此行是否已被加入新表格
          if (!checked) {
            aTrs.push(colRows[i]);
            checked = true;
          }
          var str = colRows[i].cells[j].textContent;
          var substr1 = str.substring(0,index);
          var substr2 = Textbox.value;
          var substr3 = str.substring(index + substr2.length);
          colRows[i].cells[j].innerHTML = substr1 + '<span class="highlight">' + substr2 + "</span>" + substr3;
          // 定义关键字段的标签，实现突出显示
        }
      }
    }
    var new_table = document.createDocumentFragment();
    for (var i = 0; i < aTrs.length; i++) {
      new_table.appendChild(aTrs[i]);
    }
    // 删除旧表格
    for (var i = Tbody.childNodes.length - 1; i >= 0 ; i--) {
      Tbody.removeChild(Tbody.childNodes[i]);
    }
    // 创建新表格
    Tbody.appendChild(new_table);
  }
}

/*******************sorter*********************/
//初始表格状态
function makeAllTablesSortable(tables) {
    var size = tables.length;
    for (var i = 0; i < size; i++) {
      var table = tables[i];
      var thes =  table.getElementsByTagName("th");
      var length = thes.length;
      for (var j = 0; j < length; j++) {
        createPng(thes[j]);
        thOnmouse(table, thes[j], i+"");
      }
    }
}

//写入数据
function writeIn(table, allText, indexarray) {
  var columNum = table.getElementsByTagName("th").length;
  var rowNum = table.getElementsByTagName("tr").length;
  var trContent =  table.getElementsByTagName("tr");
  for (var i = 0; i < rowNum - 1; i++) {
    var tdContent = trContent[i+1].getElementsByTagName("td");
    for (var j = 0; j < columNum; j++) {
      tdContent[j].innerHTML = allText[(indexarray[i])][j];
    }
  }
}

//读取数据
function readFrom(table) {
  var columNum = table.getElementsByTagName("th").length;
  var rowNum = table.getElementsByTagName("tr").length;
  var text = new Array();
  for (var i = 0; i < rowNum - 1; i++) {
    text[i] = new Array();
  }
  var trContent =  table.getElementsByTagName("tr");
  for (var i = 0; i < rowNum - 1; i++) {
    var tdContent = trContent[i+1].getElementsByTagName("td");
    for (var j = 0; j < columNum; j++) {
      text[i][j] = tdContent[j].innerHTML;
    }
  }
  return text;
}

//比较a和b
function comp(a, b) {
  for (var i = 0; i < a.length; i++) {
    if (parseInt(a[i]) != parseInt(b[i])) {
      return parseInt(a[i]) - parseInt(b[i]);
    }
  }
  return -1;
}

//定义Sort函数
function Sort(a, b) {
  var sign0 = '0';
  var sign9 = '9';
  if (a.substr(0,1).charCodeAt() >= sign0.charCodeAt() && a.substr(0,1).charCodeAt() <= sign9.charCodeAt() ) {
      var A = new Array();
      var B = new Array();
      if (a.indexOf("-") != -1) {
        A = a.split('-');
        B = b.split('-');
        return comp(A, B);
      }
      return parseInt(a) - parseInt(b);
  } else {
    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        return a[i].charCodeAt() - b[i].charCodeAt();
      } else {}
    }
  }
  return -1;
}

function trans(columText, indexArr) {
  var index = new Array();
  for (var i = 0; i < indexArr.length; i++) {
    for (var j = 0; j < columText.length; j++) {
      if (indexArr[i] == columText[j]) {
        index[i] = j;
        break;
      }
      }
    }
  return index;
}

//升序
function ascOrder(allText, index, table) {
  var columNum = table.getElementsByTagName("th").length;
  var rowNum = table.getElementsByTagName("tr").length;
  var tres =  table.getElementsByTagName("tr");
  var indexArr = new Array();
  var columFirst = new Array();
  var columLast = new Array();
  for (var i = 0; i < rowNum-1; i++) {
    columFirst[i] = allText[i][index-1];
    columLast[i] = allText[i][index-1];
  }
  indexArr = columFirst.sort(Sort);
  var index = trans(columLast, indexArr);
  writeIn(table, allText, index);
}

//降序
function dscOrder(allText, index, table) {
  var columNum = table.getElementsByTagName("th").length;
  var rowNum = table.getElementsByTagName("tr").length;
  var trContent =  table.getElementsByTagName("tr");
  var indexArr = new Array();
  var columFirst = new Array();
  var columLast = new Array();
  for (var i = 0; i < rowNum-1; i++) {
    columFirst[i] = allText[i][index-1];
    columLast[i] = allText[i][index-1];
  }
  indexArr = columFirst.sort(Sort);
  var index = trans(columLast, indexArr);
  writeIn(table, allText, index);
  index = index.reverse();
  writeIn(table, allText, index);
}

//定义标签
function myIndex(x) {
  var first = x.class;
  var sign = "biaoqian";
  var parent = x.parentNode;
  var tagName = x.nodeName;
  x.class  = sign;
  var xs = parent.getElementsByTagName(tagName);
  var i;
  for (i = 0; i < xs.length; i++) {
    if (xs[i].class == sign) {
      break;
    }
  }
  x.class = first;
  return i+1;
}


//创建三角形
function createPng(oneth) {
  var div = document.createElement("div");
  var img = document.createElement("img");
  div.appendChild(img);
  img.src = "descend.png";
  img.className = "sortDsc";
  div.style.backgroundColor="rgb(3,27,125)";
  img.style.backgroundColor="rgb(3,27,125)";
  img.style.verticalAlign="middle";
  img.style.position="relative";
  img.style.left="4px";
  div.className="rightdivimg";
  var height = oneth.style.height;
  div.style.display = "inline-block";
  div.style.float="right";
  div.style.cssFloat = "right";
  div.style.floatStyle = "right";
  oneth.appendChild(div);
}

//定义鼠标动作事件
function thOnmouse(table, oneth, classname) {
  oneth.class = classname;
  var img = oneth.getElementsByTagName("div")[0].getElementsByTagName("img")[0];
  var div = oneth.getElementsByTagName("div")[0];
  oneth.onmousemove = function(){
    this.style.backgroundColor="rgb(156, 175, 252)";
    div.style.backgroundColor="rgb(156, 175, 252)";
    img.style.backgroundColor="rgb(156, 175, 252)";
  }
  oneth.onmouseout = function(){
    this.style.backgroundColor="rgb(3,27,125)";
    div.style.backgroundColor="rgb(3,27,125)";
    img.style.backgroundColor="rgb(3,27,125)";
  }
  oneth.onclick = function() {
    var s = img.src;
    var string = s.substring(s.lastIndexOf("/")+1);
    var allText = readFrom(table);
    var index = myIndex(this);
    if (string == "descend.png") {
      img.src = "ascend.png";
      dscOrder(allText, index, table);
    } else {
      img.src = "descend.png";
      ascOrder(allText, index, table);
    }
  }
}
