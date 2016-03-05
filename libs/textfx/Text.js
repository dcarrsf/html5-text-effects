/**
 * Created by Dan Carr for the Adobe Inspire Magazine
 */
(function(){

    //---------------------------
    // Create global namespace:

    window.Text = {};

    //---------------------------
    // Animation definitions

    Text.animations = {

        "zoomBigIn": {start:{alpha:0, scaleX:5, scaleY:5}, end:{alpha:1, scaleX:1, scaleY:1}},
        "zoomBigOut": {start:{alpha:1, scaleX:1, scaleY:1}, end:{alpha:0, scaleX:5, scaleY:5}},
        "zoomSmallIn": {start:{alpha:0, scaleX:0, scaleY:0}, end:{alpha:1, scaleX:1, scaleY:1}},
        "zoomSmallOut": {start:{alpha:1, scaleX:1, scaleY:1}, end:{alpha:0, scaleX:0, scaleY:0}},

        "slideTopIn": {start:{alpha:0, x:0, y:-400}, end:{alpha:1, x:0, y:0}},
        "slideTopOut": {start:{alpha:1, x:0, y:0}, end:{alpha:0, x:0, y:-400}},
        "slideBottomIn": {start:{alpha:0, x:0,y:400}, end:{alpha:1, x:0,y:0}},
        "slideBottomOut": {start:{alpha:1, x:0,y:0}, end:{alpha:0, x:0,y:400}},
        "slideLeftIn": {start:{alpha:0, x:-400,y:0}, end:{alpha:1, x:0,y:0}},
        "slideLeftOut": {start:{alpha:1, x:0,y:0}, end:{alpha:0, x:-400,y:0}},
        "slideRightIn": {start:{alpha:0, x:400,y:0}, end:{alpha:1, x:0,y:0}},
        "slideRightOut": {start:{alpha:1, x:0,y:0}, end:{alpha:0, x:400,y:0}},

        "rotateIn": {start:{alpha:0, rotation:180}, end:{alpha:1, rotation:0}},
        "rotateOut": {start:{alpha:1, rotation:0}, end:{alpha:0, rotation:180}},
        "rotateBigIn": {start:{alpha:0, scaleX:5, scaleY:5, rotation:180}, end:{alpha:1, scaleX:1, scaleY:1, rotation:0}},
        "rotateBigOut": {start:{alpha:1, scaleX:1, scaleY:1, rotation:0}, end:{alpha:0, scaleX:5, scaleY:5, rotation:180}},
        "rotateSmallIn": {start:{alpha:0, scaleX:0, scaleY:0, rotation:180}, end:{alpha:1, scaleX:1, scaleY:1, rotation:0}},
        "rotateSmallOut": {start:{alpha:1, scaleX:1, scaleY:1, rotation:0}, end:{alpha:0, scaleX:0, scaleY:0, rotation:180}},
        "rotateLeftIn": {start:{alpha:0, x:-400, y:0, rotation:180}, end:{alpha:1, x:0, y:0, rotation:0}},
        "rotateLeftOut": {start:{alpha:1, x:0, y:0, rotation:0}, end:{alpha:0, x:-400, y:0, rotation:180}},
        "rotateRightIn": {start:{alpha:0, x:400, y:0, rotation:180}, end:{alpha:1, x:0, y:0, rotation:0}},
        "rotateRightOut": {start:{alpha:1, x:0, y:0, rotation:0}, end:{alpha:0, x:400, y:0, rotation:180}},
        "rotateTopIn": {start:{alpha:0, x:0, y:-400, rotation:180}, end:{alpha:1, x:0, y:0, rotation:0}},
        "rotateTopOut": {start:{alpha:1, x:0, y:0, rotation:0}, end:{alpha:0, x:0, y:-400, rotation:180}},
        "rotateBottomIn": {start:{alpha:0, x:0, y:400, rotation:180}, end:{alpha:1, x:0, y:0, rotation:0}},
        "rotateBottomOut": {start:{alpha:1, x:0, y:0, rotation:0}, end:{alpha:0, x:0, y:400, rotation:180}},

        "flipYIn": {start:{alpha:0, scaleX:0, scaleY:1}, end:{alpha:1, scaleX:1, scaleY:1}},
        "flipYOut": {start:{alpha:1, scaleX:1, scaleY:1}, end:{alpha:0, scaleX:0, scaleY:1}},
        "flipXIn": {start:{alpha:0, scaleX:1, scaleY:0}, end:{alpha:1, scaleX:1, scaleY:1}},
        "flipXOut": {start:{alpha:1, scaleX:1, scaleY:1}, end:{alpha:0, scaleX:1, scaleY:0}},

        "fadeIn": {start:{alpha:0}, end:{alpha:1}},
        "fadeOut": {start:{alpha:1}, end:{alpha:0}}
    };

}());