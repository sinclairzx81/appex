

export class Fank {

    
}

export module services
{   
    export class Customers
    {
        constructor() 
        {

        }
        
        public list(start:number, end:number) : number [] {
        
            return [];
        }

        public add(data:string) : string {

            console.log('invoked customers.add')
            
            return data;

        }
        public remove(data:string) : string {

            console.log('invoked customers.remove')

            return data;

        }
        public update(data:string) : string {

            console.log('invoked customers.update')

            return data;
        }
    }
}
