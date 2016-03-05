/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Constructor:

    function SVG( parent ){
        this.init( parent );
    }

    SVG.prototype.init = function( parent ){

        // Properties
        this.textBlock = null;
        this.textFlow = null;
        this.textTape = null;

        // Create SVG SVGCore
        if( typeof parent == "string" ){
            this.parent = $("#"+parent);
        }else{
            this.parent = parent;
        }
        this.wrapper = $("<div id='raphael-wrapper'></div>");
        this.parent.append(this.wrapper);
        this.stage = new Raphael('raphael-wrapper', this.parent.width(), this.parent.height());

        // This variation of textBlock is a workaround
        // for rendering issues in Webkit.
        this.textBlock = {
            block:null,
            inited: false,
            type:null,
            animate: function( type ){
                 if( this.inited ){
                     this.block.animate(type);
                 }else{
                     this.type = type;
                 }
            }
        };

        // Reset the size when the screen changes size
        var scope = this;
        $(window).resize(function(){
            scope.stage.setSize(scope.parent.width(), scope.parent.height());
        });
    };

    //---------------------------
    // Methods:

    SVG.prototype.addText = function( text, params ){

        if( this.textBlock.inited == false ){
            var self = this;
            setTimeout(function(){
                self.textBlock.inited = true;
                self.addText(text, params);

                // Workaround for Webkit layout bug
                if( self.textBlock.type != null ){
                    self.textBlock.block.animate(self.textBlock.type);
                }
            }, 100);
        }else{
            this.clear();
        }
        this.textBlock.block = new Text.SVGTextBlock(text, params, this.stage, this.parent);
        return this.textBlock;
    };

    //---------------------------
    // clean up:

    SVG.prototype.clear = function(){

        this.stage.clear();
    };

    //----------------
    // display

    SVG.prototype.hide = function( id ){

        this.wrapper.remove();
    };

    SVG.prototype.show = function( id ){

        this.parent.append(this.wrapper);
    };

    Text.SVG = SVG;
}());