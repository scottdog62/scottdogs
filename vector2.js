//Features of Vector2
var Vector2 = function(x, y)
{
	this.x = 0;
	this.y = 0;
	
	if(x != undefined)
	{
		this.x = x;
	}
	if(y != undefined)
	{
		this.y = y;
	}
	
	//Returns a new Vector2 with the same x and y values.
	this.copy = function()
	{
		
	}
	
	//Sets x and y to the values given to this function
	this.set = function(newX, newY)
	{
		
	};
	
	//Returns the length of this vector
	this.magnitude = function()
	{
		
	};
	
	//Clamps the length of this vector to 1
	this.normalize = function()
	{
		
	};
	
	//Adds another vector to this one
	this.add = function(v2)
	{
		
	};
	this.subtract = function(v2)
	{
		this.x -= v2.x;
		this.y -= v2.y;
	};
	
	//Multiplies the x and y values of this vector
	//by the number given to the function
	this.multiplyScalar = function(num)
	{
		
	};
	
	//Rotates a direction vector by the given angle
	this.rotateDirection = function(angle)
	{
		
	};
	
	//Reverses the direction of this vector
	this.reverse = function()
	{
		
	};
};