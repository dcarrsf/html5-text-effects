/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Private:

    //...

    //---------------------------
    // Constructor:

    function CanvasText( text, params, stage ){
        this.init( text, params, stage );
    }

    CanvasText.prototype.init = function( text, params, stage ){

        // Properties
        this.animation = null;
        this.alternate = false;
        this.drawBounds = false;
        this.params = params;
        this.stage = stage;
        this.direction = true;
        this.duration = 450;
        this.easing = null;
        this.fadeAlpha = true;
        this.fontStyles = params.fontStyles;
        this.letterAlign = "baseline";
        this.letterSpacing = 0;
        this.loop = 0;
        this.measuredText = {};
        this.startX = 0;
        this.startY = 0;
        this.text = text;
        this.textBlock = null;
        this.x = 0;
        this.y = 0;

        // Add parameters
        $.extend(this, params);

        // Measure CanvasText
        this.measureText();

        // Create group container
        this.group = new createjs.Container();
        //this.group.x = this.startX = this.x + this.measuredText.width / 2;    // Account for centered origin point within group container
        //this.group.y = this.startY = this.y + this.measuredText.height / 2;

        this.group.x = this.startX = this.x;
        this.group.y = this.startY = this.y;
        this.stage.addChild(this.group);

        // Draw text
        this.textBlock = this.draw(this.text, this.params);
       // this.textBlock.cache(0, 0, this.getWidth(), this.measuredText.height);
    };

    CanvasText.prototype.measureText = function(){

        var b = $("body");
        var p = $("<span>"+this.text+"</span>");

        b.append(p);
        p.css(this.fontStyles);

        this.measuredText.width = p.width();
        this.measuredText.height = p.height();

        p.remove();
    };

    CanvasText.prototype.draw = function(text, params){

        var target = new createjs.Text(text);
        target.color = this.fontStyles.color;
        target.font = this.fontStyles["font-size"]+"px"+" "+this.fontStyles["font-family"];
        target.outline = this.params["outline"];
        if( text.length > 1 ){
            //     target.x = -(target.getMeasuredWidth() / 2);
        }else{
            //      target.x = -(this.measuredText.width / 2);
        }
        //  target.y = -(this.measuredText.height / 2);
        this.group.addChild(target);

        // For testing
        if( this.drawBounds ){

            var g = new createjs.Graphics();
            g.setStrokeStyle(1);
            g.beginStroke(createjs.Graphics.getRGB(0,0,0));
            g.drawRect(0,0, target.getMeasuredWidth(), this.measuredText.height);
            this.group.addChild(new createjs.Shape(g));
        }
        return target;
    };

    CanvasText.prototype.clear = function(){

        this.group.removeChild(this.group.getChildAt(0));
    };

    //---------------------------
    // Methods:

    CanvasText.prototype.animate = function(effect, params, duration, direction){

        this.animation = effect;
        this.direction = direction;
        this.duration = duration;

        // Format parameters
        var formattedParams = this.getFormattedParams(params);

        // Tween the text!
        createjs.Tween.get(this.group).to(formattedParams, this.duration, this.getEasing(this.easing));
    };

    CanvasText.prototype.animationStart = function(params){

        // Format parameters
        var formattedParams = this.getFormattedParams(params);

        // Set initial animation parameters
        for(var prop in formattedParams){
            if( this.group.hasOwnProperty(prop) ){
                this.group[prop] = formattedParams[prop];
            }
        }
    };

    CanvasText.prototype.getEasing = function(easing){

        var easeFunc;
        switch( easing )
        {
            case "linear":
                return createjs.Ease.linear;
            case "easeIn":
                return createjs.Ease.sineIn;
            case "easeOut":
                return createjs.Ease.sineOut;
            case "easeInOut":
                return createjs.Ease.sinceInOut;
            case "backIn":
            case "backOut":
                if( this.direction ){
                    return createjs.Ease.backOut;
                }else{
                    return createjs.Ease.backIn;
                }
            case "elastic":
            case "elasticIn":
                return createjs.Ease.elasticIn;
            case "elasticOut":
                return createjs.Ease.elasticOut;
            case "bounce":
            case "bounceIn":
                return createjs.Ease.bounceIn;
            case "bounceOut":
                return createjs.Ease.bounceOut;
        }
        return null;
    };

    CanvasText.prototype.getFormattedParams = function(params){

        var o = {};
        for(var prop in params){
            if( prop == "alpha" ){
                if(!this.fadeAlpha ){
                    o.alpha = 1;
                }else{
                    o.alpha = params[prop];
                }
            }
            else if( prop == "x" ){
                if( params.x < 0 ){
                    params.x = Math.max(params.x, -this.stage.canvas.width);
                }else if( params.x > 0 ){
                    params.x = Math.min(params.x, this.stage.canvas.width);
                }
                o.x =  params.x + this.startX;
            }
            else if( prop == "y" ){
                if( params.y < 0 ){
                    params.y = Math.max(params.y, -this.stage.canvas.height);
                }else if( params.x > 0 ){
                    params.y = Math.min(params.y, this.stage.canvas.height);
                }
                o.y =  params.y + this.startY;
            }
            else{
                o[prop] = params[prop];
            }
        }
        return o;
    };

    CanvasText.prototype.getWidth = function(){

        return this.textBlock.getMeasuredWidth();
    };

    CanvasText.prototype.hide = function(){

        this.group.alpha = 0;
    };

    CanvasText.prototype.show = function(){

        this.group.alpha = 1;
    };

    Text.CanvasText = CanvasText;
}());