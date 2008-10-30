var areaCircleClass = areaClass.extend({
    _coords:-1,

    initCoords: function(coords) {
        if(typeof coords == 'undefined') { return; }
        this._coords = new Array();
    	var tmpCoords = coords.split(",");
        this.setX(tmpCoords[0]);
        this.setY(tmpCoords[1]);    
        this.setRadius(tmpCoords[2]);
    },

    // called from canvasClass
	persistanceXML: function() {
		return "<area shape=\"circle\" coords=\""+this.getX()+","+this.getY()+","+this.getRadius()+"\" alt=\"" + this.getLabel() + "\" color=\""+this.getColor()+"\">"+this.getLink()+"</area>";
	},

    // called from canvasClass
    drawSelection: function(vectorsObj) {
            vectorsObj.setColor(this.getColor());            
            vectorsObj.setStroke(1);
            vectorsObj.drawEllipse(this.getX()-this.getRadius(),this.getY()-this.getRadius(),2*this.getRadius(),2*this.getRadius());  
            this.drawEdge(vectorsObj,this.getX(),this.getY());
            if((this.getX()-this.getRadius()) > 0) {  this.drawEdge(vectorsObj,this.getX()-this.getRadius(),this.getY()); }
            if((this.getX()+this.getRadius()) < this.getCanvas().getMaxW()) { this.drawEdge(vectorsObj,this.getX()+this.getRadius(),this.getY()); }
            if((this.getY()-this.getRadius()) > 0) {  this.drawEdge(vectorsObj,this.getX(),this.getY()-this.getRadius()); }
            if((this.getY()+this.getRadius()) < this.getCanvas().getMaxH()) { this.drawEdge(vectorsObj,this.getX(),this.getY()+this.getRadius()); }
    },

    // called from canvasClass
    formMarkup: function(formBlueprints) {
        return this.getCanvas().getFormBlueprint("circForm").replace(/MAPFORMID/g,this.getFormId())
                     								 .replace(/MAPAREAVALUE_URL/g,escape(this.getLink()))
                     								 .replace(/MAPAREAVALUE/g,this.getLink());
    },

    // called from canvasClass
    formUpdate: function() {
        var result = this.getFormId() + "_x=" + this.getX() + ";" 
                    + this.getFormId() + "_y=" + this.getY() + ";"
                    + this.getFormId() + "_radius=" + this.getRadius() + ";"
        
        result = result  + this.getFormId() + "_link=" + this.getLink() + ";";
        result = result  + this.getFormId() + "_label=" + this.getLabel() + ";";
        return result;
    },
    
    
    applyBasicTypeActions: function() {
    
    },
    
    applyAdditionalTypeActions: function() {
    
    },
    
    updateCoordsFromForm: function(id) {
        this.setX(parseInt($("#" + this.getFormId() + "_x").val()));
        this.setY(parseInt($("#" + this.getFormId() + "_y").val()));
        this.setRadius(parseInt($("#" + this.getFormId() + "_radius").val()));
        this.getCanvas().updateCanvas(this.getId());
    },

 
    hitOnObjectEdge: function(mouseX,mouseY,edgeSize) {
        var result = -1;
        if(this.hitEdge(mouseX,mouseY,this.getX(),this.getY(),edgeSize)) {
            result = 0;
        } else if(this.hitEdge(mouseX,mouseY,this.getX()-this.getRadius(),this.getY(),edgeSize)) {
            result = 1;
        } else if(this.hitEdge(mouseX,mouseY,this.getX()+this.getRadius(),this.getY(),edgeSize)) {
            result = 2;
        } else if(this.hitEdge(mouseX,mouseY,this.getX(),this.getY()-this.getRadius(),edgeSize)) {
            result = 3;
        } else if(this.hitEdge(mouseX,mouseY,this.getX(),this.getY()+this.getRadius(),edgeSize)) {
            result = 4;
        }
        return result;
    },
    
       
    performResizeAction: function(edge,x,y) {
    
        if(edge==0) {
            this.setX(x);
            this.setY(y);
        } else if(edge==1 || edge==2) {
            this.setRadius(this.getX()-x);
        } else if(edge==3 || edge==4) {
            this.setRadius(this.getY()-y);
        }
        return edge;
    },

    getX: function() {
        return this._coords[0];
    },
    setX: function(x)   {
        this._coords[0] = parseInt(x);
    },
    getY: function() {
        return this._coords[1];
    },
    setY: function(x)   {
        this._coords[1] = parseInt(x);
    },
    getRadius: function() {
        return this._coords[2];
    },
    setRadius: function(r)   {
          this._coords[2] = Math.abs(parseInt(r));
    }
});