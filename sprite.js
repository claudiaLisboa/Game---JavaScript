//class Sprite - brackground image
function Sprite(x,y, _width, _height){
    this.x = x;
    this.y = y;
    this._width = _width;
    this._height = _height;

    this.draw = function(xCanvas, yCanvas){
        ctx.drawImage(img, this.x, this.y, this._width, this._height, xCanvas,yCanvas, this._width, this._height);
    }
}

var brackgroundSprite = new Sprite(0, 0, 600, 600); //coordinate x and y initial; coordinate x and y end in the brackground img
var spriteDoll = new Sprite (618, 16, 87, 87); //coordinate x and y initial; coordinate x and y end in the brackground img

