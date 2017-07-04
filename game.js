//Game variables
        var canvas, ctx, _HEIGHT, _WIDTH, frames = 0, maxJump = 3, speed = 6,
            currentState,

        states = {
            play: 0,
            playing:1,
            gameOver:2

        },

        ground = {
           y:550,
           _height:50,
           _color:"#e8da78",

           draw: function(){
               ctx.fillStyle = this._color;
               ctx.fillRect (0,this.y,_WIDTH, this._height);
           }
        },

        bloc = {
            x:50,
            y:0,
            _height:50,
            _width:50,
            _color:"#ff4e4e",
            gravity: 1.6,
            speed: 0,
            jumpStrength: 23.6,
            jumpCount: 0,
            score: 0,

            updates:function(){
                this.speed += this.gravity;
                this.y += this.speed;

                //bloc in ground -- if gameover bloc don't stay in ground 
                if (this.y > ground.y - this._height && currentState != states.gameOver){
                    this.y = ground.y - this._height
                    this.jumpCount = 0;
                    this.speed = 0;
                }
            },
            jump:function(){
                if(this.jumpCount < maxJump){
                    this.speed = - this.jumpStrength;
                    this.jumpCount++;
                 }
            },
         
            reset: function(){
                 this.speed = 0;
                 this.y = 0;
                 this.score = 0;
            },

            draw:function(){
                ctx.fillStyle = this._color;
                ctx.fillRect (this.x, this.y,this._width,this._height);
            }
        };

        obstacles = {
             _obs: [],
            colors: ["#ff9c1c","#6b1cff","#d646b2","#3c7fc4","#48964d"],
            insertingTime: 0,

            insert :function(){
                this._obs.push({
                    x: _WIDTH,
                    //_width: 30 + Math.floor(21 * Math.random()),
                    _width : 50,
                    _height: 30 + Math.floor(120 * Math.random()),
                    _color: this.colors[Math.floor(5 * Math.random())]
                });

                this.insertingTime = 30 + Math.floor(21 * Math.random());
            },

            updates:function(){
                if(this.insertingTime == 0)
                    this.insert();
                    else
                        this.insertingTime--;

                for(var i = 0,  tam = this._obs.length; i < tam; i++){
                    var obs = this._obs[i];

                    obs.x -= speed;
                   
                    //collision between bloc and obstacles
                    if (bloc.x < obs.x +obs._width && bloc.x + bloc._width >=
                          obs.x && bloc.y + bloc._height >= ground.y - obs._height)
                              currentState = states.gameOver;
                  
                    else if (obs.x == 0)
                    bloc.score ++;

                    else if(obs.x <= -obs._width){
                        this._obs.splice(i, 1)
                        tam--;
                        i--;
                    }
                }
            },
            
            //to clear array
            clean:function(){
                this._obs = [];
            },

            draw:function(){
                for(var i = 0, tam = this._obs.length; i < tam; i++){
                    var obs = this._obs[i];
                    ctx.fillStyle = obs._color;
                    ctx.fillRect(obs.x, ground.y - obs._height, obs._width, obs._height);
                }
            }
        };
        
        function click(event){
            if(currentState == states.playing)
                bloc.jump();

            else if (currentState == states.play){
                currentState = states.playing;
            }
            else if (currentState == states.gameOver){
                currentState = states.play;
                obstacles.clean();
                bloc.reset();
            }
        }

        function main(){
            _HEIGHT = window.innerHeight;
            _WIDTH =window.innerWidth;

            if(_WIDTH >= 500){
                _WIDTH = 600;
                _HEIGHT = 600;
            }
            canvas =document.createElement("canvas");
            canvas.width = _WIDTH;
            canvas.height = _HEIGHT;
            canvas.style.border = "1px solid #000";
            
            ctx = canvas.getContext("2d");
            document.body.appendChild(canvas);
            document.addEventListener("mousedown", click);

            currentState = states.play;
            reload();
        }

        function reload(){
            updates();
            draw();

            window.requestAnimationFrame(reload);
        }

        function updates(){
            frames++;

             bloc.updates();
            if (currentState == states.playing)
                obstacles.updates();
        }

        function draw(){
            ctx.fillStyle = "#80daff";
            ctx.fillRect(0,0,_WIDTH, _HEIGHT);

            //draw score player
            ctx.fillStyle = "#fff";
            ctx.font = "50px Atarian System"; //Connection Serif
            ctx.fillText(bloc.score, 30,68);
           
            
            if(currentState == states.play){
               ctx.fillStyle = "green";
               ctx.fillRect(_WIDTH / 2 - 50, _HEIGHT / 2 - 50, 100,100);
            }
            else if (currentState == states.gameOver){
                ctx.fillStyle = "red";
                ctx.fillRect(_WIDTH / 2 - 50, _HEIGHT / 2 - 50, 100,100);

                //when game over save score and write score in bloc red 
                ctx.save();
                ctx.translate(_WIDTH / 2 , _HEIGHT / 2);
                ctx.fillStyle = "#fff";

                if (bloc.score <10)
                    ctx.fillText(bloc.score, -13,19);

                else if(bloc.score >=10 && bloc.score < 100)
                     ctx.fillText(bloc.score, -26, 19);
                else
                    ctx.fillText(bloc.score, -39, 19);    

                ctx.restore();
            }

            else if(currentState == states.playing)
                    obstacles.draw();
            
          
            ground.draw();
            bloc.draw();
        }

        //inicializa o jogo 
        main();