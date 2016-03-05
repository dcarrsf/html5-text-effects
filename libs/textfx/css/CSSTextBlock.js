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

    function CSSTextBlock( text, params, parent ){
        this.init( text, params, parent );
    }

    CSSTextBlock.prototype.init = function( text, params, parent ){

        // Properties
        //this.actualTotalWidth = 0;
        //this.actualTotalHeight = 0;
        this.alignX = "center";
        this.alignY = "center";
        this.anchorPoint = null;
        this.animation = null;
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
        this.text = text;
        this.textBlocks = [];
        this.timer = null;
        this.toggle = true;
        this.totalWidth = 0;
        this.totalHeight = 0;
        this.type = "letters";
        this.wordSpacing = 25;

        // Add parameters
        $.extend(this, params);

        // Save grouped params reference
        // to pass to CSSText instances
        this.params = params;

        this.parent = parent;
        this.wrapper = $("<div></div>");
        this.parent.append(this.wrapper);

        // Draw the text
        this.draw();
    };

    //---------------------------
    // Methods:

    CSSTextBlock.prototype.addText = function(text){

        // Create SVGText instance
        var textBlock = new Text.CSSText(text, this.params, this.wrapper);

        // Add text to group
        this.textBlocks.push(textBlock);

        return textBlock;
    };

    CSSTextBlock.prototype.getWords = function(){

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

    CSSTextBlock.prototype.getBounds = function(){

        return {
            x: this.wrapper.position.left,
            y: this.wrapper.position.top,
            width: this.wrapper.width(),
            height: this.wrapper.height()
        };
    };

    CSSTextBlock.prototype.draw = function(){

        this.words = this.getWords();

        var text, textBlock;

        // Draw line
        if( this.type.indexOf("line") > -1 ){

            textBlock = this.addText(this.text);

            this.totalWidth += $(textBlock.wrapper).width();
            this.totalHeight += $(textBlock.wrapper).height();
        }
        else{
            var lastTextBlock,
                spaceX = 0,
                len2 = this.words.length;

            for(var t=0; t<len2; t++){

                // Draw words
                if( this.type.indexOf("word") > -1 ){

                    text = this.words[t].text;
                    textBlock = this.addText(text);

                    if( t > 0 ){
                        $(textBlock.wrapper).position({
                            my: "left center",
                            at: "right+"+this.wordSpacing+" center",
                            of: lastTextBlock.wrapper
                        });
                    }
                    lastTextBlock = textBlock;
                    this.totalWidth += $(textBlock.wrapper).width();
                }
                else{
                    // Draw letters
                    var len3 = this.words[t].letters.length;
                    for(var s=0; s<len3; s++){

                        text = this.words[t].letters[s];
                        textBlock = this.addText(text);

                        if( s > 0 || t > 0 ){
                            var offset = 0;
                            if( s == 0 && t > 0 ){
                                // Add word spacing
                                offset = this.wordSpacing;
                            }else{
                                // Add letter spacing
                                offset = this.letterSpacing;
                            }
                            $(textBlock.wrapper).position({
                                my: "left center",
                                at: "right+"+offset+" center",
                                of: lastTextBlock.wrapper
                            });
                        }
                        lastTextBlock = textBlock;
                        this.totalWidth += $(lastTextBlock.wrapper).width();

                        if( t < len2-1 ){
                            this.totalWidth += this.letterSpacing;
                        }
                    }
                }
                if( t < len2-1 ){
                    this.totalWidth += this.wordSpacing;
                }
            }
            this.totalHeight += $(textBlock.wrapper).height();
        }
        this.wrapper.css({
            width:this.totalWidth,
            height:this.totalHeight
        });
        this.position();
    };

    CSSTextBlock.prototype.position = function(){

        this.wrapper.position({
            my: this.alignX+" "+this.alignY,
            at: this.alignX+" "+this.alignY,
            of: this.parent
        });
    };

    CSSTextBlock.prototype.clear = function(){

        // Clean up
        this.letterEffects = [];
        this.textBlocks = [];
    };

    CSSTextBlock.prototype.animate = function( effect, params ){

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

    CSSTextBlock.prototype.hide = function(){

        this.wrapper.hide();
    };

    CSSTextBlock.prototype.show = function(){

        this.wrapper.show();
    };

    Text.CSSTextBlock = CSSTextBlock;
}());