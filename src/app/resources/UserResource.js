class UserResource {
    static format(user) {
        if (!user) return null;

        return {
            id: user.id || "",
            full_name: user.full_name || user.fullName || "Foydalanuvchi",
            phone: user.phone || "",
            role: user.role || "student",
            created_at: user.created_at || user.createdAt || null
        };
    }

    static collection(users) {
        if (!users || !Array.isArray(users)) return [];
        return users.map(user => this.format(user));
    }
}

module.exports = UserResource;