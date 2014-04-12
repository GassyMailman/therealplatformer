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
           
        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;;
 
        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.spritewidth = settings.width = 64;
        settings.spritewidth = settings.height = 64;
         
        // call the parent constructor
        this.parent(x, y , settings);
         
        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.endX   = x + width - settings.spritewidth;
        this.pos.x  = x + width - settings.spritewidth;
 
        // walking & jumping speed
        this.setVelocity(4, 6);
         
        // make it collidable
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
            this.renderable.flicker(750);
        }
    },
 
    // manage the enemy movement
    update: function(dt) {
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!==0 || this.vel.y!==0) {
            // update object animation
            this.parent(dt);
            return true;
        }
        return false;
    }
});