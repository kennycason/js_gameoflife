function GameOfLife(scale, speed) {
    
    this.width = 0;
    
    this.height = 0;
    
    this.scale = 2;
 
    this.ALIVE = 1;
    this.DEAD = 0;
    
    if(scale == null) {
        this.scale = 2;
    } else {
        this.scale = scale;
    }

    if(speed == null) {
        this.speed = 1;
    } else {
        this.speed = speed;
    }
    
    this.init = function() {
        CANVAS.init();

        this.width = CANVAS.width / this.scale;
        this.height = CANVAS.height / this.scale;
        
        this.map = new Array(this.width);
        this.map2 = new Array(this.height); // draw to this, then flip
        
       
        for(var x = 0; x < this.width; x++) {
            this.map[x] = new Array(this.height);
            this.map2[x] = new Array(this.height);
            for(var y = 0; y < this.height; y++) {
                this.map2[x][y] = this.DEAD;
                if(UTIL.dice(100) > 90) {
                    this.map[x][y] = this.ALIVE;
                } else {
                    this.map[x][y] = this.DEAD;
                }
            }    
        }
        var that = this;
        $(document).keyup(function(e) {
            if (e.keyCode == 13) {
                that.running = true;
                that.run();
            }   // enter
            if (e.keyCode == 27) {
                that.running = false;
                $("#running").html("not running");
            }   // esc
        });
    }
    
    this.run = function() {
        $("#running").html("running");
        this.running = true;
        this.runloop();
    }
    
    this.runloop = function() {
        var that = this;
        setTimeout(function() {
            if(that.running) {
                //$("#num_entites").html(that.entities.length + " alive");
                that.cycle();
                that.runloop();
            }
        }, this.sleep);
    }
    
    this.cycle = function() {
        this.process();
        this.draw();
      //  alert("draw");
    }
    
    this.process = function() {
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                /*
                o o o
                o x o
                o o o
                */
                var neighbors = 0;
                if(x > 0 && y > 0) { // TOP LEFT
                    if(this.map[x - 1][y - 1] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(x == 0 && y > 0) {
                        if(this.map[this.width - 1][y - 1] == this.ALIVE) {
                            neighbors++;
                        }
                    } else if(x > 0 && y == 0) {
                        if(this.map[x - 1][this.height - 1] == this.ALIVE) {
                            neighbors++;
                        }
                    }/* else { // CORNERS
                        if(this.map[CANVAS.width - 1][CANVAS.height - 1] == this.ALIVE) {
                            neighbors++;
                        }
                    }*/
                }
                if(y > 0) { // TOP
                    if(this.map[x][y - 1] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(this.map[x][this.height - 1] == this.ALIVE) {
                        neighbors++;
                    }
                }
                if(x < this.width - 1 && y > 0) { // TOP RIGHT
                    if(this.map[x + 1][y - 1] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(x == this.width - 1 && y > 0) {
                        if(this.map[0][y - 1] == this.ALIVE) {
                            neighbors++;
                        }
                    } else if(x < this.width - 1 && y == 0) {
                        if(this.map[x + 1][this.height - 1] == this.ALIVE) {
                            neighbors++;
                        }
                    }/* else { // CORNERS
                        if(this.map[0][CANVAS.height - 1] == this.ALIVE) {
                            neighbors++;
                        }
                    }*/
                }
                if(x > 0) { // LEFT
                    if(this.map[x - 1][y] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(this.map[this.width - 1][y] == this.ALIVE) {
                        neighbors++;
                    }
                }
                if(x < this.width - 1) { // RIGHT
                    if(this.map[x + 1][y] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(this.map[0][y] == this.ALIVE) {
                        neighbors++;
                    }
                }
                if(x > 0 && y < this.height - 1) { // BOTTOM LEFT
                    if(this.map[x - 1][y + 1] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(x > 0 && y == this.height - 1) {
                        if(this.map[x - 1][0] == this.ALIVE) {
                            neighbors++;
                        }
                    } else if(x == 0 && y < this.height - 1) {
                        if(this.map[this.width - 1][y + 1] == this.ALIVE) {
                            neighbors++;
                        }
                    }/* else { // CORNERS
                        if(this.map[CANVAS.width - 1][0] == this.ALIVE) {
                            neighbors++;
                        }
                    }*/
                }
                if(y < this.height - 1) { // BOTTOM
                    if(this.map[x][y + 1] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(this.map[x][0] == this.ALIVE) {
                        neighbors++;
                    }
                }
                if(x < this.width - 1 && y < this.height - 1) { // BOTTOM RIGHT
                    if(this.map[x + 1][y + 1] == this.ALIVE) {
                        neighbors++;
                    }
                } else { // wrap around
                    if(x < this.width - 1 && y == this.height - 1) {
                        if(this.map[x + 1][0] == this.ALIVE) {
                            neighbors++;
                        }
                    } else if(x == this.width - 1 && y < this.height - 1) {
                        if(this.map[0][y + 1] == this.ALIVE) {
                            neighbors++;
                        }
                    }/* else { // CORNERS
                        if(this.map[0][0] == this.ALIVE) {
                            neighbors++;
                        }
                    }*/
                }

                // Apply rules based on neighbors
                if(this.map[x][y] == this.ALIVE) {
                    if(neighbors < 2 || neighbors > 3) { // under/over population, kill it
                        this.map2[x][y] = this.DEAD;
                    } else { // it live on
                        this.map2[x][y] = this.ALIVE;
                    }
                } else {
                    if(neighbors == 3) { // bring it back to life (reproduce)
                         this.map2[x][y] = this.ALIVE;
                    } else {
                         this.map2[x][y] = this.DEAD;
                    }
                }
            }  
        }
        var tmp = this.map;
        this.map = this.map2;
        this.map2 = tmp;
    }
    
    this.draw = function() {
        CANVAS.clear();
        for(var y = 0; y < this.height; y++) {
            for(var x = 0; x < this.width; x++) {
                if(this.map[x][y] == this.ALIVE) {
                    CANVAS.drawRect(x * this.scale, y * this.scale, this.scale, '#fff');
                }
            }    
        }
    }
   
}



function Simulation() {

    this.running = true;

    this.entities = [];
    
    this.babies = [];
    
    this.maxEntities = 75;

    this.init = function() {
        CANVAS.init();
        this.entities = [];
        for(var i = 0; i < 50; i++) {
            this.entities[i] = new Entity(i, this);
        }
        
        this.running = true;
        //   \tthis.entities[1] = new Entity();
 
        var that = this;
        $(document).keyup(function(e) {
            if (e.keyCode == 13) {
                that.running = true;
                that.run();
            }   // enter
            if (e.keyCode == 27) {
                that.running = false;
                $("#running").html("not running");
            }   // esc
        });
    }

    this.run = function() {
        $("#running").html("running");
        this.running = true;
        this.runloop();
    }
    
    this.runloop = function() {
        var that = this;
        setTimeout(function() {
            if(that.running) {
                $("#num_entites").html(that.entities.length + " alive");
                that.cycle();
                that.runloop();
            }
        }, 1);
    }
    
    this.cycle = function() {
        CANVAS.clear();
        // handle entities
        for(var i = 0; i < this.entities.length; i++) {
            this.handleEntity(this.entities[i]);
            
            if(!this.entities[i].alive()) {
                this.entities.splice(i, 1);
            } 
        }
        
        // add babies to world
        if(this.babies.length > 0) {
            $("#babies").html(this.babies.length + " babies");
        }
        $("#avg_hp").html(this.averagePopulationHP() + " Avg HP");
        for(var i = 0; i < this.babies.length; i++) {
            if(this.entities.length < this.maxEntities) {
                this.entities.push(this.babies[i]);
            }
        }
        this.babies = [];
    }

    this.handleEntity = function(e) {
        this.reproduce(e);
        e.move();
        e.draw();
        
    }
    
    this.reproduce = function(e) {
        if(e.canReproduce() && this.entities.length < this.maxEntities) {
            var e2;
            for(var i = 0; i < this.entities.length; i++) {
                e2 = this.entities[i];
                if(e != e2 && e2.canReproduce()) {
                    var d = Math.sqrt( (e2.x - e.x) * (e2.x - e.x) + (e2.y- e.y) * (e2.y - e.y) );
                    if(d < 4) {
                        this.makeBabies(e, e2);
                    }
                }
            }
        }
    }
    
    this.averagePopulationHP = function() {
        if(this.entities.length == 0) {
            return 'Nan';
        }
        var tot = 0;
        for(var i = 0; i < this.entities.length; i++) {
            tot += this.entities[i].hp;
        }
        return (tot / this.entities.length).toFixed(2);
    }
    
    this.makeBabies = function(e, e2) {
        if(this.babies.length > this.maxEntities) {
            return;
        }
        // e.reproduced = true;
        // e2.reproduced = true;
        var n = UTIL.dice(5) + 1;
        for(var i = 0; i < n; i++) {
            var baby = new Entity(this.entities.length, this);
            baby.r = (e.r);
            baby.g = (e.g + e2.g) / 2;
            baby.b = (e2.b);
            baby.color = UTIL.rgbToHtml(baby.r, baby.g, baby.b);
            baby.x = e.x;
            baby.y = e2.y;
            baby.hp = (e.hp + e2.hp) / 2 + UTIL.dice(3);
            this.babies.push(baby);
        }   
        e.hp = 0;
        e2.hp = 0;
    }

}

function Entity(id, sim) {
    
    this.id = id;
    
    this.sim = sim
    
    this.r = UTIL.dice(256);
    this.g = UTIL.dice(256);
    this.b = UTIL.dice(256);

    this.color = UTIL.rgbToHtml(this.r, this.g, this.b);
    
    this.x = UTIL.dice(800);
    
    this.y = UTIL.dice(800);
    
    this.hp = 1 + UTIL.dice(13);
    
    this.xdir = UTIL.dice(10) - 5;
    
    this.ydir = UTIL.dice(10) - 5;
    
    // this.reproduced = false;
    
    this.bornTime = UTIL.getTime();
    
    this.move = function() {
        this.x += this.xdir;
        this.y += this.ydir;
        
        var collision = false;
        
        if(this.x <= 0 || this.x >= CANVAS.width - 1) {
            this.xdir *= -1;
            collision = true;
        }
        if(this.y <= 0 || this.y >= CANVAS.height - 1) {
            this.ydir *= -1;
            collision = true;
        }
        if(collision) {
            this.hp -= 0.2;
        }
    }
    
    this.draw = function() {
        CANVAS.drawRect(this.x - this.hp / 2, this.y - this.hp / 2, this.hp, this.color);
    }
    
    this.canReproduce = function() {
        var val = UTIL.getTime() - this.bornTime > 1000; // must be 2 seconds old
        return val;
    }
    
    this.alive = function() {
        return this.hp > 0;
    }
    
    this.inView = function() {
        return this.x >= 0 && this.x < CANVAS.width
        && this.y >= 0 && this.x < CANVAS.height;
    }
    
}

// static objects
CANVAS = {}

CANVAS.canvas = null;

CANVAS.canvasData;

CANVAS.context;

CANVAS.width = 800;

CANVAS.height = 800;

CANVAS.init = function(width, height) {
    CANVAS.canvas = $("#canvas").get(0);
    CANVAS.context = CANVAS.canvas.getContext("2d");
    CANVAS.canvasData = CANVAS.context.getImageData(0, 0, CANVAS.width, CANVAS.height);
}

CANVAS.drawRect = function(x, y, dim, color) {
    if(dim == null) {
        dim = 1;
    }
    if(color == null) {
        color = "black"
    }
    CANVAS.context.fillStyle = color;
    CANVAS.context.fillRect(x, y, dim, dim);

}

CANVAS.drawPixel = function(x, y, r, g, b, a) {
    var index = (x + y * CANVAS.canvasWidth) * 4;

    CANVAS.canvasData.data[index + 0] = r;
    CANVAS.canvasData.data[index + 1] = g;
    CANVAS.canvasData.data[index + 2] = b;
    CANVAS.canvasData.data[index + 3] = a;
}

CANVAS.updateCanvas = function() {
    CANVAS.context.putImageData(CANVAS.canvasData, 0, 0);
}

CANVAS.clear = function() {
    CANVAS.drawRect(0, 0, CANVAS.width, "black");
}

UTIL = {};

UTIL.getTime = function() {
    return new Date().getTime();
}

UTIL.rgbToHtml = function(r, g, b) {
    var decColor = 0x1000000 + b + 0x100 * g + 0x10000 * r ;
    return '#' + decColor.toString(16).substr(1);
}

UTIL.dice = function(max) {
    return Math.floor(Math.random() * max);
}
