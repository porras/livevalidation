// Copyright (c) 2007 Alec Hill (www.livevalidation.com) - LiveValidation is licensed under the terms of the MIT License

var LiveValidation = Class.create();
Object.extend(LiveValidation, {
    TEXTAREA: 1,
    TEXT: 2,
    PASSWORD : 3,
    CHECKBOX: 4,
    massValidate: function(validations){
      	var returnValue = true;
    	for(var i = 0, len = validations.length; i < len; ++i ){
    		var valid = validations[i].validate();
    		if(returnValue) returnValue = valid;
    	}
    	return returnValue;
    }
});
LiveValidation.prototype = {
    validClass: 'LV_valid',
    invalidClass: 'LV_invalid',
    messageClass: 'LV_validation_message',
    validFieldClass: 'LV_valid_field',
    invalidFieldClass: 'LV_invalid_field',
    displayMessageWhenEmpty: false,
    initialize: function(element, optionsObj){
      	if(!element) throw new Error("LiveValidation::initialize - No element reference or element id has been provided!");
    	this.element = $(element);
    	if(!this.element) throw new Error("LiveValidation::initialize - No element with reference or id of '" + element + "' exists!");
        this.elementType = this.getElementType();
        this.validations = [];
        // overwrite the options defaults with passed in ones
        this.options = Object.extend({
			validMessage: 'Thankyou!',
			onValid: function(){ this.insertMessage(this.createMessageSpan()); this.addFieldClass(); },
			onInvalid: function(){ this.insertMessage(this.createMessageSpan()); this.addFieldClass(); },
            insertAfterWhatNode: this.element
		}, optionsObj || {});
        this.options.insertAfterWhatNode = $(this.options.insertAfterWhatNode);
        Object.extend(this, this.options);
        if(this.elementType == LiveValidation.CHECKBOX){
            Event.observe(this.element, 'change', this.validate.bindAsEventListener(this));
			Event.observe(this.element, 'click', this.validate.bindAsEventListener(this));
        }else{
            Event.observe(this.element, 'keyup', this.validate.bindAsEventListener(this));
            Event.observe(this.element, 'blur', this.validate.bindAsEventListener(this));
        }
    },
    add: function(validationFunction, validationParamsObj){
      	this.validations.push( {type: validationFunction, params: validationParamsObj || {} } );
        return this;
    },
    getElementType: function(){
    	switch(true){
    	  	case (this.element.nodeName == 'TEXTAREA'):
    	  		return LiveValidation.TEXTAREA;
    	  	case (this.element.nodeName == 'INPUT' && this.element.type == 'text'):
    	  		return LiveValidation.TEXT;
    	  	case (this.element.nodeName == 'INPUT' && this.element.type == 'password'):
    	  		return LiveValidation.PASSWORD;
    	  	case (this.element.nodeName == 'INPUT' && this.element.type == 'checkbox'):
    	  		return LiveValidation.CHECKBOX;
            case (this.element.nodeName == 'INPUT'):
    	  		throw new Error('LiveValidation::getElementType - Cannot use LiveValidation on an ' + this.element.type + ' input!');
    	  	default:
    	  		throw new Error('LiveValidation::getElementType - Element must be an input or textarea!');
    	}
    },
    doValidations: function(){
      	this.validationFailed = false;
      	for(var i = 0, len = this.validations.length; i < len; ++i){
    	 	var validation = this.validations[i];
    		switch(validation.type){
    		   	case Validate.Presence:
                case Validate.Confirmation:
                case Validate.Acceptance:
    		   		this.displayMessageWhenEmpty = true;
    		   		this.validationFailed = !this.validateElement(validation.type, validation.params); 
    				break;
    		   	default:
    		   		this.validationFailed = !this.validateElement(validation.type, validation.params);
    		   		break;
    		}
    		if(this.validationFailed) return false;	
    	}
    	this.message = this.validMessage;
    	return true;
    },
    validateElement: function(validationFunction, validationParamsObj){
      	var value = this.element.value;
      	if(validationFunction == Validate.Acceptance){
    	    if(this.elementType != LiveValidation.CHECKBOX) throw new Error('LiveValidation::validateElement - Element to validate acceptance must be a checkbox!');
    		value = this.element.checked;
    	}
        var isValid = true;
      	try{    
    		validationFunction(value, validationParamsObj);
    	} catch(error) {
    	  	if(error instanceof Validate.Error){
    			if( value !== '' || (value === '' && this.displayMessageWhenEmpty) ){
    				this.validationFailed = true;
    				this.message = error.message;
    				isValid = false;
    			}
    		}else{
    		  	throw error;
    		}
    	}finally{
    	    return isValid;
        }
    },
    validate: function(){
      	var isValid = this.doValidations();
    	if(isValid){
    		this.onValid();
    		return true;
    	}else{
    	  	this.onInvalid();
    	  	return false;
    	}
    },
    createMessageSpan: function(){
        var span = document.createElement('span');
    	var textNode = document.createTextNode(this.message);
      	span.appendChild(textNode);
        return span;
    },
    insertMessage: function(elementToInsert){
        if( nxtEl = this.insertAfterWhatNode.next('.' + this.messageClass) ) nxtEl.remove();
        var className = this.validationFailed ? this.invalidClass : this.validClass;
      	if( (this.displayMessageWhenEmpty && (this.elementType == LiveValidation.CHECKBOX || this.element.value == '')) || this.element.value != '' ){
    	  	$(elementToInsert).addClassName( this.messageClass + (' ' + className) );
            if( nxtSibling = this.insertAfterWhatNode.nextSibling){
    		  		this.insertAfterWhatNode.parentNode.insertBefore(elementToInsert, nxtSibling);
    		}else{
    			    this.insertAfterWhatNode.parentNode.appendChild(elementToInsert);
    	    }
    	}
    },
    addFieldClass: function(){
        if(!this.validationFailed){
            this.element.removeClassName(this.invalidFieldClass);
            if(!this.displayMessageWhenEmpty && this.element.value == ''){
                this.element.removeClassName(this.validFieldClass);
            }else{
                if(!this.element.hasClassName(this.validFieldClass)) this.element.addClassName(this.validFieldClass);
            }
        }else{
            this.element.removeClassName(this.validFieldClass);
            if(!this.element.hasClassName(this.invalidFieldClass)) this.element.addClassName(this.invalidFieldClass);
        }
    }
}
var Validate = {
    Presence: function(value, paramsObj){
        var params = Object.extend({
    		failureMessage: "Can't be empty!"
    	}, paramsObj || {});
    	if(value === '' || value === null || value === undefined) Validate.fail(params.failureMessage);
    	return true;
    },
    Numericality: function(value, paramsObj){
        var suppliedValue = value;
        var value = Number(value);
        var paramsObj = paramsObj || {};
        var params = { 
            notANumberMessage: paramsObj.notANumberMessage || "Must be a number!",
            notAnIntegerMessage: paramsObj.notAnIntegerMessage || "Must be an integer!",
            wrongNumberMessage: paramsObj.wrongNumberMessage || "Must be " + paramsObj.is + "!",
    		tooLowMessage: paramsObj.tooLowMessage || "Must not be less than " + paramsObj.minimum + "!",
    		tooHighMessage: paramsObj.tooHighMessage || "Must not be more than " + paramsObj.maximum + "!", 
    		is: ((paramsObj.is) || (paramsObj.is == 0)) ? paramsObj.is : null,
    		minimum: ((paramsObj.minimum) || (paramsObj.minimum == 0)) ? paramsObj.minimum : null,
    		maximum: ((paramsObj.maximum) || (paramsObj.maximum == 0)) ? paramsObj.maximum : null,
            onlyInteger: paramsObj.onlyInteger || false
    	};
        if (!isFinite(value))  Validate.fail(params.notANumberMessage);
        if (params.onlyInteger && ( ( /\.0+$|\.$/.test(String(suppliedValue)) )  || ( value != parseInt(value) ) ) ) Validate.fail(params.notAnIntegerMessage);
    	switch(true){
    	  	case (params.is !== null):
    	  		if( value != Number(params.is) ) Validate.fail(params.wrongNumberMessage);
    			break;
    	  	case (params.minimum !== null && params.maximum !== null):
    	  		Validate.Numericality(value, {tooLowMessage: params.tooLowMessage, minimum: params.minimum});
    	  		Validate.Numericality(value, {tooHighMessage: params.tooHighMessage, maximum: params.maximum});
    	  		break;
    	  	case (params.minimum !== null):
    	  		if( value < Number(params.minimum) ) Validate.fail(params.tooLowMessage);
    			break;
    	  	case (params.maximum !== null):
    	  		if( value > Number(params.maximum) ) Validate.fail(params.tooHighMessage);
    			break;
    	}
    	return true;
    },
    Format: function(value, paramsObj){
      	var value = String(value);
        var params = Object.extend({ 
    	  	failureMessage: "Not valid!",
    		pattern: /./ 
    	}, paramsObj || {});
    	if(!params.pattern.test(value) /* && value != ''*/ ) Validate.fail(params.failureMessage);
    	return true;
    },
    Email: function(value, paramsObj){
        var params = Object.extend({ 
    	  	failureMessage: "Must be a valid email address!"
    	}, paramsObj || {});
    	Validate.Format(value, { failureMessage: params.failureMessage, pattern: /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i } );
    	return true;
    },
    Length: function(value, paramsObj){
    	var value = String(value);
        var paramsObj = paramsObj || {};
        var params = { 
            wrongLengthMessage: paramsObj.wrongLengthMessage || "Must be " + paramsObj.is + " characters long!",
        	tooShortMessage: paramsObj.tooShortMessage || "Must not be less than " + paramsObj.minimum + " characters long!",
        	tooLongMessage: paramsObj.tooLongMessage || "Must not be more than " + paramsObj.maximum + " characters long!",
            is: ((paramsObj.is) || (paramsObj.is == 0)) ? paramsObj.is : null,
            minimum: ((paramsObj.minimum) || (paramsObj.minimum == 0)) ? paramsObj.minimum : null,
        	maximum: ((paramsObj.maximum) || (paramsObj.maximum == 0)) ? paramsObj.maximum : null
        }
    	switch(true){
    	  	case (params.is !== null):
    	  		if( value.length != Number(params.is) ) Validate.fail(params.wrongLengthMessage);
    			break;
    	  	case (params.minimum !== null && params.maximum !== null):
    	  		Validate.Length(value, {tooShortMessage: params.tooShortMessage, minimum: params.minimum});
    	  		Validate.Length(value, {tooLongMessage: params.tooLongMessage, maximum: params.maximum});
    	  		break;
    	  	case (params.minimum !== null):
    	  		if( value.length < Number(params.minimum) ) Validate.fail(params.tooShortMessage);
    			break;
    	  	case (params.maximum !== null):
    	  		if( value.length > Number(params.maximum) ) Validate.fail(params.tooLongMessage);
    			break;
    		default:
    			throw new Error("Validate::Length - Length(s) to validate against must be provided!");
    	}
    	return true;
    },
    Inclusion: function(value, paramsObj){
    	var params = Object.extend({
            failureMessage: "Must be included in the list!",
            within: [],
            allowNull: false,
            partialMatch: false,
            exclusion: false
        }, paramsObj || {});
        if(params.allowNull && value == null) return true;
        if(!params.allowNull && value == null) Validate.fail(params.failureMessage);
        var found = (params.within.indexOf(value) == -1) ? false : true;
        if(params.partialMatch){
          found = false;
          params.within.each( function(arrayVal){
            if(value.indexOf(arrayVal) != -1 ) found = true;
          }); 
        }
    	if( (!params.exclusion && !found) || (params.exclusion && found) ) Validate.fail(params.failureMessage);
    	return true;
    },
    Exclusion: function(value, paramsObj){
        var params = Object.extend({
            failureMessage: "Must not be included in the list!",
            within: [],
            allowNull: false,
            partialMatch: false
        }, paramsObj || {});
        params.exclusion = true;// set outside of params so cannot be overridden
    	Validate.Inclusion(value, params);
        return true;
    },
    Confirmation: function(value, paramsObj){
      	if(!paramsObj.match) throw new Error("Validate::Confirmation - Error validating confirmation: Id of element to match must be provided!");
    	var params = Object.extend({
            failureMessage: "Does not match!",
            match: null
        }, paramsObj || {});
        params.match = $(paramsObj.match);
        if(!params.match) throw new Error("Validate::Confirmation - There is no reference with name of, or element with id of '" + params.match + "'!");
    	if(value != params.match.value) Validate.fail(params.failureMessage);
    	return true;
    },
    Acceptance: function(value, paramsObj){
      	var params = Object.extend({
            failureMessage: "Must be accepted!"
        }, paramsObj || {});
    	if(!value) Validate.fail(params.failureMessage);
    	return true;
    },
    now: function(validationFunction, value, validationParamsObj){
      	if(!validationFunction) throw new Error("Validate::now - Validation function must be provided!");
    	var isValid = true;
        try{    
    		validationFunction(value, validationParamsObj || {});
    	} catch(error) {
    		if(error instanceof Validate.Error){
    			isValid =  false;
    		}else{
    		 	throw error;
    		}
    	}finally{ 
            return isValid 
        }
    },
    Error: function(errorMessage){
    	this.message = errorMessage;
    	this.name = 'ValidationError';
    },
    fail: function(errorMessage){
        throw new Validate.Error(errorMessage);
    }
}