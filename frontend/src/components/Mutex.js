class Lock {
    constructor() {
        this.lock = 1;
        this.queue = [];
    }

    hold(callback) {
        if (this.lock) {
            this.lock--;
            callback();
        } else {
            this.queue.push(callback);
        }
    }

    release() {
        if (this.queue.length > 0) {
            let callback = this.queue.pop();
            setTimeout(() => callback, 0);
        } else {
            if (this.lock == 0) this.lock++;
        }
    }

}

export {
    Lock
}