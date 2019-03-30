import axios from 'axios';

class Common {

    get(url) {
        return new Promise((resolve, reject) => {
            axios
                .get(url, {
                    header: {
                        "content-type": "application/json"
                    }
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

    post(url, body) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, body, {
                    header: {
                        "content-type": "application/json"
                    }
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

    delete(url) {
        return new Promise((resolve, reject) => {
            axios
                .delete(url, {
                    header: {
                        "content-type": "application/json"
                    }
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

    put(url, body) {
        return new Promise((resolve, reject) => {
            axios
                .put(url, body, {
                    header: {
                        "content-type": "application/json"
                    }
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

    handleChange(e) {
        e.persist();
        this.setState({
            [e.target.name]: e.target.value
        });
    }
}

export default Common;