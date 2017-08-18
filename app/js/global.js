console.log("Welcome to Table App v.1.1   https://github.com/selinAnt0n/TableApp-Vue.js")
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

			// ============================
			// Start APP
			// ============================

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

			// ============================
			// Parse XML 
			// ============================
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

			// ============================
			// Download XML 
			// ============================

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

			// ============================
			// Search Names 
			// ============================

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

			// ============================
			// Marth all Names 
			// ============================
			
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

			// ============================
			// Create XML file 
			// ============================

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

					var item = $(newXMLitem[i]).text().replace(/(^\s*)|(\s*)$/g, '');

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

			// ============================
			// Upload new XML 
			// ============================

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
							console.error('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
						}
					},
					error: function( jqXHR, textStatus, errorThrown ){
						console.error('ОШИБКИ AJAX запроса: ' + textStatus );
					}
				});
			}
			
		},
	}
});

var strictApp = new Vue({ 
			// ============================
			// Strict APP
			// ============================
	el:"#strictApp",
	data: {
		words:["в","на","под"],
		text:""
	},
	methods:{
		addWord: function () {
			this.words.push(this.text);
			this.text = "";
		},
		delWord: function (word,index) {
			this.words.splice(index,1);
		}
	}
	
});

var arrWords = strictApp.words;


var createTask = new Vue({
			// ============================
			// Create tast APP
			// ============================
	el:"#createTask",
	data: {
		citys:[
			{
				name:"Карло",
				flag:false
			},
			{
				name:"Санат",
				flag:false
			},
			{
				name:"Лечен",
				flag:false
			}

		],
		textCity:"",
		choseCitys:[],
		templates:[
			{
				name:"Шаблон 1",
				data:[
					"лечен",
					"вар",
					"тур"

				],
				flag:false,
				visible:false
			},

		],
		newWords: [
			{
				text:"",
			},
		
		],
		choseTemps:[],
		wordTemp:"",
		nameTemp:"",
		countHolder:1,
		visible:false,
		showBox:false,
		downloadFile:true,
		convertFile:false,
		arr:[],
	},
	created: function () {

		var arr = [];

		var xml = this.getXMLDocument('upload/workSpace.xml');

		var allRow2 = xml.getElementsByTagName('Row');

		var xml = this.getXMLDocument('upload/workSpace.xml');

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

		this.arr = obj;

		this.parseArr(this.arr,$(allRow2[0]).find( "Data" ).length);
	},
	methods:{
		getXMLDocument: function (url) {
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
		},
		parseArr: function (arrXml,count) {
			var globalArr = [];

			var row = arrXml.length/count;

			for (var i = 0;i < row;i++) {

				var str = "";
				
				globalArr[i] = new Array();

				for (var j = 0;j < count;j++) {

					globalArr[i][j] = arrXml[(i*count)+j];

				}
			}

			this.arr = [];

			this.arr = globalArr;
		},
		useFile1: function () {

			this.downloadFile = true;
			this.convertFile = false;

			var xml = this.getXMLDocument('upload/workSpace.xml');
			this.getXml(xml);
		},
		useFile2: function () {

			this.downloadFile = false;
			this.convertFile = true;

			var xml = this.getXMLDocument('convertBox/convertVersion.xml');
			this.getXml(xml);
		},
		getXml: function (xml) {

			var allRow2 = xml.getElementsByTagName('Row');


			if (this.downloadFile) {

				var xml = this.getXMLDocument('upload/workSpace.xml');

			} else {

				var xml = this.getXMLDocument('convertBox/convertVersion.xml');

			}

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

			this.arr = obj;

			this.parseArr(this.arr,$(allRow2[0]).find( "Data" ).length);
		},
		choseCity: function (city,index) {

			city.flag = !city.flag;

			if (city.flag) {
				this.choseCitys.push(city.name);
			} else {
				for (var i =0;i < this.choseCitys.length;i++) {

					if (this.choseCitys[i] == city.name) {
						this.choseCitys.splice(i,1);
					}
				}
			}
		},
		choseTemp: function (temp,index) {

			temp.flag = !temp.flag; 

			if (temp.flag) {
				this.choseTemps.push(temp)
			}else {

				for (var i =0;i < this.choseTemps.length;i++) {

					if (this.choseTemps[i] == temp) {
						this.choseTemps.splice(i,1);
					}
				}
			}
		},
		addCity: function () {
			this.citys.push({
				name: this.textCity,
				flag:false
			});
			this.textCity = "";
		},
		addNewWord: function(newWord) {      
			this.newWords.push({ number: newWord.number });
		},
		removeNewWord: function(index) {

			this.newWords.splice(index,1);
		},
		addTempl: function () {

			let arr = [];
			for (var i = 0;i < this.newWords.length;i++) {
				arr.push(this.newWords[i].text);
			}
			this.templates.push({
				name: this.nameTemp,
				data:arr,
				flag:false,
				visible:false
			});
		},
		hoverTampl: function (temp) {
			return temp.visible = true;
		},
		hoverTamplOut: function (temp) {
			return temp.visible = false;
		},
	}
});

