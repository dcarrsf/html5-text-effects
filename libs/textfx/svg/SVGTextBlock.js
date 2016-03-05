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

    function SVGTextBlock( text, params, stage, parent ){
        this.init( text, params, stage, parent );
    }

    SVGTextBlock.prototype.init = function( text, params, stage, parent ){

        // Properties
        this.alignX = "center";
        this.alignY = "center";
        this.alternate = true;
        this.anchorPoint = null;
        this.animation = null;
        this.attr = params.fontStyles;
        this.stage = stage;
        this.delay = 20;
        this.direction = true;
        this.duration = 450;
        this.easing = "backIn";
        this.id = null;
        this.letterEffects = [];
        this.letterSpacing = 0;
        this.words = [];
        this.loop = 0;
        this.parent = parent;
        this.text = text;
        this.textBlocks = [];
        this.timer = null;
        this.toggle = true;
        this.type = "letters";
        this.wordSpacing = 25;

        // Add parameters
        $.extend(this, params);

        // Save grouped params reference
        // to pass to SVGText instances
        this.params = params;

        // Create SVG stage
        this.group = this.stage.set();
        this.fontSize = this.attr["font-size"];

        // Draw the text
        this.getBounds();
        this.draw();
    };

    //---------------------------
    // Methods:

    SVGTextBlock.prototype.addText = function(x, y, text){

        // Append x and y coordinates to params
        this.params.x = x;
        this.params.y = y;

        // Create SVGText instance
        var textBlock = new Text.SVGText(text, this.params, this.stage);

        // Add text to group
        this.group.push(textBlock.group);
        this.textBlocks.push(textBlock);

        return textBlock;
    };

    SVGTextBlock.prototype.getWords = function(){

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

    SVGTextBlock.prototype.getBounds = function(){

        var textBlock;

        // Layout and measure text at 0, 0
        if( this.type.indexOf("lines") > -1 ){

            textBlock = this.addText(x, y, this.text);
        }
        else{
            this.words = this.getWords();

            var x = 0,
                y = 0,
                len2 = this.words.length;

            for(var j=0; j<len2; j++){

                if( this.type.indexOf("words") > -1 ){

                    textBlock = this.addText(x, y, this.words[j].text);
                    x += textBlock.textBlock.getBBox().width;
                }
                else{
                    var len3 = this.words[j].letters.length;
                    for(var n=0; n<len3; n++){
                        textBlock = this.addText(x, y, this.words[j].letters[n]);
                        x += textBlock.textBlock.getBBox().width + this.letterSpacing;
                    }
                }
                x += this.wordSpacing;
            }
        }
        // get overall bounds
        this.bounds = this.group.getBBox();

        // Get page alignment
       if( this.anchorPoint != null ){
            this.offsetX = this.anchorPoint.x;
            this.offsetY = this.anchorPoint.y;
        }else{
            var pw = this.parent.width(),
                ph = this.parent.height();
            if( this.alignX == "center" ){
                this.offsetX = (pw-this.bounds.width)/2;
            }else if( this.alignX == "right" ){
                this.offsetX = (pw-this.bounds.width);
            }else if( this.alignX == "left" ){
                this.offsetX = 0;
            }
            if( this.alignY == "center" ){
                this.offsetY = (ph-this.bounds.height)/2;
            }else if( this.alignY == "bottom" ){
                this.offsetY = (ph-this.bounds.height);
            }else if( this.alignY == "top" ){
                this.offsetY = 0;
            }
        }
        this.clear();
    };

    SVGTextBlock.prototype.draw = function(){

        this.words = this.getWords();

        var text, textBlock,
            x = this.offsetX,
            y = -this.bounds.y + this.offsetY;

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
                    x += textBlock.textBlock.getBBox().width;
                }
                else{
                    // Draw letters
                    var len3 = this.words[t].letters.length;
                    for(var s=0; s<len3; s++){

                        text = this.words[t].letters[s];
                        textBlock = this.addText(x, y, text);
                        x += textBlock.textBlock.getBBox().width + this.letterSpacing;
                     }
                }
                x += this.wordSpacing;
            }
        }
    };

    SVGTextBlock.prototype.clear = function(){

        // Clear timer
        clearTimeout(this.timer);

        // Clean up
        this.group.remove();
        this.letterEffects = [];
        this.textBlocks = [];
        this.timer = null;
    };

    SVGTextBlock.prototype.animate = function( effect, params ){

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

    SVGTextBlock.prototype.hide = function(){

        // Clean up
        this.group.hide();
    };

    SVGTextBlock.prototype.show = function(){

        // Clean up
        this.group.show();
    };

    Text.SVGTextBlock = SVGTextBlock;
}());