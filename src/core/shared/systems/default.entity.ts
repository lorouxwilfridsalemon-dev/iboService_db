
import { getConnection} from 'typeorm';

export class DefaultEntity{
    public static convertDataType(dataType: any): any{
        //const connection = getConnection();
        let myType: any = {};
        /*switch (connection.options.type){
            case 'mysql': {
                myType = MySqlDataTypeConverter.convert(dataType);
                break;
            }
        }*/
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        myType = MySqlDataTypeConverter.convert(dataType);
        return myType;
    }
}

class MySqlDataTypeConverter{
    public static convert(dataType: any): any{
        let myType: any = dataType;
        switch (dataType.type){
            case 'bigint': {
                myType = { type: 'bigint' };
                break;
            }
            case 'binary': {
                myType = { type: 'binary' };
                break;
            }
            case 'bit': {
                myType = { type: 'bit' };
                break;
            }
            case 'blob': {
                // Conversion du blob en tinyblob, mediumblob, longblob ou blob
                if (dataType.length > 0 &&  dataType.length <= 150){ myType = { type: 'blob', length: dataType.length }; }
                else if (dataType.length > 150 &&  dataType.length <= 255){ myType = { type: 'tinyblob'}; }
                else if (dataType.length > 255 &&  dataType.length <= 16777215){ myType = { type: 'mediumblob' }; }
                else if (dataType.length > 16777215 &&  dataType.length <= 4294967295 ){ myType = { type: 'tinyblob' }; }
                else{ myType = { type: 'blob' }; }
                break;
            }
            case 'char': {
                myType = { type: 'char', length: dataType.length };
                break;
            }
            case 'clob': {
                myType = { type: 'text' };
                break;
            }
            case 'date': {
                switch (dataType.length){
                    case 4: {  myType = { type: 'year'}; break; }
                    case 10: { myType = { type: 'date'}; break; }
                    case 19: { myType = { type: 'datetime'}; break; }
                    default: { myType = { type: 'datetime'}; break; }
                }
                break;
            }
            case 'decimal': {
                let scale = new Number(0);
                if(!isNaN(dataType.scale)){ scale = new Number(dataType.scale)}
                myType = { type: 'decimal', precision: dataType.length, scale: scale };
                break;
            }
            case 'double': {
                myType = { type: 'double' };
                break;
            }
            case 'float': {
                myType = { type: 'float' };
                break;
            }
            case 'integer': {
                myType = { type: 'int' };
                break;
            }
            case 'numeric': {
                myType = { type: 'decimal' };
                break;
            }
            case 'real': {
                myType = { type: 'real' };
                break;
            }
            case 'smallint': {
                myType = { type: 'smallint' };
                break;
            }
            case 'time': {
                myType = { type: 'time' };
                break;
            }
            case 'timestamp': {
                myType = { type: 'timestamp' };
                break;
            }
            case 'tinyint': {
                myType = { type: 'tinyint' };
                break;
            }
            case 'varbinay': {
                myType = { type: 'varbinay' };
                break;
            }
            case 'varchar': {
                // Conversion du varchar en tinyText, mediumText, longText ou text
                if (dataType.length > 0 &&  dataType.length <= 150){ myType = { type: 'varchar', length: dataType.length }; }
                else if (dataType.length > 150 &&  dataType.length <= 255){ myType = { type: 'text'}; }
                else if (dataType.length > 255 &&  dataType.length <= 16777215){ myType = { type: 'text' }; }
                else if (dataType.length > 16777215 &&  dataType.length <= 4294967295 ){ myType = { type: 'text' }; }
                else{ myType = { type: 'text' }; }
                break;
            }
        }

        
        myType.unique = dataType.primary == true ? undefined : dataType.unique;
        myType.nullable = dataType.nullable === false ? undefined : dataType.nullable;
        myType.name = !dataType.name ? undefined : dataType.name;
       
        return myType;
    }
}