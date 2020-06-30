

import React, {Component} from 'react';

import './FormComponent.scss';

class AlertComponent extends Component{

    render(){
        return(
            <div>

                {
                    this.props.isSuccess ? 

                        <div className={`alert alert--success`}>
                            <p>Tu mensaje ha sido enviado con éxito </p>
                        </div>

                    :   

                        <div className={`alert alert--error`}>
                            <p>Para enviar el formulario, todos los campos deben de estar completados correctamente </p>
                        </div>

                }

            </div>
        );
    }

}



export class FormComponent extends Component{

    constructor(){
        super();

        this.state = {
            submitState: false,
            nameValue: '',
            nameSuccess: false,
            rutValue: '',
            moneyValue: '',
            moneySuccess: false,
            formSuccess: false,
        }
        
    }

    onSubmitBehaviours = (e)=>{
        e.preventDefault();

        this.setState({
            submitState: true,
        });

        //If all cases are successfull form success is toke

        if(this.state.nameSuccess){ 
            
            this.setState({
                formSuccess: true,
            });

        }else{
            this.setState({
                formSuccess: false,
            });
        }

    }

    //Validate all inputs on key up

    onKeyUpBehaviours = (e)=>{ 
        let item = e.currentTarget;
        let itemValue = item.value;

        //Name input

        if(item.id === 'name'){
            if(item.value.length){
                this.setState({
                    nameSuccess: true,
                })
            }else{
                this.setState({
                    nameSuccess: false,
                })
            }
        }

        //Rut input

        if(item.id === 'rut'){
            
            if(item.value.length && this.validateRut(itemValue)){
                this.setState({
                    rutSuccess: true,
                })
            }else{
                this.setState({
                    rutSuccess: false,
                })
            }

        }

        //Money input

        if(item.id === 'money' && itemValue > 0){
            
            if(item.value.length){
                this.setState({
                    moneySuccess: true,
                })
            }else{
                this.setState({
                    moneySuccess: false,
                })
            }

        }

    }


    formatNumber = (input)=>{
        
        let num = input.replace(/\./g,'');
        if(!isNaN(num)){
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
            num = num.split('').reverse().join('').replace(/^[/.]/,'');
            input = num;
        }else{ alert('Solo se permiten numeros');
            input = input.replace(/[^\d+*.]*/g,'');
        }
        return input;
    }


    //Format rut text number
    formatRut = (rut)=>{
        let actual = rut.replace(/^0+/, "");
        if (actual !== '' && actual.length > 1) {
            var sinPuntos = actual.replace(/\./g, "");
            var actualLimpio = sinPuntos.replace(/-/g, "");
            var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
            var rutPuntos = "";
            var i = 0;
            var j = 1;
            for (i = inicio.length - 1; i >= 0; i--) {
                var letra = inicio.charAt(i);
                rutPuntos = letra + rutPuntos;
                if (j % 3 === 0 && j <= inicio.length - 1) {
                    rutPuntos = "." + rutPuntos;
                }
                j++;
            }
            var dv = actualLimpio.substring(actualLimpio.length - 1);
            rutPuntos = rutPuntos + "-" + dv;
        }else{
            return rut;
        }
        return rutPuntos;
    }

    //Validate rut
    validateRut =(cRut)=> {

        // cRut = cRut.replace(/[\.-]/g, "");
        cRut = cRut.replace(/[/.-]/g, "");
        cRut = cRut.toUpperCase();
        let patt = /^\d{1,8}[0-9K]$/;
        let ok = patt.test(cRut);
        let cStr = cRut.slice(0, -1);
        let cDig = cRut.slice(-1);
        let nSum = 0;
        let nVal = 0;
        let cVal = "";
    
        if (ok) {
            for (let nMul = 2; cStr !== ""; nMul = (nMul === 7) ? 2 : nMul + 1) {
                nSum += Number(cStr.slice(-1)) * nMul;
                cStr = cStr.slice(0, -1);
            }
            nVal = 11 - (nSum % 11);
            switch (nVal) {
                case 11:
                    cVal = "0";
                    break;
                case 10:
                    cVal = "K";
                    break;
                default:
                    cVal = nVal.toString();
            }
            ok = cVal === cDig;
        }
        console.log('El rut es valido: ' + ok);
        return ok;
    }






    render(){

        const {nameSuccess, nameValue, submitState, rutValue, rutSuccess, moneyValue, moneySuccess} = this.state;

        return(
            
            <div className={`main-cont`}>

                <form onSubmit={this.onSubmitBehaviours}>

                    {
                        this.state.submitState ? 
                            <AlertComponent isSuccess={this.state.formSuccess} />
                        :

                            ''

                    }


                    <label htmlFor={`name`}>Nombre:</label>
                    <input 
                    id={'name'}
                        className={
                            submitState ? 
                                nameSuccess ? 'input--success' : 'input--error' 
                            : '' 
                        } 
                        name={`name`}
                        type={`text`}
                        onKeyUp={this.onKeyUpBehaviours}
                        placeholder={`Ingresa tu nombre aquí`}
                        value={nameValue}
                        onChange={ e => this.setState({ nameValue: e.currentTarget.value }) }
                    />

                    <label htmlFor={`rut`}>Rut</label>
                    <input 
                        id={'rut'}
                        className={
                            submitState ? 
                                rutSuccess ? 'input--success' : 'input--error' 
                            : '' 
                        } 
                        type={`text`}
                        name={`rut`}
                        onKeyUp={this.onKeyUpBehaviours}
                        maxLength={`12`}
                        onChange={ e => this.setState({rutValue: this.formatRut(e.target.value)})}
                        placeholder={`Ingresa tu rut aquí`}
                        value={rutValue}
                    />

                    
                    <label htmlFor={'money'}>Sueldo bruto mensual</label>
                    <input 
                        id={'money'}
                        className={
                            submitState ? 
                                moneySuccess ? 'input--success' : 'input--error' 
                            : '' 
                        } 
                        name={'money'}
                        type={'text'}
                        placeholder={'Ingresa tu sueldo aquí'}
                        onKeyUp={this.onKeyUpBehaviours}

                        onChange={ e => this.setState({moneyValue: this.formatNumber(e.target.value)})}
                        value={moneyValue}

                    />


                    <button className={`btn btn--primary`}>Submit</button>

                </form>


            </div>

        );
    }

}