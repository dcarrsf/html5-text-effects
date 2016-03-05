
var textBanner = $("#text-banner"),
    textInput = $("#text-input"),
    typeInput = $("#type"),
    effectInput = $("#effect"),
    animateInput = $("#animate"),
    easingInput = $("#easing"),
    durationInput = $("#duration"),
    delayInput = $("#delay"),
    fontInput = $("#font"),
    fontColorInput = $("#fontcolor"),
    fontSizeInput = $("#fontsize"),
    borderInput = $("#border"),
    borderSizeInput = $("#bordersize"),
    letterSpacingInput = $("#letterspacing"),
    wordSpacingInput = $("#wordspacing");

function getParameters(){
    return {
        "fontStyles": {
            "font-family": fontInput.val(),
            "font-size": parseFloat(fontSizeInput.val()),
            "color": fontColorInput.val(),
            "letter-spacing": parseFloat(letterSpacingInput.val()),
            "stroke":borderInput.val(),
            "stroke-width":parseFloat(borderSizeInput.val())
        },
        "letterSpacing": parseFloat(letterSpacingInput.val()),
        "wordSpacing": parseFloat(wordSpacingInput.val()),
        "easing": easingInput.val(),
        "type": animateInput.val(),
        "duration": parseFloat(durationInput.val()),
        "delay": parseFloat(delayInput.val()),
        "toggle":true
    }
}

var canvas, canvasDiv, text, textFlow, textTape,
    canvasType = "SVG",
    parentId = "text-banner",
    parent = $("#"+parentId);

var svgCanvas = null,
    svgDiv = $("#text-svg").remove();
var cssCanvas = null,
    cssDiv = $("#text-css").remove();
var html5Canvas = null,
    html5Div = $("#text-canvas").remove();

function getCanvasByType( type ){

    // Remove last canvas div
    if( canvas ){
        canvas.parent.remove();
    }
    canvasType = type;

    // Add next canvas div type
    switch( type )
    {
        case "SVG":

            canvasDiv = svgDiv;
            canvasDiv.css({
                width:parent.width(),
                height: parent.height()
            });
            parent.append(canvasDiv);

            if( svgCanvas ){
                canvas = svgCanvas;
            }else{
                canvas = (svgCanvas = new Text.SVG(svgDiv));
            }
            break;

        case "CSS":

            canvasDiv = cssDiv;
            canvasDiv.css({
                width:parent.width(),
                height: parent.height()
            });
            parent.append(canvasDiv);

            if( cssCanvas ){
                canvas = cssCanvas;
            }else{
                canvas = (cssCanvas = new Text.CSS(cssDiv));
            }
            break;

        case "Canvas":

            canvasDiv = html5Div;
            canvasDiv.css({
                width:parent.width(),
                height: parent.height()
            });
            parent.append(canvasDiv);

            if( html5Canvas ){
                canvas = html5Canvas;
            }else{
                canvas = (html5Canvas = new Text.Canvas(html5Div));
            }
            break;
    }
    return canvas;
}

function init( type ){

    // Init canvas
    canvas = getCanvasByType(type);  // Sniff browser for best defaults

    // Init text
    text = canvas.addText(textInput.val(), getParameters());
}

$(document).ready(function(){

    textInput.val("Typography");
    init(canvasType);
});

// Handle list changes
$("select").on("change", listChange);
$("select").on("keyup", listChange);

function listChange(e){

    switch(e.currentTarget.id){
        case "type":

            // Redraw the text view
            init(typeInput.val());
            break;

        case "effect":

            // Animate!
            text.animate(effectInput.val());
            break;

        default:
            // Redraw the text view
            text = canvas.addText(textInput.val(), getParameters());
    }
}

// Update text view while typing
textInput.on("keyup", function(e){

    text = canvas.addText(textInput.val(), getParameters());
});

// Update text view choosing fonts typing
fontInput.on("keyup", function(e){

    text = canvas.addText(textInput.val(), getParameters());
});

// Animate!
effectInput.on("keyup", function(e){

    text.animate(effectInput.val());
});

// Handle input field changes
$("input").on("change", function(e){

    switch(e.currentTarget.id){
        case "text-input":
            return;
    }
    text = canvas.addText(textInput.val(), getParameters());
});

// Handle canvas clicks
textBanner.on("click", function(e){

    // Animate!
    text.animate(effectInput.val());
});

var copyScreen = $("#copy-params");
var copyForm = $("#copy-form");
var copyField = $("#copy-field");

$(window).resize(function(){
    copyForm.position({
        my: "center top",
        at: "center top+30",
        of: $(window)
    });
});
copyScreen.hide();

// Handle button clicks
$("a").on("click", function(e){

    switch(e.currentTarget.id){

        case "play":
            // Animate!
            text.animate(effectInput.val());
            break;

        case "copy":
            // Copy params to clipboard!
            copyField.text(getParamsForCopy());
            copyScreen.show();
            copyField.get(0).select();
            copyForm.position({
                my: "center top",
                at: "center top+30",
                of: $(window)
            });
            break;

        case "done":
            // Copy params to clipboard!
            copyScreen.hide();
            break;
    }
});

function getParamsForCopy(){

    var str = "var params = {\n";
    str += "    fontStyles: {\n";
    str += "        'font-family': 'Arial, sans-serif',\n";
    str += "        'font-size': "+fontSizeInput.val()+",\n";
    str += "        'color': '"+fontColorInput.val()+"',\n";
    str += "        'stroke': '"+borderInput.val()+"',\n";
    str += "        'stroke-width': "+borderSizeInput.val()+"\n";
    str += "    },\n";
    str += "    letterSpacing: "+letterSpacingInput.val()+",\n";
    str += "    wordSpacing: '"+wordSpacingInput.val()+"',\n";
    str += "    easing: '"+easingInput.val()+"',\n";
    str += "    duration: "+durationInput.val()+",\n";
    str += "    delay: "+delayInput.val()+",\n";
    str += "    type: '"+animateInput.val()+"'\n";
    str += "}\n\n";
    str += "var canvas = new Text."+typeInput.val()+"('canvas');\n";
    str += "var text = canvas.addText('"+textInput.val()+"', params);\n";
    str += "\n";
    str += "var direction = true;\n";
    str += "$(window).on('click', function(){\n\n";
    str += "    direction = !direction;\n\n";
    str += "    if( direction ){\n";
    str += "        text.animate('"+effectInput.val()+"In');\n";
    str += "    }else{\n";
    str += "        text.animate('"+effectInput.val()+"Out');\n";
    str += "    }\n";
    str += "});\n";
    return str;
}