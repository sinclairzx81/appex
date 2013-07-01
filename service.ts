var fs = require('fs')

export module services
{   
    export class Service
    {
        constructor() 
        {
            console.log('Service 1')

        }
        
        public method(data:string) : string {

            return data;

        }
    }
}
 