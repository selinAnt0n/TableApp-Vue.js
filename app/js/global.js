var convertApp = new Vue({
	el:"#convertApp",
	data: {
		procentNew: 0,
		countRowOld:0,
		oldTime: 0,
		timeWork:0,
		arr:[],
		countColumn:0,
		registNeed: false,
		spaceNeed:false,
		result:[],
		widthSpan: 0,

	},
	methods: {
		startConvert: function () {

			this.getXMLDocument();

			this.oldTime = performance.now();
			// Спид тест

			this.parseArr(this.arr,this.countColumn);

			var xml;  //Создание нового файла

		    if(window.XMLHttpRequest) {  
		        xml=new window.XMLHttpRequest();  
		        xml.open("GET", 'upload/workSpace.xml', false);  
		        xml.send("");  		       
		    }  
		    else  { 
		        
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

		    xml = xml.responseXML;

		    var xmlData = xml.getElementsByTagName('Data');

		    var newXMLitem = $('.result-box .col');

		    for (var i = 0;i < xmlData.length;i++) {
	    		if (newXMLitem[i] == undefined) {

	    			$(xmlData[i]).text('');

	    		} else {
	    			
	    			var item = $(newXMLitem[i]).text();
	    	  		$(xmlData[i]).text(item);

	    			var strObj = xmlData[i].outerHTML;

	    	  		var testItem = $(newXMLitem[i]).text();

	    			if (!isNaN(testItem)) { // Переструктурирование XML DOM в зависимости от типа данных в ячейке

	    				xmlData[i].outerHTML = strObj.replace('ss:Type="String"','ss:Type="Number"');

	    			} else if (typeof testItem == typeof "string") {

	    				xmlData[i].outerHTML = strObj.replace('ss:Type="Number"','ss:Type="String"');

	    			}	    			

	    		}

		    }

			var serializer = new XMLSerializer();
			serialized = serializer.serializeToString(xml);

		    $.ajax({
			  type: "POST",
			  url: "some.php",
			  data: "string=" + serialized,
			  response:"text",
			  cache:false,
			  success: function(msg){
			  	
			  }
			});
		},
		parseArr: function (arrXml,count) {
			let globalArr = [];

			let row = arrXml.length/count;

			for (let i = 0;i < row;i++) {
				let str = "";
				
				globalArr[i] = new Array();
				for (var j = 0;j < count;j++) {
			
					globalArr[i][j] = arrXml[(i*count)+j];
				}
			}

			this.searchName(globalArr);
			
		},
		getXMLDocument: function () {

			var xml;

			function getXML () {
				if(window.XMLHttpRequest) {  
			        xml = new window.XMLHttpRequest();  
			        xml.open("GET", 'upload/workSpace.xml', false);  
			        xml.send("");  
			        return xml.responseXML;   
			    }  
			    else if(window.ActiveXObject) {  
		            xml=new ActiveXObject("Microsoft.XMLDOM");  
		            xml.async=false;  
		            xml.load(url);   
		            return xml;   
			    } else {  
		            alert("Загрузка XML не поддерживается браузером");  
		            return null;  
			    }
			}
		    
		    var xml = getXML();

	        let allRow = xml.getElementsByTagName('Data');

	        this.countColumn = $(xml.getElementsByTagName('Row')[0]).find("Data").length;

	        let obj = [];

	        for (var c = 0;c < allRow.length;c++) {
	        	
	            var test = Number.isNaN(+$(allRow[c]).text());

	            if (test) {

	                obj.push($(allRow[c]).text());
	            } else {
	            	
	                obj.push(+$(allRow[c]).text());
	            }
	        }

			this.arr = obj;
		},
		searchName: function (arr) {

			var count = 0;

			var resultBox = [];

			var resultKey = [];

			this.countRowOld = arr.length;

			var mirrorArr = Object.assign([], arr.map(el => Object.assign([],el)));

			if ( this.spaceNeed  || this.registNeed ) {
				for (var k = 0;k < mirrorArr.length;k++) {

					var item = mirrorArr[k];

					if (this.spaceNeed  && this.registNeed) {

						if (!isNaN(item)) {

							item[0] = item[0].replace(/\s/ig, "");

						} else {

							item[0] = item[0].toLowerCase().replace(/\s/ig, "");

						}

					} else if (this.spaceNeed) {

						item[0] = item[0].replace(/\s/ig, "");

					} else if (this.registNeed) {

						
						if (!isNaN(item)) {

						} else {
							item[0] = item[0].toLowerCase();
						}
					}
				}
			}

			for (var i = 0;i < mirrorArr.length; i++) {

				if ( i == 0 ) {

					resultBox[0] = [];

					resultBox[0].push(arr[0]);
			
					resultKey[0] = (mirrorArr[0][0]);

					count++;

				}

				let index = resultKey.indexOf(mirrorArr[i][0]);


				if ( index == -1  && i !== 0) {

					resultBox[count] = [];
					
					resultBox[count].push(arr[i]);

					resultKey[count] = (mirrorArr[i][0]);

					count++;


				} else if (i !== 0) {


					if (typeof resultBox[index] == "object") {

					} else {
						resultBox[index] = [];
					}
					
					resultBox[index].push(arr[i]);

				}

			}

			this.MathArr( resultBox );

		},
		MathArr: function (arr) {
			
			var result = [];

			for (var i = 0;i < arr.length;i++) {

				var box = [];

				var miniArr = arr[i];

				box[0] = miniArr[0][0];

				for (var j = 0;j < miniArr.length;j++) {

					for (var k = 1;k < miniArr[j].length;k++) {

						if (j == 0) {

							box[k] = +miniArr[j][k];



						} else {

							box[k] +=  +miniArr[j][k];

						}
						
					}

				}

				result.push( box );

			}


			for (var e = 0;e < result.length;e++) {

				for (var h = 0;h < result[e].length;h++) {

					if (h == 0) {

					} else {

						result[e][h] = (+result[e][h]).toFixed(3);

					}

				}

			}

			this.timeWork = +(performance.now() - this.oldTime).toFixed(0) + "Мс";

			this.result = result;

			this.widthSpan = 100/this.result[0].length;

			this.procentNew = 100 - ((this.result.length / this.countRowOld ) * 100);
			

		},
		createFile: function () {

			var xml;  //Создание нового файла

		    if(window.XMLHttpRequest) {  
		        xml=new window.XMLHttpRequest();  
		        xml.open("GET", 'upload/workSpace.xml', false);  
		        xml.send("");  		       
		    }  
		    else  { 
		        
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

		    xml = xml.responseXML;

		    var xmlData = xml.getElementsByTagName('Data');

		    var newXMLitem = $('.result span');

		    for (var i = 0;i < xmlData.length;i++) {

	    		if (newXMLitem[i] == undefined) {

	    			$(xmlData[i]).text('');

	    		} else {
	    			
	    			var item = $(newXMLitem[i]).text().replace(/\s/ig,"");
	    	  		$(xmlData[i]).text(item);

	    			var strObj = xmlData[i].outerHTML;

	    	  		var testItem = $(newXMLitem[i]).text();

	    			if (!isNaN(testItem)) { // Переструктурирование XML DOM в зависимости от типа данных в ячейке

	    				testItem = 

	    				xmlData[i].outerHTML = strObj.replace('ss:Type="String"','ss:Type="Number"');

	    			} else if (typeof testItem == typeof "string") {

	    				xmlData[i].outerHTML = strObj.replace('ss:Type="Number"','ss:Type="String"');

	    			}	    			

	    		}

		    }

			var serializer = new XMLSerializer();

			serialized = serializer.serializeToString(xml);

		    $.ajax({
			  type: "POST",
			  url: "some.php",
			  data: "string=" + serialized,
			  response:"text",
			  cache:false,
			  success: function(msg){
			  	$(".buttonDown")[0].click();
			  }
			});

		}

	}
});

var tableStepOne = new Vue({
	el:"#uploadFile",
	data: {
		files:0,
		resultAjax: "",
	},
	methods: {
		changeFile: function (e) {

			let name = e.srcElement.files[0].name.split(".");

			if (name[1] === "xml" ) {

				this.files = e.srcElement.files;

			} else {
			
				this.resultAjax = "Неверный тип файла";

			}
		
			if (this.files) {

				var data = new FormData();
		    	$.each( this.files, function( key, value ){
		        	data.append( key, value );
		    	});

		    	$.ajax({
			        url: './submit.php?uploadfiles',
			        type: 'POST',
			        data: data,
			        cache: false,
			        dataType: 'json',
			        processData: false, // Не обрабатываем файлы (Don't process the files)
			        contentType: false, // Так jQuery скажет серверу что это строковой запрос
			        success: function( respond, textStatus, jqXHR ){
			 
			            if( typeof respond.error === 'undefined' ){

							tableStepOne.resultAjax = "Успешно загружен";

			            }
			            else{
			                console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
			            }
			        },
			        error: function( jqXHR, textStatus, errorThrown ){
			            console.log('ОШИБКИ AJAX запроса: ' + textStatus );
			        }
			    });

			}
			
		},
	}
});

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