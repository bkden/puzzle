var table = document.getElementById('gameboard');
var ct = document.getElementById('contain');
var st = document.getElementById('status');
var t;
let g;

class puzzle {
    constructor(row,col) {
        
        this.row = row;
        this.col = col;

        this.arr = [];
        this.winarr = [];

        this.blank = 0;
        this.id;

        this.firsttime = 0;
        this.timeload = 0;
        this.s ;
        this.m ;
        this.h ;

        this.R;
        this.C;

        this.newR;
        this.newC;


        this.moves = 0;

        this.createblankarray();
        this.randomarr();
        if (this.checkissolve) {
            this.drawboard();
            this.resettime();
            this.cleartime();
            this.showmoves();
        } else {
            this.randomarr();
        }
        
       
    }
    

    createblankarray() {
        
        var count = 0;
        var r,c,rs;

        if (this.row>15) {
            this.row = 15;
            document.getElementById('row').value = 15;
            rs = 1;
        }
        if (this.col > 15) {
            this.col = 15;
            document.getElementById('col').value = 15;
            rs = 1;
        }

        if (rs == 1) {
            alert('Max is 15x15');
            rs = 0;
        }

        for (r=0;r<this.row;r++) {
            this.arr[r] = [];
            this.winarr[r] = [];
            for (c=0;c<this.col;c++) {
                this.arr[r][c] = count;
                count++;
                if (count==(this.row*this.col)) count=0
                this.winarr[r][c] = count;
            }
        }
        
        
    }


    randomarr() {

        var arrcache = [];
        var count = 0;

        for (var i=0;i<(this.row*this.col);i++) {
            arrcache[i] = i;
        }

        //******** Random Array ************ */
        var n = arrcache.length;
        for (i = (n-1); i > 0; i--) {
            var j = Math.floor(Math.random() * (i+1));
            [arrcache[i],arrcache[j]] = [arrcache[j],arrcache[i]];
        }
        
        //******* Convert one-arr to multi-arr */
        for (var r=0;r<this.row;r++){
            for (var c=0;c<this.col;c++) {
                this.arr[r][c] = arrcache[count];
                if (arrcache[count]==0) this.blank=count;
                count++;
            }
        }

    }

    drawboard() {

        let output='';
        let name,vl;
        var id = 0;

        for (var r = 0; r < this.row; r++) {

            output += '<tr>';

            for (var c = 0; c < this.col; c++) {

                
                name = 'txtbox';
                vl = this.arr[r][c];
                
                if (vl == 0) {
                    vl = '';
                    name = 'txtblank';
                } 
                
                output += "<td><div class='dcl'><input type='text' id='"+id+"' class='"+name+"' value='"+vl+"' onclick='move(this.id);' readonly ></div></td>";

                id++;
            }

            output += '</tr>';
        }
        
        table.innerHTML = output;
    
        //*********************************************** */
        // Edit font size of number into box
        var el = document.querySelectorAll('.txtbox');
        var fs = 50-(this.row*2.5);
        
        for (var i=0;i<el.length;i++) {
            el[i].style.fontSize = fs;
        }
        
    }

    checkcollision(){


        let position = [
            [-1,0],
            [1,0],
            [0,-1],
            [0,1],
        ];

        for (var p = 0;p<4;p++) {
            var r = Math.floor(this.id/this.row);
            var c = this.id%this.row;
            
            // Check four position
            // up, down, left, right
            
            //    |-c-|--0--|--1--|--2--
            // -r-|
            // -0-|   |--1--|--2--|--3--
            // -1-|   |--4--|--5--|--6--
            // -2-|   |--7--|--8--|--0--

            // r0c0 -> 1
            // r0c1 -> 2
            // r0c2 -> 3

            // Click -> four position
            // Up -> row-1 ||| Down -> row+1 ||| Left -> col-1 ||| Right -> col+1
            r+=position[p][0];
            c+=position[p][1];

            
            
            if (r > (this.row-1) || r < 0 || c > (this.col-1) || c < 0){
                continue;
            }
            

            
            var result = this.arr[r][c];
            if (result == 0) {
                return false;
            }

        }
    
        return true;
    }

    convert(x) {
        
        this.R = Math.floor(x/this.row);
        this.C = x%this.row;
        

    }

    canmove(x) {

        this.checktime();

        this.move(0,0,x);
    }

