function Simulation() {

    this.running = true;

    this.entities = [];

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
                $("#running").html("not running<br/>");
            }   // esc
        });
    }

    this.run = function() {
        $("#running").html("running<br/>");
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
        for(var i = 0; i < this.entities.length; i++) {
            this.handleEntity(this.entities[i]);
            if(!this.entities[i].alive()) {
                this.entities.splice(i, 50);
            }
        }
    }

    this.handleEntity = function(e) {
        if(this.entities.length < 150) {
            var e2;
            for(var i = 0; i < this.entities.length; i++) {
                e2 = this.entities[i];
                if(e.id != e2.id) {
                    var d = Math.sqrt( (e2.x - e.x) * (e2.x - e.x) + (e2.y- e.y) * (e2.y - e.y) );
                    if(d < 2) {
                        var n = UTIL.dice(2);
                        for(var j = 0; j < n; j++) {
                            var baby = new Entity(this.entities.length, this);
                            baby.r = (e.r + e2.r) / 2;
                            baby.g = (e.g + e2.g) / 2;
                            baby.b = (e.b + e2.b) / 2;
                            baby.color = UTIL.rgbToHtml(baby.r, baby.g, baby.b);
                            this.entities.push(baby);
                        }
                    }
                }
            }
        }
        
        e.move();
        e.draw();
        
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
            this.hp -= 0.1;
        }
    }
    
    this.draw = function() {
        CANVAS.drawRect(this.x - this.hp / 2, this.y - this.hp / 2, this.hp, this.color);
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

CANVAS.init = function() {
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

UTIL.rgbToHtml = function(r, g, b) {
    var decColor = 0x1000000 + b + 0x100 * g + 0x10000 * r ;
    return '#' + decColor.toString(16).substr(1);
}

UTIL.dice = function(max) {
    return Math.floor(Math.random() * max);
}