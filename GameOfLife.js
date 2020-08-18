(function() {
	let options = {
		rows : 50,
		cols : 50,
		resolution : 10,
		delay: 50, 

		update: null,
	};

	class gameOfLife {
		_make2dGrid () {
			let arr = Array(this.options.cols);

			for (let i = 0; i < arr.length; i++) {
				arr[i] = Array(this.options.rows);
			}

			return arr;
		}

		_initCanvas() {
			this.canvas.width = this.options.cols * this.options.resolution;
			this.canvas.height = this.options.rows * this.options.resolution;

			for(let i = 0; i < this.options.cols; i++) {
				for(let j = 0; j < this.options.rows; j++) {
					this.cells[i][j] = Math.floor(Math.random() * 2);
				}
			}
		}

		_drawCanvas() {
			const ctx = this.canvas.getContext('2d');

			const width = this.canvas.width
			const height = this.canvas.height

			ctx.fillStyle = "black";
			ctx.fillRect(0,0,width,height);

			for (var i = 0; i < this.options.cols; i++) {
				for (var j = 0; j < this.options.rows; j++) {
					let x = i * this.options.resolution;
					let y = j * this.options.resolution;
					if(this.cells[i][j] === 1){
						ctx.fillStyle = "white";
						ctx.fillStroke = "black";
						ctx.fillRect(x, y, this.options.resolution-1, this.options.resolution-1);
					}
				}
			}
		}

		constructor() {
			this.options = options; 
			this.canvas = document.querySelector(arguments[0]);

			if(typeof arguments[1] === 'object')
			{
				for (const option in this.options)
				{
					for(const argument in arguments[1])
					{
						if(option === argument) this.options[option] = arguments[1][argument];
						else this.options[argument] = arguments[1][argument];
					}
				}
			}else if(typeof arguments[1] !== 'undefined'){
				console.error('gameOfLife\'s argument must be an object of options');
			}

			this.cells = this._make2dGrid();

			this._initCanvas();
			this._drawCanvas();
		}

		_countNeighbours(grid, x, y) {
			let sum = 0;
			for (let i = -1; i < 2; i++){
				for (let j = -1; j < 2; j++){
					let col = (x + j + this.options.cols) % this.options.cols;
					let row = (y + i + this.options.rows) % this.options.rows;
					sum += grid[col][row];
				}
			}

			sum -= grid[x][y];
			return sum;
		}

		_computeNextStep(that) {
			let next = that._make2dGrid();

			for (var i = 0; i < that.options.cols; i++) {
				for (var j = 0; j < that.options.rows; j++) {
					let actualState = that.cells[i][j];

					let neighbours = that._countNeighbours(that.cells, i, j);

					if(actualState === 0  && neighbours === 3) {
						next[i][j] = 1;
					}else if(actualState === 1 && (neighbours < 2 || neighbours > 3)) {
						next[i][j] = 0;
					}else{
						next[i][j] = actualState;
					}
				}
			}

			that.cells = next;

			that._drawCanvas();

			if(that.options.update !== null) {
				that.options.update();
			}
		}

		play() {
			if(!this.intervalId){
				this.intervalId = setInterval(this._computeNextStep, this.options.delay, this);
			}
		}

		pause () {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}

		refresh () {
			this._initCanvas();

			if(!this.intervalId){
				this.intervalId = setInterval(this._computeNextStep, this.options.delay, this);
			}
		}
	}

	if(!window.gameOfLife) {
		window.gameOfLife = gameOfLife;
	}
})();