    checkwin() {
        var count = 0;

        for (var r = 0; r < this.row; r++) {
            for (var c = 0; c < this.col; c++) {

                var x = this.arr[r][c];
                var y = this.winarr[r][c];
                if (x == '') x = 0;
                if (x == y) {
                    count++;
                }
            }
        }
        if (count == (this.row*this.col)) {
            return true;
        } else {
            return false;
        }
        
    }

    resettime(){
        this.s = 0;
        this.h = 0;
        this.m = 0;
        
        
    }

    starttime() {
        
       
        this.s++;
        if (this.s==60) {
            this.s=0;
            this.m++;
            if (this.m==60) {
                this.m=0;
                this.h++;
            }
        }
        this.showtime();
        
        t = setTimeout(() => {this.starttime();},1000);

        
    }

    cleartime() {
        
        
        clearTimeout(t);
        
        if (this.firsttime ==0) {
            document.getElementById('txttime').value = "00:00:00";
        }

        
    }
    

    showtime() {
        
        var xs = 0;
        var xm = 0;
        var xh = 0;
        xs = this.s;
        if (xs<10) xs = "0"+xs.toString();
        if (xm<10) xm = "0"+xm.toString();
        if (xh<10) xh = "0"+xh.toString();
       
        document.getElementById('txttime').value = xh+':'+xm+':'+xs;
    }

    showmoves() {
        document.getElementById('txtmoves').value = this.moves;
    }


    checkissolve() {
        let arrtemp = [];
        let z,vl,p,pb,cb;
        let count = 0;
        let cx = 0;

        // Find blank row position
        this.convert(this.blank);
        p = row-this.R;
        if (p%2==0) {
            pb = true; // Even
        } else {
            pb = false; // Odd
        }
        
        
        for (var r=0;r<this.row;r++) {
            for (var c=0;c<this.col;c++) {
                
                vl = this.arr[r][c];
            

                for (var j=1;j<vl;j++) {

                    if (arrtemp[0]==undefined) {
                        z=0;
                    }

                    for (k=0;k<arrtemp.length;k++) {
                        if (j==arrtemp[k]) {
                            z = 1;
                            break;
                        } else {
                            z = 0;
                        }
                    }

                    if (z==0) cx++;
                }

                count += cx;
                arrtemp.push(vl);
                cx = 0;
            }
        }

        if (count%2==0) {
            cb = true;  
        } else {
            cb = false; 
        }
        
        if (this.row%2==1) {
            if (count%2==1) {
                issolved = false;
                
            } else {
                issolved = true;
                
            }
        }

        if (this.row%2 ==0) {
            
            if (pb^cb) {
                issolved = true;
                // console.log('Giải được');
            } else {
                issolved = false;
                // console.log('Không giải được');
            }
        }
        
        if (issolved) {
            return true;
        } else {
            return false;
        }
    
    }

    move(x,y,z) {

        if (z>=0) {
            this.convert(z);
            this.newR = this.R + x;
            this.newC = this.C + y;
            this.convert(this.blank); 
        } else {
            this.convert(this.blank);  
            
            this.newR = this.R + x;
            this.newC = this.C + y;
        }
        
        if (this.arr[this.newR][this.newC]!=undefined) {
           
            this.arr[this.R][this.C] = this.arr[this.newR][this.newC];
            this.arr[this.newR][this.newC] = '';

            this.blank = (this.newR*this.row+this.newC);
        }
        this.drawboard();
        this.moves++;
        this.showmoves();
    }

    checktime(){
        if (this.firsttime==0) {
            this.starttime();
            this.firsttime=1;
        }
    }

    left() {
        this.checktime();
        this.move(0,1);
        
    }

    right() {
        this.checktime();
        this.move(0,-1);
    }

    up() {
        this.checktime();
        this.move(1,0);
    }

    down() {
        this.checktime();
        this.move(-1,0);
    }
}

function gameonload() {
    var r = document.getElementById('row').value;
    var c = document.getElementById('col').value;
    
    st.style.display = 'none';
    ct.style.display = 'block';
    ct.style.marginTop = '50px';
    

    g = new puzzle(r,c);


}



function start() {
    gameonload();
}

document.addEventListener('keydown',CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        g.left();
    }
    if (event.keyCode == 38) {
        g.up();
    }
    if (event.keyCode == 39) {
        g.right();
    }
    if (event.keyCode == 40) {
        g.down();
    }
}

function move(x) {
    g.id = x;
    if (!g.checkcollision()) {
        g.canmove(x);
        
    }

    if (g.checkwin()) {
        st.style.display = 'block';
        ct.style.marginTop = '-600px';
        g.cleartime();
    }
}


gameonload();

