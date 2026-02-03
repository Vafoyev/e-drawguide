class UserResource {
    static format(user) {
        if (!user) return null;

        return {
            id: user.id,
            full_name: user.full_name,
            phone: user.phone,
            role: user.role,
            created_at: user.created_at
        };
    }

    static collection(data) {
        if (!data || !data.items) return { items: [], meta: {} };

        return {
            items: data.items.map(user => this.format(user)),
            meta: data.meta
        };
    }
}

module.exports = UserResource;