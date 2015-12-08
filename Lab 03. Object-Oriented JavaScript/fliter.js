// 窗口加载
window.onload = function() {
	var tables = getAllTables();
	makeAllTablesFilterable(tables);
}


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
				// search方法返回搜索字段的下标，若不等于-1表示能搜索到
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
