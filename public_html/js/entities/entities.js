game.PlayerEntity = me.ObjectEntity.extend({
   init: function(x,y, settings) {
       settings.image = "player1-spritesheet";
       settings.spritewidth = "72";
       settings.spriteheight = "97";
       this.parent(x, y, settings);
       
       this.collidable = true; 
       
       this.renderable.addAnimation("idle", [3]);
       this.renderable.addAnimation("duck", [0]);
       this.renderable.addAnimation("run", [3,4,5,6,7,8,9,10,11]);
       this.renderable.addAnimation("up", [2]);
       this.renderable.setCurrentAnimation("idle");       
       
       this.setVelocity(5, 20);
       
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   },
    
    update: function(dt) {
      if(me.input.isKeyPressed("right")) {
          this.flipX(false);
          this.vel.x += this.accel.x * me.timer.tick;
      }      
      else if(me.input.isKeyPressed("left")) {
          this.flipX(true);
          this.vel.x -= this.accel.x * me.timer.tick;
      }      
      else {
        this.vel.x = 0;
        this.renderable.setCurrentAnimation("run");
      }      
      if (me.input.isKeyPressed("jump")) {
              if (this.doJump())
              this.renderable.setCurrentAnimation("up");  
              if (me.input.isKeyPressed("jump")) {
                    if (this.jumping) {
                        this.pos.y = this.pos.y - 8;
                    }
                }
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
            this.parent(dt);
            return true;
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
 
game.EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        settings.image = "slime-spritesheet";
        settings.spritewidth = 60;
        settings.spriteheight = 32;
        this.parent(x, y , settings);
         
         x = this.pos.x;
        this.startX = x;
        this.endX   = x + width - settings.spritewidth;
        this.pos.x  = x + width - settings.spritewidth;
        
        this.setVelocity(4, 6);
         
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
    },
 
    onCollision: function(res, obj) {
 
        if (this.alive && (res.y > 0) && obj.falling) {
            this.renderable.flicker(750);
        }
    },
 
    update: function(dt) {
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
         
        this.updateMovement();
         
        if (this.vel.x!==0 || this.vel.y!==0) {
            this.parent(dt);
            return true;
        }
        return true;
    }
});