var workBox = new Vue({
			// ============================
			// Search APP
			// ============================
	el:"#workBoxesApp",
	data: {
		countWords:0,
		city:[],
		words:[],
		resultSearch:[],
		messege:"",
	},
	methods:{
		createBoxes:function () {
			this.words = [];

			this.city = createTask.choseCitys;

			let arr = createTask.choseTemps;

			var result = [];

			var lastarr = [];

			function createObj (data) {

				this.data = data;
				this.result = [];
				this.strictFlag = false;
				this.searchEmpty = false;
				this.strictShow = true;
				this.useExceptions = false;
				this.countFind = 0;

			}

			if (arr.length && !this.city.length) {
				this.messege = "";

				for (var j =0;j < arr.length;j++) {
					
					result.push(arr[j].data );

				}

				for (var k =0;k < result.length;k++) {

					let it = result[k];

					let dataItem =  {};

					dataItem = new createObj(it); 

					this.words.push(dataItem);

				}

			} else if (this.city.length && !arr.length) {
				this.messege = "";

				for (var i =0;i < this.city.length;i++){

					result.push( this.city[i] );

				}

				for (var k =0;k < result.length;k++) {

					let it = result[k];

					it.strict = false;
					let dataItem =  {};
					dataItem.data = [];
					dataItem.data.push(it);
					dataItem.result = [];
					dataItem.strictFlag = false;
					dataItem.searchEmpty = false;
					dataItem.strictShow = true;
					dataItem.useExceptions = false;

					dataItem.countFind = 0;

					this.words.push(dataItem);

				}

			} else if (this.city.length && arr.length) {
				this.messege = "";

				for (var i =0;i < arr.length;i++){
					for (var j =0;j < this.city.length;j++) {

						result.push(arr[i].data ,this.city[j] );

					}

				}

				for (var k =0;k < result.length;k=k+2) {

					let item = result[k];

					let it = result[k].concat(result[k+1]);

					let dataItem =  {};

					dataItem = new createObj(it); 

					this.words.push(dataItem);

				}
			} else {

				this.messege = "Выберите Город/Шаблон";

			}
		},
		useStrict: function (item,index) {
			
			item.strictFlag = !item.strictFlag;
		},
		startSearch: function (item,index) {

			item.countFind = 0;

			var arr = createTask.arr;

			var holder = $('.workbox')[index];

			var globalArr = [];

			var allWord = item.data;

			if (item.strictFlag) {

				globalCount = allWord.length;

				for (var i = 0;i < arr.length;i++) {

					let str =  arr[i][0];

					if (str == 0) {

						return console.warn("конец таблицы !");

					} else if (typeof str == typeof "test") {
						str = str.toLowerCase();
					} else{
						str = str + "";
					}

					let innerCount = 0;

					for (var j = 0;j < globalCount;j++) {

						var searStr = allWord[j];
						searStr = searStr.toLowerCase();


						if ( str.indexOf(searStr,0) >= 0) {

							innerCount++;

						}

					}

					let reCreateArr = str.split(" ");

					let strictCount = 0;

					for (var c =0;c < reCreateArr.length;c++) {


						if (reCreateArr[c] == "" || reCreateArr[c] == " ") {
							reCreateArr.splice(c,1);
						}
						
					}

					for (var t = 0;t < reCreateArr.length;t++) {
						for (var k = 0;k < arrWords.length;k++) {
							if (reCreateArr[t] == arrWords[k] ) {

								strictCount++;

							}
						}
					}

					if (globalCount == innerCount && (reCreateArr.length - strictCount) == globalCount) {
					
						globalArr.push(arr[i]);

						item.searchEmpty = false;

						item.countFind = item.countFind + 1;

						this.mathSTR(globalArr,index,item);

					} else {

						if (!globalArr.length) {
							item.searchEmpty = true;
						}
					}

				}
			} else if (item.useExceptions) {

				globalCount = allWord.length;

				for (var i = 0;i < arr.length;i++) {

					let str =  arr[i][0];

					if (str == 0) {

						return console.warn("конец таблицы !");

					} else if (typeof str == typeof "test") {
						str = str.toLowerCase();
					} else{
						str = str + "";
					}

					let innerCount = 0;

					for (var j = 0;j < globalCount;j++) {

						let searStr = allWord[j];

						searStr = searStr.toLowerCase();

						if ( str.indexOf(searStr,0) >= 0) {

							innerCount++;

						}

					}

					if (globalCount == innerCount) {

						if (!globalArr.length) {
							item.searchEmpty = true;
						}

					} else {

						globalArr.push(arr[i]);

						item.searchEmpty = false;
						item.countFind = item.countFind + 1;

						this.mathSTR(globalArr,index,item);

					}

				}
			} else {

				globalCount = allWord.length;

				for (var i = 0;i < arr.length;i++) {

					let str =  arr[i][0];

					if (str == 0) {

						return console.warn("конец таблицы !");

					} else if (typeof str == typeof "test") {
						str = str.toLowerCase();
					} else{
						str = str + "";
					}

					let innerCount = 0;

					for (var j = 0;j < globalCount;j++) {

						let searStr = allWord[j];

						searStr = searStr.toLowerCase();

						if ( str.indexOf(searStr,0) >= 0) {

							innerCount++;

						}

					}

					if (globalCount == innerCount) {
					
						globalArr.push(arr[i]);

						item.countFind = item.countFind + 1;

						item.searchEmpty = false;

						this.mathSTR(globalArr,index,item);

					} else {

						if (!globalArr.length) {
							item.searchEmpty = true;
						}
					}
				}
			}
		},
		mathSTR: function (arr,index,item) {

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
				
				this.viewInfo(endArr,index,item);

			}
		},
		viewInfo: function (arr,index,item) {
			arr[0] = "____"
			item.result = arr;
		},
		useExceptions: function (item,index) {

			item.strictFlag = false;
			item.strictShow = !item.strictShow;
			item.useExceptions = !item.useExceptions;
		},
		deleteWord: function (holder,holderInner,index) {
			holder.data.splice(index,1);
		}
	}
});