import PropTypes from 'prop-types';
import { 
    Avatar,
    Flex,
    Text,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export default function FriendRow({friend, FriendButton}) {
    const { user } = useAuth();

    return (
        <Flex
            alignItems="center"
            p={3}
            width="100%"
        >
            <Avatar.Root
                boxSize="40px"
                borderRadius="full"
                mr={4}
            >
                <Avatar.Fallback
                    name={`${friend.firstName} ${friend.lastName}`}
                />
                <Avatar.Image
                    src={friend.picture}
                    alt={`${friend.firstName}'s profile`}
                />
            </Avatar.Root>
            <Text 
                flex="1"
                mr={4}
            >
                {friend?.first_name} {friend?.last_name} {user?.id === friend?.id && '(me)'}
            </Text>
            <FriendButton 
                friend={friend}
            />
        </Flex>
    );
}

FriendRow.propTypes = {
    friend: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        picture: PropTypes.string,
    }).isRequired,
    FriendButton: PropTypes.func.isRequired,
};