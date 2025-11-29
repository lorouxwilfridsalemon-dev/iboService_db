import { Not, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Equal, Like, Between, In, Any, IsNull, Raw } from 'typeorm';
import { isUndefined, isArray, isObject } from 'util';

export const TypeOrmHttpParamQuery = (paramQuery: any) => {
    let typeOrmQuery: any = null;
    if (isObject(paramQuery)){
        typeOrmQuery = {};
        for (const property in paramQuery){
            if (!isUndefined(paramQuery[property]._type)){
                switch (paramQuery[property]._type) {
                    case 'not': { typeOrmQuery[property] = Not(paramQuery[property]._value); break; }
                    case 'lessThan': { typeOrmQuery[property] = LessThan(paramQuery[property]._value); break; }
                    case 'lessThanOrEqual': { typeOrmQuery[property] = LessThanOrEqual(paramQuery[property]._value); break; }
                    case 'moreThan': { typeOrmQuery[property] = MoreThan(paramQuery[property]._value); break; }
                    case 'moreThanOrEqual': { typeOrmQuery[property] = MoreThanOrEqual(paramQuery[property]._value); break; }
                    case 'equal': { typeOrmQuery[property] = Equal(paramQuery[property]._value); break; }
                    case 'like': { typeOrmQuery[property] = Like(paramQuery[property]._value); break; }
                    case 'between': {
                        const [ a , b] = paramQuery[property]._value;
                        typeOrmQuery[property] = Between(a , b); break;
                    }
                    case 'in': { typeOrmQuery[property] = In(paramQuery[property]._value); break; }
                    case 'isNull': { typeOrmQuery[property] = IsNull(); break; }
                    case 'raw': { typeOrmQuery[property] = Raw(paramQuery[property]._value); break; }
                    default:
                        break;
                }
            }
            else{
                if (!isArray(paramQuery[property])){
                    typeOrmQuery[property] = paramQuery[property];
                }
                else{
                    typeOrmQuery[property] = [];
                    paramQuery[property].forEach(element => {
                        typeOrmQuery[property].push(TypeOrmHttpParamQuery(element));
                    });
                }
            }
        }
    }
    else{
        typeOrmQuery = paramQuery;
    }

    return typeOrmQuery;
};