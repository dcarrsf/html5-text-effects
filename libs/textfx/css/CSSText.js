/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Constructor:

    function CSSText( text, params, parent ){
        this.init( text, params, parent );
    }

    CSSText.prototype.init = function( text, params, parent ){

        // Properties
        this.animation = null;
        this.params = params;
        this.direction = true;
        this.duration = 450;
        this.easing = "back-out";
        this.fadeAlpha = true;
        this.fontStyles = params.fontStyles;
        this.letterAlign = "baseline";
        this.letterSpacing = 0;
        this.loop = 0;
        this.measuredText = {};
        this.parent = parent;
        this.shadow = null;
        this.shadowTextBlock = null;
        this.text = text;
        this.textBlock = null;
        this.x = 0;
        this.y = 0;

        // Add parameters
        $.extend(this, params);

        this.measureText();

        //this.fontStyles["border"] = "1px solid black";
        this.fontStyles["width"] = this.measuredText.width;
        this.fontStyles["height"] = this.measuredText.height;

            // Draw text
        this.wrapper = $("<div></div>");
        this.wrapper.css(this.fontStyles);
        this.wrapper.text(text);
        this.parent.append(this.wrapper);
    };

    CSSText.prototype.clear = function(){

        this.wrapper.remove();
    };

    CSSText.prototype.measureText = function(){

        this.span = $("<span>"+this.text+"</span>");
        this.span.css(this.fontStyles);
        this.parent.append(this.span);
        this.measuredText = {width:this.span.width(), height:this.span.height()};
        this.span.remove();
    };

    //---------------------------
    // Methods:

    CSSText.prototype.animate = function(effect, params, duration, direction){

        this.animation = effect;
        this.direction = direction;
        this.duration = duration;

        // Format easing function
        this.easing = this.getEasing(this.easing);

        // Tween the text!
        this.transition(this.getFormattedParams(params), this.duration, this.easing);
    };

    CSSText.prototype.animationStart = function(params){

        // Set initial animation parameters
        this.transform(this.getFormattedParams(params));
    };

    CSSText.prototype.getEasing = function(easing){

        var forWebkit = navigator.userAgent.indexOf("Safari") > -1;

        switch( easing )
        {
            case "linear":
                this.easing = forWebkit ? "linear" : "";
                break;
            case "easeIn":
                this.easing = forWebkit ? "ease-in" : "cubic-bezier(0.47, 0, 0.745, 0.715)";
                break;
            case "easeOut":
                this.easing = forWebkit ? "ease-out" : "cubic-bezier(0.39, 0.575, 0.565, 1)";
                break;
            case "easeInOut":
                this.easing = forWebkit ? "ease-in-out" : "cubic-bezier(0.445, 0.05, 0.55, 0.95)";
                break;
            case "backIn":
                this.easing = forWebkit ? "ease-in" : "cubic-bezier(0.6, -0.28, 0.735, 0.045)";
                break;
            case "backOut":
            default:
                this.easing = forWebkit ? "ease-out" : "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                break;
        }
        return this.easing;
    };

    CSSText.prototype.getFormattedParams = function(params){

        var o = {};
        for(var prop in params){
            if( prop == "alpha" ){
                if(!this.fadeAlpha ){
                    o.opacity = 1;
                }else{
                    o.opacity = params[prop];
                }
            }
            else if( prop == "x" ){
                if( params.x < 0 ){
                    params.x = Math.max(params.x, -this.parent.width());
                }else if( params.x > 0 ){
                    params.x = Math.min(params.x, this.parent.width());
                }
                o.translateX =  params.x;
            }
            else if( prop == "y" ){
                if( params.y < 0 ){
                    params.y = Math.max(params.y, -this.parent.height());
                }else if( params.x > 0 ){
                    params.y = Math.min(params.y, this.parent.height());
                }
                o.translateY =  params.y;
            }
            else{
                o[prop] = params[prop];
            }
        }
        return o;
    };

    CSSText.prototype.getBounds = function(){

        return {
            x: this.wrapper.position.left,
            y: this.wrapper.position.top,
            width: this.wrapper.width(),
            height: this.wrapper.height()
        };
    };

    CSSText.prototype.position = function(h1, v1, h2, v2){

        this.wrapper.position({
            my: "center center",
            at: "center center-40",
            of: this.parent
        });
    };

    CSSText.prototype.show = function(){

        this.wrapper.show();
    };

    CSSText.prototype.hide = function(){

        this.wrapper.hide();
    };

    CSSText.prototype.transition = function(params, milliseconds, easing){

        var transStr = "all "+milliseconds/1000+"s "+easing;

        this.wrapper.css({
            "-webkit-transition":  transStr,
            "-moz-transition":  transStr,
            "-ms-transition":  transStr,
            "-o-transition":  transStr,
            "transition":  transStr
        });
        this.transform(params);
    };

    CSSText.prototype.transform = function(params){

        var paramStr = "";
        for(var param in  params){
            switch( param ){
                case "scale":
                    paramStr += "scale("+params.scale+") ";
                    break;
                case "scaleX":
                //case "scaleY":
                    paramStr += "scale("+params.scaleX+","+params.scaleY+") ";
                    break;
                case "rotation":
                    paramStr += "rotate("+params[param]+"deg) ";
                    break;
                case "translate":
                case "translateX":
                case "translateY":
                    paramStr += param+"("+params[param]+"px) ";
                    break;
                case "scale":
                    paramStr += param+"("+params[param]+") ";
                    break;
                default:
                    this.wrapper.css(param, params[param]);
            }
        }
        if( paramStr != "" ){
            this.wrapper.css({
                "-webkit-transform": paramStr,
                "-moz-transform": paramStr,
                "-ms-transform": paramStr,
                "-o-transform": paramStr,
                "transform": paramStr
            });
        }
    };

    CSSText.prototype.addTransition = function(milliseconds, easing){

        var transStr = "all "+milliseconds+"ms "+easing;

        this.wrapper.css({
            "-webkit-transition":  transStr,
            "-moz-transition":  transStr,
            "-ms-transition":  transStr,
            "-o-transition":  transStr,
            "transition":  transStr
        });
    };

    CSSText.prototype.removeTransition = function(){

        var transStr = "none !important";

        this.wrapper.css({
            "-webkit-transition":  transStr,
            "-moz-transition":  transStr,
            "-ms-transition":  transStr,
            "-o-transition":  transStr,
            "transition":  transStr
        });
    };

    Text.CSSText = CSSText;
}());