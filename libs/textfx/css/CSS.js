/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Constructor:

    function CSS( parent ){
        this.init( parent );
    }

    CSS.prototype.init = function( parent ){

        // Properties
        this.textBlock = null;
        this.textFlow = null;
        this.textTape = null;

        // Create CSS
        if( typeof parent == "string" ){
            this.parent = $("#"+parent);
        }else{
            this.parent = parent;
        }

        // Reset the CSS size when the screen changes size
        var text = this;
        $(window).resize(function(){
            text.wrapper.css({
                width:text.parent.width(),
                height:text.parent.height()
            });
        });
    };

    //---------------------------
    // Methods:

    CSS.prototype.addText = function( text, params ){

        this.clear();
        this.textBlock = new Text.CSSTextBlock(text, params, this.wrapper);
        return this.textBlock;
    };

    //---------------------------
    // clean up:

    CSS.prototype.clear = function(){

        if( this.wrapper ){
            this.wrapper.remove();
        }
        this.wrapper = $("<div id='css-wrapper'></div>");
        this.wrapper.css({
            width:this.parent.width(),
            height:this.parent.height()
        });
        this.parent.append(this.wrapper);
    };

    //----------------
    // display

    CSS.prototype.hide = function( id ){

        this.wrapper.remove();
    };

    CSS.prototype.show = function( id ){

        this.parent.append(this.wrapper);
    };

    Text.CSS = CSS;
}());