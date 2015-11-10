function bot(){
    var self = this;
    self.game = null;
    self.groundlim = GROUND_Y - 70;

    self.checkGameEnd = function(){
        // nothing can be done without the bird
        if(bird==null || bird==undefined) return;
        // we got game
        if(self.game == null) self.game = bird.game;
        // trigger reset
        if(gameOver){
            self.game.input.onTap.dispatch();
            return;
        }
        // start the game
        if(!gameStarted){
            self.click();
            return;
        }
    };

    // deterministic play
    self.play = function(){
        if(!gameStarted) return;
        // already flapped
        if(bird.body.gravity.y==0) return;
        var bleft = bird.bounds.x, bright = bird.bounds.x + bird.bounds.width, btop = bird.bounds.y, bbottom = bird.bounds.y + bird.bounds.height;
        if(tubes.countLiving()==0) return self.clickGround(bbottom);

        var closest = null;
        tubes.forEachAlive(function(t){
            var t = t.bounds, tleft = t.x, tright = t.x + t.width, ttop = t.y, tbottom = t.y + t.height;
            // top tube
            if(ttop<=0) return;
            // already past
            if(tright<bleft) return;
            // init if null
            if(closest==null){
                closest = t;
                return;
            }
            var xdist = closest.x + closest.width - bleft;
            // if t is closer than current closest
            if((tright - bleft) < xdist){
                closest = t;
            }
        });

        if(closest==null) return self.clickGround(bbottom);
        // decide if we should click
        if(self.prevy!=undefined)
            console.log('predicted ' + self.prevy + ' actual ' + bbottom);
        self.prevy = (bird.body.velocity.y/250 + bbottom);
        if((closest.y - bbottom) <= 15 || (bird.body.velocity.y/250 + bbottom) >= closest.y-17) self.click();
    };

    // click based on how close we are to ground
    self.clickGround = function(bbottom){
        if(bbottom>=self.groundlim){
            self.click();
        }
    }

    self.click = function(){
        self.game.input.onDown.dispatch();
    }

    $(document).ready(function(){
        setInterval(self.checkGameEnd,30); 
        setInterval(self.play,4); 
    });
}
// Inject bot into the page
$(document).ready(function(){
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ bot +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
});
