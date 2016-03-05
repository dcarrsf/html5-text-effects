/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Constructor:

    function Canvas( parent ){
        this.init( parent );
    }

    Canvas.prototype.init = function( parent ){

        // Properties
        this.textBlock = null;
        this.textFlow = null;
        this.textTape = null;

        // Create SVG Canvas
        if( typeof parent == "string" ){
            this.parent = $("#"+parent);
        }else{
            this.parent = parent;
        }
        this.canvas = $("<canvas id ='"+parent+"-canvascore' width='"+this.parent.width()+"' height='"+this.parent.height()+"'></canvas>");
        this.parent.append(this.canvas);
        this.stage = new createjs.Stage(this.canvas.attr("id"));

        // Reset the Canvas size when the screen changes size
        var scope = this;
        $(window).resize(function(){
            scope.canvas.width(scope.parent.width()),
            scope.canvas.height(scope.parent.height())
        });
    };

    //---------------------------
    // Methods:

    Canvas.prototype.addText = function( text, params ){

        this.clear();
        this.textBlock = new Text.CanvasTextBlock(text, params, this.stage, this.parent);
        return this.textBlock;
    };

    //---------------------------
    // clean up:

    Canvas.prototype.clear = function(){

         this.stage.uncache();
         this.stage.removeAllChildren();
         this.stage.update();
    };

    //----------------
    // display

    Canvas.prototype.hide = function(){

        this.stage.alpha = 0;
    };

    Canvas.prototype.show = function(){

        this.stage.alpha = 1;
    };

    Text.Canvas = Canvas;
}());