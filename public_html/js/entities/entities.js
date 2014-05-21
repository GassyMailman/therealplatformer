game.PlayerEntity = me.ObjectEntity.extend({
   init: function(x, y, settings) {
       settings.image = "player1-spritesheet";
       settings.spritewidth = "72";
       settings.spriteheight = "97";
       settings.width = 72;
       settings.height = 97; 
       this.parent(x, y, settings);
       
       this.collidable = true; 
       
       this.renderable.addAnimation("idle", [3]);
       this.renderable.addAnimation("duck", [0]);
       this.renderable.addAnimation("run", [3,4,5,6,7,8,9,10,11]);
       this.renderable.addAnimation("up", [2]);
       this.renderable.setCurrentAnimation("idle");       
       
       this.setVelocity(7, 25);
       
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   },
    
    update: function(deltaTime) {
      if(me.input.isKeyPressed("right")) {
          this.renderable.flipX(false);
          this.vel.x += this.accel.x * me.timer.tick;
      }      
      else if(me.input.isKeyPressed("left")) {
          this.renderable.flipX(true);
          this.vel.x -= this.accel.x * me.timer.tick;
      }      
      else {
        this.vel.x = 0;
        this.renderable.setCurrentAnimation("run");
      }      
      if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
              this.vel.y -= this.accel.y * me.timer.tick;           
                this.jumping = true;
            }
     
        // check & update player movement
        this.updateMovement();
        
        var res = me.game.world.collide(this);
 
    if (res) {
        if (res.obj.type === me.game.ENEMY_OBJECT) {
            if ((res.y > 0) && ! this.jumping) {
                this.falling = false;
                this.vel.y = -this.maxVel.y * me.timer.tick;
                this.jumping = true;
                 } 
           
            else {
                this.renderable.flicker(750);
            }
        }
    }
 
        // update animation if necessary
        if (this.vel.x!==0 || this.vel.y!==0) {
            // update object animation
            this.parent(deltaTime);
            return true;
        }
        
     var collision = me.game.world.collide(this);
     this.updateMovement();
     return true;
    
    
    }
});

game.LevelTrigger = me.ObjectEntity.extend({
   init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.collidable = true;
      this.level = settings.level;
      this.xSpawn = settings.xSpawn;
      this.ySpawn = settings.ySpawn;
      
   },
           
      onCollision: function() {
         this.collidable = false;
         var x = this.xSpawn;
         var y = this.ySpawn;
         me.levelDirector.loadLevel(this.level);
         me.state.current().resetPlayer(x, y);
      }     
 });
 