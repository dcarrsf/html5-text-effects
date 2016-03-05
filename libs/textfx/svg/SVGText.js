/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Constructor:

    function SVGText( text, params, stage ){
        this.init( text, params, stage );
    }

    SVGText.prototype.init = function( text, params, stage ){

        // Properties
        this.animation = null;
        this.attr = params.fontStyles;
        this.attr.fill = this.attr.color;
        this.stage = stage;
        this.direction = true;
        this.duration = 450;
        this.easing = "backIn";
        this.fadeAlpha = true;
        this.letterSpacing = 0;
        this.measuredText = {};
        this.shadow = null;
        this.shadowTextBlock = null;
        this.text = text;
        this.textBlock = null;
        this.x = 0;
        this.y = 0;

        // Add parameters
        $.extend(this, params);

        // Create group container
        this.group = this.stage.set();

        // Measure text
        this.measureText();

        // Draw text
        this.textBlock = this.draw(this.text, this.x, this.y, this.attr);
    };

    SVGText.prototype.measureText = function(){

        var textBlock  = this.stage.text(0, 0, this.text).attr(this.attr);

        this.group.push(textBlock);
        this.measuredText = textBlock.getBBox();
        this.clear();
    };

    SVGText.prototype.clear = function(){

        // Clean up
        this.group.remove();

        // Create group container
        this.group = this.stage.set();
    };

    //---------------------------
    // Methods:

    SVGText.prototype.animate = function(effect, attr, duration, direction){

        this.animation = effect;
        this.direction = direction;
        this.duration = duration;

        attr = this.getFormattedParams(attr);

        // Format easing function
        switch( this.easing )
        {
            case "linear":
                this.easing = "linear";
                break;
            case "easeIn":
                this.easing = "ease-in";
                break;
            case "easeOut":
                this.easing = "ease-out";
                break;
            case "easeInOut":
                this.easing = "ease-in-out";
                break;
            case "elastic":
            case "elasticIn":
            case "elasticOut":
                this.easing = "elastic";
                break;
            case "bounce":
            case "bounceIn":
            case "bounceOut":
                this.easing = "bounce";
                break;
            case "backIn":
            case "backOut":
            default:
                this.easing = direction ? "back-out" : "back-in";
                break;
        }
        this.textBlock.animate(attr, duration, this.easing);
    };

    SVGText.prototype.animationStart = function(attr, direction){

        this.textBlock.attr(this.getFormattedParams(attr));
    };

    SVGText.prototype.getFormattedParams = function(params){

        var o = {};
        if( params.hasOwnProperty("alpha") ){
            o.opacity = params.alpha;
        }
        if( params.hasOwnProperty("color") ){
            o.fill = params.color;
        }
        var transStr = "";
        if( params.hasOwnProperty("scaleX") ){
            transStr += "s"+params.scaleX+", "+params.scaleY;
        }
        if( params.hasOwnProperty("x") ){
            transStr += " t"+params.x+", "+params.y;
        }
        if( params.hasOwnProperty("rotation") ){
            transStr += " r"+params.rotation;
        }
        if( transStr != "" ){
            o.transform = transStr;
        }
        return o;
    };

    SVGText.prototype.draw = function(text, x, y, attr){

        x -= this.measuredText.x;

        var target = this.stage.text(x, y, text).attr(attr);

        // Add to group
        this.group.push(target);

        return target;
    };

    SVGText.prototype.getBounds = function( withOffsets ){

        return this.group.getBBox();
    };

    SVGText.prototype.show = function(){
        this.group.show();
    };

    SVGText.prototype.hide = function(){
        this.group.hide();
    };

    SVGText.prototype.pause = function(){
        this.group.pause();
    };

    SVGText.prototype.resume = function(){
        this.group.resume();
    };

    Text.SVGText = SVGText;
}());