class UserStore {
    constructor() {
        this.users = new Map(); // socketId -> { userId, username }
    }

    addUser(socketId, userData) {
        const { userId, username } = userData;
        if (!userId || !username) {
            throw new Error('Username and userId are required');
        }
        this.users.set(socketId, { userId, username });
        return this.users.get(socketId);
    }

    removeUser(socketId) {
        const user = this.users.get(socketId);
        this.users.delete(socketId);
        return user;
    }

    getUser(socketId) {
        return this.users.get(socketId);
    }

    getAllUsers() {
        return Array.from(this.users.values());
    }

    getUserCount() {
        return this.users.size;
    }

    findSocketIdByUserId(userId) {
        for (const [socketId, user] of this.users.entries()) {
            if (user.userId === userId) {
                return socketId;
            }
        }
        return null;
    }

    isUserOnline(userId) {
        return this.findSocketIdByUserId(userId) !== null;
    }

    clear() {
        this.users.clear();
    }
}

export default new UserStore();