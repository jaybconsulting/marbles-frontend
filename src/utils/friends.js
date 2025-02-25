export const sortFriendsWithUserOnTop = (friends, user) => {
    return friends.sort((a, b) => {
        if (a.id === user.id) {
            return -1;
        }
        if (b.id === user.id) {
            return 1;
        }
        return orderFriends(a, b);
    });
};

export const sortFriends = (friends) => {
    return friends.sort(orderFriends);
};

const orderFriends = (a, b) => {
    return a.first_name === b.first_name ? 
        a.last_name.localeCompare(b.last_name) :
        a.first_name.localeCompare(b.first_name);
};

export const removeFriend = (friends, friend) => {
    return friends.filter(f => f.id !== friend.id);
};

export const addFriend = (friends, friend) => {
    return [...friends, friend];
};
