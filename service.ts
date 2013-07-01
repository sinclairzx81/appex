export module services.app
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

     class Test {
    
        constructor() {
            
        }
    }
}
