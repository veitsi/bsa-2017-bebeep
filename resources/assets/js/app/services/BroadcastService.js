import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {getAuthToken} from './AuthService';
import {PUSHER_API_KEY} from 'app/config.js';

const BroadcastService = (() => {
    const _Echo = new Echo({
        broadcaster: 'pusher',
        key: PUSHER_API_KEY,
        cluster: 'eu',
        encrypt: true,
        auth: {
            headers: {
                'Authorization': 'Bearer ' + getAuthToken()
            }
        }
    });

    return {
        get Echo() {
            return _Echo;
        },
        prepareType(type) {
            const newType = type.match(/\\([a-zA-Z]+)$/);

            if (newType === null) {
                return type;
            }

            return newType[1].replace(/([A-Z]+)/g, "_$&").toLowerCase().slice(1);
        }
    };
})();

export default BroadcastService;