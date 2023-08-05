export class ApiService {
    #baseUrl
    #Authorization

    get baseUrl () {
        return this.#baseUrl;
    }

    get isAuth () {
        return !!this.#Authorization;
    }

    constructor(host, port) {
        this.#baseUrl = `http://${host}:${port}/api`
        const prevAuthState = localStorage.getItem('token')
        if (prevAuthState) {
            this.#Authorization = prevAuthState;
        }
    }

    async #get (path) {
        return fetch(`${this.baseUrl}/${path}`, {
            method:'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            }
        })
    }

    async #post (path, data) {
        return fetch(`${this.baseUrl}/${path}`, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            },
            body: JSON.stringify(data)
        })
    }

    async #put (path) {
        return fetch(`${this.baseUrl}/${path}`, {
            method:'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            },
            body: JSON.stringify(data)
        })
    }

    async #delete (path, params) {
        return fetch(`${this.baseUrl}/${path}?${new URLSearchParams(params)}`, {
            method:'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            },
        })
    }

    async login (credentials) {
        try {
            const res = (await this.#post('users/login', credentials));
            const preparedData = await res.json()
            if (preparedData.jwt) {
                this.#Authorization = 'Bearer ' + preparedData.jwt;
                localStorage.setItem('token', this.#Authorization);
            }
            return preparedData
        } catch (e) {
            return e
        }
    }

    logout () {
        this.#Authorization = undefined;
        localStorage.removeItem('token');

    }

    async todos () {
        try {
            const res = await this.#get('todos');
            return await res.json()
        } catch (e) {
            return e
        }
    }
}