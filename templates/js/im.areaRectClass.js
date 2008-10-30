var areaRectClass = areaClass.extend({
    _coords:-1,

    initCoords: function(coords) {
        if(typeof coords == 'undefined') { return; }
        this._coords = new Array();
    	var tmpCoords = coords.split(",");
        this.setX(tmpCoords[0],tmpCoords[2]);
        this.setY(tmpCoords[1],tmpCoords[3]);    
    },

    // called from canvasClass
	persistanceXML: function() {
		return "<area shape=\"rect\" coords=\""+this.getLeftX()+","+this.getTopY()+","+this.getRightX()+","+this.getBottomY()+"\" alt=\"" + this.getLabel() + "\" color=\""+this.getColor()+"\">"+this.getLink()+"</area>";
	},

    // called from canvasClass
    drawSelection: function(vectorsObj) {
            vectorsObj.setColor(this.getColor());            
            vectorsObj.setStroke(1);
            vectorsObj.drawRect(this.getLeftX(),this.getTopY(),this.getWidth(),this.getHeight());
            /*vectorsObj.setStroke(Stroke.DOTTED);
            vectorsObj.setColor("#ffffff");         
            vectorsObj.drawRect(this.getLeftX(),this.getTopY(),this.getWidth(),this.getHeight());
            vectorsObj.setColor(_color);         */
            
            this.drawEdge(vectorsObj,this.getLeftX(),this.getTopY());
            this.drawEdge(vectorsObj,this.getRightX(),this.getTopY());
            this.drawEdge(vectorsObj,this.getRightX(),this.getBottomY());
            this.drawEdge(vectorsObj,this.getLeftX(),this.getBottomY());          
    },

    // called from canvasClass
    formMarkup: function(formBlueprints) {
        return this.getCanvas().getFormBlueprint("rectForm").replace(/MAPFORMID/g,this.getFormId())
                     								 .replace(/MAPAREAVALUE_URL/g,escape(this.getLink()))
                     								 .replace(/MAPAREAVALUE/g,this.getLink());
    },

    // called from canvasClass
    formUpdate: function() {
        var result = this.getFormId() + "_x1=" + this.getLeftX() + ";" 
                    + this.getFormId() + "_y1=" + this.getTopY() + ";"
                    + this.getFormId() + "_x2=" + this.getRightX() + ";"
                    + this.getFormId() + "_y2=" + this.getBottomY() +  ";";
        
        
        result = result  + this.getFormId() + "_link=" + this.getLink() + ";";
        result = result  + this.getFormId() + "_label=" + this.getLabel() + ";";
        return result;
    },
    
    
    applyBasicTypeActions: function() {
    
    },
    
    applyAdditionalTypeActions: function() {
    
    },
    
    updateCoordsFromForm: function(id) {
        this.setX(parseInt($("#" + this.getFormId() + "_x1").val()), parseInt($("#" + this.getFormId() + "_x2").val()));
        this.setY(parseInt($("#" + this.getFormId() + "_y1").val()), parseInt($("#" + this.getFormId() + "_y2").val()));
        this.getCanvas().updateCanvas(this.getId());
    },

 
    hitOnObjectEdge: function(mouseX,mouseY,edgeSize) {
        var result = -1;
        if(this.hitEdge(mouseX,mouseY,this.getLeftX(),this.getTopY(),edgeSize)) {
            result = 0;
        } else if(this.hitEdge(mouseX,mouseY,this.getRightX(),this.getTopY(),edgeSize)) {
            result = 1;
        } else if(this.hitEdge(mouseX,mouseY,this.getRightX(),this.getBottomY(),edgeSize)) {
            result = 2;
        } else if(this.hitEdge(mouseX,mouseY,this.getLeftX(),this.getBottomY(),edgeSize)) {
            result = 3;
        }
        return result;
    },
    
       
    performResizeAction: function(edge,x,y) {
        var tx = this.getLeftX();
        var ty = this.getTopY();
        var tw = this.getWidth();
        var th = this.getHeight();
        /* calculate new size */
        if(edge==0 || edge==3) {    tw = tw-(x-tx);   }
        if(edge==0 || edge==1) {    th = th-(y-ty);   }
        if(edge==2 || edge==1) {    tw = x-tx;  }
        if(edge==2 || edge==3) {    th = y-ty;  }
        if(edge==0 || edge==3) {    tx = x;   }
        if(edge==0 || edge==1) {    ty = y;   }
        /* handle negativ width values */
        if(tw<0) {
            tx=tx+tw;
            tw=-tw;
            if(edge==0) {       edge=1; }
            else if(edge==1) {  edge=0; }
            else if(edge==2) {  edge=3; }
            else if(edge==3) {  edge=2; }
        }
        /* handle negativ height values */
        if(th<0) {
            ty=ty+th;
            th=-th;
            if(edge==0) {       edge=3; }
            else if(edge==1) {  edge=2; }
            else if(edge==2) {  edge=1; }
            else if(edge==3) {  edge=0; }            
        }
        this.setX(tx,tx+tw);
        this.setY(ty,ty+th);
        return edge;
    },
    
    getLeftX: function()          {  return parseInt(this._coords[0]); },
    getTopY: function()          {  return parseInt(this._coords[1]);  },
    getRightX: function()      {  return parseInt(this._coords[2]);  },
    getBottomY: function()      {  return parseInt(this._coords[3]); },

	getWidth: function()	{ return this.getRightX()-this.getLeftX(); },
	getHeight: function()	{ return this.getBottomY()-this.getTopY(); },
    
    setX: function(x1,x2)   {
          this._coords[0] = parseInt(parseInt(x1)>parseInt(x2)?x2:x1);
          this._coords[2] = parseInt(parseInt(x1)>parseInt(x2)?x1:x2);
    },
    setY: function(y1,y2)   {
          this._coords[1] = parseInt(parseInt(y1)>parseInt(y2)?y2:y1);
          this._coords[3] = parseInt(parseInt(y1)>parseInt(y2)?y1:y2);  
    },
    setW: function(value)     {   var x = this.getLeftX();    this.setX(x,x+value);     },
    setH: function(value)     {   var y = this.getTopY();    this.setY(y,y+value);     }
});
