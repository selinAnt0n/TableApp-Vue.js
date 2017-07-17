function getXMLDocument(url)  {  //Получение одномерного XML

	    var xml; 

	    if(window.XMLHttpRequest)  {  
	        xml = new window.XMLHttpRequest();  
	        xml.open("GET", url, false);  
	        xml.send("");  
	        return xml.responseXML;  
	       
	    }  else  {
	        
	        if(window.ActiveXObject) {  
	            xml=new ActiveXObject("Microsoft.XMLDOM");  
	            xml.async=false;  
	            xml.load(url);   
	            return xml;   
	        }  else  {  
	            alert("Загрузка XML не поддерживается браузером");  
	            return null;  
	        }  
	    }
	}
		
	var arr = [];

	var xml = getXMLDocument('upload/workSpace.xml');

    var allRow2 = xml.getElementsByTagName('Row');

    var xml = getXMLDocument('upload/workSpace.xml');

    var allRow = xml.getElementsByTagName('Data');

    var obj = [];

    for (var c = 0;c < allRow.length;c++) {
    	
        var test = Number.isNaN(+$(allRow[c]).text());

        if (test) {

            obj.push($(allRow[c]).text());
        } else {
        	
            obj.push(+$(allRow[c]).text());
        }
    }

	arr = obj;

	parseArr(arr,$(allRow2[0]).find( "Data" ).length);







	$(".raido-holder input").on("change", function (e) {




		if ($(e.target).attr("id") == "uploadFileMet") {

			var xml = getXMLDocument('upload/workSpace.xml');

		} else {
			
			var xml = getXMLDocument('convertBox/convertVersion.xml');

		}




        



		
	})




    function parseArr(arrXml,count) {	//парсинг XML

		var globalArr = [];

		var row = arrXml.length/count;

		for (var i = 0;i < row;i++) {
			var str = "";
			
			globalArr[i] = new Array();
			for (var j = 0;j < count;j++) {
		
				globalArr[i][j] = arrXml[(i*count)+j];
			}
		}

		arr = globalArr;	

	}





	$('.globalColum .moreKeyWord').click(function (e) {

		var holder = document.createElement("div");
		var input = document.createElement("INPUT");
		var button = document.createElement("button");

		input.setAttribute("type", "text");

		$(button).addClass("delWord");
		$(button).text("Удалить");

		$(holder).addClass("keyWord");

		holder.append(button);
		holder.append(input);

		$(this).next().append(holder);
	});

	$('.holderKeyWords').on('click', '.delWord', function (e) {

		$(e.target).parent().remove();
	});















	

























	$(".go").click(function () {

		var holder = $(this).parent();

		var step1 = $(this).next().next().next().next();

		var step2 = $(step1).find('.keyWord');

		var step3 = $(step2).find('input');

		$(step2).removeClass("noSearch");

		var globalArr = [];


		function searchWords() {

			var allWord = step3;

			var resultHolder = $(holder).find(".result-box");

			$(resultHolder).find("span").remove();

			globalCount = allWord.length;

			for (var i = 0;i < arr.length;i++) {

				let str =  arr[i][0];

				if (!(isNaN(str))) {

					return console.warn("конец таблицы !");

				} else {
					str = str.toLowerCase();
				}

				let innerCount = 0;

				for (var j = 0;j < globalCount;j++) {

					let searStr = $(allWord[j]).val();

					searStr = searStr.toLowerCase();
					
					if ( str.indexOf(searStr,0) >= 0) {

						innerCount++;

					}

				}

				if (globalCount == innerCount) {
					globalArr.push(arr[i]);
				}
			}
		}







		function searchWordsStrict() {

			var allWord = step3;

			var resultHolder = $(holder).find(".result-box");

			$(resultHolder).find("span").remove();

			globalCount = allWord.length;

			for (var i = 0;i < arr.length;i++) {

				let str =  arr[i][0];

				if (!(isNaN(str))) {

					return console.warn("конец таблицы !");

				} else {

					str = str.toLowerCase();

				}

				let innerCount = 0;

				for (var j = 0;j < globalCount;j++) {

					let searStr = $(allWord[j]).val();

					searStr = searStr.toLowerCase();
					
					if ( str.indexOf(searStr,0) >= 0) {

						innerCount++;

					}

				}

				let reCreateArr = str.split(" ");

				let strictCount = 0;


				for (var t = 0;t < reCreateArr.length;t++) {
					for (var k = 0;k < arrWords.length;k++) {
						if (reCreateArr[t] == arrWords[k]) {
							strictCount++;
						}
					}
				}
			
				if (globalCount == innerCount && (reCreateArr.length - strictCount) == globalCount) {
				
					globalArr.push(arr[i]);
				
				}
			}
		}


		var strictMode = $(holder).find('.strickCheck');


		if (strictMode.prop("checked")) {
			searchWordsStrict();
		} else {
			searchWords();
		}
		

		var counterSearch = $(holder).find('.counterSearch');

		$(counterSearch).find('strong').text(globalArr.length);

		if (globalArr.length > 0) {
			mathSTR(globalArr);
		} else {
			$(step2).addClass("noSearch");
		}
		


		function mathSTR (arr) {	//Расчет

			var endArr = [];

			var count = arr[0].length;

			for (var k = 0;k < count;k++) {
				endArr[k] = 0;
			}
			
			if (arr.length <= 0) {

			} else {
				endArr.unshift(arr[0][0]);
				var str = '';
				for (var i = 0;i < arr.length;i++) {
					for (var j = 1; j < arr[i].length;j++) {

						if (typeof arr[i][j] == typeof str){
					
							if ( !isNaN(parseInt(arr[i][j])) ) {

								str = arr[i][j];
								str = str.replace(/\s+/g,'');
								str = str.replace(/,/g,'.');
								arr[i][j] = parseFloat(str)/100;

							}
						}

						endArr[j] += arr[i][j];
					}
				}
				endArr.pop();
				
				viewInfo(endArr);
			}
		}
		function viewInfo (arr) {   //Отображение расчета

			var count = arr.length;

			var result = $(holder).find('.result-box');

			var holderEndInfo = result[0];

			var row = document.createElement('span');

			$(row).addClass("row");
		
			for (var x = 0; x < count;x++) {
				var col = document.createElement('span');
				var widthCol = 98/count;
				$(col).addClass('col');
				$(col).css('width',widthCol + "%");

				if (!isNaN(arr[x])) {
					if (arr[x] == 0 ) {
						$(col).text(arr[x]);
					} else {
						var numberTest = arr[x] + "";
						if (numberTest.length > 4) {
							
							arr[x] = arr[x].toFixed(1);
							$(col).text(arr[x]);

						} else {
							$(col).text(arr[x]);
						}
					}
				} else {

					$(col).text(arr[x]);

				}
				
				row.appendChild(col);

			}

			holderEndInfo.appendChild(row);
			$(".row > span:first-of-type").text("___");
		}
	});