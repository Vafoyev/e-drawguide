class UserResource {
    static format(user) {
        return {
            id: user.id,
            full_name: user.full_name,
            phone: user.phone,
            role: user.role,
            created_at: user.created_at
        };
    }
}

module.exports = UserResource;