function bot(){
    var self = this;
    var game = null;

    $(document).ready(function(){
        $(document).click(function(){
            // get game object
            game = bird.game;
        });
    });
}
// Inject bot into the page
$(document).ready(function(){
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ bot +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
});
