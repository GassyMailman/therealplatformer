game.PlayerEntity = me.ObjectEntity.extend({
   init: function(x,y, settings) {
       settings.image = "player1-spritesheet";
       settings.spritewidth = "72";
       settings.spriteheight = "97";
       this.parent(x, y, settings);
       
       this.collidable = true; 
       
       this.renderable.addAnimation("idle", [3]);
       this.renderable.addAnimation("duck", [0]);
       this.renderable.addAnimation("dead", [1]);
       this.renderable.addAnimation("jump", [2]);
       this.renderable.setCurrentAnimation("idle");       
       
       this.setVelocity(5, 20);
       
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   },
    
    update: function() {
      if(me.input.isKeyPressed("right")) {
          this.vel.x += this.accel.x * me.timer.tick;
      }
      else if(me.input.isKeyPressed("left")) {
          this.vel.x -= this.accel.x * me.timer.tick;
      }
      else {
        this.vel.x = 0;
      }
      if (me.input.isKeyPressed("jump")) {
                if (this.doJump()) {
                }
                
                if (me.input.isKeyPressed("jump")) {
                    if (this.jumping) {
                        this.pos.y = this.pos.y - 8;
                    }
                }
            }
    
     var collision = this.collide();
     this.updateMovement();
     return true;
    
    
    }
});

game.LevelTrigger = me.ObjectEntity.extend({
   init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.collidable = true;
      this.level = settings.level;
      
   },
           
      onCollision: function() {
         this.collidable = false;
         me.levelDirector.loadLevel.defer(this.level);
         me.state.current().resetPlayer.defer();
      }     
});