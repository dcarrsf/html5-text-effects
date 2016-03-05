/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Private:

    var animations = Text.animations;

    function startAnimation( target ){

        var attr = animations[target.animation].end,
            time = target.duration,
            dir = target.direction;

        if( this.type == "lettersall" || this.type == "wordsall" ){

            var len = target.textBlocks.length;
            for(var i=0; i<len; i++){
                if( target.textBlocks[i] ){
                    target.textBlocks[i].animate(target.animation, attr, time, dir);
                }
            }
        }else{
            var effectIndex = target.letterEffects.shift();

            if( target.textBlocks[effectIndex] ){
                target.textBlocks[effectIndex].animate(target.animation, attr, time, dir);
            }
            if( target.letterEffects.length > 0 ){
                target.timer = setTimeout(startAnimation, target.delay, target);
            }
        }
    }

    //---------------------------
    // Constructor:

    function CanvasTextBlock( text, params, stage, parent ){
        this.init( text, params, stage, parent );
    }

    CanvasTextBlock.prototype.init = function( text, params, stage, parent ){

        // Properties
        this.alignX = "center";
        this.alignY = "center";
        this.anchorPoint = null;
        this.animation = null;
        this.stage = stage;
        this.delay = 20;
        this.direction = true;
        this.duration = 450;
        this.easing = "backIn";
        this.fontStyles = params.fontStyles;
        this.id = null;
        this.textBlocks = [];
        this.letterEffects = [];
        this.letterSpacing = 0;
        this.words = [];
        this.loop = 0;
        this.measuredFont = {};
        this.parent = parent;
        this.text = text;
        this.textBlocks = [];
        this.totalHeight = 0;
        this.timer = null;
        this.toggle = true;
        this.type = "letters";
        this.wordSpacing = 25;

        // Add parameters
        $.extend(this, params);

        // Save grouped params reference
        // to pass to text instances
        this.params = params;

        // Create containing group
        this.group = new createjs.Container();

        // Draw the text
        this.getBounds();
        this.draw();

        // Start Ticker
        var scope = this;
        function handleTick(event){
            scope.stage.update();
        }
        createjs.Ticker.setFPS(1000/30);
        createjs.Ticker.addEventListener("tick", handleTick);
    };

    //---------------------------
    // Methods:

    CanvasTextBlock.prototype.addText = function(x, y, text){

        // Append x and y coordinates to params
        this.params.x = x;
        this.params.y = y;

        // Create SVGText instance
        var textBlock = new Text.CanvasText(text, this.params, this.stage);

        // Add text to group
        this.textBlocks.push(textBlock);

        return textBlock;
    };

    CanvasTextBlock.prototype.getWords = function(){

        this.words = [];

        var wordArray = this.text.split(" ");
        var len = wordArray.length;
        for(var i=0; i<len; i++){

            this.words[i] = {
                text: wordArray[i],
                letters:[]
            };
            var len2 = wordArray[i].length;
            for(var n=0; n<len2; n++){

                this.words[i].letters[n] = wordArray[i].charAt(n);
            }
        }
        return this.words;
    };

    CanvasTextBlock.prototype.getBounds = function(){

        this.words = this.getWords();

        var textBlock,
            lineWidth = 0,
            x = 0,
            y = 0;

        // Layout and measure text at 0, 0
        if( this.type.indexOf("line") > -1 ){

            textBlock = this.addText(x, y, this.text);

            lineWidth = textBlock.getWidth();
            this.totalHeight = y + textBlock.measuredText.height;
            this.textBlocks.push(textBlock);
        }
        else{
            var lettersTotal = 0,
                len2 = this.words.length;

            for(var j=0; j<len2; j++){

                if( this.type.indexOf("word") > -1 ){

                    textBlock = this.addText(x, y, this.words[j].text);
                    x += textBlock.getWidth();
                    lineWidth += textBlock.getWidth();
                    this.textBlocks.push(textBlock);
                }
                else{
                    var len3 = this.words[j].letters.length;
                    for(var n=0; n<len3; n++){

                        textBlock = this.addText(x, y, this.words[j].letters[n]);
                        x += textBlock.getWidth();
                        lineWidth += textBlock.getWidth();
                        this.textBlocks.push(textBlock);

                        if( n < len3-1 ){
                            x += this.letterSpacing;
                            lineWidth += this.letterSpacing;
                            lettersTotal++;
                        }
                    }
                }
                if( j < len2-1 ){
                    x += this.wordSpacing;
                    lineWidth += this.wordSpacing;
                }
            }
            this.totalHeight = y + textBlock.measuredText.height;
        }
        if( this.type.indexOf("letter") > -1 ){
            lineWidth += (lettersTotal+1)*this.letterSpacing; // TODO: Fix this!!
        }

        // get overall bounds
        this.bounds = {
            width: lineWidth,
            height: this.totalHeight
        };

        // Get page alignment
        if( this.anchorPoint != null ){
            this.offsetX = this.anchorPoint.x;
            this.offsetY = this.anchorPoint.y;
        }else{
            var pw = this.stage.canvas.width,
                ph = this.stage.canvas.height,
                offsetX = 0,
                offsetY = 0;

            if( this.alignX == "center" ){
                this.offsetX = (pw-this.bounds.width)/2;
            }else if( this.alignX == "right" ){
                this.offsetX = (pw-this.bounds.width);
            } else if( this.alignX == "left" ){
                this.offsetX = 0;
            }
            if( this.alignY == "center" ){
                this.offsetY = (ph-this.bounds.height)/2;
            }else if( this.alignY == "bottom" ){
                this.offsetY = (ph-this.bounds.height);
            } else if( this.alignY == "top" ){
                this.offsetY = 0;
            }
        }
        this.clear();
    };

    CanvasTextBlock.prototype.draw = function(){

        var text, textBlock,
            x = this.offsetX,
            y = this.offsetY;

        // Draw line
        if( this.type.indexOf("line") > -1 ){

            textBlock = this.addText(x, y, this.text);
        }
        else{
            var len2 = this.words.length;
            for(var t=0; t<len2; t++){

                // Draw words
                if( this.type.indexOf("word") > -1 ){

                    text = this.words[t].text;
                    textBlock = this.addText(x, y, text);
                    x += textBlock.getWidth();
                }
                else{
                    // Draw letters
                    var len3 = this.words[t].letters.length;
                    for(var s=0; s<len3; s++){

                        text = this.words[t].letters[s];
                        textBlock = this.addText(x, y, text);
                        x += textBlock.measuredText.width;

                        if( s < len3-1 ){
                            x += this.letterSpacing;
                        }
                    }
                }
                if( t < len2-1 ){
                    x += this.wordSpacing;
                }
            }
        }
    };

    CanvasTextBlock.prototype.clear = function(){

        // Clear text blocks
        for(var txt in this.textBlocks){
            this.textBlocks[txt].clear();
        }
        // Clear timer
        clearTimeout(this.timer);

        // Clean up
        this.letterEffects = [];
        this.textBlocks = [];
        this.timer = null;
    };


    CanvasTextBlock.prototype.animate = function( effect, params ){

        if( this.toggle ){
            this.direction = !this.direction;
        }
        var type;
        if( effect.indexOf("In") > -1 ){
            type = effect;
            this.direction = true;
        }else if( effect.indexOf("Out") > -1 ){
            type = effect;
            this.direction = false;
        }else{
            type = effect+(this.direction ? "In" : "Out");
        }
        var config = animations[type];
        if( config ){

            var len = this.textBlocks.length;
            for(var i=0; i<len; i++){
                this.textBlocks[i].animationStart(config.start, this.direction);
                this.letterEffects.push(i);
            }
            this.animation = type;

            // Start animation
            startAnimation(this);
        }
    };

    CanvasTextBlock.prototype.hide = function(){

        this.stage.visible = false;
    };

    CanvasTextBlock.prototype.show = function(){

        this.stage.visible = true;
    };

    CanvasTextBlock.prototype.pause = function(){

        createjs.Ticker.pause();
    };

    CanvasTextBlock.prototype.resume = function(){

        createjs.Ticker.resume();
    };
    Text.CanvasTextBlock = CanvasTextBlock;
}());