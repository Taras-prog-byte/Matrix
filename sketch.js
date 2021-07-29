let streams = [];
let fadeInterval = 1.6;
let symbolSize = 40;
let backgrn = JSON.parse(localStorage.getItem('bgColor'));
let strColor = JSON.parse(localStorage.getItem('stringColor'));
let strNumdef=Math.floor((window.innerWidth-200)/symbolSize);
let bckgHexColor;
let strHexColor;
let strNum=JSON.parse(localStorage.getItem('stringNum'));
let endPos=[];
let startPos=[];
let strMaxLength=JSON.parse(localStorage.getItem('stringLength'));
let strMaxLengthDef=25;



function getBkgColor(){
  bckgHexColor = document.getElementById("BkgColor").value;
  let TMPbackgrn = JSON.stringify(hexToRgb(bckgHexColor));
  document.getElementById("BkgColor").value=rgbToHex(backgrn[0],backgrn[1],backgrn[2]);
  localStorage.setItem('bgColor', TMPbackgrn)
}

function getStrColor(){
  strHexColor = document.getElementById("StrColor").value;
  let TMPstrColor = JSON.stringify(hexToRgb(strHexColor))
  document.getElementById("StrColor").value=rgbToHex(strColor[0],strColor[1],strColor[2]);
  localStorage.setItem('stringColor', TMPstrColor)
}

function getStrNum(){
  let strNumTmp=document.getElementById("strNum").value;
  if (isNaN(strNumTmp)||strNumTmp<=0){
    strNumTmp=0;
  }
  if (strNumTmp>Math.floor((window.innerWidth-200)/symbolSize)){
    strNumTmp=strNumdef;
  }
  strNumTmp=JSON.stringify(strNumTmp)
  localStorage.setItem('stringNum', strNumTmp)
}

function getStrMaxLength(){
  let strMaxLengthTmp=document.getElementById("strLength").value;
  if (isNaN(strMaxLengthTmp)||strMaxLengthTmp<=9){
    strMaxLengthTmp=10;
    alert("max length must be > 4");

  }
  if (strMaxLengthTmp>50){
    alert("max length must be <= 50");
    strMaxLengthTmp=strMaxLengthDef;
  }
  strMaxLengthTmp=JSON.stringify(strMaxLengthTmp)
  localStorage.setItem('stringLength', strMaxLengthTmp)
}


function setDefStrNum(){
  let tmp = JSON.stringify((window.innerWidth-200)/symbolSize)
  localStorage.setItem('stringNum', tmp)
  reload();
}

function setDefLength(){
 let tmp = JSON.stringify(strMaxLengthDef)
  localStorage.setItem('stringLength', tmp)
  reload();
}







function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
    var r= parseInt(result[1], 16);
    var g= parseInt(result[2], 16);
    var b= parseInt(result[3], 16);
    let mas=[r, g, b]
    return mas;
  }
  return null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}








function reload (){ // to reload the page
  document.location.reload();
}



function setup() {

  createCanvas(
    window.innerWidth-300,
    window.innerHeight

  );
  endPos=[];
  startPos=[];
  var x = 0;
  for (var i = 0; i <strNum; i++) {


    startPos[i]=random(-300, 300);
    endPos[i]=random(400, height*2);

    var stream = new Stream();
    stream.generateSymbols(x, random(-200, height));
    streams.push(stream);
    x += symbolSize
  }


    textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  background(backgrn);
  streams.forEach(function(stream) {
    stream.render();
  });

}



function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(2, 25));

  this.setToRandomSymbol = function() {
    var charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        this.value = String.fromCharCode(
          0x30A0 + floor(random(0, 97))
        );
      } else {
        this.value = floor(random(0,10));
      }
    }
  }



  this.rain = function() {
    let i = round(this.x/symbolSize);
    //console.log(i)
    this.y = (this.y >= endPos[i]) ? startPos[i] : this.y += this.speed;
    //this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }
}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(4, strMaxLength));
  this.speed = random(1, 3);
  //this.speed = 3;

  this.generateSymbols = function(x, y) {
    let opacity = floor(random(130, 255));
    let first = round(random(0, 4)) == 1;
    for (let i =0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
      );
      symbol.setToRandomSymbol();

      this.symbols.push(symbol);

      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }




  this.render = function() {
    this.symbols.forEach(function(symbol, i) {
      if (symbol.first) {
        fill(140, 255, 170, symbol.opacity);
      } else {
        fill(strColor[0], strColor[1],strColor[2], symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);


      symbol.rain();
      symbol.setToRandomSymbol();


    });
  }
}

