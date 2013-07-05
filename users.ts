export module users {


    export function login   (context) { 
        context.response.write('users.login');
        context.response.end();
    }


    export function logout   (context) { 
        context.response.write('user.logout');
        context.response.end();
    }

}