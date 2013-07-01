export module services
{   
    export class Customers
    {   
        public list(input:any, callback: (output:any) => void) : void {
            
            console.log('invoked customers.add');

            callback(input);
        }

        public add(input:any, callback: (output:any) => void) : void {

            console.log('invoked customers.add');
            
            callback(input);

        }
        public remove(input:any, callback: (output:any) => void) : void {

            console.log('invoked customers.remove');

            callback(input);
        }

        public update(input:any, callback: (output:any) => void) : void {

            console.log('invoked customers.update');

            callback(input);
        }
    }
}
